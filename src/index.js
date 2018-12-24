const server = require('./server');

let config =  {
    serverPort: 80,
    downloadLocation: './'
};

module.exports.config = config;

module.exports.main = async () => {
    await server.init();
    await server.listen();
}
