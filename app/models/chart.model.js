const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        sensor: {
            type: mongoose.Schema.Types.ObjectId,
            Ref: 'sensor',
            required: true
        },
        name: String,
    }, {
    timestamps: true
}
)

schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id;

    return object
})

module.exports = mongoose.model('chart', schema)
