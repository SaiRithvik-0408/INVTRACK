// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.status(401).send("You must be logged in");
    }
    try {
        const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_USER);
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }
}

function adminIsLoggedIn(req, res, next) {
    console.log("Admin token:", req.cookies.token); // Debugging log
    if (!req.cookies.token) {
        console.log("Admin token not found"); // Debugging log
        return res.status(401).send("You must be logged in");
    }
    try {
        const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET_ADMIN);
        console.log("Decoded admin token:", data); // Debugging log
        req.admin = data;
        next();
    } catch (error) {
        console.error("Admin token verification error:", error); // Debugging log
        return res.status(401).send("Invalid token");
    }
}

module.exports = { isLoggedIn, adminIsLoggedIn };