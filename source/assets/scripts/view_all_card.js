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
            case 'image': {
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
    const cardNames = Object.keys(cardsList);
    const container = document.querySelector('.show');
    container.innerHTML = '';

    const previewModal = document.createElement('div');
    previewModal.classList.add('preview-modal');
    previewModal.style.display = 'none';
    document.body.appendChild(previewModal);

    const previewContent = document.createElement('div');
    previewContent.classList.add('preview-content');
    previewModal.appendChild(previewContent);

    const closePreview = document.createElement('button');
    closePreview.classList.add('close-preview');
    closePreview.innerHTML = '×';
    previewContent.appendChild(closePreview);

    const previewCanvas = document.createElement('canvas');
    previewCanvas.classList.add('preview-canvas');
    previewContent.appendChild(previewCanvas);

    closePreview.addEventListener('click', () => {
        previewModal.style.display = 'none';
    });

    cardNames.forEach(cardName => {
        const frontData = cardsList[cardName].front;
        const btnWrapper = document.createElement('div');
        btnWrapper.classList.add('view-card-button');

        const button = document.createElement('button');
        button.classList.add('card-main-button'); 
        
        const flipContainer = document.createElement('div');
        flipContainer.classList.add('flip-container');
        
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        flipContainer.appendChild(overlay);
        
        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('button-group');

        const icons = ['Edit', 'flip', 'upload', 'delete'];

        for (let i = 0; i < 4; i++) {
            const btn = document.createElement('button');
            btn.classList.add('overlay-button');

            const img = document.createElement('img');
            img.src = `icons/${icons[i]}.png`;
            img.alt = icons[i];
            img.style.width = '25px';
            img.style.height = '25px';

            btn.appendChild(img);
            buttonGroup.appendChild(btn);
        }

        overlay.appendChild(buttonGroup);

        const frontCanvas = document.createElement('canvas');
        frontCanvas.classList.add('front-canvas');

        flipContainer.appendChild(frontCanvas);
        button.appendChild(flipContainer);
        btnWrapper.appendChild(button);
        container.appendChild(btnWrapper);

        renderScaledPreview(frontCanvas, frontData, 300, 167);

        button.addEventListener('click', (e) => {
            if (!e.target.closest('.overlay-button')) {
                renderScaledPreview(previewCanvas, frontData, 800, 450);
                previewModal.style.display = 'flex';
            }
        });
    });
});
