import * as Toolbar from './toolbar.js';
import * as AttributeMenu from './attribute-menu.js';
import * as Canvas from './canvas.js';
import * as Topbar from './topbar.js';

window.addEventListener('DOMContentLoaded', init);

export let saved = false;
export let cardName = 'Untitled';
export let frontCanvas, backCanvas;
let cardsList;

/**
 * Causes the user to download the file at the
 * given URL under the given name
 *
 * @param {String} url The URL to download
 * @param {String} name The name to download it as
 */
export function downloadURL(url, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Sets the value of saved
 *
 * @param {boolean} value Value
 */
export function setSaved(value) {
  saved = value;
}

/**
 * Sets the name of the current card
 *
 * @param {String} name Name to set it to
 */
export function setCardName(name) {
  cardName = name;
  Topbar.setName(name);
}

/**
 * Creates a copy of the current card with a
 * new name
 *
 * @param {String} name The new name
 */
export function saveAs(name) {
  if (name && cardName !== name) {
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

/**
 * Removes the current card from localStorage
 * and opens up a new card for the user to use
 */
export function deleteCard() {
  delete cardsList[cardName];
  openNew();
}

/**
 * A helper function to find the first card
 * name of the form "UntitledX" that isn't
 * currently used by another card
 *
 * @returns The next unused name
 */
export function nextUntitled() {
  if (!('Untitled' in cardsList)) {
    return 'Untitled';
  } else {
    let num = 1;
    while (`Untitled${num}` in cardsList) num += 1;
    return `Untitled${num}`;
  }
}

/**
 * Opens a new card
 */
export function openNew() {
  cardName = nextUntitled();

  exportCurrentCardName();
  exportCardsList();

  reset(false);
}

/**
 * Imports the user's saved cards from localStorage
 *
 * @returns A dictionary of card names and their descriptions
 */
export function importCardsList() {
  const cardsList = localStorage.getItem('cards');
  if (!cardsList) return {};
  else return JSON.parse(cardsList);
}

/**
 * Saves the current value of cardsList to localStorage,
 * used for saving cards
 */
export function exportCardsList() {
  if (cardsList) { localStorage.setItem('cards', JSON.stringify(cardsList)); }
}

/**
 * Imports what the last value of current_card was in
 * localStorage. Used to save session information so
 * that if a user reloads the screen, they'll stay on the
 * same card.
 *
 * If there is no such value, get the next
 * unused name with nextUntitled();
 *
 * @returns The name of the card to use
 */
export function importCurrentCardName() {
  const cardName = localStorage.getItem('current_card');
  if (!cardName) return nextUntitled();
  else return cardName;
}

/**
 * Sets the value of current_card to the current
 * card's name in localStorage
 */
export function exportCurrentCardName() {
  localStorage.setItem('current_card', cardName);
}

/**
 * Resets the rendering of the current card.
 * Used to open up new cards without having to
 * fully create new Canvas objects, which would
 * be expensive.
 *
 * @param {boolean} saved Whether to display the top bar
 *      as saved or not
 */
export function reset(saved = true) {
  console.log('reset');
  frontCanvas.setActive(true);
  backCanvas.setActive(false);

  document.querySelector('#front-card').style.transform = 'rotateY(0deg)';
  document.querySelector('#back-card').style.transform = 'rotateY(180deg)';
  document.querySelector('#flip-button').innerHTML = 'Flip to Back!';

  cardsList = importCardsList();
  cardName = importCurrentCardName();
  if (cardName in cardsList) {
    console.log('importing from previous');
    frontCanvas.importJSON(cardsList[cardName].front);
    backCanvas.importJSON(cardsList[cardName].back);
  } else {
    frontCanvas.importJSON({ objects: [] });
    backCanvas.importJSON({ objects: [] });
  }

  setSaved(saved);
  Topbar.setName(cardName);
}

/**
 * Preloads the images that can be displayed
 * as icons on a card. Without this, a user might
 * add an icon and not have it render until they
 * do something else to update the card, which
 * isn't ideal.
 */
const images = [];
function preloadImages(img) {
  for (let i = 0; i < img.length; i++) {
    images[i] = new Image();
    images[i].src = img[i];
  }
}

/**
 * Initializes the objects on the editor page.
 */
function init() {
  preloadImages([
    './icons/instagram.webp',
    './icons/facebook.png',
    './icons/linkedin.png',
    './icons/github.png',
    './icons/gmail.webp',
    './icons/youtube.webp',
    './icons/tiktok.png',
    './icons/tumblr.png',
    './icons/x.png'
  ]);

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

  cardsList = importCardsList();
  cardName = importCurrentCardName();
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
    if (key === 'KeyS' && (e.ctrlKey || e.altKey || e.metaKey)) { 
      e.preventDefault();
      saveAs(); 
    }
  });

  const root = document.querySelector('html');
  const darkMode = localStorage.getItem('theme');
  if (darkMode === 'dark') {
    root.setAttribute('class', 'dark');
  }

  Topbar.initListeners();

  setTimeout(() => { // ensure images are drawn
    frontCanvas.renderCanvas();
  }, 10);
}
