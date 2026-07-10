const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 character"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Sirf in dono me se ek hi role ho sakta hai
        default: 'user' // By default har naya banda normal user hoga
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);
module.exports = User;