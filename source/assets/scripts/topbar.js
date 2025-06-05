import * as Editor from './editor-page.js';

export function initListeners() {
  const back = document.querySelector('#back-button');
  back.addEventListener('click', () => {
    window.history.back();
  });

  const home = document.querySelector('#home-button');
  home.addEventListener('click', (e) => {
    window.location.href = '../homepage.html';
  });

  const reset = document.querySelector('#reset-button');
  reset.addEventListener('click', Editor.reset);

  const del = document.querySelector('#delete-button');
  del.addEventListener('click', triggerDeleteMenu);

  const saveNormal = document.querySelector('#save-button');
  saveNormal.addEventListener('click', (e) => {
    Editor.saveAs();
  });

  const saveAs = document.querySelector('#save-as');
  saveAs.addEventListener('click', triggerSaveAsMenu);

  const jpgexport = document.getElementById('export-jpg');
  const pngexport = document.getElementById('export-png');
  const jsonexport = document.getElementById('export-json');
  const duplicate = document.getElementById('file-duplicate');
  const openprev = document.getElementById('file-open');

  openprev.addEventListener('click', () => {
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
  });

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
        background-color: var(--toolbox-bg);
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

function triggerSaveAsMenu(e) {
  const menu = document.querySelector('#popup-menu');
  if (!menu) { return; }

  menu.innerHTML =
    `
    <label for="popup-save-as">Title: </label>
    <input type="text" title="popup-save-as" id="popup-save-as"></input>
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
        background-color: var(--toolbox-bg);
        padding: 15px;
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
  if (!Editor.saved) {
    bold = true;
    name += '*';
  }

  const cardTitle = document.querySelector('#card-title');
  cardTitle.innerHTML = name;
  if (bold) cardTitle.style.fontWeight = 'bold';
  else cardTitle.style.fontWeight = 'normal';
}
