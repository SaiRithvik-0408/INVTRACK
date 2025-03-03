// controllers/userController.js
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    getSignup: async (req, res) => {
        try {
            res.send("hello");
        } catch {
            res.send("Something went wrong");
        }
    },
    createSignup: async (req, res) => {
        let { companyName, email, password, phone } = req.body;

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                const createUser = await userModel.create({
                    companyName,
                    email,
                    password: hash,
                    phone
                });

                let token = jwt.sign({ email, userid: createUser._id }, process.env.JWT_SECRET_USER);
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: false
                });
                res.status(200).send({ message: "Account Created Successfully", companyName: createUser.companyName });
            });
        });
    },
    login: async (req, res) => {
        let { email, password } = req.body;
        let verifyUser = await userModel.findOne({ email });
        if (!verifyUser) return res.status(404).send("No user found");

        bcrypt.compare(password, verifyUser.password, function (err, result) {
            if (result) {
                let token = jwt.sign({ email, userid: verifyUser._id }, process.env.JWT_SECRET_USER);
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: false
                });
                res.status(200).send({ message: "Login Successful", companyName: verifyUser.companyName });
            } else {
                res.status(401).send("Invalid password");
            }
        });
    },
    getProfile: async (req, res) => {
        let { email, userid } = req.user;
        let userData = await userModel.findOne({ email });
        res.send(userData);
    },
    logout: async (req, res) => {
        res.cookie("token", "", {
            httpOnly: true,
            secure: false,
            expires: new Date(0),
        });
        res.status(200).send({ message: "Logged out successfully" });
    },
    getCompanyName: async (req, res) => {
        try {
            const { email, userid } = req.user;
            const user = await userModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user.companyName);

        } catch (error) {
            console.error('Error fetching user :', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getCategories: async (req, res) => {
        try {
            const { email } = req.user;

            const user = await userModel.findOne({ email }).populate("inventories");

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const categoriesSet = new Set();

            for (const inventory of user.inventories) {
                await inventory.populate("items");

                for (const item of inventory.items) {
                    if (item.category) {
                        categoriesSet.add(item.category);
                    }
                }
            }

            const categories = Array.from(categoriesSet);

            res.json({ categories });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
        }
    },
    getItemsByCategory: async (req, res) => {
        try {
            const { category } = req.params;
            const { email } = req.user;

            const user = await userModel.findOne({ email }).populate({
                path: 'inventories',
                populate: {
                    path: 'items',
                    model: 'Items'
                }
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const userItems = [];

            for (const inventory of user.inventories) {

                const filteredItems = inventory.items.filter(item =>
                    item.category === category &&
                    item.inventory &&
                    item.inventory.toString() === inventory._id.toString()
                );

                for (const item of filteredItems) {
                    userItems.push({
                        ...item.toObject(),
                        inventoryName: inventory.name
                    });
                }
            }

            res.json(userItems);
        } catch (error) {
            console.error('Error fetching items by category:', error);
            res.status(500).json({ message: 'Failed to fetch items', error: error.message });
        }
    }
};
