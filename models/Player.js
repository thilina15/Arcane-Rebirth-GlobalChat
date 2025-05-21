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
    },
    rank: {
        type: String,
        required: false,
        default:"001"
    },
    title: {
        type: String,
        required: false,
        default:"None"
    },
    guildId: {
        type: String,
        required: false,
    },
    avatarId: {
        type: String,
        required: false,
        default:"001"
    },
    frameId: {
        type: String,
        required: false,
        default:"001"
    },
    exp: {
        type: Number,
        default: 0
    },
    treeXp: {
        type: Number,
        default: 1
    },
    treeLevel: {
        type: Number,
        default: 1
    },
    completedQuests: [{
        type: String
    }],
    acceptedQuest: {
        type: String,
        default: ""
    },
    nextQuest: {
        type: String,
        default: "A0001"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Player', playerSchema); 