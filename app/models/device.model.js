const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        name: String,
        active: Boolean,
    }, {
    timestamps: true
}
)

module.exports = mongoose.model('device', schema);