import { importCardsList } from './editor-page.js';

export function renderScaledPreview(canvas, data, width, height) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get 2D context for canvas');
        return;
    }
    console.log('Rendering data:', data);

    canvas.width = width;
    canvas.height = height;

    const originalWidth = data.width || 1080;
    const originalHeight = data.height || 600;

    const scaleX = width / originalWidth;
    const scaleY = height / originalHeight;

    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    ctx.clearRect(0, 0, originalWidth, originalHeight);

    if (!data.objects || !data.objects.length) {
        console.warn('No objects to render, drawing default');
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('No Content', 50, 50);
        return;
    }

    for (const obj of data.objects) {
        console.log('Rendering object:', obj);
        const d = obj.data;
        switch (obj.type) {
            case 'textbox':
                ctx.font = `${d.bold ? 'bold ' : ''}${d.italics ? 'italic ' : ''}${d.size}px ${d.style}`;
                ctx.fillStyle = `rgb(${d.r},${d.g},${d.b})`;
                ctx.fillText(d.text, d.x, d.y);
                break;
            case 'box':
                ctx.fillStyle = `rgb(${d.r},${d.g},${d.b})`;
                ctx.fillRect(d.x1, d.y1, d.x2 - d.x1, d.y2 - d.y1);
                break;
            case 'image':{
                const img = new Image();
                img.src = d.src;
                img.onload = () => {
                    console.log('Image loaded:', d.src);
                    ctx.drawImage(img, d.x1, d.y1, d.x2 - d.x1, d.y2 - d.y1);
                };
                img.onerror = () => {
                    console.error('Failed to load image:', d.src);
                };
                break;
            }
            case 'ellipse':
                ctx.fillStyle = `rgb(${d.r},${d.g},${d.b})`;
                ctx.beginPath();
                ctx.ellipse(
                    (d.x1 + d.x2) / 2,
                    (d.y1 + d.y2) / 2,
                    Math.abs(d.x2 - d.x1) / 2,
                    Math.abs(d.y2 - d.y1) / 2,
                    0, 0, 2 * Math.PI
                );
                ctx.fill();
                break;
            default:
                console.warn('Unsupported object type:', obj.type);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const cardsList = importCardsList();
    console.log("cardlist", cardsList)
    const cardNames = Object.keys(cardsList);
    const buttons = document.querySelectorAll('.show .view-card-button');

    buttons.forEach((btnWrapper, index) => {
        const button = btnWrapper.querySelector('button');
        const flipInner = btnWrapper.querySelector('.flip-inner');
        const frontCanvas = btnWrapper.querySelector('.front-canvas');
        const backCanvas = btnWrapper.querySelector('.back-canvas');

        if (index < cardNames.length) {
            const cardName = cardNames[index];
            const frontData = cardsList[cardName].front;
            const backData = cardsList[cardName].back;

            renderScaledPreview(frontCanvas, frontData, 300, 170);
            renderScaledPreview(backCanvas, backData, 300, 170);

            button.addEventListener('click', () => {
                console.log('Toggling flip for card:', cardName);
                flipInner.classList.toggle('flip');
            });
        } else {
            const ctx = frontCanvas.getContext('2d');
            const img = new Image();
            img.src = 'icons/Person_green.png';
            img.onload = () => {
                ctx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
                const x = (frontCanvas.width - img.width) / 2.2;
                const y = (frontCanvas.height - img.height) / 2;
                ctx.drawImage(img, x, y);
            };
            img.onerror = () => {
                console.error('Failed to load default image');
            };
            const backCtx = backCanvas.getContext('2d');
            backCtx.fillStyle = 'black';
            backCtx.font = '20px Arial';
            backCtx.fillText('No Back Content', 50, 50);
        }
    });
});