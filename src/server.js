let app;
let http;
let io;

module.exports.init = async () => {
    app = require('express')();
    http = require('http').Server(app);
    io = require('socket.io')(http);
    
    http.listen(80, () => {
        console.log('HTTP server listening on port 80');
        console.log('Socket server listening');
    }); 
}

module.exports.listen = async () => {
    app.use()
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/../public/index.html');
    });
}

module.exports.app = app;
module.exports.http = http;
module.exports.io = io;
