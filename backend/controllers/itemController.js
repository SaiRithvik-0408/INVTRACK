// controllers/itemController.js
const itemModel = require('../models/items');
const inventoryModel = require('../models/inventory');
const userModel = require('../models/user');

module.exports = {
    createItems: async (req, res) => {
        let { inventoryId } = req.params;
        let { items } = req.body;

        try {
            let inventory = await inventoryModel.findById(inventoryId).populate('items');

            if (!inventory) {
                return res.status(404).send("Inventory not found");
            }

            const existingItems = inventory.items;
            let currentTotalValue = inventory.totalInventoryValue;
            let currentTotalQuantity = inventory.totalInventoryQuantity;

            for (let item of items) {
                const quantity = parseInt(item.quantity, 10);
                const price = parseFloat(item.price);
                const itemName = item.itemName;

                const existingItem = existingItems.find(existing => existing.itemName === itemName);

                if (existingItem) {
                    existingItem.quantity += quantity;
                    currentTotalQuantity += quantity;
                    currentTotalValue += price * quantity;

                    await itemModel.findByIdAndUpdate(existingItem._id, { quantity: existingItem.quantity });
                } else {
                    let createItem = await itemModel.create({
                        inventory: inventoryId,
                        itemName: itemName,
                        quantity: quantity,
                        price: price,
                        description: item.description,
                        category: item.category
                    });

                    inventory.items.push(createItem._id);

                    currentTotalQuantity += quantity;
                    currentTotalValue += price * quantity;
                }
            }

            inventory.totalInventoryValue = currentTotalValue;
            inventory.totalInventoryQuantity = currentTotalQuantity;
            inventory.totalInventoryItems += items.length;

            await inventory.save();

            res.send("Items added successfully");
        } catch (error) {
            res.status(500).send("Error adding items: " + error.message);
        }
    },
    searchItems: async (req, res) => {
        try {
            const { query } = req.query;
            const user = await userModel.findOne({ email: req.user.email }).populate({
                path: 'inventories',
                populate: { path: 'items' },
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const suggestions = [];

            user.inventories.forEach((inventory) => {
                if (inventory.name.toLowerCase().includes(query.toLowerCase())) {
                    suggestions.push({
                        _id: inventory._id,
                        name: inventory.name,
                        type: 'inventory',
                    });
                }

                inventory.items.forEach((item) => {
                    if (item.itemName.toLowerCase().includes(query.toLowerCase()) ||
                        item.category.toLowerCase().includes(query.toLowerCase())) {
                        suggestions.push({
                            _id: item._id,
                            name: item.itemName,
                            type: 'item',
                            category: item.category,
                            inventoryName: inventory.name,
                        });
                    }
                });
            });

            res.json(suggestions);
        } catch (error) {
            console.error('Error fetching search results:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getAllItems: async (req, res) => {
        try {
            const { email } = req.user;

            const user = await userModel.findOne({ email }).populate({
                path: "inventories",
                populate: { path: "items" },
            });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const allItems = user.inventories.flatMap(inventory =>
                inventory.items.map(item => ({
                    ...item.toObject(),
                    inventory: inventory.name,
                }))
            );
            res.json(allItems);
        } catch (error) {
            console.error("Error fetching items:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    getItem: async (req, res) => {
        try {
            const { itemId } = req.params;
            const item = await itemModel.findById(itemId).populate({
                path: 'inventory',
                select: 'name',
            });

            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }

            res.json(item);
        } catch (error) {
            console.error('Error fetching item details:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    updateItem: async (req, res) => {
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
    deleteItem: async (req, res) => {
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