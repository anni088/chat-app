const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
        default: 'general',
    },
    username: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);