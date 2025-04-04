const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    rank: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        trim: true
    },
    guild: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guild'
    },
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Avatar'
    },
    frame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Frame'
    },
    exp: {
        type: Number,
        default: 0
    },
    squadLeader: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Player', playerSchema); 