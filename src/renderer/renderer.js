
const ocrText = document.getElementById('ocrText');
const copyButton = document.getElementById('copyButton');
const clearButton = document.getElementById('clearButton');
const message = document.getElementById('message');

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
});

window.snipscript.onTextExtracted((text) => {
    ocrText.value = text;
    message.textContent = text
        ? 'Text extracted successfully.'
        : 'No text detected.';
});

window.snipscript.onOcrStatus((status) => {
    message.textContent = status;
});