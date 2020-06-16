const Logger = require('./logger')
const Config = require('./config');

const express = require('express');

let app;
let http;
let io;

module.exports.Init = async () => 
{
    app = require('express')();
    http = require('http').Server(app);
    io = require('socket.io')(http);
}

module.exports.Listen = async () => 
{
    http.listen(Config.Configuration.ListenPort, () => {
        Logger.Log(`HTTP server listening on port ${Config.Configuration.ListenPort}`);
        Logger.Log(`WebSocket server listening on ${Config.Configuration.ListenPort}`);
    }); 

    app.use(express.static(Config.Configuration.PublicDirectory));

    io.on('connection', async (socket) => {
        Logger.Log(`New socket connection from ip: ${socket.handshake.address}, unique id: ${socket.id}`);

        SocketHandler(socket);

    });
}

function SocketHandler(socket) 
{
    socket.on('VideoListUpdate', (req) => VideoListUpdate(socket, req) );
}

async function VideoListUpdate(socket, req)
{
    

    socket.emit('VideoListResolution', req.Content);
}

module.exports.App = app;
module.exports.Http = http;
module.exports.Io = io;

