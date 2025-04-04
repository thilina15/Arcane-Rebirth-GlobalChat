require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const playerRoutes = require('./routes/playerRoutes');
const heroRoutes = require('./routes/heroRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const playerHeroRoutes = require('./routes/playerHeroRoutes');
const playerChallengeRoutes = require('./routes/playerChallengeRoutes');
const guildRoutes = require('./routes/guildRoutes');
const avatarRoutes = require('./routes/avatarRoutes');
const frameRoutes = require('./routes/frameRoutes');
const WebSocketService = require('./services/websocket');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket service
const wss = new WebSocketService(server);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/heroes', heroRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/player-heroes', playerHeroRoutes);
app.use('/api/player-challenges', playerChallengeRoutes);
app.use('/api/guilds', guildRoutes);
app.use('/api/avatars', avatarRoutes);
app.use('/api/frames', frameRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Arcane Rebirth Game Server API' });
});

// Start server
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
