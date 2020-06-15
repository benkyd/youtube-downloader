const server = require('./server');

let config =  {
    serverPort: 8080,
    downloadLocation: './'
};

module.exports.config = config;

module.exports.main = async () => {
    await server.init();
    await server.listen();
}
