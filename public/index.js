let Socket = io();

(() => 
{
    console.log('Starting up');
})();

const VideoInput = document.getElementById("VideosToRecord");

VideoInput.oninput = () => 
{
    const ToSend = {
        // TODO: add toggle
        ExpectPreview: true,
        Content: VideoInput.value.split('\n')
    };
    Socket.emit('VideoListUpdate', ToSend);
};

Socket.on('VideoListResolution', (req) => console.log(req));
