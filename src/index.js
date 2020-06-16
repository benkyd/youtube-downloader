const Logger = require('./logger')
const Config = require('./config');
const Server = require('./server');

module.exports.Main = async () =>
{
    await Config.Load();

    await Server.Init();
    Server.Listen();
}
