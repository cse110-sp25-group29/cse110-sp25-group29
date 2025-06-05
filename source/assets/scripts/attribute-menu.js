import * as Drawable from './drawable.js';
import './shadow-dom.js';

/**
 * Represents the right column of the editor page. Gets
 * updated whenever the Canvas object selects/changes an object,
 * and allows the user to manually change values of specific
 * Drawable objects.
 */
export class AttributeMenu {
  /**
   * Initializes this AttributeMenu
   *
   * @constructor
   * @param {string} attributeSel The selector pointing to where this
   *    attribute selector is located
   */
  constructor(attributeSel) {
    this.attributeSelText = attributeSel;
    this.attributeSel = document.querySelector(attributeSel);
    this.obj = null;
    this.form = null;
  }

  /**
   * Resets the right column by updating it with a new
   * object (or clearing it if no new object is selected)
   *
   * @param {*} obj The object to set to
   */
  setObject(obj) {
    if (this.obj === obj) { return; }

    if (this.form) {
      this.attributeSel.removeChild(this.form);
      this.form = null;
    }

    this.obj = obj;
    if (obj instanceof Drawable.Textbox) {
      this.form = document.createElement('textbox-attributes');
      this.form.load(this.obj);
      this.attributeSel.appendChild(this.form);
    } else if (obj instanceof Drawable.Image) {
      this.form = document.createElement('icon-attributes');
      this.form.load(this.obj);
      this.attributeSel.appendChild(this.form);
    } else if (obj instanceof Drawable.Box) {
      this.form = document.createElement('box-attributes');
      this.form.load(this.obj);
      this.attributeSel.appendChild(this.form);
    }
  }

  /**
   * Updates the right column. Called when the currently selected
   * object gets updated outside of this element
   */
  updateObject() {
    if (!this.form) { return; }

    this.form.update();
  }
}
