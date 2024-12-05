const mongoose = require('mongoose');

const formula = new mongoose.Schema({
    sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sensor',
        required: true
    },
    formula: { type: String, default: () => "0" },
    operator: { type: String, default: () => "=" },
    target: { type: String, default: () => "Humandity" },
    msg: { type: String, default: () => "Formula reached" },
} , {
    timestamps: true
})

module.exports = mongoose.model('formula', formula);