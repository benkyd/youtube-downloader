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
    

}
