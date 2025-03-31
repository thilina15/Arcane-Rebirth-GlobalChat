const mongoose = require('mongoose');

const playerHeroSchema = new mongoose.Schema({
    hero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hero',
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    level: {
        type: Number,
        default: 1
    },
    unlockedAbilityIds: [{
        type: String
    }],
    equippedAbilityIds: [{
        type: String
    }],
    exp: {
        type: Number,
        default: 0
    },
    kills: {
        type: Number,
        default: 0
    },
    damageDealt: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique player-hero combinations
playerHeroSchema.index({ player: 1, hero: 1 }, { unique: true });

module.exports = mongoose.model('PlayerHero', playerHeroSchema); 