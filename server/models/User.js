const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 24,
        match: /^[a-zA-Z0-9_]+$/,
    },
    // socketId: {
    //     type: String,
    //     default: null,
    // },
    // isOnline: {
    //     type: Boolean,
    //     default: false,
    // },

    password: {
        type: String,
        required: true,
        select: false,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);