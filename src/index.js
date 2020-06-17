const Logger = require('./logger')
const Config = require('./config');
const Server = require('./server');

const YoutubeHelper = require('./youtubehelper');

module.exports.Main = async () =>
{
    await Config.Load();

    await YoutubeHelper.InitResolverCache();

    await Server.Init();
    Server.Listen();
}
