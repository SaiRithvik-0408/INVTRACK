const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.post("/create/inventory", isLoggedIn, inventoryController.createInventory);
router.get('/inventories', isLoggedIn, inventoryController.getInventories);
router.get("/inventory", isLoggedIn, inventoryController.getInventoryDetails);
router.delete('/inventories/:inventoryId', inventoryController.deleteInventory);
router.get('/inventories/:inventoryId/items', inventoryController.getInventoryItems);
router.get("/inventories/:inventoryId", inventoryController.getInventory);
router.put('/inventories/:inventoryId', inventoryController.updateInventory);

module.exports = router;