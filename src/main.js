
const {
    app,
    BrowserWindow,
    globalShortcut
} = require('electron');

const { exec } = require('child_process');
const { extractText } = require('./ocr/textExtractor');
const path = require('path');
const os = require('os');

let mainWindow;
let isCapturing = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 650,
        title: 'SnipScript',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(
        path.join(__dirname, 'renderer', 'index.html')
    );

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function activateSelection() {
    if (isCapturing) {
        console.log('A screenshot is already in progress.');
        return;
    }

    isCapturing = true;

    const screenshotPath = path.join(
        os.tmpdir(),
        `snipscript-capture-${Date.now()}.png`
    );

    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.hide();
    }

    // Allow the SnipScript window to disappear before taking the screenshot.
    setTimeout(() => {
        exec(
            `/usr/sbin/screencapture -i "${screenshotPath}"`,
            async (error) => {
                try {
                    if (error) {
                        console.log('Screenshot cancelled or failed.');

                        return;
                    }

                    console.log('Native screenshot captured successfully.');

                    if (!mainWindow || mainWindow.isDestroyed()) {
                        return;
                    }

                    mainWindow.show();
                    mainWindow.webContents.send(
                        'ocr-status',
                        'Extracting text...'
                    );

                    console.log('Extracting text...');

                    const text = await extractText(screenshotPath);

                    if (!mainWindow || mainWindow.isDestroyed()) {
                        return;
                    }

                    mainWindow.webContents.send('ocr-result', text);

                    mainWindow.webContents.send(
                        'ocr-status',
                        text
                            ? 'Text extracted successfully.'
                            : 'No text detected.'
                    );

                    console.log('Extracted text:\n', text);
                } catch (err) {
                    console.error('Screenshot or OCR failed:', err);

                    if (mainWindow && !mainWindow.isDestroyed()) {
                        mainWindow.show();

                        mainWindow.webContents.send(
                            'ocr-status',
                            'Text extraction failed. Check the terminal.'
                        );
                    }
                } finally {
                    isCapturing = false;
                }
            }
        );
    }, 300);
}

app.whenReady().then(() => {
    createWindow();

    const registered = globalShortcut.register(
        'CommandOrControl+Shift+S',
        activateSelection
    );

    if (registered) {
        console.log('Global shortcut registered successfully.');
    } else {
        console.error('Failed to register the SnipScript shortcut.');
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
