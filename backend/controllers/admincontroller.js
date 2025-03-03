// controllers/adminController.js
const adminModel = require('../models/admin');
const userModel = require('../models/user');
const inventoryModel = require('../models/inventory');
const itemModel = require('../models/items');
const jwt = require('jsonwebtoken');

module.exports = {
    adminLogin: async (req, res) => {
        let { username, password } = req.body;
        const admin = await adminModel.findOne({ username });

        if (!admin) {
            return res.status(404).send("Admin not found");
        }

        if (password === admin.password) {
            let token = jwt.sign({ username }, process.env.JWT_SECRET_ADMIN);
            res.cookie("token", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
                secure: false
            });
            res.status(200).send({ message: "Login Successful" });
        } else {
            res.status(401).send("Invalid password");
        }
    },
    checkAdmin: async (req, res) => {
        res.status(200).send({ isAdmin: true });
    },
    getUsers: async (req, res) => {
        try {
            const users = await userModel.find({});
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ message: "Server error fetching users." });
        }
    },
    getInventories: async (req, res) => {
        try {
            const inventories = await inventoryModel.find({});
            res.json(inventories);
        } catch (error) {
            console.error("Error fetching inventories:", error);
            res.status(500).json({ message: "Server error fetching inventories." });
        }
    },
    getItems: async (req, res) => {
        try {
            const items = await itemModel.find({}).populate('inventory', 'name');
            res.json(items);
        } catch (error) {
            console.error("Error fetching items with inventory names:", error);
            res.status(500).json({ message: "Server error fetching items." });
        }
    },
    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const updatedData = req.body;

            const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await userModel.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const inventories = await inventoryModel.find({ user: id });
            const inventoryIds = inventories.map(inv => inv._id);

            await inventoryModel.deleteMany({ user: id });

            await itemModel.deleteMany({ inventory: { $in: inventoryIds } });

            return res.status(200).json({ message: 'User and associated inventories and items deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    },
    updateInventory: async (req, res) => {
        const { inventoryId } = req.params;
        const { name, description } = req.body;

        try {
            const updatedInventory = await inventoryModel.findByIdAndUpdate(
                inventoryId,
                { name, description },
                { new: true }
            );

            if (!updatedInventory) {
                return res.status(404).json({ message: 'Inventory not found' });
            }

            res.json(updatedInventory);
        } catch (error) {
            console.error('Error updating inventory:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    deleteAdminInventory: async (req, res) => {
        const { inventoryId } = req.params;

        try {
            const deletedInventory = await inventoryModel.findByIdAndDelete(inventoryId);

            if (!deletedInventory) {
                return res.status(404).json({ message: 'Inventory not found' });
            }
            await userModel.updateMany(
                { inventories: inventoryId },
                { $pull: { inventories: inventoryId } }
            );

            await itemModel.deleteMany({ inventory: inventoryId });

            res.json({ message: 'Inventory and associated items deleted successfully' });
        } catch (error) {
            console.error('Error deleting inventory:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    updateAdminItem: async (req, res) => {
        const { itemId } = req.params;
        const { name, price, quantity, category } = req.body;

        try {
            const oldItem = await itemModel.findById(itemId);
            if (!oldItem) {
                return res.status(404).json({ message: 'Item not found' });
            }

            const updatedItem = await itemModel.findByIdAndUpdate(
                itemId,
                { itemName: name, price, quantity, category },
                { new: true }
            );

            const quantityDifference = parseInt(quantity) - parseInt(oldItem.quantity);
            const valueDifference = (parseInt(price) * parseInt(quantity)) - (parseInt(oldItem.price) * parseInt(oldItem.quantity));

            const inventory = await inventoryModel.findByIdAndUpdate(
                updatedItem.inventory,
                {
                    $inc: {
                        totalInventoryQuantity: quantityDifference,
                        totalInventoryValue: valueDifference,
                        totalInventoryItems: 0
                    }
                },
                { new: true }
            );

            res.json({ message: 'Item and inventory totals updated successfully', updatedItem, inventory });
        } catch (error) {
            console.error('Error updating item or inventory totals:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    deleteAdminItem: async (req, res) => {
        const { itemId } = req.params;

        try {
            const deletedItem = await itemModel.findByIdAndDelete(itemId);
            if (!deletedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }

            const inventory = await inventoryModel.findOne({ items: itemId });

            if (inventory) {
                const remainingItems = await itemModel.find({ _id: { $in: inventory.items } });
                const newTotalQuantity = remainingItems.reduce((acc, item) => acc + parseInt(item.quantity), 0);
                const newTotalValue = remainingItems.reduce((acc, item) => acc + (parseInt(item.price) * parseInt(item.quantity)), 0);
                const newTotalItems = remainingItems.length;

                inventory.totalInventoryQuantity = newTotalQuantity;
                inventory.totalInventoryValue = newTotalValue;
                inventory.totalInventoryItems = newTotalItems;

                await inventory.save();
            }

            res.json({ message: 'Item deleted successfully', inventory });
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};