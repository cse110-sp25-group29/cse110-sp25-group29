import * as Drawable from "./drawable.js"
import "./shadow-dom.js"

export class AttributeMenu {
    constructor(attributeSel) {
        this.attributeSelText = attributeSel;
        this.attributeSel = document.querySelector(attributeSel);
        this.obj = null;
        this.form = null;
    }

    setObject(obj) {
        if (this.obj == obj)
            return;
    

        if (this.form) {
            this.attributeSel.removeChild(this.form)
            this.form = null;
        }

        this.obj = obj;
        if (obj instanceof Drawable.Textbox) {
            this.form = document.createElement("textbox-attributes");
            this.form.load(this.obj);
            this.attributeSel.appendChild(this.form);
        }
    }

    updateObject(obj) {
        if (!this.form)
            return;

        this.form.update();
    }

    createTextMenu() {
        let container = document.createElement("form");
        this.attributeSel.appendChild(container);

        let labelText = document.createElement("label");
        labelText.setAttribute("for", "attr-text");
        labelText.innerHTML = "Text:";
        container.appendChild(labelText);

        let inputText = document.createElement("input");
        inputText.setAttribute("type", "text");
        inputText.setAttribute("id", "attr-text");
        inputText.setAttribute("name", "attr-text");
        inputText.setAttribute("autocomplete", "off");
        container.appendChild(inputText);
    }

    updateTextMenu() {

    }
}