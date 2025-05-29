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

// Delete item from inventory
router.delete('/:playerId/items/:itemId', async (req, res) => {
    try {
        const player = await Player.findOne({ playerId: req.params.playerId });
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const inventory = await Inventory.findOne({ player: player._id });
        if (!inventory) {
            return res.status(404).json({ error: 'Inventory not found' });
        }

        const itemIndex = inventory.items.findIndex(item => item.itemId === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in inventory' });
        }

        // If quantity is specified, reduce it; otherwise remove the item completely
        const { quantity } = req.query;
        
        if (quantity) {
            const reduceAmount = parseInt(quantity);
            if (isNaN(reduceAmount) || reduceAmount <= 0) {
                return res.status(400).json({ error: 'Quantity must be a positive number' });
            }

            if (inventory.items[itemIndex].quantity <= reduceAmount) {
                // Remove item completely if reducing by equal or more than current quantity
                inventory.items.splice(itemIndex, 1);
            } else {
                // Reduce quantity
                inventory.items[itemIndex].quantity -= reduceAmount;
            }
        } else {
            // Remove item completely if no quantity specified
            inventory.items.splice(itemIndex, 1);
        }

        await inventory.save();
        res.json({
            message: 'Item updated successfully',
            inventory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router; 