import * as Editor from './editor-page.js';

export function initListeners() {
  const back = document.querySelector('#back-button');
  back.addEventListener('click', () => {
    window.history.back();
  });

  const home = document.querySelector('#home-button');
  home.addEventListener('click', (e) => {
    window.location.href = './homepage.html';
  });

  const cardTitle = document.querySelector('#card-title');
  cardTitle.addEventListener('focusout', () => {
    let name = cardTitle.innerHTML;
    if (name === '') name = Editor.nextUntitled();
    if (name !== Editor.cardName) {
      Editor.setSaved(false);
      Editor.setCardName(name);
    }
  });

  const reset = document.querySelector('#reset-button');
  reset.addEventListener('click', Editor.reset);

  const del = document.querySelector('#delete-button');
  del.addEventListener('click', triggerDeleteMenu);

  const saveNormal = document.querySelector('#save-button');
  saveNormal.addEventListener('click', Editor.saveAs);

  const saveAs = document.querySelector('#save-as');
  saveAs.addEventListener('click', triggerSaveAsMenu);

  const openMenu = document.querySelector('#file-open');
  openMenu.addEventListener('click', triggerOpenMenu);

  const jpgexport = document.getElementById('export-jpg');
  const pngexport = document.getElementById('export-png');
  const jsonexport = document.getElementById('export-json');
  const duplicate = document.getElementById('file-duplicate');

  /* openprev.addEventListener('click', () => {
    const cards = Editor.importCardsList();
    const cardNames = Object.keys(cards);
    const current = Editor.importCurrentCardName();
    if (cardNames.length === 0) {
      alert('No saves in local storage!');
      return;
    }
    let prevname = null;
    for (let i = 0; i < cardNames.length; ++i) {
      if (cardNames[i] === current) {
        if (i !== 0) {
          prevname = cardNames[i - 1];
        } else {
          prevname = cardNames[cardNames.length - 1];
        }
        break;
      }
    }

    if (!prevname) prevname = cardNames[cardNames.length - 1];
    if (prevname === current) {
      alert(`${prevname} is the only save in storage.`);
      return;
    }

    Editor.frontCanvas.importJSON(cards[prevname].front);
    Editor.backCanvas.importJSON(cards[prevname].back);

    Editor.setSaved(true);
    Editor.setCardName(prevname);
    Editor.exportCurrentCardName();
  }); */

  duplicate.addEventListener('click', () => {
    Editor.setSaved(false);
    Editor.setCardName(`Copy of ${Editor.cardName}`);
  });

  jpgexport.addEventListener('click', () => {
    const active = Editor.frontCanvas.active;
    let activeCanvas;
    let name;
    if (active) {
      activeCanvas = Editor.frontCanvas;
      name = 'front-card.jpg';
    } else {
      activeCanvas = Editor.backCanvas;
      name = 'back-card.jpg';
    }

    const url = activeCanvas.canvas.toDataURL('image/jpeg', 0.95);
    Editor.downloadURL(url, name);
  });

  pngexport.addEventListener('click', () => {
    const active = Editor.frontCanvas.active;
    let activeCanvas;
    let name;

    if (active) {
      activeCanvas = Editor.frontCanvas;
      name = 'front-card.png';
    } else {
      activeCanvas = Editor.backCanvas;
      name = 'back-card.png';
    }

    const url = activeCanvas.canvas.toDataURL('image/png');
    Editor.downloadURL(url, name);
  });

  jsonexport.addEventListener('click', () => {
    const exportData = {
      front: Editor.frontCanvas.exportJSON(),
      back: Editor.backCanvas.exportJSON()
    };
    const str = JSON.stringify(exportData, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    Editor.downloadURL(url, 'front-and-back.json');
    URL.revokeObjectURL(url);
  });

  const fileNew = document.querySelector('#file-new');
  fileNew.addEventListener('click', () => {
    Editor.openNew();
  });
}

export function removePopupMenu() {
  const menu = document.querySelector('#popup-menu');
  if (!menu) { return; }

  menu.innerHTML = '';
  menu.style.display = 'none';
}

function triggerDeleteMenu(e) {
  const menu = document.querySelector('#popup-menu');
  if (!menu) { return; }

  menu.innerHTML =
    `
    <p>Are you sure you want to delete this card? It will be lost forever...</p>
    <button id='popup-delete-button'>Delete Card</button>
    `;
  menu.style.display = 'block';

  const style = document.createElement('style');
  style.innerHTML =
    `
    #popup-menu {
        display: block;
        position: absolute;
        z-index: 1;
        width: 250px;
        height: 150px;
        background-color: var(--sidebar-bg);
        padding: 15px;
        border-radius: 5px;
        top: 38vh;
    }
    
    #popup-menu button {
        background-color: red;
        border: 0;
        padding: 0.4rem;
        color: white;
        border-radius: 3px;
    }
    
    #popup-menu button:hover {
        background-color: rgb(227, 0, 0);
    }
    `;

  menu.appendChild(style);

  const innerDelete = document.querySelector('#popup-delete-button');
  innerDelete.addEventListener('click', (e) => {
    console.log('delete');
    Editor.deleteCard();
    removePopupMenu();
  });
}

function triggerOpenMenu() {
  const menu = document.querySelector('#popup-menu');
  if (!menu) { return; }

  menu.innerHTML =
    `
    <div id="modal-content">
      <h2>Open Business Card</h2>
      <label for="card-select">Select a saved card:</label>
      <select id="card-select">
      </select>
      <button id="open-card-btn">Open</button>
      <button id="cancel-open-btn">Cancel</button>
    </div>
    `;
  menu.style.display = 'block';

  const style = document.createElement('style');
  style.innerHTML =
    `
    #popup-menu {
      position: fixed;
      top: 40vh;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      width: 300px;
      background-color: var(--sidebar-bg);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      font-family: sans-serif;
    }

    #popup-menu h2 {
      margin-top: 0;
      font-size: 18px;
      text-align: center;
    }

    #popup-menu label {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
    }

    #popup-menu select {
      width: 100%;
      padding: 0.4rem;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    #popup-menu button {
      width: 100%;
      background-color: var(--save-bg);
      border: none;
      padding: 0.5rem;
      margin-top: 5px;
      color: white;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }

    #popup-menu button:hover {
      background-color: var(--save-hover-bg);
    }
    `;

  menu.appendChild(style);

  const select = document.getElementById('card-select');
  const cards = Editor.importCardsList();
  const cardNames = Object.keys(cards);
  if (cardNames.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'No saved cards!';
    option.disabled = true;
    option.selected = true;
    select.appendChild(option);
  } else {
    for (let i = 0; i < cardNames.length; i++) {
      const option = document.createElement('option');
      option.value = cardNames[i];
      option.textContent = cardNames[i];
      if (cardNames[i] === Editor.cardName) { option.selected = 'selected'; }
      select.appendChild(option);
    }
  }

  document.getElementById('cancel-open-btn').addEventListener('click', () => {
    removePopupMenu();
  });

  const openCard = document.querySelector('#open-card-btn');
  openCard.addEventListener('click', () => {
    const selected = select.value;
    Editor.frontCanvas.importJSON(cards[selected].front);
    Editor.backCanvas.importJSON(cards[selected].back);
    Editor.setSaved(true);
    Editor.setCardName(selected);
    Editor.exportCurrentCardName();
    removePopupMenu();
  });
}

function triggerSaveAsMenu(e) {
  const menu = document.querySelector('#popup-menu');
  if (!menu) { return; }

  menu.innerHTML =
    `
    <label for="popup-save-as">Title: </label>
    <input type="text" title="popup-save-as" id="popup-save-as" autocomplete="off"></input>
    <button id="popup-save-button">Save</button>
    `;
  menu.style.display = 'block';

  const style = document.createElement('style');
  style.innerHTML =
    `
    #popup-menu {
        display: block;
        position: absolute;
        align-content: center;
        z-index: 1;
        width: 250px;
        height: 100px;
        background-color: var(--sidebar-bg);
        padding: 15px;
        border-radius: 5px;
        top: 40vh;
    }
    
    #popup-menu input[type='text'] {
        border: 0;
    }
    
    #popup-menu button {
        background-color: var(--save-bg);
        border: 0;
        padding: 0.4rem;
        color: white;
        border-radius: 3px;
    }
    
    #popup-menu button:hover {
        background-color: var(--save-hover-bg);
    }
    `;

  menu.appendChild(style);

  const saveButton = document.querySelector('#popup-save-button');
  saveButton.addEventListener('click', (e) => {
    const name = document.querySelector('#popup-save-as').value;
    Editor.saveAs(name);
    removePopupMenu();
  });
}

export function setName(name) {
  if (!name) { name = 'Untitled'; }

  let bold = false;
  const saveStar = document.querySelector('#save-star');
  if (!Editor.saved) {
    bold = true;
    saveStar.innerHTML = '*';
  } else {
    saveStar.innerHTML = '';
  }

  const cardTitle = document.querySelector('#card-title');
  cardTitle.innerHTML = name;
  if (bold) cardTitle.style.fontWeight = 'bold';
  else cardTitle.style.fontWeight = 'normal';
}
