const express = require('express');

let app;
let http;
let io;

module.exports.init = async () => {
    app = require('express')();
    http = require('http').Server(app);
    io = require('socket.io')(http);
    
    http.listen(8080, () => {
        console.log('HTTP server listening on port 8080');
        console.log('WebSocket server listening');
    }); 
}

module.exports.listen = async () => {
    app.use(express.static('public'));
}

module.exports.app = app;
module.exports.http = http;
module.exports.io = io;
