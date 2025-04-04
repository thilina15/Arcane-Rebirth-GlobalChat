const express = require('express');
const router = express.Router();
const PlayerHero = require('../models/PlayerHero');
const Player = require('../models/Player');
const Hero = require('../models/Hero');

// Get all player-hero combinations
router.get('/', async (req, res) => {
    try {
        const playerHeroes = await PlayerHero.find()
            .populate('player', 'name rank')
            .populate('hero', 'name');
        res.json(playerHeroes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single player-hero combination
router.get('/:id', async (req, res) => {
    try {
        const playerHero = await PlayerHero.findById(req.params.id)
            .populate('player', 'name rank')
            .populate('hero', 'name');
        if (!playerHero) {
            return res.status(404).json({ message: 'Player-Hero combination not found' });
        }
        res.json(playerHero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create player-hero combination
router.post('/', async (req, res) => {
    const player = await Player.findOne({ playerId: req.body.playerId });
    const hero = await Hero.findOne({ heroId: req.body.heroId });

    if (!player || !hero) {
        return res.status(404).json({ message: 'Player or Hero not found' });
    }
    const playerHero = new PlayerHero({
        hero: hero._id,
        player: player._id,
        level: req.body.level || 1,
        unlockedAbilityIds: req.body.unlockedAbilityIds || [],
        equippedAbilityIds: req.body.equippedAbilityIds || [],
        exp: req.body.exp || 0,
        kills: req.body.kills || 0,
        damageDealt: req.body.damageDealt || 0
    });

    try {
        const newPlayerHero = await playerHero.save();
        res.status(201).json(newPlayerHero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update player-hero combination
router.patch('/', async (req, res) => {
    try {

        // get player
        const player = await Player.findOne({playerId:req.body.player})
        const hero = await Hero.findOne({heroId:req.body.hero})

        if(!player||!hero){
            return res.status(404).json({ message: 'Player or Hero not found' });
        }

        const playerHero = await PlayerHero.findOne();
        if (!playerHero) {
            return res.status(404).json({ message: 'Player-Hero combination not found' });
        }
        
        // Update fields if provided
        if (req.body.level) playerHero.level = req.body.level;
        if (req.body.unlockedAbilityIds) playerHero.unlockedAbilityIds = req.body.unlockedAbilityIds;
        if (req.body.equippedAbilityIds) playerHero.equippedAbilityIds = req.body.equippedAbilityIds;
        if (req.body.exp) playerHero.exp = req.body.exp;
        if (req.body.kills) playerHero.kills = req.body.kills;
        if (req.body.damageDealt) playerHero.damageDealt = req.body.damageDealt;
        
        const updatedPlayerHero = await playerHero.save();
        res.json(updatedPlayerHero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete player-hero combination
router.delete('/:id', async (req, res) => {
    try {
        const playerHero = await PlayerHero.findById(req.params.id);
        if (!playerHero) {
            return res.status(404).json({ message: 'Player-Hero combination not found' });
        }
        await playerHero.deleteOne();
        res.json({ message: 'Player-Hero combination deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all heroes for a specific player
router.get('/player/:playerId', async (req, res) => {
    try {
        const playerHeroes = await PlayerHero.find({ player: req.params.playerId })
            .populate('hero', 'name');
        res.json(playerHeroes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update hero abilities
router.patch('/:id/abilities', async (req, res) => {
    try {
        const playerHero = await PlayerHero.findById(req.params.id);
        if (!playerHero) {
            return res.status(404).json({ message: 'Player-Hero combination not found' });
        }
        
        if (req.body.unlockedAbilityIds) {
            playerHero.unlockedAbilityIds = [...new Set([...playerHero.unlockedAbilityIds, ...req.body.unlockedAbilityIds])];
        }
        if (req.body.equippedAbilityIds) {
            playerHero.equippedAbilityIds = req.body.equippedAbilityIds;
        }
        
        const updatedPlayerHero = await playerHero.save();
        res.json(updatedPlayerHero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update hero stats
router.patch('/:id/stats', async (req, res) => {
    try {
        const playerHero = await PlayerHero.findById(req.params.id);
        if (!playerHero) {
            return res.status(404).json({ message: 'Player-Hero combination not found' });
        }
        
        if (req.body.exp) playerHero.exp += req.body.exp;
        if (req.body.kills) playerHero.kills += req.body.kills;
        if (req.body.damageDealt) playerHero.damageDealt += req.body.damageDealt;
        
        const updatedPlayerHero = await playerHero.save();
        res.json(updatedPlayerHero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 