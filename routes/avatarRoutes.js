const express = require('express');
const router = express.Router();
const Avatar = require('../models/Avatar');

// Create a new avatar
router.post('/', async (req, res) => {
    try {
        const avatar = new Avatar(req.body);
        await avatar.save();
        res.status(201).send(avatar);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all avatars
router.get('/', async (req, res) => {
    try {
        const avatars = await Avatar.find({});
        res.send(avatars);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a specific avatar by ID
router.get('/:id', async (req, res) => {
    try {
        const avatar = await Avatar.findById(req.params.id);
        if (!avatar) {
            return res.status(404).send();
        }
        res.send(avatar);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router; 