const mongoose = require('mongoose');

const foundationSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    foundationId: {
        type: String,
        required: true
    },
    heroId: {
        type: String,
        required: true
    },
    runeSlot: {
        type: String,
        default: "None"
    },
    weaponSlot: {
        type: String,
        default: "None"
    },
    armorSlot: {
        type: String,
        default: "None"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique player-challenge combinations
foundationSchema.index({ player: 1, foundationId: 1 }, { unique: true });

module.exports = mongoose.model('Foundation', foundationSchema); 