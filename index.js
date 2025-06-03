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
    maxAge: 86400, // Cache preflight requests for 24 hours
    credentials: false // Set to false when origin is '*'
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased limit for game data
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use(requestLogger);

// Health check endpoint (before other routes)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api/players', playerRoutes);
app.use('/api/heroes', playerHeroRoutes);
app.use('/api/foundations', foundationRoutes);
app.use('/api/inventory', inventoryRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Arcane Rebirth Game Server API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Start server
const PORT = process.env.PORT || 3333;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`WebSocket service initialized`);
});

module.exports = { app, server };