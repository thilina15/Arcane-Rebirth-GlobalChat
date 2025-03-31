const mongoose = require('mongoose');

const playerChallengeSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    current: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique player-challenge combinations
playerChallengeSchema.index({ player: 1, challenge: 1 }, { unique: true });

module.exports = mongoose.model('PlayerChallenge', playerChallengeSchema); 