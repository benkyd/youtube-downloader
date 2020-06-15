const Config = require('./config');

const express = require('express');

let app;
let http;
let io;

module.exports.Init = async () => {
    app = require('express')();
    http = require('http').Server(app);
    io = require('socket.io')(http);
    
    http.listen(main.config.serverPort, () => {
        logger.log(`HTTP server listening on port ${main.config.serverPort}`);
        logger.log(`WebSocket server listening on ${main.config.serverPort}`);
    }); 
}

module.exports.listen = async () => {
    app.use(express.static('public'));

    io.on('connection', async (socket) => {
        logger.log(`New socket connection from id: ${socket.id}`);


    });
}

module.exports.App = app;
module.exports.Http = http;
module.exports.Io = io;

