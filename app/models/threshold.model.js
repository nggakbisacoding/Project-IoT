const mongoose = require('mongoose');

const threshold = new mongoose.Schema({
    sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sensor',
        required: true
    },
    value: { type: String, default: () => "1,100" },
    formula: { type: String, default: () => "x" },
} , {
    timestamps: true
})

module.exports = mongoose.model('threshold', threshold);