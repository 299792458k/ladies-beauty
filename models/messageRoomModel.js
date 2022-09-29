const mongoose = require('mongoose')


const messageRoomSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    members: {
        type: Array,
        required: true
    },
    messages: {
        type: Array,
        default: [],
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("messageRoom", messageRoomSchema)