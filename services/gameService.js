const PlayerHero = require('../models/PlayerHero');
const Player = require('../models/Player');
const Foundation = require('../models/Foundation');
const Building = require('../models/building');
const Inventory = require('../models/Inventory');
const Worker = require('../models/Worker');
const PlayerWarrior = require('../models/PlayerWarrior');

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

const deleteFoundation = async (playerId, foundationId) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    const foundation = await Foundation.findOneAndDelete({ 
        player: player._id,
        foundationId 
    });

    if (!foundation) {
        throw new Error('Foundation not found');
    }

    return foundation;
};

const deletePlayerHero = async (playerId, heroId) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    const playerHero = await PlayerHero.findOneAndDelete({ 
        player: player._id,
        heroId 
    });

    if (!playerHero) {
        throw new Error('Player hero not found');
    }

    return playerHero;
};

const addOrUpdateBuildings = async (playerId, buildingId, transforms) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    // Try to find existing building
    let building = await Building.findOne({ 
        player: player._id,
        buildingId 
    });

    if (building) {
        // Update existing building
        building = await Building.findOneAndUpdate(
            { 
                player: player._id,
                buildingId 
            },
            { $set: { transforms } },
            { new: true, runValidators: true }
        );
    } else {
        // Create new building
        building = new Building({
            player: player._id,
            buildingId,
            transforms
        });
        await building.save();
    }

    return building;
};

const updateInventory = async (playerId, inventoryId, updateData) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    // Remove fields that shouldn't be updated
    delete updateData.playerId;
    delete updateData.inventoryId;
    delete updateData.createdAt;

    // Try to find existing inventory
    let inventory = await Inventory.findOne({ 
        player: player._id,
        inventoryId 
    });

    if (inventory) {
        // Update existing inventory
        inventory = await Inventory.findOneAndUpdate(
            { 
                player: player._id,
                inventoryId 
            },
            { $set: updateData },
            { new: true, runValidators: true }
        );
    } else {
        // Create new inventory
        inventory = new Inventory({
            player: player._id,
            inventoryId,
            ...updateData
        });
        await inventory.save();
    }

    return inventory;
};

const getInventory = async (playerId) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    let inventory = await Inventory.findOne({ player: player._id });
    
    // Create inventory if it doesn't exist
    if (!inventory) {
        inventory = new Inventory({
            player: player._id,
            items: []
        });
        await inventory.save();
    }

    return inventory;
};

const updateEntireInventory = async (playerId, items) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    if (!items) {
        throw new Error('items array is required');
    }

    const inventory = await Inventory.findOneAndUpdate(
        { player: player._id },
        { $set: { items } },
        { new: true, runValidators: true, upsert: true }
    );

    return inventory;
};

const updateInventoryItem = async (playerId, itemId, quantity = 1) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    let inventory = await Inventory.findOne({ player: player._id });
    if (!inventory) {
        inventory = new Inventory({
            player: player._id,
            items: []
        });
    }

    // Check if item already exists
    const existingItemIndex = inventory.items.findIndex(item => item.itemId === itemId);

    if (existingItemIndex !== -1) {
        // Update existing item quantity
        inventory.items[existingItemIndex].quantity = quantity;
    } else {
        // Add new item
        inventory.items.push({
            itemId,
            quantity
        });
    }

    await inventory.save();
    return inventory;
};

const deleteInventoryItem = async (playerId, itemId, quantity) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    const inventory = await Inventory.findOne({ player: player._id });
    if (!inventory) {
        throw new Error('Inventory not found');
    }

    const itemIndex = inventory.items.findIndex(item => item.itemId === itemId);
    if (itemIndex === -1) {
        throw new Error('Item not found in inventory');
    }

    if (quantity) {
        const reduceAmount = parseInt(quantity);
        if (isNaN(reduceAmount) || reduceAmount <= 0) {
            throw new Error('Quantity must be a positive number');
        }

        if (inventory.items[itemIndex].quantity <= reduceAmount) {
            // Remove item completely if reducing by equal or more than current quantity
            inventory.items.splice(itemIndex, 1);
        } else {
            // Reduce quantity
            inventory.items[itemIndex].quantity -= reduceAmount;
        }
    } else {
        // Remove item completely if no quantity specified
        inventory.items.splice(itemIndex, 1);
    }

    await inventory.save();
    return inventory;
};

const getBuildingsForPlayer = async (playerId) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    const buildings = await Building.find({ player: player._id });
    return buildings;
};

const getWorkersForPlayer = async (playerId) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    const workers = await Worker.find({ player: player._id });
    return workers
};

const updateOrCreateWorker = async (playerId, workerId, updateData) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    // Remove fields that shouldn't be updated
    delete updateData.playerId;
    delete updateData.workerId;
    delete updateData.createdAt;

    // Try to find existing worker
    let worker = await Worker.findOne({ 
        player: player._id,
        workerId 
    });

    if (worker) {
        // Update existing worker
        worker = await Worker.findOneAndUpdate(
            { 
                player: player._id,
                workerId 
            },
            { $set: updateData },
            { new: true, runValidators: true }
        );
    } else {
        // Create new worker
        worker = new Worker({
            player: player._id,
            workerId,
            ...updateData
        });
        await worker.save();
    }

    return worker;
};

const deleteWorker = async (playerId, workerId) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    const worker = await Worker.findOneAndDelete({ 
        player: player._id,
        workerId 
    });

    if (!worker) {
        throw new Error('Worker not found');
    }

    return worker;
};

const getWarriorsForPlayer = async (playerId) => {
    // First find the player to get their ObjectId
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    const warriors = await PlayerWarrior.find({ player: player._id });
    return warriors;
};

const addOrUpdatePlayerWarrior = async (playerId, warriorId, updateData) => {
    const player = await Player.findOne({ playerId });
    if (!player) {
        throw new Error('Player not found');
    }

    // Remove fields that shouldn't be updated
    delete updateData.playerId;
    delete updateData.warriorId;
    delete updateData.createdAt;

    // Try to find existing warrior
    let playerWarrior = await PlayerWarrior.findOne({ 
        player: player._id,
        warriorId 
    });

    if (playerWarrior) {
        // Update existing warrior
        playerWarrior = await PlayerWarrior.findOneAndUpdate(
            { 
                player: player._id,
                warriorId 
            },
            { $set: updateData },
            { new: true, runValidators: true }
        );
    } else {
        // Create new warrior
        playerWarrior = new PlayerWarrior({
            player: player._id,
            warriorId,
            ...updateData
        });
        await playerWarrior.save();
    }

    return playerWarrior;
};

module.exports = {
    getHerosForPlayer,
    getFoundationsForPlayer,
    updateOrCreateFoundation,
    deleteFoundation,
    deletePlayerHero,
    addOrUpdateBuildings,
    updateInventory,
    getInventory,
    updateEntireInventory,
    updateInventoryItem,
    deleteInventoryItem,
    getBuildingsForPlayer,
    getWorkersForPlayer,
    updateOrCreateWorker,
    deleteWorker,
    addOrUpdatePlayerWarrior,
    getWarriorsForPlayer
};