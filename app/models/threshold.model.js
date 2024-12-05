const mongoose = require('mongoose');

const threshold = new mongoose.Schema({
    sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sensor',
        required: true
    },
    target: { type: String, default: () => "0" },
    min: { type: Number, default: () => 0 },
    max: { type: Number, default: () => 0 },
    msg: { type: String, default: () => "Threshold reached" },
} , {
    timestamps: true
})

module.exports = mongoose.model('threshold', threshold);