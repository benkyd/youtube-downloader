const logger = require('./logger');

const fs = require('fs');
const ytdl = require('ytdl-core');

module.exports.resolveVideos = async (arr) => {
    let output = {contents: false, data: {}};

    for (let video of arr) {
        if (video == '' || video == ' ') continue;
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
    }

    return output;
}

module.exports.downloadVideos = async (arr, socket, options) => {
    let path = options.path ? options.path : './'
    let numOfDownloads = 0;

    for (const [key, value] of Object.entries(arr)) {
        if (ytdl.validateURL(key)) {
            try {
                const stream = await ytdl(key, {quality: 'highest'});
                stream.pipe(fs.createWriteStream(`${path}/${value.title}.mp4`));

                stream.on('response', (res) => {
                    let totalSize = res.headers['content-length'];
                    let dataRead = 0;
                    let lastPercent = 0;
                    res.on('data', (data) => {
                        dataRead += data.length;
                        let percent = Math.floor((dataRead / totalSize) * 100) + '%';
                        if (percent != lastPercent) {
                            socket.emit('download-progress', {video: key, percent: percent, title: value.title});
                        }
                        lastPercent = percent;
                    });
                    res.on('end', () => {
                        logger.log(`Socket id '${socket.id}' finished downloading ${value.title}`)
                        socket.emit('download-done', {video: key, title: value.title});
                    });
                });
        
                logger.log(`Socket id '${socket.id}' is downloading ${value.title}`);
            } catch (e) {
                logger.log(`Socket id '${socket.id}' failed to download ${value.title}`);
                socket.emit('download-done', {video: key, title: value.title});
            }
            numOfDownloads++;
        }
    }
    socket.emit('download-count', {num: numOfDownloads});
}
