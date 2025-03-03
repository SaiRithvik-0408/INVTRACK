// controllers/inventoryController.js
const inventoryModel = require('../models/inventory');
const userModel = require('../models/user');
const itemModel = require('../models/items');

module.exports = {
    createInventory: async (req, res) => {
        let { email, userid } = req.user;
        let { name, description } = req.body;

        try {
            let createInventory = await inventoryModel.create({
                name,
                description,
                user: userid
            });

            const user = await userModel.findById(userid);
            user.inventories.push(createInventory._id);
            await user.save();

            res.status(201).send({
                message: "Inventory created successfully",
                inventory: createInventory
            });
        } catch (error) {
            res.status(500).send("Error creating inventory: " + error.message);
        }
    },
    getInventories: async (req, res) => {
        const { email } = req.user;
        try {
            const user = await userModel.findOne({ email }).populate("inventories");
            if (user && user.inventories) {
                res.json(user.inventories);
            } else {
                res.status(404).json({ message: "No inventories found for this user" });
            }
        } catch (error) {
            console.error("Error fetching inventories:", error);
            res.status(500).json({ message: "Server Error" });
        }
    },
    getInventoryDetails: async (req, res) => {
        let { email } = req.user;

        try {
            const user = await userModel.findOne({ email }).populate({
                path: 'inventories',
                populate: {
                    path: 'items',
                    model: 'Items'
                }
            });

            if (!user) return res.status(404).send("User not found");

            const totalInventoryValue = user.inventories.reduce((sum, inv) => sum + inv.totalInventoryValue, 0);
            const totalQuantity = user.inventories.reduce((sum, inv) => sum + inv.totalInventoryQuantity, 0);
            const totalItems = user.inventories.reduce((sum, inv) => sum + inv.totalInventoryItems, 0);

            res.send({
                companyName: user.companyName,
                totalInventoryValue,
                totalQuantity,
                totalItems,
                inventories: user.inventories.map(inventory => ({
                    name: inventory.name,
                    description: inventory.description,
                    totalInventoryValue: inventory.totalInventoryValue,
                    totalInventoryQuantity: inventory.totalInventoryQuantity,
                    totalInventoryItems: inventory.totalInventoryItems,
                    items: inventory.items.map(item => ({
                        itemName: item.itemName,
                        quantity: item.quantity,
                        price: item.price,
                        category: item.category,
                        description: item.description,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    }))
                }))
            });
        } catch (error) {
            res.status(500).send("Error fetching inventory data: " + error.message);
        }
    },
    deleteInventory: async (req, res) => {
        const { inventoryId } = req.params;

        try {
            const inventoryToDelete = await inventoryModel.findById(inventoryId);
            if (!inventoryToDelete) {
                return res.status(404).json({ message: "Inventory not found." });
            }

            const userId = inventoryToDelete.user;

            await itemModel.deleteMany({ inventory: inventoryId });

            await inventoryModel.deleteOne({ _id: inventoryId });

            await userModel.updateOne(
                { _id: userId },
                { $pull: { inventories: inventoryId } }
            );

            const user = await userModel.findById(userId).populate("inventories");

            let totalQuantity = 0;
            let totalValue = 0;

            user.inventories.forEach(inventory => {
                totalQuantity += inventory.totalQuantity;
                totalValue += inventory.totalValue;
            });

            await userModel.updateOne(
                { _id: userId },
                { totalQuantity, totalValue }
            );

            res.status(200).json({ message: "Inventory and associated items deleted successfully." });
        } catch (error) {
            console.error("Error deleting inventory:", error);
            res.status(500).json({ message: "Server Error" });
        }
    },
    getInventoryItems: async (req, res) => {
        const { inventoryId } = req.params;

        try {
            const inventory = await inventoryModel.findById(inventoryId).populate('items');

            if (!inventory) {
                return res.status(404).json({ message: 'Inventory not found' });
            }

            res.json(inventory.items);
        } catch (error) {
            console.error('Error fetching items:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getInventory: async (req, res) => {
        const { inventoryId } = req.params;
        try {
            const inventory = await inventoryModel.findById(inventoryId).populate('items');
            if (!inventory) {
                return res.status(404).json({ message: 'Inventory not found' });
            }
            res.json(inventory);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            res.status(500).json({ message: 'An error occurred while fetching inventory details.' });
        }
    },
    updateInventory: async (req, res) => {
        const { inventoryId } = req.params;
        const { name } = req.body;

        try {
            const updatedInventory = await inventoryModel.findByIdAndUpdate(
                inventoryId,
                { name },
                { new: true }
            );

            if (!updatedInventory) {
                return res.status(404).json({ message: 'Inventory not found.' });
            }

            res.json(updatedInventory);
        } catch (error) {
            console.error('Error updating inventory:', error);
            res.status(500).json({ message: 'An error occurred while updating the inventory.' });
        }
    }
};