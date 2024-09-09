// models/Investment.js

const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    principal: { type: Number, required: true },
    rate: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    interest: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    investorName: { type: String, required: true }, // Add this field
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);
