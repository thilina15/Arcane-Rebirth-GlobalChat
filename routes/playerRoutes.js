const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Avatar = require('../models/Avatar')
const Frame = require('../models/Frame');
const Guild = require('../models/Guild');

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

    //  get default values......
    const defaultAvatar = await Avatar.findOne({avatarId:"default-1"})
    const defaultFrame = await Frame.findOne({frameId:"default-1"})
    const defaultRank = 0
    const defaultEXP = 0

    const player = new Player({
        playerId: req.body.playerId,
        name: req.body.name,
        title: req.body.title,
        rank: defaultRank,
        avatar: defaultAvatar._id,
        frame: defaultFrame._id,
        exp: defaultEXP
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
        const player = await Player.findOne({playerId:req.params.id});
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // update name..............
        if(req.body.name){
            player.name = req.body.name
        }

        // update rank
        if(req.body.rank){
            player.rank = req.body.rank
        }

        // update title
        if(req.body.title){
            player.title = req.body.title
        }

        // update guild
        if(req.body.guild){
            const guild = await Guild.findOne({guildId:req.body.guild})
            if(guild){
                player.guild = guild._id
            }
        }

        // update avatar
        if(req.body.avatar){
            const avatar = await Avatar.findOne({avatarId:req.body.avatar})
            if(avatar){
                player.avatar = avatar._id
            }
        }

        // update frame
        if(req.body.frame){
            const frame = await Frame.findOne({frameId:req.body.frame})
            if(frame){
                player.frame = frame._id
            }
        }

        // update XP
        if(req.body.exp){
            player.exp = req.body.exp
        }

        // update squad leader
        if(req.body.squadLeader){
            player.squadLeader = req.body.squadLeader
        }

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