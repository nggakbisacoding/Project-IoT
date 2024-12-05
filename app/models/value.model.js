const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sensor',
        required: true
    },
    functionName: { type: String, default: () => "none" },
    value: {
        type: [Number],
        default: () => [0]
    },
    date: {
        type: [Date],
        default: Date.now
    },
    active: { Boolean, default: () => true }
}, {
    timestamps: false
});

module.exports = mongoose.model('value', schema);