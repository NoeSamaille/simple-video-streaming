const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const pug = require('pug')

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

// WebSocket connexion
const wsServer = new WebSocket.Server({ server: httpServer }, () => console.log(`WS server is listening at ws://localhost:${PORT}`));
let clients = [];
wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    clients.push(ws);
    ws.on('message', data => {
        clients.forEach((ws, i) => {
            // Check connexion
            if (ws.readyState === ws.OPEN) {
                // Send data
                ws.send(data);
            } else {
                // Remove from connected clients
                clients.splice(i, 1);
            }
        });
    });
});

// Home Page
app.get('/', (req, res) => {
    res.send(pug.renderFile('index.pug', {
        title: process.env.INDEX_TITLE || 'Simple Streaming Client',
        ws_url: process.env.WS_URL || `ws://localhost:${PORT}`
    }))
});
// Start http server
httpServer.listen(PORT, () => console.log(`HTTP server listening at http://localhost:${PORT}`));
