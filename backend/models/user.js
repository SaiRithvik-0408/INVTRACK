const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    inventories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory"
        }
    ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;

