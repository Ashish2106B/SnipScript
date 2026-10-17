const { app, BrowserWindow, globalShortcut } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        title: 'Snipscript',
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadURL(
        'data:text/html;charset=utf-8,' +
        encodeURIComponent(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Snipscript</title>
                <style>
                    body {
                        font-family: -apple-system, sans-serif;
                        background: #f7f8fa;
                        color: #202124;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }

                    h1 {
                        font-size: 40px;
                    }

                    p {
                        color: #666;
                    }

                    #status {
                        margin-top: 20px;
                        padding: 12px 20px;
                        background: #e8f0fe;
                        border-radius: 8px;
                        color: #174ea6;
                    }
                </style>
            </head>
            <body>
                <h1>Snipscript</h1>
                <p>Extract text from anywhere on your screen.</p>
                <p>Shortcut: Cmd + Shift + S</p>
                <div id="status">Status: Ready</div>

                <script>
                    window.addEventListener('DOMContentLoaded', () => {
                        window.addEventListener('message', (event) => {
                            if (event.data === 'SNIPSCRIPT_ACTIVATED') {
                                document.getElementById('status').textContent =
                                    'Status: Shortcut activated!';
                            }
                        });
                    });
                </script>
            </body>
            </html>
        `)
    );
}

app.whenReady().then(() => {
    createWindow();

    const registered = globalShortcut.register(
        'CommandOrControl+Shift+S',
        () => {
            console.log('Snipscript shortcut activated!');

            if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();

    mainWindow.webContents.executeJavaScript(`
        document.getElementById('status').textContent =
            'Status: Shortcut activated!';
    `);
}
        }
    );

    if (!registered) {
        console.error('Failed to register the Snipscript shortcut.');
    } else {
        console.log('Global shortcut registered successfully.');
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});