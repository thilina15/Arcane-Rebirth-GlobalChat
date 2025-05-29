const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Player = require('../models/Player');

// Get inventory for a player
router.get('/:playerId', async (req, res) => {
    try {
        const player = await Player.findOne({ playerId: req.params.playerId });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        let inventory = await Inventory.findOne({ player: player._id });
        
        // Create inventory if it doesn't exist
        if (!inventory) {
            inventory = new Inventory({
                player: player._id,
                items: []
            });
            await inventory.save();
        }

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update entire inventory
router.put('/:playerId', async (req, res) => {
    try {
        const player = await Player.findOne({ playerId: req.params.playerId });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const { items } = req.body;
        if (!items) {
            return res.status(400).json({ error: 'items array is required' });
        }

        const inventory = await Inventory.findOneAndUpdate(
            { player: player._id },
            { $set: { items } },
            { new: true, runValidators: true, upsert: true }
        );

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add or update item in inventory
router.put('/:playerId/items/:itemId', async (req, res) => {
    try {
        const player = await Player.findOne({ playerId: req.params.playerId });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const { quantity = 1 } = req.body;
        const itemId = req.params.itemId;

        let inventory = await Inventory.findOne({ player: player._id });
        if (!inventory) {
            inventory = new Inventory({
                player: player._id,
                items: []
            });
        }

        // Check if item already exists
        const existingItemIndex = inventory.items.findIndex(item => item.itemId === itemId);

        if (existingItemIndex !== -1) {
            // Update existing item quantity
            inventory.items[existingItemIndex].quantity = quantity;
        } else {
            // Add new item
            inventory.items.push({
                itemId,
                quantity
            });
        }

        await inventory.save();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove item from inventory
router.delete('/:playerId/items/:itemId', async (req, res) => {
    try {
        const player = await Player.findOne({ playerId: req.params.playerId });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const { quantity = 1 } = req.query;
        const inventory = await Inventory.findOne({ player: player._id });
        
        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        const itemIndex = inventory.items.findIndex(item => item.itemId === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in inventory' });
        }

        if (inventory.items[itemIndex].quantity <= quantity) {
            // Remove item completely if quantity is less than or equal to requested amount
            inventory.items.splice(itemIndex, 1);
        } else {
            // Reduce quantity
            inventory.items[itemIndex].quantity -= quantity;
        }

        await inventory.save();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update item in inventory (equip/unequip or change slot)
router.patch('/:playerId/items/:itemId', async (req, res) => {
    try {
        const player = await Player.findOne({ playerId: req.params.playerId });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const { equipped, slot } = req.body;
        const inventory = await Inventory.findOne({ player: player._id });
        
        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        const item = inventory.items.find(item => item.itemId === req.params.itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found in inventory' });
        }

        if (equipped !== undefined) item.equipped = equipped;
        if (slot) item.slot = slot;

        inventory.lastUpdated = new Date();
        await inventory.save();

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 