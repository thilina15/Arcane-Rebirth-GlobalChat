const express = require('express');
const router = express.Router();
const { addOrUpdateBuildings, updateEntireInventory, getBuildingsForPlayer } = require('../services/gameService');

// Get all buildings for a player
router.get('/player/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;
        const buildings = await getBuildingsForPlayer(playerId);
        res.json({buildings:buildings});
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// Update or Create a building
router.put('/:buildingId', async (req, res) => {
    try {
        const { buildingId } = req.params;
        const { playerId, transforms } = req.body;

        if (!playerId || !transforms) {
            return res.status(400).json({ 
                error: 'playerId and transforms array are required' 
            });
        }

        const building = await addOrUpdateBuildings(playerId, buildingId, transforms);
        res.json(building);
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// Update both inventory and building in one request
router.put('/:buildingId/with-inventory', async (req, res) => {
    try {
        const { buildingId } = req.params;
        const { playerId, transforms, items } = req.body;

        if (!playerId || !transforms || !items) {
            return res.status(400).json({ 
                error: 'playerId, transforms array, and items array are required' 
            });
        }

        // Use existing functions to update both
        const [building, inventory] = await Promise.all([
            addOrUpdateBuildings(playerId, buildingId, transforms),
            updateEntireInventory(playerId, items)
        ]);

        res.json({ building, inventory });
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'items array is required' || error.message === 'transforms array is required') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 