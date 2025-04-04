const express = require('express');
const router = express.Router();
const Guild = require('../models/Guild');

// Create a new guild
router.post('/', async (req, res) => {
    try {
        const guild = new Guild(req.body);
        await guild.save();
        res.status(201).send(guild);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all guilds
router.get('/', async (req, res) => {
    try {
        const guilds = await Guild.find({});
        res.send(guilds);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a specific guild by ID
router.get('/:id', async (req, res) => {
    try {
        const guild = await Guild.findById(req.params.id);
        if (!guild) {
            return res.status(404).send();
        }
        res.send(guild);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router; 