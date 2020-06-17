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
    // req format
    // { 
    //     ExptectPreview: bool,
    //     Content: [arr]
    // }

    let Res = {};

    // res format
    // errors not present if error is false
    // content not present if error is true
    // {
    //     Error: bool,
    //     Errors: [err],
    //     Content: [{
    //         id: int,
    //         url: string,
    //         valid: bool,
    //         action: string
    //     }]
    // }

    if (!req || !req.Content)
    {
        Res.Error = true;
        Res.Errors = ErorrsBuilder("Content Error", "No content in request");
        socket.emit('VideoListResolution', Res);
        return;
    }

    const VideoArray = req.Content;

    

    socket.emit('VideoListResolution', );
}


function ErorrsBuilder(...errors)
{
    // errors format 
    // Errors: [{
    //     type: string,
    //     content: string
    // }],
    let ret = [];
    let j = 0;
    for (let i = 0; i < errors.length; i += 2)
    {
        ret[j] = {
            type: errors[i],
            content: errors[i+1]
        };
        j++;
    }
    return ret;
}

module.exports.App = app;
module.exports.Http = http;
module.exports.Io = io;

