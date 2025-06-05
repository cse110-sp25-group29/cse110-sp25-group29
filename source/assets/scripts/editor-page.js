import * as Toolbar from './toolbar.js';
import * as AttributeMenu from './attribute-menu.js';
import * as Canvas from './canvas.js';
import * as Topbar from './topbar.js';

window.addEventListener('DOMContentLoaded', init);

function downloadURL(url, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export let saved = false;
export function setSaved(value) {
  saved = value;
}

export let cardName = 'Untitled';
export function setCardName(name) {
  cardName = name;
  Topbar.setName(name);
}
export function saveAs(name) {
  if (name && cardName !== name) {
    delete cardsList[cardName];
    cardName = name;
    cardsList[cardName] = {
      front: frontCanvas.exportJSON(),
      back: backCanvas.exportJSON()
    };
    console.log(cardsList);
    exportCardsList();
  } else if (!saved) {
    cardsList[cardName] = {
      front: frontCanvas.exportJSON(),
      back: backCanvas.exportJSON()
    };
    exportCardsList();
  }

  saved = true;
  console.log('saving card as ' + cardName);
  exportCurrentCardName();
  Topbar.setName(cardName);
}

export function deleteCard() {
  delete cardsList[cardName];

  if (!('Untitled' in cardsList)) {
    cardName = 'Untitled';
  } else {
    let num = 1;
    while (`Untitled${num}` in cardsList) num += 1;
    cardName = `Untitled${num}`;
  }

  exportCurrentCardName();
  exportCardsList();

  reset();
}

let cardsList;
export function importCardsList() {
  const cardsList = localStorage.getItem('cards');
  if (!cardsList) return {};
  else return JSON.parse(cardsList);
}

function exportCardsList() {
  if (cardsList) { localStorage.setItem('cards', JSON.stringify(cardsList)); }
}

function importCurrentCardName() {
  const cardName = localStorage.getItem('current_card');
  if (!cardName) return 'Untitled';
  else return cardName;
}

function exportCurrentCardName() {
  localStorage.setItem('current_card', cardName);
}

function reset() {
  console.log('reset');
  frontCanvas.setActive(true);
  backCanvas.setActive(false);

  document.querySelector('#front-card').style.transform = 'rotateY(0deg)';
  document.querySelector('#back-card').style.transform = 'rotateY(180deg)';
  document.querySelector('#flip-button').innerHTML = 'Flip to Back!';

  cardName = importCurrentCardName();
  cardsList = importCardsList();
  if (cardName in cardsList) {
    console.log('importing from previous');
    frontCanvas.importJSON(cardsList[cardName].front);
    backCanvas.importJSON(cardsList[cardName].back);
  } else {
    frontCanvas.importJSON({});
    backCanvas.importJSON({});
  }

  setSaved(true);
  Topbar.setName(cardName);
}

/**
 * Initializes the objects on the editor page.
 */
let frontCanvas, backCanvas;
function init() {
  frontCanvas = new Canvas.Canvas('#front-card', true);
  backCanvas = new Canvas.Canvas('#back-card', false);
  document.querySelector('#front-card').style.transform = 'rotateY(0deg)';
  document.querySelector('#back-card').style.transform = 'rotateY(180deg)';

  const toolbar = new Toolbar.Toolbar();
  const attributeMenu = new AttributeMenu.AttributeMenu('#attribute-sel');

  frontCanvas.attachToolbar(toolbar);
  frontCanvas.attachAttributeMenu(attributeMenu);

  backCanvas.attachToolbar(toolbar);
  backCanvas.attachAttributeMenu(attributeMenu);

  cardName = importCurrentCardName();
  cardsList = importCardsList();
  if (cardName in cardsList) {
    console.log('importing from previous');
    frontCanvas.importJSON(cardsList[cardName].front);
    backCanvas.importJSON(cardsList[cardName].back);
  }

  setSaved(true);
  Topbar.setName(cardName);

  const flipButton = document.querySelector('#flip-button');

  flipButton.addEventListener('click', () => {
    const active = frontCanvas.active;
    frontCanvas.setActive(!active);
    backCanvas.setActive(active);

    if (active) {
      frontCanvas.canvas.style.transform = 'rotateY(180deg)';
      backCanvas.canvas.style.transform = 'rotateY(0deg)';
      flipButton.innerHTML = 'Flip to Front!';
    } else {
      frontCanvas.canvas.style.transform = 'rotateY(0deg)';
      backCanvas.canvas.style.transform = 'rotateY(180deg)';
      flipButton.innerHTML = 'Flip to Back!';
    }
  });

  document.addEventListener('keypress', (e) => {
    const key = e.code;
    console.log(e);
    if (key === 'KeyS' && (e.ctrlKey || e.altKey)) { saveAs(); }
  });

  Topbar.initListeners();
  const jpgexport = document.getElementById('export-jpg');
  const pngexport = document.getElementById('export-png');
  const jsonexport = document.getElementById('export-json');
  const duplicate = document.getElementById('export-duplicate');
  const openprev = document.getElementById('import-previous');

  openprev.addEventListener('click', () => {
    const cards = importCardsList();
    const cardNames = Object.keys(cards);
    const current = importCurrentCardName();
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

    frontCanvas.importJSON(cards[prevname].front);
    backCanvas.importJSON(cards[prevname].back);

    setSaved(true);
    setCardName(prevname);
    exportCurrentCardName();
  });

  duplicate.addEventListener('click', () => {
    setSaved(false);
    setCardName(null);
  });

  jpgexport.addEventListener('click', () => {
    const active = frontCanvas.active;
    let activeCanvas;
    let name;
    if (active) {
      activeCanvas = frontCanvas;
      name = 'front-card.jpg';
    } else {
      activeCanvas = backCanvas;
      name = 'back-card.jpg';
    }

    const url = activeCanvas.canvas.toDataURL('image/jpeg', 0.95);
    downloadURL(url, name);
  });

  pngexport.addEventListener('click', () => {
    const active = frontCanvas.active;
    let activeCanvas;
    let name;

    if (active) {
      activeCanvas = frontCanvas;
      name = 'front-card.png';
    } else {
      activeCanvas = backCanvas;
      name = 'back-card.png';
    }

    const url = activeCanvas.canvas.toDataURL('image/png');
    downloadURL(url, name);
  });

  jsonexport.addEventListener('click', () => {
    const exportData = {
      front: frontCanvas.exportJSON(),
      back: backCanvas.exportJSON()
    };
    const str = JSON.stringify(exportData, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadURL(url, 'front-and-back.json');
    URL.revokeObjectURL(url);
  });
}
