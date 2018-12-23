(() => {
    console.log('STARTUP')
})();

document.getElementById('VideosToRecord').addEventListener('keydown', () => {
    let videoText = document.getElementById('VideosToRecord').value;

    VideosToDownload = videoText.split('\n');
    console.log(VideosToDownload);
});
