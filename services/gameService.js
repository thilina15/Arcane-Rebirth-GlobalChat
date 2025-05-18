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

const updateOrCreateFoundation = async (playerId, foundationId, updateData) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    // Remove fields that shouldn't be updated
    delete updateData.playerId;
    delete updateData.foundationId;
    delete updateData.createdAt;

    // Try to find existing foundation
    let foundation = await Foundation.findOne({ 
        player: player._id,
        foundationId 
    });

    if (foundation) {
        // Update existing foundation
        foundation = await Foundation.findOneAndUpdate(
            { 
                player: player._id,
                foundationId 
            },
            { $set: updateData },
            { new: true, runValidators: true }
        );
    } else {
        // Create new foundation
        foundation = new Foundation({
            player: player._id,
            foundationId,
            ...updateData
        });
        await foundation.save();
    }

    return foundation;
};

module.exports = {
    getHerosForPlayer,
    getFoundationsForPlayer,
    updateOrCreateFoundation
};