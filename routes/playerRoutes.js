const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Get all players
router.get('/', async (req, res) => {
    try {
        const players = await Player.find()
            .populate('guild')
            .populate('avatar')
            .populate('frame')
            .populate('squadLeader', 'name rank');
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single player
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id)
            .populate('guild')
            .populate('avatar')
            .populate('frame')
            .populate('squadLeader', 'name rank');
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create player
router.post('/', async (req, res) => {
    const player = new Player({
        playerId: req.body.playerId,
        name: req.body.name,
        rank: req.body.rank,
        title: req.body.title,
        guild: req.body.guild,
        avatar: req.body.avatar,
        frame: req.body.frame,
        exp: req.body.exp || 0,
        squadLeader: req.body.squadLeader
    });

    try {
        const newPlayer = await player.save();
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update player
router.patch('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        
        // Update fields if provided
        if (req.body.name) player.name = req.body.name;
        if (req.body.rank) player.rank = req.body.rank;
        if (req.body.title) player.title = req.body.title;
        if (req.body.guild) player.guild = req.body.guild;
        if (req.body.avatar) player.avatar = req.body.avatar;
        if (req.body.frame) player.frame = req.body.frame;
        if (req.body.exp) player.exp = req.body.exp;
        if (req.body.squadLeader) player.squadLeader = req.body.squadLeader;
        
        const updatedPlayer = await player.save();
        res.json(updatedPlayer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete player
router.delete('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        await player.deleteOne();
        res.json({ message: 'Player deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get player's heroes
router.get('/:id/heroes', async (req, res) => {
    try {
        const playerHeroes = await PlayerHero.find({ player: req.params.id })
            .populate('hero');
        res.json(playerHeroes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get player's challenges
router.get('/:id/challenges', async (req, res) => {
    try {
        const playerChallenges = await PlayerChallenge.find({ player: req.params.id })
            .populate('challenge');
        res.json(playerChallenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 