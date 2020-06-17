
module.exports.Configuration = {}

module.exports.Load = () =>
{
    module.exports.Configuration = {
        LogFile: 'logs.log',
        ListenPort: 8080,
        PublicDirectory: 'public',
        StorageDirectory: './tmp/',
        CacheCleanInterval: 2
    }
}
