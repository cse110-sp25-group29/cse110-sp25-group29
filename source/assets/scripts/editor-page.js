import * as Toolbar from './toolbar.js';
import * as AttributeMenu from './attribute-menu.js';
import * as Canvas from './canvas.js';
import * as Topbar from './topbar.js';

window.addEventListener('DOMContentLoaded', init);

export let saved = false;
export function setSaved(value) {
  saved = value;
}

export let cardName = 'Untitled';
export function saveAs(name) {
  if (name && cardName !== name) {
    delete cardsList[cardName];
    cardName = name;
    cardsList[cardName] = {
      'front': frontCanvas.exportJSON(),
      'back': backCanvas.exportJSON()
    };
    console.log(cardsList);
    exportCardsList();
  } else if (!saved) {
    cardsList[cardName] = {
      'front': frontCanvas.exportJSON(),
      'back': backCanvas.exportJSON()
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
  cardName = 'Untitled';
  exportCurrentCardName();
  exportCardsList();

  reset();
}

let cardsList;
function importCardsList() {
  const cardsList = localStorage.getItem('cards');
  if (!cardsList) return {};
  else return JSON.parse(cardsList);
}

function exportCardsList() {
  if (cardsList)
    localStorage.setItem('cards', JSON.stringify(cardsList));
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
  console.log("reset");
  frontCanvas = new Canvas.Canvas('#front-card', true);
  backCanvas = new Canvas.Canvas('#back-card', false);
  document.querySelector('#front-card').style.transform = 'rotateY(0deg)'
  document.querySelector('#back-card').style.transform = 'rotateY(180deg)'

  const toolbar = new Toolbar.Toolbar();
  const attributeMenu = new AttributeMenu.AttributeMenu('#attribute-sel');

  frontCanvas.attachToolbar(toolbar);
  frontCanvas.attachAttributeMenu(attributeMenu);

  backCanvas.attachToolbar(toolbar);
  backCanvas.attachAttributeMenu(attributeMenu);

  cardName = importCurrentCardName();
  cardsList = importCardsList();
  if (cardName in cardsList) {
    console.log("importing from previous");
    frontCanvas.importJSON(cardsList[cardName]['front']);
    backCanvas.importJSON(cardsList[cardName]['back']);
  }

  setSaved(true);
  Topbar.setName(cardName);
}

/**
 * Initializes the objects on the editor page.
 */
let frontCanvas, backCanvas;
function init() {
  reset();

  const flipButton = document.querySelector('#flip_button');

  flipButton.addEventListener('click', () => {
    const active = frontCanvas.active;
    frontCanvas.setActive(!active);
    backCanvas.setActive(active);

    if (active) {
      frontCanvas.canvas.style.transform = 'rotateY(180deg)';
      backCanvas.canvas.style.transform = 'rotateY(0deg)';
    } else {
      frontCanvas.canvas.style.transform = 'rotateY(0deg)';
      backCanvas.canvas.style.transform = 'rotateY(180deg)';
    }
  });

  document.addEventListener('keypress', (e) => {
    const key = e.code;
    console.log(e);
    if (key === 'KeyS' && (e.ctrlKey || e.altKey)) { saveAs(); }
  });

  Topbar.initListeners();
}