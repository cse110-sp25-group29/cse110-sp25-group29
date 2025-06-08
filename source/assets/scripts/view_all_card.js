import { importCardsList } from './editor-page.js';
import { handleFiles,  } from './homepage.js';

/**
 * Render a preview of a card on a canvas with scaling applied.
 * @param {HTMLCanvasElement} canvas - The canvas to render on.
 * @param {Object} data - The card data object.
 * @param {number} width - Target width for rendering.
 * @param {number} height - Target height for rendering.
 */
export function renderScaledPreview(canvas, data, width, height) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get 2D context for canvas');
        return;
    }

    canvas.width = width;
    canvas.height = height;

    const originalWidth = data.width || 1080;
    const originalHeight = data.height || 600;

    const scaleX = width / originalWidth;
    const scaleY = height / originalHeight;

    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    ctx.clearRect(0, 0, originalWidth, originalHeight);

    if (!data.objects || !data.objects.length) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('No Content', 50, 50);
        return;
    }

    for (const obj of data.objects) {
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

/**
 * Download the selected card's data as a JSON file.
 * @param {string} cardName - The name of the card to download.
 */
export function downloadCardJSON(cardName) {
    const cardsList = importCardsList();
    const cardData = cardsList[cardName];
    
    if (!cardData) {
        alert('No card found');
        return;
    }

    const jsonStr = JSON.stringify(cardData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cardName.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Save the updated card list to local storage.
 * @param {Object} cardsList - The full card list to save.
 */
export function saveCardsList(cardsList) {
    localStorage.setItem('cards', JSON.stringify(cardsList));
}

/**
 * Set up the upload button to allow file uploads via dialog or drag-drop.
 */
export function uploadFeature() {
    const uploadBtn = document.querySelector('.icon-button.upload');
    
    uploadBtn.addEventListener('click', () => {
        let files;
        const overlay = document.createElement('div');
        overlay.id = "overlay";
        const dialogBox = document.createElement('div');
        dialogBox.id = "dialogBox";

        const dropZone = document.createElement('div');
        dropZone.id = "dropZone";
        dropZone.innerText = 'Drag and drop a file here';
        dropZone.ondrop = (e) => {
            e.preventDefault();
            files = e.dataTransfer.files;
            dropZone.innerText = dropZone.innerText + '\n' + 'You droped: \n' + files[0].name;
            confirmBtn.disabled = false;  
        };

        dropZone.ondragover = (e) => {
            e.preventDefault();
            dropZone.style.backgroundColor = '#e0f7fa';
        };

        dropZone.ondragleave = () => {
            dropZone.style.backgroundColor = '#f9f9f9';
        };

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.marginTop = '10px';
        fileInput.onchange = (e) => {
            files = e.target.files;
            confirmBtn.disabled = false;  
        };
        
        const cancelBtn = document.createElement('button');
        cancelBtn.id = "cancelBtn";
        cancelBtn.innerText = "Cancel";

        const confirmBtn = document.createElement('button');
        confirmBtn.id = "confirmBtn";
        confirmBtn.innerText = "Confirm";
        confirmBtn.disabled = true;

        confirmBtn.addEventListener('click', () => {
            if (files) {
                handleFiles(files);
            }
        });

        cancelBtn.addEventListener('click', (e) => {
            document.body.removeChild(overlay);
        });

        dialogBox.appendChild(dropZone);
        dialogBox.appendChild(fileInput);
        dialogBox.appendChild(cancelBtn);
        dialogBox.appendChild(confirmBtn);

        overlay.appendChild(dialogBox);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    });
}

/**
 * Delete a specific card from local storage and trigger a UI update.
 * @param {string} cardName - The name of the card to delete.
 * @returns {Promise<boolean>} - True if deleted, false if card not found.
 */
export async function deleteCard(cardName) {
    const cardsList = await importCardsList();
    if (!cardsList[cardName]) {
        console.error('Cards not found:', cardName);
        return false;
    }

    if (getStarStatus(cardName)) {
        localStorage.removeItem('star');
    }

    delete cardsList[cardName];
    saveCardsList(cardsList); 
    window.dispatchEvent(new Event('cardsUpdated'));
    return true;
}

/**
 * Handle the logic to star or unstar a card. Only one card can be starred.
 * @param {string} cardName - The name of the card to (un)star.
 * @param {Object} cardData - The card data to store if starring.
 * @returns {Object} - Action result and success flag.
 */
export function handleStarCard(cardName, cardData) {
    const starredCard = JSON.parse(localStorage.getItem('star'));
    
    if (starredCard && starredCard.name === cardName) {
        localStorage.removeItem('star');
        // window.dispatchEvent(new Event('cardsUpdated'));
        return { action: 'unstar', success: true };
    } else if (starredCard) {
        alert(`You have starred card: ${starredCard.name}\nPlease unstar it first!`);
        return { action: 'rejected', success: false };
    } else {
        localStorage.setItem('star', JSON.stringify({
            name: cardName,
            data: cardData,
            timestamp: new Date().getTime()
        }));
        window.dispatchEvent(new Event('cardsUpdated'));
        return { action: 'star', success: true };
    }
}

/**
 * Check if a specific card is currently starred.
 * @param {string} cardName - The name of the card to check.
 * @returns {boolean} - True if the card is starred.
 */
export function getStarStatus(cardName) {
    const starredCard = JSON.parse(localStorage.getItem('star'));
    return starredCard && starredCard.name === cardName;
}


window.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.show');
    container.innerHTML = '';
    let currentPreviewCard = null; 
    let starBtn = null; 

    const previewModal = document.createElement('div');
    previewModal.classList.add('preview-modal');
    previewModal.style.display = 'none';
    document.body.appendChild(previewModal);

    const previewContent = document.createElement('div');
    previewContent.classList.add('preview-content');
    previewModal.appendChild(previewContent);

    const closePreview = document.createElement('button');
    closePreview.classList.add('close-preview');
    const closeIcon = document.createElement('img');
    closeIcon.src = './icons/close.svg';
    closeIcon.alt = 'Close';
    closeIcon.style.width = '45px';
    closeIcon.style.height = '45px';
    closePreview.appendChild(closeIcon);
    previewContent.appendChild(closePreview);

    const mainContent = document.createElement('div');
    mainContent.classList.add('preview-main-content');
    previewContent.appendChild(mainContent);

    const actionButtons = document.createElement('div');
    actionButtons.classList.add('action-buttons');
    previewModal.appendChild(actionButtons); 

    uploadFeature();

    // add delete preview (confirmation)
    function deletePreview(){
        const deleteOverlay = document.createElement('div');
        deleteOverlay.id = "overlay";
        const deleteConfirmation = document.createElement('deleteConfirmation');
        deleteConfirmation.id = "dialogBox";
        const message = document.createElement('p');
        
        const cancelBtn = document.createElement('button');
        const confirmBtn = document.createElement('button');
        message.innerHTML = "Are you sure to delete this card?";
        cancelBtn.innerText = "Cancel";
        confirmBtn.innerText = "Confirm";
        cancelBtn.addEventListener('click', ()=> {
            document.body.removeChild(deleteOverlay);
        })

        confirmBtn.addEventListener('click', ()=>{
            if (deleteCard(currentPreviewCard)) {
                const cardElement = document.querySelector(`.view-card-button[data-card-name="${currentPreviewCard}"]`);
                if (cardElement) {
                    cardElement.remove();
                }
                previewModal.style.display = 'none';
            }
            window.location.reload();
        });
        
        deleteConfirmation.appendChild(message);
        deleteConfirmation.appendChild(cancelBtn);
        deleteConfirmation.appendChild(confirmBtn);
        deleteOverlay.appendChild(deleteConfirmation);
        document.body.appendChild(deleteOverlay);
    }

    // preview buttons
    const actionIcons = ['edit', 'star', 'download', 'delete'];
    actionIcons.forEach(icon => {
        const btn = document.createElement('button');
        btn.classList.add('action-button');
        
        const img = document.createElement('img');
        if (icon === 'star') {
            const flag = getStarStatus(currentPreviewCard);
            img.src = flag ? './icons/star-filled.svg' : `./icons/${icon}.svg`;
            starBtn = img; 
        } else {
            img.src = `./icons/${icon}.svg`;
        }
        img.alt = icon;
        img.style.width = '24px';
        img.style.height = '24px';
        
        btn.appendChild(img);
        actionButtons.appendChild(btn);
    
        btn.addEventListener('click', () => {
            if (!currentPreviewCard) {
                console.error('No card selected');
                return;
            }
            
            const cardsList = importCardsList();
            const cardData = cardsList[currentPreviewCard];
    
            switch(icon) {
                case 'edit':
                    localStorage.setItem('current_card', currentPreviewCard);
                    window.location.href = './editor-page.html';
                    break;
                case 'star':{
                    const result = handleStarCard(currentPreviewCard, cardData);
                    if (result.success) {
                        img.src = result.action === 'star' ? './icons/star-filled.svg' : './icons/star.svg';
                        starBtn = img; 
                    }
                    break;
                }
                case 'download':
                    downloadCardJSON(currentPreviewCard);
                    break;
                case 'delete':
                    deletePreview();
                    break;
            }
        });
    });

    // define preview page
    const canvasContainer = document.createElement('div');
    canvasContainer.classList.add('canvas-container');
    mainContent.appendChild(canvasContainer);

    const frontCanvas = document.createElement('canvas');
    frontCanvas.classList.add('preview-canvas', 'front');
    frontCanvas.width = 800;
    frontCanvas.height = 445;
    canvasContainer.appendChild(frontCanvas);

    const backCanvas = document.createElement('canvas');
    backCanvas.classList.add('preview-canvas', 'back');
    backCanvas.width = 800;
    backCanvas.height = 445;
    backCanvas.style.display = 'none';
    canvasContainer.appendChild(backCanvas);

    const navContainer = document.createElement('div');
    navContainer.classList.add('nav-container');
    mainContent.appendChild(navContainer);

    const leftArrow = document.createElement('button');
    leftArrow.classList.add('nav-button', 'left');
    leftArrow.style.display = 'none';
    const leftArrowImg = document.createElement('img');
    leftArrowImg.src = './icons/left.png';
    leftArrowImg.alt = 'Previous';
    leftArrowImg.style.width = '45px';
    leftArrowImg.style.height = '45px';
    leftArrow.appendChild(leftArrowImg);
    navContainer.appendChild(leftArrow);

    const rightArrow = document.createElement('button');
    rightArrow.classList.add('nav-button', 'right');
    const rightArrowImg = document.createElement('img');
    rightArrowImg.src = './icons/right.png';
    rightArrowImg.alt = 'Next';
    rightArrowImg.style.width = '45px';
    rightArrowImg.style.height = '45px';
    rightArrow.appendChild(rightArrowImg);
    navContainer.appendChild(rightArrow);

    let currentView = 'front';
    const toggleView = () => {
        if (currentView === 'front') {
            frontCanvas.style.display = 'none';
            backCanvas.style.display = 'block';
            leftArrow.style.display = 'block';
            rightArrow.style.display = 'none';
            currentView = 'back';
        } else {
            frontCanvas.style.display = 'block';
            backCanvas.style.display = 'none';
            leftArrow.style.display = 'none';
            rightArrow.style.display = 'block';
            currentView = 'front';
        }
    };

    leftArrow.addEventListener('click', toggleView);
    rightArrow.addEventListener('click', toggleView);

    closePreview.addEventListener('click', () => {
        previewModal.style.display = 'none';
        frontCanvas.style.display = 'block';
        backCanvas.style.display = 'none';
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'block';
        currentView = 'front';
        window.dispatchEvent(new Event('cardsUpdated'));
    });

    // define search function
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-bar-view');
    const suggestionsBox = document.getElementById('search-suggestions');

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        const cardsList = importCardsList();
        const filteredNames = filterCardsByName(cardsList, searchTerm);
        renderFilteredCards(cardsList, container, filteredNames);
        suggestionsBox.style.display = 'none';
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        const cardsList = importCardsList();
        
        if (searchTerm.length > 0) {
            const suggestions = filterCardsByName(cardsList, searchTerm);
            suggestionsBox.innerHTML = '';
            
            if (suggestions.length > 0) {
                suggestions.forEach(name => {
                    const item = document.createElement('div');
                    item.classList.add('suggestion-item');
                    item.textContent = name;
                    item.addEventListener('click', () => {
                        searchInput.value = name;
                        performSearch();
                    });
                    suggestionsBox.appendChild(item);
                });
                suggestionsBox.style.display = 'block';
            } else {
                const noResults = document.createElement('div');
                noResults.classList.add('suggestion-item', 'no-results');
                noResults.textContent = 'No results found';
                suggestionsBox.appendChild(noResults);
                suggestionsBox.style.display = 'block';
            }
        } else {
            suggestionsBox.style.display = 'none';
            performSearch(); 
        }
    });

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    /**
     * Filter card names by a search term (case-insensitive).
     * @param {Object} cardsList - The full card list.
     * @param {string} searchTerm - The term to filter by.
     * @returns {string[]} - Filtered list of card names.
     */
    function filterCardsByName(cardsList, searchTerm) {
        if (!searchTerm) return Object.keys(cardsList);
        return Object.keys(cardsList).filter(name => 
            name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    /**
     * Render the list of cards, placing starred card first if it exists.
     * @param {Object} cardsList - All cards.
     * @param {HTMLElement} container - The HTML element to render into.
     * @param {string[]} filteredNames - Filtered card name list to render.
     */
    function renderFilteredCards(cardsList, container, filteredNames) {
        container.innerHTML = '';
        const starredCard = JSON.parse(localStorage.getItem('star'));
        const starredCardName = starredCard?.name;

        let sortedNames = [...filteredNames];
        if (starredCardName && sortedNames.includes(starredCardName)) {
            sortedNames = [starredCardName, ...sortedNames.filter(name => name !== starredCardName)];
        }

        sortedNames.forEach(cardName => {
            const frontData = cardsList[cardName].front;
    
            const btnWrapper = document.createElement('div');
            btnWrapper.classList.add('view-card-button');
            btnWrapper.dataset.cardName = cardName;
    
            const button = document.createElement('button');
            button.classList.add('card-main-button');
            
            const flipContainer = document.createElement('div');
            flipContainer.classList.add('view-flip-container');
            
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            flipContainer.appendChild(overlay);
            
            const buttonGroup = document.createElement('div');
            buttonGroup.classList.add('button-group');
            
            const icons = ['edit', 'star', 'download', 'delete'];
    
            for (let i = 0; i < 4; i++) {
                const btn = document.createElement('button');
                btn.classList.add('overlay-button');
    
                const img = document.createElement('img');
                img.src = `./icons/${icons[i]}.svg`;
                if (icons[i] === 'star') {
                    img.src = getStarStatus(cardName) ? './icons/star-filled.svg' : `./icons/${icons[i]}.svg`;
                }
                    
                img.alt = icons[i];
                img.style.width = '25px';
                img.style.height = '25px';
    
                btn.appendChild(img);
                buttonGroup.appendChild(btn);
    
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentPreviewCard = cardName; 
    
                    const cardsList = importCardsList();
                    const cardData = cardsList[currentPreviewCard];
    
                    switch (icons[i]) {
                        case 'edit':
                            localStorage.setItem('current_card', currentPreviewCard);
                            window.location.href = `editor-page.html?card=${encodeURIComponent(currentPreviewCard)}`;
                            break;
                        case 'star':{
                            const result = handleStarCard(currentPreviewCard, cardData);
                            if (result.success) {
                                img.src = result.action === 'star' ? './icons/star-filled.svg' : './icons/star.svg';
                                if (starBtn) {
                                    starBtn.src = result.action === 'star' ? './icons/star-filled.svg' : './icons/star.svg';
                                }
                            }
                            break;
                        }
                        case 'download':
                            downloadCardJSON(currentPreviewCard);
                            break;
                        case 'delete':
                            deletePreview();
                            break;
                    }
                });
            }
    
            overlay.appendChild(buttonGroup);
    
            const cardFrontCanvas = document.createElement('canvas');
            cardFrontCanvas.classList.add('front-canvas');
            flipContainer.appendChild(cardFrontCanvas);
            button.appendChild(flipContainer);
            btnWrapper.appendChild(button);
            container.appendChild(btnWrapper);
    
            renderScaledPreview(cardFrontCanvas, frontData, 300, 167);
    
            button.addEventListener('click', (e) => {
                if (!e.target.closest('.overlay-button')) {
                    currentPreviewCard = cardName;
                    const cardsList = importCardsList();
                    if (!cardsList[cardName]) {
                        console.error('Card not found:', cardName);
                        return;
                    }
                    const frontData = cardsList[cardName].front;
                    const backData = cardsList[cardName].back;
                    if (!frontData || !backData) {
                        console.error('Invalid card data for:', cardName, frontData, backData);
                        return;
                    }
                    const isStarred = getStarStatus(cardName);
                    if (starBtn) {
                        starBtn.src = isStarred ? './icons/star-filled.svg' : './icons/star.svg';
                    } else {
                        console.warn('starBtn is not defined');
                    }
                    renderScaledPreview(frontCanvas, frontData, 800, 445);
                    renderScaledPreview(backCanvas, backData, 800, 445);
                    previewModal.style.display = 'flex';
                }
            });
        });
    }

    window.addEventListener('cardsUpdated', () => {
        if (previewModal.style.display === 'flex') {
            console.log('Preview modal is open, skipping re-render');
            return;
        }
        const cardsList = importCardsList();
        renderFilteredCards(cardsList, container, Object.keys(cardsList));
    });

    // init rendering cards
    const cardsList = importCardsList();
    renderFilteredCards(cardsList, container, Object.keys(cardsList));
});