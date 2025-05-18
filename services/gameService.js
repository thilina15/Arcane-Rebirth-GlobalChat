const PlayerHero = require('../models/PlayerHero');
const Player = require('../models/Player');
const Foundation = require('../models/Foundation');

const getHerosForPlayer = async (playerId) => {
    // First find the player to get their ObjectId
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    const heroes = await PlayerHero.find({ player: player._id });
    return heroes;
};

const getFoundationsForPlayer = async (playerId) => {
    // First find the player to get their ObjectId
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    const foundations = await Foundation.find({ player: player._id });
    return foundations;
};

const createFoundation = async (playerId, foundationId, heroId) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    // Check if foundation already exists for this player
    const existingFoundation = await Foundation.findOne({ 
        player: player._id,
        foundationId 
    });

    if (existingFoundation) {
        throw new Error('Foundation already exists for this player');
    }

    const foundation = new Foundation({
        player: player._id,
        foundationId,
        heroId
    });

    return await foundation.save();
};

const updateFoundation = async (playerId, foundationId, updateData) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    // Remove fields that shouldn't be updated
    delete updateData.playerId;
    delete updateData.foundationId;
    delete updateData.createdAt;

    const foundation = await Foundation.findOneAndUpdate(
        { 
            player: player._id,
            foundationId 
        },
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!foundation) {
        throw new Error('Foundation not found');
    }

    return foundation;
};

module.exports = {
    getHerosForPlayer,
    getFoundationsForPlayer,
    createFoundation,
    updateFoundation
};