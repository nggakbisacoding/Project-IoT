const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        name: String,
        api_url: String,
    }, {
    timestamps: String
}
)

module.exports = mongoose.model('sensor', schema);