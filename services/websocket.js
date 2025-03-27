const WebSocket = require('ws');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = [];
        this.online_users = 0;
        this.initialize();
    }

    initialize() {
        console.log("Arcane WS server is online");

        this.wss.on("connection", (ws) => {
            console.log("New client connected");
            this.online_users++;

            this.clients.push(ws);

            ws.send("You are connected to the global server!");
            ws.send("New online user count is " + this.online_users);

            this.clients.forEach(client => {
                if (client !== ws) {
                    client.send("New client has connected, new online user count is " + this.online_users);
                }
            });

            ws.on("message", (message) => {
                try {
                    const receivedMessage = message.toString();
                    let messageJson = JSON.parse(receivedMessage);
                    console.log("Received message:", messageJson);
                    let messageString = JSON.stringify(messageJson);
                    
                    this.clients.forEach(client => {
                        client.send(messageString);
                    });
                    
                } catch (error) {
                    console.log("Error parsing message to JSON");
                }
            });

            ws.on("close", () => {
                console.log("Client disconnected");
                this.online_users--;

                const index = this.clients.indexOf(ws);
                if (index !== -1) {
                    this.clients.splice(index, 1);
                }

                this.clients.forEach(client => {
                    if (client !== ws) {
                        client.send("Someone has disconnected, new online user count is " + this.online_users);
                    }
                });
            });
        });
    }
}

module.exports = WebSocketService; 