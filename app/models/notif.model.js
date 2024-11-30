const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        sensor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sensor',
            required: true
        },
        name: String,
        message: String,
    }, {
    timestamps: true
});

module.exports = mongoose.model('notif', schema);
