
const PlayerHero = require('../models/PlayerHero');
const Player = require('../models/Player');


const getHerosForPlayer = async (playerId) => {
        
        // First find the player to get their ObjectId
        const player = await Player.findOne({ playerId });
        if (!player) {
            throw new Error('Player not found');
        }

        const heroes = await PlayerHero.find({ player: player._id });
        return heroes;
};


module.exports = {
    getHerosForPlayer,
};