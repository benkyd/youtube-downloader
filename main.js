const {app, BrowserWindow} = require('electron');

require('electron-reload')(__dirname);

function createWindow() {
    module.exports.window = new BrowserWindow({
        width: 1000, 
        height: 800,
        isResizable: false,
        resizable: false
    });

    module.exports.window.loadFile('index.html');
    module.exports.window.openDevTools();
    
    module.exports.window.isResizable(false);

    module.exports.window.on('closed', () => {
        module.exports.window = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // MacOS is weird and an application will stay 
    //open until explicitly closed with command + q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (module.exports.window === null) {
        createWindow();
    }
});
