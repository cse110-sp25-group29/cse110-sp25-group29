import { importCardsList } from './editor-page.js'
import { Canvas } from './canvas.js' 

import { renderScaledPreview } from './view_all_card.js'

const cardsList = importCardsList();
console.log(cardsList);

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const searchInput = document.querySelector('#search-input')

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        toggleBtn.textContent = body.classList.contains('dark-theme') ? '🔆' : '🌙';
    });

    searchInput.addEventListener('input', (e) => {
        console.log(searchInput.value);
        searchLocalStorage(searchInput);
    });

    yourCardFeature();
    uploadFeature();
    
});

function uploadFeature() {
    const uploadBtn = document.querySelector('#upload-button');
    
    uploadBtn.addEventListener('click', () => {
        let files;
        const overlay = document.createElement('div');
        overlay.id = "overlay";
        const dialogBox = document.createElement('div');
        const rect = uploadBtn.getBoundingClientRect();
        dialogBox.style.left = `${rect.left}px`;
        dialogBox.style.top = `${rect.top - dialogBox.offsetHeight - 10}px`;
        dialogBox.id = "dialogBox";
        // dialogBox.innerText = 'Drag and drop a file here';

        const dropZone = document.createElement('div');
        dropZone.id = "dropZone";
        dropZone.innerText = 'Drag and drop a file here';
        dropZone.ondrop = (e) => {
            console.log("Testing: drop" + e);
            e.preventDefault();
            files = e.dataTransfer.files;
            // handleFiles(files);
            // let confirmUpload = handleFiles(files);
            // if (confirmUpload) {
            dropZone.innerText = dropZone.innerText + '\n' + 'You droped: \n' + files[0].name;
            //     console.log("up")

            // } else {
            //     console.log("cancle")
            // }
            confirmlBtn.disabled = false;  
        };

        dropZone.ondragover = (e) => {
            e.preventDefault();
            dropZone.style.backgroundColor = '#e0f7fa';
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
            // let confirmUpload = handleFiles(files);
            // if (confirmUpload) {
            //     fileInput.innerText = fileInput.innerText + '\n' + files[0].name;
            //     console.log("up")

            // } else {
            //     fileInput.value = null;
            //     console.log("cancle")
            // }
            confirmlBtn.disabled = false;  
        };
        
        const cancelBtn = document.createElement('button');
        cancelBtn.id = "cancelBtn";
        cancelBtn.innerText = "Cancel";

        const confirmlBtn = document.createElement('button');
        confirmlBtn.id = "confirmlBtn";
        confirmlBtn.innerText = "Confirml";
        confirmlBtn.disabled = true;

        confirmlBtn.addEventListener('click', () => {
            console.log(files)
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
        dialogBox.appendChild(confirmlBtn);

        overlay.appendChild(dialogBox);
        // document.body.appendChild(dialogBox);
        document.body.appendChild(overlay);

        // if (e.target == dialogBox) {
        //     document.body.removeChild(dialogBox);
        // }
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    });

}

function handleFiles(files) {
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
    // alert(`You uploaded: ${files[0].name}`);
}

function yourCardFeature() {
    const yourCardBtn = document.querySelector('#your-card-button');

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
        closeBtn.innerHTML = '<img src="assets/icons/Cross.png"/>';


        // Create edit button
        const editBtn = document.createElement('button');
        // editBtn.innerHTML = 'Edit';
        editBtn.innerHTML = '<img src="assets/icons/Edit.png"/>';

        // Create delete button
        const deleteBtn = document.createElement('button');
        // deleteBtn.innerHTML = 'delete';
        deleteBtn.innerHTML = '<img src="assets/icons/delete.png"/>';

        // Create download button
        const downloadBtn = document.createElement('button');
        // downloadBtn.innerHTML = 'Download';
        downloadBtn.innerHTML = '<img src="assets/icons/download.png"/>';


        // Create popup
        const popup = document.createElement('div');
        popup.id = "popup";

        // 
        const frontCard = document.createElement('canvas');
        frontCard.id = "front-card";
        frontCard.className = "front-card";

        const backCard = document.createElement('canvas');
        backCard.id = "back-card";
        backCard.className = "back-card";

        // Close handler
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Optional: clicking outside popup also closes it
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Add content
        // popup.innerHTML += `<h2>Your Card</h2><p>Some other content goes here.</p>`;
        overlay.appendChild(left);
        overlay.appendChild(popup);
        overlay.appendChild(right);
        left.appendChild(downloadBtn);
        left.appendChild(deleteBtn);
        left.appendChild(editBtn);
        right.appendChild(closeBtn);
        popup.appendChild(frontCard);
        // popup.appendChild(backCard);
        document.body.appendChild(overlay);
        renderYourCard(frontCard, backCard);
    });

}
// const cardName = '<insert card name>'

// const frontCanvas = new Canvas('<to front>') // i.e. '#front-card'
// const backCanvas = new Canvas('<to back>')

// frontCanvas.importJSON(cardsList[cardName].front)
// backCanvas.importJSON(cardsList[cardName].back)
// let frontCanvas, backCanvas;
function renderYourCard(frontCard, backCard) {
    const cardName = localStorage.getItem("current_card");
    console.log("rendering your card");
    // // const cardName = '<insert card name>'
    // frontCanvas = new Canvas('#front-card');
    // backCanvas = new Canvas('#back-card');
    // document.querySelector('#front-card').style.transform = 'rotateY(0deg)';
    // document.querySelector('#back-card').style.transform = 'rotateY(180deg)';
    // console.log(cardsList[cardName]);
    // frontCanvas.importJSON(cardsList[cardName].front)
    // backCanvas.importJSON(cardsList[cardName].back)
    const frontData = cardsList[cardName].front;
    const backData = cardsList[cardName].back;
    renderScaledPreview(frontCard, frontData, 300, 170);
    renderScaledPreview(backCard, backData, 300, 170);
}


function searchLocalStorage(searchInput) {
    const searchBar = document.querySelector('.search-bar');
    const keyword = searchInput.value.toLowerCase();
    console.log(keyword);
    let resultsContainer = document.querySelector('#search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('search-results');
        resultsContainer.id = 'search-results';
        resultsContainer.style.position = 'absolute';
        resultsContainer.style.backgroundColor = '#fff';
        resultsContainer.style.border = '1px solid #ccc';
        resultsContainer.style.maxHeight = '200px';
        resultsContainer.style.overflowY = 'auto';
        resultsContainer.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';

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
    for (const key in obj) {
        if (key.toLowerCase().includes(keyword) && keyword !== '') {
            const item = document.createElement('div');
            item.innerText = `Found: ${key}`;
            item.style.padding = '4px 8px';
            item.style.cursor = 'pointer';
            item.addEventListener('mouseover', () => item.style.backgroundColor = '#f0f0f0');
            item.addEventListener('mouseout', () => item.style.backgroundColor = '');
            resultsContainer.appendChild(item);
            found = true;
        }
    }

    if (!found && keyword !== '') {
        resultsContainer.innerText = "No results found.";
    }
}
