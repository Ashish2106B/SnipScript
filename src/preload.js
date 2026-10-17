const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('snipscript', {
    captureSelection: (region) => {
        ipcRenderer.send('capture-selection', region);
    },

    cancelSelection: () => {
        ipcRenderer.send('cancel-selection');
    }
});