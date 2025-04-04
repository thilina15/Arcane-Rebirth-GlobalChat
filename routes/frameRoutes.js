const express = require('express');
const router = express.Router();
const Frame = require('../models/Frame');

// Create a new frame
router.post('/', async (req, res) => {
    try {
        const frame = new Frame(req.body);
        await frame.save();
        res.status(201).send(frame);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all frames
router.get('/', async (req, res) => {
    try {
        const frames = await Frame.find({});
        res.send(frames);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a specific frame by ID
router.get('/:id', async (req, res) => {
    try {
        const frame = await Frame.findById(req.params.id);
        if (!frame) {
            return res.status(404).send();
        }
        res.send(frame);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router; 