const { WebcastPushConnection } = require('tiktok-live-connector');
const WebSocket = require('ws');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log("Server běží na portu " + port));

const wss = new WebSocket.Server({ server });

const tiktokUsername = "kdo.ses.tvl"; 
const tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

tiktokLiveConnection.connect().then(state => {
    console.info(`Připojeno na stream ${tiktokUsername}`);
}).catch(err => {
    console.error('Chyba připojení', err);
});

tiktokLiveConnection.on('chat', data => {
    const msg = data.comment.trim().toLowerCase();
    
    if (["1", "2", "3", "4", "a", "b", "c", "d"].includes(msg)) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    username: data.uniqueId,
                    message: msg.toUpperCase()
                }));
            }
        });
    }
});
