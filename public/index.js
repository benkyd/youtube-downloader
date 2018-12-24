let socket = io();

(() => {
    console.log('Starting up');
})();

socket.on('path', async (data) => {
    document.getElementById('saveloc').innerText = data;
});

let isDownloading = false;
let VideosToDownload = {};
document.getElementById('VideosToRecord').addEventListener('keyup', (e) => {
    if (isDownloading) return;
    let current = document.getElementById('VideosToRecord').value;
    VideosToDownload = current.split('\n');
    
    let payload = {
        ExpectPreview: true,
        VideosToDownload: VideosToDownload
    };
    
    socket.emit('video-list', payload);
});

let VideoPreview = [];

function renderPreview() {
    if (isDownloading) return;
    document.getElementById('VideoPreview').innerText = '';
    for (const [key, value] of Object.entries(VideoPreview)) {
        if (document.getElementById(key) == null) {
            if (!value.found) {
                document.getElementById('VideoPreview').innerHTML += `<div id="${key}">${key}: <h>Video not found</h></div>`;
            } else {
                document.getElementById('VideoPreview').innerHTML += `<div id="${key}">${key}: <h>${value.title}</h></div>`;
            }
        }
    }
}

function clearPreview() {
    document.getElementById('VideoPreview').innerText = '';
}

socket.on('video-preview', async (data) => {
    if (isDownloading) return;
    if (!data || !data.data || data.contents == false) {
        clearPreview();
        return;
    }
    VideoPreview = data.data;
    renderPreview();
});

document.getElementById('Download').addEventListener('click', async (event) => {
    if (isDownloading) return;
    socket.emit('download', document.getElementById('VideosToRecord').value.split('\n'));
    document.getElementById('VideoPreview').innerText = '\nDownloading...';
    document.getElementById('VideosToRecord').value = null;
    isDownloading = true;
    console.log('Asked server for download...');
});


