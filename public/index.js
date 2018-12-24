(() => {
    console.log('Starting up');
})();

let VideosToDownload = [];
document.getElementById('VideosToRecord').addEventListener('keyup', (e) => {
    let current = document.getElementById('VideosToRecord').value;
    VideosToDownload = current.split('\n');
    console.log(VideosToDownload);
});
