const express = require('express');
const router = express.Router();
const gameService = require('../services/gameService');

// 1. Get all foundations for a player
router.get('/player/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const foundations = await gameService.getFoundationsForPlayer(playerId);
        res.json(foundations);
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// 2. Create a new foundation
router.post('/', async (req, res) => {
    try {
        const { playerId, foundationId, heroId } = req.body;

        if (!playerId || !foundationId || !heroId) {
            return res.status(400).json({ 
                error: 'playerId, foundationId, and heroId are required' 
            });
        }

        const foundation = await gameService.createFoundation(playerId, foundationId, heroId);
        res.status(201).json(foundation);
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Foundation already exists for this player') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// 3. Update a foundation
router.patch('/:foundationId', async (req, res) => {
    try {
        const { foundationId } = req.params;
        const { playerId } = req.body;
        const updateData = req.body;

        if (!playerId) {
            return res.status(400).json({ error: 'playerId is required' });
        }

        const foundation = await gameService.updateFoundation(playerId, foundationId, updateData);
        res.json(foundation);
    } catch (error) {
        if (error.message === 'Player not found' || error.message === 'Foundation not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 