const mongoose = require('mongoose');

const userVerifyOtpSchema = new mongoose.Schema({
    user_email: {
        type: String,
        unique: true,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: Date,
})


module.exports = mongoose.model("userVerifyOtps", userVerifyOtpSchema)