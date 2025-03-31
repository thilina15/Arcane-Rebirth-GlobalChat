const express = require('express');
const router = express.Router();
const PlayerChallenge = require('../models/PlayerChallenge');

// Get all player-challenge combinations
router.get('/', async (req, res) => {
    try {
        const playerChallenges = await PlayerChallenge.find()
            .populate('player', 'name rank')
            .populate('challenge', 'name');
        res.json(playerChallenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single player-challenge combination
router.get('/:id', async (req, res) => {
    try {
        const playerChallenge = await PlayerChallenge.findById(req.params.id)
            .populate('player', 'name rank')
            .populate('challenge', 'name');
        if (!playerChallenge) {
            return res.status(404).json({ message: 'Player-Challenge combination not found' });
        }
        res.json(playerChallenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create player-challenge combination
router.post('/', async (req, res) => {
    const playerChallenge = new PlayerChallenge({
        player: req.body.player,
        challenge: req.body.challenge,
        current: req.body.current,
        completed: req.body.completed || false
    });

    try {
        const newPlayerChallenge = await playerChallenge.save();
        res.status(201).json(newPlayerChallenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update player-challenge combination
router.patch('/:id', async (req, res) => {
    try {
        const playerChallenge = await PlayerChallenge.findById(req.params.id);
        if (!playerChallenge) {
            return res.status(404).json({ message: 'Player-Challenge combination not found' });
        }
        
        if (req.body.current) playerChallenge.current = req.body.current;
        if (req.body.completed !== undefined) playerChallenge.completed = req.body.completed;
        
        const updatedPlayerChallenge = await playerChallenge.save();
        res.json(updatedPlayerChallenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete player-challenge combination
router.delete('/:id', async (req, res) => {
    try {
        const playerChallenge = await PlayerChallenge.findById(req.params.id);
        if (!playerChallenge) {
            return res.status(404).json({ message: 'Player-Challenge combination not found' });
        }
        await playerChallenge.deleteOne();
        res.json({ message: 'Player-Challenge combination deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all challenges for a specific player
router.get('/player/:playerId', async (req, res) => {
    try {
        const playerChallenges = await PlayerChallenge.find({ player: req.params.playerId })
            .populate('challenge', 'name');
        res.json(playerChallenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update challenge progress
router.patch('/:id/progress', async (req, res) => {
    try {
        const playerChallenge = await PlayerChallenge.findById(req.params.id);
        if (!playerChallenge) {
            return res.status(404).json({ message: 'Player-Challenge combination not found' });
        }
        
        if (req.body.current) playerChallenge.current = req.body.current;
        if (req.body.completed !== undefined) playerChallenge.completed = req.body.completed;
        
        const updatedPlayerChallenge = await playerChallenge.save();
        res.json(updatedPlayerChallenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get completed challenges for a player
router.get('/player/:playerId/completed', async (req, res) => {
    try {
        const completedChallenges = await PlayerChallenge.find({
            player: req.params.playerId,
            completed: true
        }).populate('challenge', 'name');
        res.json(completedChallenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 