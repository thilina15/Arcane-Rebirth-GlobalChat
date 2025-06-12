const express = require('express');
const router = express.Router();
const PlayerHero = require('../models/PlayerHero');
const Player = require('../models/Player');
const { getHerosForPlayer, deletePlayerHero } = require('../services/gameService');


// 1. Get all heroes for a player
router.get('/player/:playerId', async (req, res) => {
    try {
        const heros = await getHerosForPlayer(req.params.playerId);
        res.json(heros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Create a new player hero
router.post('/', async (req, res) => {
    try {
        const { playerId, heroId, level, unlockedAbilityIds, equippedAbilityIds } = req.body;

        if (!playerId || !heroId) {
            return res.status(400).json({ error: 'playerId and heroId are required' });
        }

        // Find the player to get their ObjectId
        const player = await Player.findOne({ playerId });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Check if player already has this hero
        const existingHero = await PlayerHero.findOne({ 
            player: player._id,
            heroId 
        });

        if (existingHero) {
            return res.status(400).json({ error: 'Player already has this hero' });
        }

        const playerHero = new PlayerHero({
            heroId,
            player: player._id,
            level: level || 1,
            unlockedAbilityIds: unlockedAbilityIds || [],
            equippedAbilityIds: equippedAbilityIds || [],
            exp: 1,
            kills: 0,
            damageDealt: 0,
        });

        await playerHero.save();
        res.status(201).json(playerHero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Update a player hero
router.put('/:heroId', async (req, res) => {
    try {
        const { heroId } = req.params;
        const { playerId } = req.body;
        const updateData = req.body;

        if (!playerId) {
            return res.status(400).json({ error: 'playerId is required' });
        }

        // Find the player to get their ObjectId
        const player = await Player.findOne({ playerId });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        // Remove fields that shouldn't be updated
        delete updateData.playerId;
        delete updateData.heroId;
        delete updateData.createdAt;

        const playerHero = await PlayerHero.findOneAndUpdate(
            { 
                player: player._id,
                heroId 
            },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!playerHero) {
            return res.status(404).json({ error: 'Player hero not found' });
        }

        res.json(playerHero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Delete a player hero
router.delete('/:heroId', async (req, res) => {
    try {
        const { heroId } = req.params;
        const { playerId } = req.body;

        if (!playerId) {
            return res.status(400).json({ error: 'playerId is required in request body' });
        }

        const playerHero = await deletePlayerHero(playerId, heroId);
        res.json({ message: 'Player hero deleted successfully', playerHero });
    } catch (error) {
        if (error.message === 'Player not found' || error.message === 'Player hero not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router

