const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

// Get all challenges
router.get('/', async (req, res) => {
    try {
        const challenges = await Challenge.find();
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single challenge
router.get('/:id', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.json(challenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create challenge
router.post('/', async (req, res) => {
    const challenge = new Challenge({
        challengeId: req.body.challengeId,
        name: req.body.name
    });

    try {
        const newChallenge = await challenge.save();
        res.status(201).json(newChallenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update challenge
router.patch('/:id', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        if (req.body.name) challenge.name = req.body.name;
        
        const updatedChallenge = await challenge.save();
        res.json(updatedChallenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete challenge
router.delete('/:id', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        await challenge.deleteOne();
        res.json({ message: 'Challenge deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 