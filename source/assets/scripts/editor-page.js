import * as Toolbar from './toolbar.js';
import * as AttributeMenu from './attribute-menu.js';
import * as Canvas from './canvas.js';

window.addEventListener('DOMContentLoaded', init);

function init() {
    const frontCanvas = new Canvas.Canvas("#front-card", true);
    const backCanvas = new Canvas.Canvas("#back-card", false);

    const toolbar = new Toolbar.Toolbar();
    const attributeMenu = new AttributeMenu.AttributeMenu("#attribute-sel");

  frontCanvas.attachToolbar(toolbar);
  frontCanvas.attachAttributeMenu(attributeMenu);

  backCanvas.attachToolbar(toolbar);
  backCanvas.attachAttributeMenu(attributeMenu);

    const flipButton = document.querySelector("#flip_button");

    flipButton.addEventListener('click', () => {
        let active = front_canvas.active;
        front_canvas.setActive(!active);
        back_canvas.setActive(active);

    if (active) {
      frontCanvas.canvas.style.transform = 'rotateY(180deg)';
      backCanvas.canvas.style.transform = 'rotateY(0deg)';
    } else {
      frontCanvas.canvas.style.transform = 'rotateY(0deg)';
      backCanvas.canvas.style.transform = 'rotateY(180deg)';
    }
  });
}
