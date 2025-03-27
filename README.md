# Arcane Rebirth - Game Server

## Overview
Arcane Rebirth is an epic tower defense game featuring heroes, knights, and mythical creatures. This server component handles the game's global chat system and user data management, providing a seamless multiplayer experience for players on Steam.

## Features

### Global Chat System
- Real-time global chat using WebSocket technology
- Live player count tracking
- Instant message broadcasting to all connected players
- JSON-based message format for structured communication

### User Management
- Secure user authentication and registration
- Profile management system
- User statistics tracking
- Data persistence using MongoDB

### Game Data Management
- Hero statistics and progression
- Character inventory management
- Equipment tracking (armors, weapons)
- Challenger system data
- Player achievements and milestones

## Technical Stack
- Node.js
- Express.js (REST API)
- WebSocket (Real-time communication)
- MongoDB (Database)
- Mongoose (ODM)

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Steam API credentials (for Steam integration)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/arcane-rebirth-globalchat.git
cd arcane-rebirth-globalchat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3333
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### WebSocket Connection
- WebSocket server runs on the same port as the HTTP server
- Connection URL: `ws://localhost:3333`

## Game Integration
The server is designed to integrate seamlessly with the Arcane Rebirth game client. It handles:
- Player authentication via Steam
- Real-time chat communication
- Game state synchronization
- Player progression tracking
- Inventory management
- Character statistics

## Security
- Password hashing (to be implemented)
- Secure WebSocket connections
- CORS protection
- Environment variable protection
- Input validation

## Development Roadmap
- [ ] Steam API integration
- [ ] Hero and character data models
- [ ] Inventory system
- [ ] Achievement system
- [ ] Leaderboard implementation
- [ ] Game state synchronization
- [ ] Anti-cheat measures

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the ISC License - see the LICENSE file for details.

## Support
For support, please contact the development team or create an issue in the repository.

## Acknowledgments
- Steam API
- MongoDB Atlas
- Node.js community
- Express.js framework
- WebSocket protocol

---

Made with ❤️ by the Arcane Rebirth Development Team 