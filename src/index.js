const server = require('./server');

module.exports.main = async () => {
    await server.init();
    await server.listen();
}
