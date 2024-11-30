const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'device',
            required: true
        },
        name: String,
        api_url: String,
    }, {
    timestamps: String
}
)

module.exports = mongoose.model('sensor', schema);