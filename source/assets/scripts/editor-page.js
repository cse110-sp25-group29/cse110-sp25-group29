import * as Toolbar from "./toolbar.js"
import * as AttributeMenu from "./attribute-menu.js"
import * as Canvas from "./canvas.js"

window.addEventListener('DOMContentLoaded', init);

function init() {
    const front_canvas = new Canvas.Canvas("#front-card", true);
    const back_canvas = new Canvas.Canvas("#back-card", false);

    const toolbar = new Toolbar.Toolbar();
    const attributeMenu = new AttributeMenu.AttributeMenu("#attribute-sel");

    front_canvas.attachToolbar(toolbar);
    front_canvas.attachAttributeMenu(attributeMenu);

    back_canvas.attachToolbar(toolbar);
    back_canvas.attachAttributeMenu(attributeMenu);

    const flipButton = document.querySelector("#flip_button");
    flipButton.addEventListener('click', () => {
        let active = front_canvas.active;
        front_canvas.setActive(!active);
        back_canvas.setActive(active);

        if (active) {
            front_canvas.canvas.style.transform = 'rotateY(180deg)';
            back_canvas.canvas.style.transform = 'rotateY(0deg)';
        } else {
            front_canvas.canvas.style.transform = 'rotateY(0deg)';
            back_canvas.canvas.style.transform = 'rotateY(180deg)';
        }
    });
}