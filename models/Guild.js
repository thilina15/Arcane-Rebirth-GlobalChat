const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Guild', guildSchema); 