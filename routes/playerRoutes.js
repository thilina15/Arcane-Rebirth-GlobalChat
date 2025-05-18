const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const {getHerosForPlayer, getFoundationsForPlayer} = require('../services/gameService');

// 1. get or create player (using playerId and name)
router.get('/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        let player = await Player.findOne({ playerId });
        
        if (!player) {
            // Create new player if not found
            player = new Player({
                playerId,
                name
            });
            await player.save();
        }
        let details = player.toJSON();

        // Fetch heroes for the player
        const heroes = await getHerosForPlayer(playerId);

        // fetch foundations for the player
        const foundations = await getFoundationsForPlayer(playerId)
        
        details.heroes = heroes;
        details.foundations = foundations
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. update player (using playerId) patch method
router.put('/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const updateData = req.body;

        // Remove any fields that shouldn't be updated
        delete updateData.playerId;
        delete updateData.createdAt;

        const player = await Player.findOneAndUpdate(
            { playerId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 