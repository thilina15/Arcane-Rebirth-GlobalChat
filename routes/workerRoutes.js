const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const Player = require('../models/Player');
const { getWorkersForPlayer, updateOrCreateWorker, deleteWorker } = require('../services/gameService');

// 1. Get all workers for a player
router.get('/player/:playerId', async (req, res) => {
    try {
        const workers = await getWorkersForPlayer(req.params.playerId);
        res.json({workers: workers});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Add or update a worker
router.put('/:workerId', async (req, res) => {
    try {
        const { workerId } = req.params;
        const { playerId } = req.body;
        const updateData = req.body;

        if (!playerId) {
            return res.status(400).json({ error: 'playerId is required' });
        }

        const worker = await updateOrCreateWorker(playerId, workerId, updateData);
        res.json(worker);
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// 3. Delete a worker
router.delete('/:workerId', async (req, res) => {
    try {
        const { workerId } = req.params;
        const { playerId } = req.body;

        if (!playerId) {
            return res.status(400).json({ error: 'playerId is required in request body' });
        }

        const worker = await deleteWorker(playerId, workerId);
        res.json({ message: 'Worker deleted successfully', worker });
    } catch (error) {
        if (error.message === 'Player not found' || error.message === 'Worker not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 