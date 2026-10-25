
const { createWorker } = require('tesseract.js');

async function extractText(imagePath) {
    const worker = await createWorker('eng');

    try {
        const result = await worker.recognize(imagePath);
        return result.data.text.trim();
    } finally {
        await worker.terminate();
    }
}

module.exports = { extractText };
