const Logger = require('./logger');

module.exports.Configuration = {}

module.exports.Load = () =>
{
    this.Configuration = {
        LogFile: 'logs.log',
        ListenPort: 8080,
        PublicDirectory: 'public',
        StorageDirectory: './tmp/',
        CacheCleanInterval: 300000, // 5 mins
        CacheTimeToUse: 600000, // 10 mins
    }
    Logger.Log('Configuration loaded');
}
