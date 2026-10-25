const selection = document.getElementById('selection');

let startX = 0;
let startY = 0;
let isSelecting = false;

document.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;

    startX = event.clientX;
    startY = event.clientY;
    isSelecting = true;

    selection.style.display = 'block';
    selection.style.left = `${startX}px`;
    selection.style.top = `${startY}px`;
    selection.style.width = '0px';
    selection.style.height = '0px';
});

document.addEventListener('mousemove', (event) => {
    if (!isSelecting) return;

    const currentX = event.clientX;
    const currentY = event.clientY;

    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selection.style.left = `${left}px`;
    selection.style.top = `${top}px`;
    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;
});

document.addEventListener('mouseup', (event) => {
    if (!isSelecting) return;

    isSelecting = false;

    const endX = event.clientX;
    const endY = event.clientY;

    const region = {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY)
    };

    if (region.width < 5 || region.height < 5) {
        console.log('Selection too small.');
        return;
    }

    console.log('Final selected region:', region);
    console.log('Selection rectangle bounds:', selection.getBoundingClientRect());

    window.snipscript.captureSelection(region);
});