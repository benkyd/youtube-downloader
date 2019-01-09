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
    document.getElementById('VideoBox').innerText = '';
    for (const [key, value] of Object.entries(VideoPreview)) {
        if (document.getElementById(key) == null) {
            if (!value.found) {
                document.getElementById('VideoBox').innerHTML += `<div id="${key}">${key}: <h>Video not found</h></div>`;
            } else {
                document.getElementById('VideoBox').innerHTML += `<div id="${key}">${key}: <h>${value.title}</h></div>`;
            }
        }
    }
}

function clearPreview() {
    document.getElementById('VideoBox').innerText = '';
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
    socket.emit('download', { 
        videos: document.getElementById('VideosToRecord').value.split('\n'),
        audioOnly: document.getElementById('AudioOnly').checked
    });
    document.getElementById('VideoBox').innerText = 'Downloading...';
    // document.getElementById('VideosToRecord').value = null;
    isDownloading = true;
    console.log('Asked server for download...');
});

let downloads = [];
let downloadCount = 0;
let completedDownloads = 0;

function renderDownloads() {
    document.getElementById('VideoBox').innerText = '';
    for (const [key, value] of Object.entries(downloads)) {
        document.getElementById('VideoBox').innerHTML += `<div id="${key}">${value.title}: <h>${value.percent}</h></div>`;
    }
}

socket.on('download-count', async (data) => {
    downloadCount = data.num;
});

socket.on('download-done', async(data) => {    
    downloads[data.video] = {title: data.title, percent: 'Complete!'};
    renderDownloads();
});

socket.on('download-progress', async (data) => {
    downloads[data.video] = data;
    renderDownloads();
});

socket.on('queue-concluded', async (data) => {
    completedDownloads = 0; downloadCount = 0;
    isDownloading = false;
    downloads = [];
    document.getElementById('VideoBox').innerHTML += "<h>Queue Concluded...</h>";
});
