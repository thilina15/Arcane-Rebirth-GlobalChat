const mongoose = require('mongoose');

const playerWarriorSchema = new mongoose.Schema({
    warriorId: {
        type: String,
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
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
    isLeader: {
        type: Boolean,
        default: false
    },
    spawnLocation:{
        type: {
            x: Number,
            y: Number,
            z: Number
        },
        default: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique player-hero combinations
playerWarriorSchema.index({ player: 1, warriorId: 1 }, { unique: true });

module.exports = mongoose.model('PlayerWarrior', playerWarriorSchema); 