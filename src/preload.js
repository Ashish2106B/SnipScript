
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('snipscript', {
    onTextExtracted: (callback) => {
        ipcRenderer.on('ocr-result', (_event, text) => {
            callback(text);
        });
    },

    onOcrStatus: (callback) => {
        ipcRenderer.on('ocr-status', (_event, status) => {
            callback(status);
        });
    }
});
