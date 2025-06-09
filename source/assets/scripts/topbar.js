import * as Editor from './editor-page.js';

/**
 * Initializes all listener actions for the top bar,
 * which will then have functionality when the
 * user clicks on them.
 */
export function initListeners() {
  // go back to previous page
  const back = document.querySelector('#back-button');
  back.addEventListener('click', () => {
    window.history.back();
  });

  // go back to home menu
  const home = document.querySelector('#home-button');
  home.addEventListener('click', (e) => {
    window.location.href = './homepage.html';
  });

  // lets the user edit the card name directly
  const cardTitle = document.querySelector('#card-title');
  cardTitle.addEventListener('focusout', () => {
    let name = cardTitle.innerHTML;
    if (name === '') name = Editor.nextUntitled();
    if (name !== Editor.cardName) {
      Editor.setSaved(false);
      Editor.setCardName(name);
    }
  });

  // resets the card to its last save
  const reset = document.querySelector('#reset-button');
  reset.addEventListener('click', Editor.reset);

  // delete button
  // triggers a confirmation before deleting
  const del = document.querySelector('#delete-button');
  del.addEventListener('click', triggerDeleteMenu);

  // saves the card
  const saveNormal = document.querySelector('#save-button');
  saveNormal.addEventListener('click', () => {
    Editor.saveAs(Editor.cardName);
  });

  // triggers the save as menu
  const saveAs = document.querySelector('#save-as');
  saveAs.addEventListener('click', triggerSaveAsMenu);

  // triggers the open card menu
  const openMenu = document.querySelector('#file-open');
  openMenu.addEventListener('click', triggerOpenMenu);

  const jpgexport = document.getElementById('export-jpg');
  const pngexport = document.getElementById('export-png');
  const jsonexport = document.getElementById('export-json');
  const duplicate = document.getElementById('file-duplicate');

  // duplicates the current card
  duplicate.addEventListener('click', () => {
    Editor.setSaved(false);
    Editor.setCardName(`Copy of ${Editor.cardName}`);
  });

  // exports the current card shown to JPG
  // only saves front or back one at a time
  jpgexport.addEventListener('click', () => {
    const active = Editor.frontCanvas.active;
    let activeCanvas;
    let name;
    if (active) {
      activeCanvas = Editor.frontCanvas;
      name = `${Editor.cardName}-front.jpg`;
    } else {
      activeCanvas = Editor.backCanvas;
      name = `${Editor.cardName}-back.jpg`;
    }

    const url = activeCanvas.canvas.toDataURL('image/jpeg', 0.95);
    Editor.downloadURL(url, name);
  });

  // exports the current card shown to PNG
  // only saves front or back one at a time
  pngexport.addEventListener('click', () => {
    const active = Editor.frontCanvas.active;
    let activeCanvas;
    let name;

    if (active) {
      activeCanvas = Editor.frontCanvas;
      name = `${Editor.cardName}-front.png`;
    } else {
      activeCanvas = Editor.backCanvas;
      name = `${Editor.cardName}-back.png`;
    }

    const url = activeCanvas.canvas.toDataURL('image/png');
    Editor.downloadURL(url, name);
  });

  // exports the current card to JSON
  jsonexport.addEventListener('click', () => {
    const exportData = {
      front: Editor.frontCanvas.exportJSON(),
      back: Editor.backCanvas.exportJSON()
    };
    const str = JSON.stringify(exportData, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    Editor.downloadURL(url, `${Editor.cardName}.json`);
    URL.revokeObjectURL(url);
  });

  const fileNew = document.querySelector('#file-new');
  fileNew.addEventListener('click', () => {
    Editor.openNew();
  });
}

/**
 * Removes the current popup menu, hiding it from
 * the user. This is important because we reuse the same
 * div to handle the popup menu, so we need to hide it away
 * whenever a menu is gone; we can't delete it.
 */
export function removePopupMenu() {
  const menu = document.querySelector('#popup-menu');
  if (!menu) { return; }

  menu.innerHTML = '';
  menu.style.display = 'none';
}

/**
 * Makes the popup menu into a confirmation screen before
 * the user deletes the current card.
 *
 * @param {*} e The click event triggering the menu; unused
 */
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

/**
 * Triggers an open menu, where the user can
 * select a card to open from their list of currently
 * available cards.
 */
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

/**
 * Opens a "save as" menu, where the user can choose the
 * name of their card that they want to save it as.
 *
 * @param {*} e The click event triggering the menu; unused
 */
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

/**
 * Sets the name in the top bar, adding an asterisk
 * if the card isn't saved.
 *
 * @param {String} name Name to set to
 */
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

  try {
    const pageTitle = document.querySelector('#page-title');
    pageTitle.innerHTML = `Concard | ${name}`;
  } catch (e) {
    console.error(e);
  }
}
