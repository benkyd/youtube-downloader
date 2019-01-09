const logger = require('./logger');

const fs = require('fs');
const ytdl = require('ytdl-core');

module.exports.resolveVideos = async (arr) => {
    let output = {contents: false, data: {}};

    for (let video of arr) {
        if (video == '' || video == ' ') continue;
        try {
            if (await ytdl.validateURL(video)) {
                const info = await ytdl.getBasicInfo(video);
                if (!info) {
                    output.data[video] = {found: false};
                    return;
                }
                output.data[video] = {
                    found: true,
                    title: info.title,
                    thumbnail: info.thumbnail_url.replace('default', 'maxresdefault'),
                    runtime: info.length_seconds
                }
                output.contents = true;
            } else {
                output.data[video] = {found: false};
                output.contents = true;
            }
        } catch (e) {
            output.data[video] = {found: false};
            output.contents = true;
            logger.log(`Error resolving video ${video}: ${e}`);
        }
    }

    return output;
}

let downloadQueue = [];

module.exports.setupDownloadQueue = async (arr, socket, options) => {
    let numOfDownloads;

    downloadQueue[socket.id] = {
        count: 0,
        videos: { }
    }

    for (const [key, value] of Object.entries(arr)) {
        if (ytdl.validateURL(key)) {

            numOfDownloads++;
            socket.emit('download-progress', {video: key, percent: "Queued", title: value.title});
        }
    }

    socket.emit('download-count', {num: numOfDownloads});
    
    for (const [key, value] of Object.entries(arr)) {
        if (ytdl.validateURL(key)) {
            await runQueueAsync(socket.id);
            await download(key, value.title, socket, options.audioOnly);
        }
    }
}

async function runQueueAsync(socketID) {

}

async function download(video, videoName ,socket, audioOnly, path = './') {
    return new Promise(async (resolve, reject) => {
        let stream;
        try {
            if (audioOnly) {
                stream = await ytdl(video, {quality: 'highest', filter: (format) => format.container === 'mp4'});
                stream.pipe(fs.createWriteStream(`${path}/${(videoName).replace(/\//, '-')}.mp4`));
            } else {
                stream = await ytdl(video, {quality: 'highest', filter: "audioonly"});
                stream.pipe(fs.createWriteStream(`${path}/${(videoName).replace(/\//, '-')}.mp3`));
            }

            stream.on('response', (res) => {
                let totalSize = res.headers['content-length'];
                let dataRead = 0;
                let lastPercent = 0;
                res.on('data', (data) => {
                    dataRead += data.length;
                    let percent = Math.floor((dataRead / totalSize) * 100) + '%';
                    if (percent != lastPercent) {
                        socket.emit('download-progress', {video: video, percent: percent, title: videoName});
                    }
                    lastPercent = percent;
                });

                res.on('end', () => {
                    logger.log(`Socket id '${socket.id}' finished downloading ${videoName}`)
                    socket.emit('download-done', {video: video, title: videoName});
                    resolve('complete');
                });

                logger.log(`Socket id '${socket.id}' is downloading ${videoName}`);
            });
        } catch (e) {
            logger.log(`Socket id '${socket.id}' failed to download ${videoName}: ${e}`);
            socket.emit('download-done', {video: video, title: videoName});
            socket.emit('download-progress', {video: video, percent: "Failed", title: videoName});
            resolve('error');
        }
    });
}
