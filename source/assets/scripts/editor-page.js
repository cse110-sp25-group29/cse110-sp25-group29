import * as Toolbar from './toolbar.js';
import * as AttributeMenu from './attribute-menu.js';
import * as Canvas from './canvas.js';
import * as Topbar from './topbar.js';

window.addEventListener('DOMContentLoaded', init);

export let saved = false;
export function setSaved(value) {
  saved = value;
}

export let cardName = 'placeholder';
export function saveAs(name) {
  if (name) { cardName = name; }

  saved = true;
  console.log('saving card as ' + cardName);
  Topbar.setName(cardName);
}

/**
 * Initializes the objects on the editor page.
 */
function init() {
  const frontCanvas = new Canvas.Canvas('#front-card', true);
  const backCanvas = new Canvas.Canvas('#back-card', false);

  const toolbar = new Toolbar.Toolbar();
  const attributeMenu = new AttributeMenu.AttributeMenu('#attribute-sel');

  frontCanvas.attachToolbar(toolbar);
  frontCanvas.attachAttributeMenu(attributeMenu);

  backCanvas.attachToolbar(toolbar);
  backCanvas.attachAttributeMenu(attributeMenu);

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
  setSaved(true);
  Topbar.setName(cardName);
}
