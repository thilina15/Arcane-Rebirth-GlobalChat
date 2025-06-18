const express = require('express');
const router = express.Router();
const PlayerWarrior = require('../models/PlayerWarrior');
const Player = require('../models/Player');
const { addOrUpdatePlayerWarrior, getWarriorsForPlayer } = require('../services/gameService');

// Get all warriors for a player
router.get('/player/:playerId', async (req, res) => {
    try {
        const warriors = await getWarriorsForPlayer(req.params.playerId);
        res.json(warriors);
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// Add or Update a player warrior
router.post('/', async (req, res) => {
    try {
        const { playerId, warriorId, ...updateData } = req.body;

        if (!playerId || !warriorId) {
            return res.status(400).json({ error: 'playerId and warriorId are required' });
        }

        const playerWarrior = await addOrUpdatePlayerWarrior(playerId, warriorId, updateData);
        res.json(playerWarrior);
    } catch (error) {
        console.error("Error adding/updating player warrior:", error);
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 