const ocrText = document.getElementById('ocrText');
const copyButton = document.getElementById('copyButton');
const clearButton = document.getElementById('clearButton');
const message = document.getElementById('message');
const status = document.getElementById('status');

function updateStatus(text, state = 'ready') {
    status.textContent = text;
    status.className = `status ${state}`;
}

function updateCopyButton() {
    copyButton.disabled = !ocrText.value.trim();
}

copyButton.addEventListener('click', async () => {
    const text = ocrText.value.trim();

    if (!text) {
        message.textContent = 'There is no text to copy.';
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        message.textContent = 'Text copied to clipboard.';
    } catch (error) {
        message.textContent = 'Unable to copy text.';
        console.error('Clipboard error:', error);
    }
});

clearButton.addEventListener('click', () => {
    ocrText.value = '';
    message.textContent = 'Text cleared.';
    updateCopyButton();
    updateStatus('Ready');
});

ocrText.addEventListener('input', updateCopyButton);

window.snipscript.onTextExtracted((text) => {
    ocrText.value = text;
    message.textContent = text
        ? 'Text extracted successfully.'
        : 'No text detected. Try selecting a clearer region.';

    updateCopyButton();
    updateStatus(text ? 'Completed' : 'No text', text ? 'success' : 'error');
});

window.snipscript.onOcrStatus((statusText) => {
    message.textContent = statusText;

    if (statusText.includes('Extracting')) {
        updateStatus('Working…', 'loading');
    } else if (statusText.includes('failed')) {
        updateStatus('Failed', 'error');
    } else {
        updateStatus(statusText, 'ready');
    }
});

updateCopyButton();
updateStatus('Ready');