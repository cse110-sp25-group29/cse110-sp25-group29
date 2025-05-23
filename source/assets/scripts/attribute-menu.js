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
        } else if (obj instanceof Drawable.Image) {
            this.form = document.createElement("icon-attributes");
            this.form.load(this.obj);
            this.attributeSel.appendChild(this.form);
        } else if (obj instanceof Drawable.Box) {
            this.form = document.createElement("box-attributes");
            this.form.load(this.obj);
            this.attributeSel.appendChild(this.form);
        }
    }

    updateObject() {
        if (!this.form)
            return;

        this.form.update();
    }
}