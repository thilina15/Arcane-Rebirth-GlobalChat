require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
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
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Arcane Chat API' });
});

// Start server
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
