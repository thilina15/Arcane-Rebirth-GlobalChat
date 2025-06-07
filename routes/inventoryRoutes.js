const express = require('express');
const router = express.Router();
const { 
    getInventory, 
    updateEntireInventory, 
    updateInventoryItem, 
    deleteInventoryItem 
} = require('../services/gameService');

// Get inventory for a player
router.get('/:playerId', async (req, res) => {
    try {
        const inventory = await getInventory(req.params.playerId);
        res.json(inventory);
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// Update entire inventory
router.put('/:playerId', async (req, res) => {
    try {
        const { items } = req.body;
        const inventory = await updateEntireInventory(req.params.playerId, items);
        res.json(inventory);
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'items array is required') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// Add or update item in inventory
router.put('/:playerId/items/:itemId', async (req, res) => {
    try {
        const { quantity = 1 } = req.body;
        const inventory = await updateInventoryItem(req.params.playerId, req.params.itemId, quantity);
        res.json(inventory);
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// Delete item from inventory
router.delete('/:playerId/items/:itemId', async (req, res) => {
    try {
        const { quantity } = req.query;
        const inventory = await deleteInventoryItem(req.params.playerId, req.params.itemId, quantity);
        res.json({
            message: 'Item updated successfully',
            inventory
        });
    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Inventory not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Item not found in inventory') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Quantity must be a positive number') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 