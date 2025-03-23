const WebSocket = require("ws");
// const exec = require("child_process").exec;
// const {stdout} = require("process");

const wss = new WebSocket.Server({port: 3333});

// Array to store WebSocket connections representing each connected client
const clients = [];

online_users = 0;

console.log("Arcane WS server is online");

wss.on("connection", (ws)=>{

    console.log("New client connected");

    online_users ++;

    // Add the newly connected WebSocket to the list of connected clients
    clients.push(ws);

    ws.send("You are connected to the global server!");
    ws.send("New online user count is " + online_users);

    // Multicast the current user count message to all connected clients
    clients.forEach(client => {
        if (client !== ws) {
            client.send("New client has connected, new online user count is " + online_users);
        }
    });

    ws.on("message", function incoming(message) {
        try {
            const receivedMessage = message.toString();
            let messageJson = JSON.parse(receivedMessage);
            console.log("Received message:", messageJson);
            let messageString = JSON.stringify(messageJson);
            // console.log("Received message string:", messageString);
            // Multicast the received message to all connected clients except the sender
            clients.forEach(client => {
                // if (client !== ws) {
                    client.send(messageString);
    
                // }
            });
            
        } catch (error) {
            console.log("Error parsing message to JSON");
        }

    });

    // Event handler for WebSocket connection close
    ws.on("close", function close() {
        console.log("Client disconnected");

        online_users --;

        // Remove the disconnected WebSocket from the list of connected clients
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }

        // Multicast the current user count message to all connected clients
        clients.forEach(client => {
            if (client !== ws) {
                client.send("Someone has diconnected, new online user count is " + online_users);
            }
        });

    });
});
