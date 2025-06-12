const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    workerId: {
        type: String,
        required: true
    },
    nodeLocation:{
        x:{
            type: Number,
            default: 0
        },
        y:{
            type: Number,
            default: 0
        },
        z:{
            type: Number,
            default: 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Worker', workerSchema); 