const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.get("/signup", userController.getSignup);
router.post("/signup/create", userController.createSignup);
router.post("/login", userController.login);
router.get("/profile/:companyName", isLoggedIn, userController.getProfile);
router.post("/logout", userController.logout);
router.get("/companyName", isLoggedIn, userController.getCompanyName);
router.get("/categories", isLoggedIn, userController.getCategories);
router.get("/categories/:category/items", isLoggedIn, userController.getItemsByCategory);

module.exports = router;