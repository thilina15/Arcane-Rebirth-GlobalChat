require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const playerRoutes = require('./routes/playerRoutes');
const playerHeroRoutes = require('./routes/playerHeroRoutes')
const WebSocketService = require('./services/websocket');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket service
const wss = new WebSocketService(server);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/heros',playerHeroRoutes)

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Arcane Rebirth Game Server API' });
});

// Start server
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
