require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const playerRoutes = require('./routes/playerRoutes');
const playerHeroRoutes = require('./routes/playerHeroRoutes');
const foundationRoutes = require('./routes/foundationRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const WebSocketService = require('./services/websocket');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket service
const wss = new WebSocketService(server);

// Connect to MongoDB
connectDB();

// CORS configuration for Unreal Engine
const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // Cache preflight requests for 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/heroes', playerHeroRoutes);
app.use('/api/foundations', foundationRoutes);
app.use('/api/inventory', inventoryRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Arcane Rebirth Game Server API' });
});

// Start server
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
