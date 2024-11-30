const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        role: { type: String, default: 'user' },
    }, {
    timestamps: true
})

module.exports = mongoose.model('user', schema);