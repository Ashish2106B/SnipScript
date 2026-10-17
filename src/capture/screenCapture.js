const { desktopCapturer, screen } = require('electron');
const { nativeImage } = require('electron');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

async function captureScreenRegion(region) {
    const display = screen.getPrimaryDisplay();
    const { width, height } = display.bounds;
    const scaleFactor = display.scaleFactor;

    const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
            width: Math.round(width * scaleFactor),
            height: Math.round(height * scaleFactor)
        }
    });

    const source = sources.find(
        item => item.display_id === String(display.id)
    ) || sources[0];

    if (!source || source.thumbnail.isEmpty()) {
        throw new Error('Unable to capture the screen.');
    }

    const screenshot = source.thumbnail;
    const imageSize = screenshot.getSize();

    const scaleX = imageSize.width / width;
    const scaleY = imageSize.height / height;

    const cropRegion = {
        x: Math.round(region.x * scaleX),
        y: Math.round(region.y * scaleY),
        width: Math.round(region.width * scaleX),
        height: Math.round(region.height * scaleY)
    };

    cropRegion.width = Math.min(
        cropRegion.width,
        imageSize.width - cropRegion.x
    );

    cropRegion.height = Math.min(
        cropRegion.height,
        imageSize.height - cropRegion.y
    );

    if (
        cropRegion.x < 0 ||
        cropRegion.y < 0 ||
        cropRegion.width <= 0 ||
        cropRegion.height <= 0
    ) {
        throw new Error('The selected region is outside the screen.');
    }

    const croppedImage = nativeImage.createFromBuffer(
        screenshot.toPNG()
    ).crop(cropRegion);

    const outputPath = path.join(
        os.tmpdir(),
        `snipscript-${Date.now()}.png`
    );

    await fs.writeFile(outputPath, croppedImage.toPNG());

    return outputPath;
}

module.exports = { captureScreenRegion };