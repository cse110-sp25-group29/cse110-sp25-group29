import { importCardsList } from './editor-page.js'

import { renderScaledPreview, downloadCardJSON, deleteCard } from './view_all_card.js'

const cardsList = importCardsList();

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const toggleBtn = document.getElementById('theme-toggle');
    const themeImg = document.querySelector('#theme-toggle > img');
    const concardHeading = document.querySelector('#concard');
    const newCardBtn = document.querySelector('#new-card-button');

    if (!savedTheme) {
        localStorage.setItem('theme', 'light');
    }

    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (themeImg) {
            themeImg.src = "assets/icons/light-mode.svg";
            concardHeading.src = "assets/icons/title-centered-dark.svg";
        }
    } else {
        body.classList.remove('dark-theme');
        if (themeImg) {
            themeImg.src = "assets/icons/dark-mode.svg";
            concardHeading.src = "assets/icons/title-centered-light.svg";
        }
    }

    const searchInput = document.querySelector('#search-input')

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const themeImg = document.querySelector('#theme-toggle > img');
        const isDark = body.classList.contains('dark-theme');
        themeImg.src = isDark ? "assets/icons/light-mode.svg" : "assets/icons/dark-mode.svg";
        concardHeading.src = isDark ? "assets/icons/title-centered-dark.svg" : "assets/icons/title-centered-light.svg";

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    searchInput.addEventListener('input', (e) => {
        searchLocalStorage(searchInput);
    });

    newCardBtn.addEventListener('click', ()=>{
        newCard();
    })

    yourCardFeature();
    uploadFeature();
    
});

export function newCard() {
    localStorage.setItem('current_card', 'untitle');
}

export function uploadFeature() {
    const uploadBtn = document.querySelector('#upload-button');
    const savedTheme = localStorage.getItem('theme');
    
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
            if (savedTheme === 'light') {
                dropZone.style.backgroundColor = '#e0f7fa';
            }
        };

        dropZone.ondragleave = () => {
            dropZone.style.backgroundColor = '#f9f9f9';
        };

        // File input
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
        })

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

export function handleFiles(files) {
    const file = files[0];
    if (!file) return;

    const confirmUpload = confirm(`Do you want to upload the file: "${file.name}"?`);
    if (confirmUpload) {
        alert(`You uploaded: ${file.name}`);
        return true;
    } else {
        alert("Upload canceled.");
        return false;
    }
}

export function yourCardFeature() {
    const yourCardBtn = document.querySelector('#your-card-button');
    const starredCard = JSON.parse(localStorage.getItem('star'));
    let cardName = false;

    if (starredCard) {
        cardName = starredCard.name;
    }

    yourCardBtn.addEventListener('click', () => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = "overlay";

        const right = document.createElement('div');
        right.id = "right-col";

        const left = document.createElement('div');
        left.id = "left-col";

        // Create close button
        const closeBtn = document.createElement('button');
        // closeBtn.innerHTML = 'Close';
        closeBtn.id = 'closeBtn';
        closeBtn.classList.add("circle-button");

        // Create edit button
        const editLink = document.createElement('a');
    
        const editBtn = document.createElement('button');
        // editBtn.innerHTML = 'Edit';
        editBtn.innerHTML = '<img src="assets/icons/edit.svg"/>';
        editBtn.id = 'editBtn';
        editBtn.classList.add("circle-button");

        // Create delete button
        const deleteBtn = document.createElement('button');
        // deleteBtn.innerHTML = 'delete';
        deleteBtn.innerHTML = '<img src="assets/icons/delete.svg"/>';
        deleteBtn.id = 'deleteBtn';
        deleteBtn.classList.add("circle-button");

        // Create download button
        const downloadBtn = document.createElement('button');
        // downloadBtn.innerHTML = 'Download';
        downloadBtn.innerHTML = '<img src="assets/icons/download.svg"/>';
        downloadBtn.id = 'downloadBtn';
        downloadBtn.classList.add("circle-button");

        // Create popup
        const popup = document.createElement('div');
        popup.id = "popup";
        popup.className = "popup";

        const frontCard = document.createElement('canvas');
        frontCard.id = "front-card";
        frontCard.className = "front-canvas";

        const backCard = document.createElement('canvas');
        backCard.id = "back-card";
        backCard.className = "back-canvas";
        // backCard.hidden = true;

        // Close handler
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        if (cardName) {
            editLink.href = "assets/editor-page.html";
            editBtn.addEventListener('click', ()=> {
                localStorage.setItem('current_card', cardName);
            });
            downloadBtn.addEventListener('click', ()=> {
                downloadCardJSON(cardName);
            });
            deleteBtn.addEventListener('click', () => {
                const deleteOverlay = document.createElement('div');
                deleteOverlay.id = "overlay";
                const deleteConfirmation = document.createElement('deleteConfirmation');
                deleteConfirmation.id = "delete-confirmation";
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
                    deleteCard(cardName);
                    localStorage.setItem('current_card', '');
                    window.location.reload();
                });
                
                deleteConfirmation.appendChild(message);
                deleteConfirmation.appendChild(cancelBtn);
                deleteConfirmation.appendChild(confirmBtn);
                deleteOverlay.appendChild(deleteConfirmation);
                document.body.appendChild(deleteOverlay);
            });
        }

        // Optional: clicking outside popup also closes it
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Add content
        // popup.innerHTML += `<h2>Your Card</h2><p>Some other content goes here.</p>`;
        editLink.appendChild(editBtn);
        overlay.appendChild(left);
        overlay.appendChild(popup);
        overlay.appendChild(right);
        left.appendChild(editLink);
        left.appendChild(downloadBtn);
        left.appendChild(deleteBtn);
        right.appendChild(closeBtn);
        popup.appendChild(frontCard);
        popup.appendChild(backCard);
        document.body.appendChild(overlay);
        renderYourCard(frontCard, backCard, cardName); 
    });
}

export function renderYourCard(frontCard, backCard, cardName) {
    const popup = document.querySelector(".popup");
    if (cardName) {
        const frontData = cardsList[cardName].front;
        const backData = cardsList[cardName].back;
        renderScaledPreview(frontCard, frontData, 1200, 680);
        renderScaledPreview(backCard, backData, 1200, 680);
        popup.addEventListener('click', () => {
            popup.classList.toggle('flip');
        });
    } else {
        popup.innerHTML = '<p>You did not set the starred card yet.\n Go to <a href="assets/view_all_card.html">Gallery</a> and select your card!</p>';
    }
    return cardName;
}

export function searchLocalStorage(searchInput) {
    const searchBar = document.querySelector('.search-bar');
    const keyword = searchInput.value.toLowerCase();
    let resultsContainer = document.querySelector('#search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('search-results');
        resultsContainer.id = 'search-results';
        resultsContainer.style.maxHeight = '200px';
        resultsContainer.style.overflowY = 'auto';
        searchBar.appendChild(resultsContainer);
    }

    resultsContainer.innerHTML = '';
    const rect = searchInput.getBoundingClientRect();
    resultsContainer.style.top = `${window.scrollY + rect.bottom}px`;
    resultsContainer.style.left = `${window.scrollX + rect.left}px`;
    resultsContainer.style.width = `${rect.width}px`;

    const cards = localStorage.getItem("cards");
    if (!cards) {
        resultsContainer.innerText = "No cards found in localStorage.";
        return;
    }

    let obj;
    try {
        obj = JSON.parse(cards);
    } catch (e) {
        resultsContainer.innerText = "Error parsing cards data.";
        return;
    }

    let found = false;
    const savedTheme = localStorage.getItem('theme');
    for (const key in obj) {
        if (key.toLowerCase().includes(keyword) && keyword !== '') {
            const item = document.createElement('div');
            item.id = "search-result";
            // item.innerText = `Found: ${key}`;
            item.innerHTML = `<a href="assets/editor-page.html" id="search-target-link"> Found: ${key}</a>`;
            item.style.padding = '4px 8px';
            item.style.cursor = 'pointer';
            item.addEventListener('mouseover', () => {
                if(savedTheme === 'light') {
                    item.style.backgroundColor = '#EFFFEC';
                } else {
                    item.style.backgroundColor = '#2e302d';
                }
            });
            item.addEventListener('mouseout', () => { 
                item.style.backgroundColor = '';
            });
            item.addEventListener('click', () => {
                localStorage.setItem('current_card', key);
            });
            resultsContainer.appendChild(item);
            found = true;
        }
    }

    if (!found && keyword !== '') {
        resultsContainer.innerText = "No results found.";
    }
}
