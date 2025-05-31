import * as Editor from './editor-page.js';

export function initListeners() {
  const home = document.querySelector('#home-button');
  home.addEventListener('click', (e) => {
    window.location.href = '../homepage.html';
  });

  const del = document.querySelector('#delete-button');
  del.addEventListener('click', triggerDeleteMenu);

  const saveNormal = document.querySelector('#save-button');
  saveNormal.addEventListener('click', (e) => {
    Editor.saveAs();
  });

  const saveAs = document.querySelector('#save-as');
  saveAs.addEventListener('click', triggerSaveAsMenu);
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
  else cardTitle.style.fontWeight = 'regular';
}
