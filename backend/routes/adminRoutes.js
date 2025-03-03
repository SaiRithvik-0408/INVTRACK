// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminIsLoggedIn } = require('../middlewares/authMiddleware');

router.post("/", adminController.adminLogin);
router.get('/check-admin', adminIsLoggedIn, adminController.checkAdmin);
router.get("/users", adminController.getUsers);
router.get("/inventories", adminController.getInventories);
router.get("/items", adminController.getItems);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.put('/inventories/:inventoryId', adminController.updateInventory);
router.delete('/inventories/:inventoryId', adminController.deleteAdminInventory);
router.put('/items/:itemId', adminController.updateAdminItem);
router.delete('/items/:itemId', adminController.deleteAdminItem);

module.exports = router;