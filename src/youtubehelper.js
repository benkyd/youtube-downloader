const Config = require('./config');
const Logger = require('./logger');

const YTDL = require('ytdl-core');

// TODO: does the video resolver need a queue?

// cache
let ResolutionCache = [];

function HitCache(id)
{
    if (ResolutionCache[id])
    {
        Logger.Log(`Cache hit! ${id}`)
        ResolutionCache[id].LastUsed = Date.now();
        return ResolutionCache[id].Video;
    } else
    {
        return false;
    }
}

function RegisterCache(video)
{
    ResolutionCache[video.player_response.videoDetails.videoId] = {
        Id: video.player_response.videoDetails.videoId,
        Video: video,
        LastUsed: Date.now(),
        TimeCreated: Date.now()
    }
}

function CleanCache()
{
    // TODO: fix weird bug where a cleaned
    // entry's timeused lingers
    let ExpiredEntrys = [];
    for (id in ResolutionCache)
    {
        entry = ResolutionCache[id];
        // if cache entry has expired
        const LastUsed = Date.now() - entry.LastUsed;
        if (LastUsed > Config.Configuration.CacheTimeToUse)
        {
            // remove expired entry
            Logger.Log(`Cache entry '${id}' expired`);
            ExpiredEntrys.push(id);
            delete entry;
        }
    }

    for (expiredEntry of ExpiredEntrys)
    {
        delete ResolutionCache[expiredEntry];
    }
}

module.exports.InitResolverCache = async () =>
{
    setInterval(CleanCache, Config.Configuration.CacheCleanInterval);
    Logger.Log('Video resolver cache settup')
}

module.exports.GetVideoInfoArr = async (arr) =>
{
    let ret = [];
    // TODO: make async AND retain order
    for (video of arr) 
    {
        ret.push(await this.GetVideoInfo(video));
    }
    return ret;
}

module.exports.GetVideoInfo = async (video) =>
{
    try
    {
        const CacheHit = HitCache(video);

        let Video = {};

        if (CacheHit)
        {
            Video = CacheHit
        } else 
        {
            // TODO: is the YouTube API faster for this?
            Logger.Log(`Resolving '${video}'`)
            Video = await YTDL.getInfo(video);
            // register the info into the cache
            RegisterCache(Video);
        }
        

        let Res = BuildBasicInfoFromInfo(Video);
        return Res;

    } catch (e)
    {
        Logger.Log(`Error resolving video '${video}', ${e}`);
        return { Error: "Video cannot resolve" };
    }
}

function BuildBasicInfoFromInfo(info)
{
    let ret = {};
    ret.id = info.player_response.videoDetails.videoId;
    ret.title = info.player_response.videoDetails.title;
    ret.desc = info.player_response.videoDetails.shortDescription;
    ret.views = info.player_response.videoDetails.viewCount;
    if (!info.player_response.videoDetails.thumbnail.thumbnails[0])
    {
        ret.thumbnail = info.player_response.videoDetails.thumbnail.thumbnails[1].url;
    } else 
    {
        ret.thumbnail = info.player_response.videoDetails.thumbnail.thumbnails[0].url;   
    }
    ret.channel = info.player_response.videoDetails.author;
    ret.runtime = info.player_response.videoDetails.lengthSeconds;
    return ret;
}
