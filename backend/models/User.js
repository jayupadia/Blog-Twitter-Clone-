const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Default to 'user', can be 'admin'
    isVerified: { type: Boolean, default: false },
    otp: { type: String },  // Field to store OTP
    otpExpires: { type: Date },  // Field to store OTP expiration time
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
