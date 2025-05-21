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

// 2. Update or Create a foundation
router.put('/:foundationId', async (req, res) => {
    try {
        const { foundationId } = req.params;
        const { playerId } = req.body;
        const updateData = req.body;

        if (!playerId) {
            return res.status(400).json({ error: 'playerId is required' });
        }

        const foundation = await gameService.updateOrCreateFoundation(playerId, foundationId, updateData);
        res.json(foundation);
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// 3. Delete a foundation
router.delete('/:foundationId', async (req, res) => {
    try {
        const { foundationId } = req.params;
        const { playerId } = req.body;

        if (!playerId) {
            return res.status(400).json({ error: 'playerId is required in request body' });
        }

        const foundation = await gameService.deleteFoundation(playerId, foundationId);
        res.json({ message: 'Foundation deleted successfully', foundation });
    } catch (error) {
        if (error.message === 'Player not found' || error.message === 'Foundation not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 