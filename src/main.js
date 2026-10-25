const {
    app,
    BrowserWindow,
    globalShortcut,
    screen,
    ipcMain
} = require('electron');
const { extractText } = require('./ocr/textExtractor');

const { captureScreenRegion } = require('./capture/screenCapture');

const path = require('path');

let mainWindow;
let selectionWindow;

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
            </body>
            </html>
        `)
    );
}

function createSelectionWindow() {
    const { bounds } = screen.getPrimaryDisplay();

    selectionWindow = new BrowserWindow({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        alwaysOnTop: true,
        skipTaskbar: true,
        hasShadow: false,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false
    }
    });

    selectionWindow.setAlwaysOnTop(true, 'screen-saver');
    selectionWindow.setVisibleOnAllWorkspaces(true);

    selectionWindow.loadFile(
        path.join(__dirname, 'selection', 'selection.html')
    );

    selectionWindow.on('closed', () => {
        selectionWindow = null;
    });
}

function activateSelection() {
    if (selectionWindow && !selectionWindow.isDestroyed()) {
        selectionWindow.close();
    }

    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.hide();
    }

    createSelectionWindow();
}

app.whenReady().then(() => {
    createWindow();

   ipcMain.on('capture-selection', async (event, region) => {
    try {
        console.log('Received selection coordinates:', region);

        if (selectionWindow && !selectionWindow.isDestroyed()) {
            selectionWindow.hide();
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        const imagePath = await captureScreenRegion(region);

        console.log('Screenshot saved successfully:', imagePath);
    } catch (error) {
        console.error('Screen capture failed:', error);
    } finally {
        if (selectionWindow && !selectionWindow.isDestroyed()) {
            selectionWindow.close();
        }

        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.show();
        }
    }
});

const { exec } = require('child_process');

const registered = globalShortcut.register(
    'CommandOrControl+Shift+S',
    () => {
        console.log('Snipscript selection activated!');

        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.hide();
        }

        exec('/usr/sbin/screencapture -i "$HOME/Desktop/snipscript-capture.png"', async (error) => {
    try {
        if (error) {
            console.log('Screenshot cancelled or failed.');
            return;
        }

        console.log('Native screenshot captured successfully.');

        const imagePath = path.join(
            require('os').homedir(),
            'Desktop',
            'snipscript-capture.png'
        );

        console.log('Extracting text...');

        const text = await extractText(imagePath);

        console.log('Extracted text:\n', text);
    } catch (err) {
        console.error('OCR failed:', err);
    } finally {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.show();
        }
    }
});
    }
);


    if (registered) {
        console.log('Global shortcut registered successfully.');
    } else {
        console.error('Failed to register the Snipscript shortcut.');
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