const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const { Server } = require('socket.io')

const app = express();
const PORT = process.env.PORT || 3000;


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on("connection", (client) => {
    console.log("New websocket connection!...");

    client.on("transcribe", (data) => {
        const dataURL = data.split(",").pop();
        // convert to buffer
        let fileBuffer = Buffer.from(dataURL, "base64");

        fs.writeFileSync(`${client.id}.wav`, fileBuffer);
    });

    client.on("disconnect", (reason) => {
        console.log(`\nDisconnected....\nReason=${reason}\n`);
    });
});


server.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});