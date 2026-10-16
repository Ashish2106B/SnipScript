
const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        title: 'Snipscript',
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadURL(
        'data:text/html;charset=utf-8,' +
        encodeURIComponent(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Snipscript</title>
                <style>
                    body {
                        margin: 0;
                        height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        font-family: -apple-system, sans-serif;
                        background: #f7f8fa;
                        color: #202124;
                    }

                    h1 {
                        font-size: 40px;
                        margin-bottom: 8px;
                    }

                    p {
                        color: #666;
                        font-size: 16px;
                    }
                </style>
            </head>
            <body>
                <h1>Snipscript</h1>
                <p>Extract text from anywhere on your screen.</p>
                <p>Your local OCR workspace starts here.</p>
            </body>
            </html>
        `)
    );
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
