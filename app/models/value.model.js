const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    sensor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sensor',
        required: true
    },
    function: {
        type: String,
        required
    },
    value: {
        type: [{Number}],
        required: true
    },
    active: Boolean,
    created_at: { 
        type: Date, 
        default: () => Date.now(), 
        immutable: true },
}, {
    timestamps: false
});

module.exports = mongoose.model('value', schema);