const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.post("/inventory/:inventoryId/items/create", isLoggedIn, itemController.createItems);
router.get('/search', isLoggedIn, itemController.searchItems);
router.get("/items", isLoggedIn, itemController.getAllItems);
router.get('/item/:itemId', isLoggedIn, itemController.getItem);
router.put('/items/:itemId', itemController.updateItem);
router.delete('/items/:itemId', itemController.deleteItem);

module.exports = router;