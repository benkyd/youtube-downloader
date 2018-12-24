const logger = require('./logger')
const main = require('./index');
const youtube = require('./youtubehelper');

const express = require('express');

let app;
let http;
let io;

module.exports.init = async () => {
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

        socket.emit('path', main.config.downloadLocation);

        socket.on('video-list', async (data) => {
            if (data.ExpectPreview) {
                logger.log(`Socket id '${socket.id}' is requesting a video preview`);
                let response = await youtube.resolveVideos(data.VideosToDownload);
                socket.emit('video-preview', response);         
                logger.log(`Finished preview for socket id '${socket.id}'`);       
            }
        });

        socket.on('download', async (data) => {
            logger.log(`Socket id '${socket.id}' is requesting a download`);
            let toDownload = await youtube.resolveVideos(data);
            youtube.downloadVideos(toDownload.data, socket, {path: main.config.downloadLocation});
        });
    });
}

module.exports.app = app;
module.exports.http = http;
module.exports.io = io;
