const express = require('express');
const router = express.Router();
const { getBuildingsForPlayer, getFoundationsForPlayer, getHerosForPlayer } = require('../services/gameService');
const Player = require('../models/Player');

// Get all buildings for a player
router.get('/random', async (req, res) => {
    try {
        const playerId = req.query.playerId;
        // get random player without playerId
        const randomPlayers = await Player.find({ playerId: { $ne: playerId } });
        const randomPlayer = randomPlayers[Math.floor(Math.random() * randomPlayers.length)];

        // get buildings for random player
        const buildings = await getBuildingsForPlayer(randomPlayer.playerId);

        // get foundations for random player
        const foundations = await getFoundationsForPlayer(randomPlayer.playerId);

        //get player heroes
        const heroes = await getHerosForPlayer(randomPlayer.playerId);

        // make response
        const response = {
            player: randomPlayer.toJSON(),
            buildings: buildings,
            foundations: foundations,
            heroes: heroes
        };
        res.json(response);

    } catch (error) {
        if (error.message === 'Player not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});



module.exports = router; 