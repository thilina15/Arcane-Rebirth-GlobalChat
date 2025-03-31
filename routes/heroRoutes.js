const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');

// Get all heroes
router.get('/', async (req, res) => {
    try {
        const heroes = await Hero.find();
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single hero
router.get('/:id', async (req, res) => {
    try {
        const hero = await Hero.findById(req.params.id);
        if (!hero) {
            return res.status(404).json({ message: 'Hero not found' });
        }
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create hero
router.post('/', async (req, res) => {
    const hero = new Hero({
        heroId: req.body.heroId,
        name: req.body.name
    });

    try {
        const newHero = await hero.save();
        res.status(201).json(newHero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update hero
router.patch('/:id', async (req, res) => {
    try {
        const hero = await Hero.findById(req.params.id);
        if (!hero) {
            return res.status(404).json({ message: 'Hero not found' });
        }
        if (req.body.name) hero.name = req.body.name;
        
        const updatedHero = await hero.save();
        res.json(updatedHero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete hero
router.delete('/:id', async (req, res) => {
    try {
        const hero = await Hero.findById(req.params.id);
        if (!hero) {
            return res.status(404).json({ message: 'Hero not found' });
        }
        await hero.deleteOne();
        res.json({ message: 'Hero deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 