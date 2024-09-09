// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0
    },
    totalInvested: {
        type: Number,
        default: 0 // Track the total amount invested by the user
    },
});

module.exports = mongoose.model('User', userSchema);
