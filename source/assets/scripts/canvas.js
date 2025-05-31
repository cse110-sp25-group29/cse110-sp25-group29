import * as Drawable from './drawable.js';
import * as Topbar from './topbar.js';
import * as Editor from './editor-page.js';

/**
 * Represents a <canvas> HTML object with methods to
 * manipulate what's drawn on screen
 *
 * Instance variables:
 *  - canvas: The \<canvas\> object to draw to
 *  - draw_stack: The order in which to draw objects
 *  - focus: The currently selected object
 *  - active: Whether the Canvas is currently active
 *  - toolbar: The toolbar to pull from
 *  - attr: The attribute menu to pull from and write to
 */
export class Canvas {
  /**
   * Initializes the Canvas object.
   *
   * @constructor
   * @param {string} id The HTML identifier for what \<canvas\> element this
   *    Canvas object is attached to
   * @param {boolean} active Whether this \<canvas\> is active at startup
   */
  constructor(id, active) {
    this.canvas = document.querySelector(id);
    this.canvas.width = 1080;
    this.canvas.height = 600;

    this.draw_stack = [];
    this.focus = null;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.shiftHeld = false;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.onClickElsewhere = this.onClickElsewhere.bind(this);

    this.setActive(active);
  }

  /**
   * Makes this Canvas object either active or inactive, resetting
   * all relevant listeners
   *
   * @param {boolean} active Whether to be active or not
   */
  setActive(active) {
    this.active = active;

    if (active) {
      this.canvas.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('keyup', this.onKeyUp);

      document.addEventListener('click', this.onClickElsewhere);
    } else {
      this.shiftHeld = false;
      this.focus = null;

      this.canvas.removeEventListener('mousedown', this.onMouseDown);
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('keyup', this.onKeyUp);

      document.removeEventListener('click', this.onClickElsewhere);
    }

    if (this.attr) { this.attr.setObject(this.focus); }
    this.renderCanvas();
  }

  /**
   * Attaches the selected toolbar to this Canvas object
   *
   * @param {Toolbar} toolbar Toolbar to attach
   */
  attachToolbar(toolbar) {
    this.toolbar = toolbar;
  }

  /**
   * Attaches the selected attribute menu to this Canvas object
   *
   * @param {AttributeMenu} attr Attribute menu to attach
   */
  attachAttributeMenu(attr) {
    this.attr = attr;
  }

  /**
   * Exports this Canvas object into JSON format, giving a
   * description thorough enough to reconstruct it at a later time
   *
   * @returns {Map<string,Object>} JSON formatted dictionary
   */
  exportJSON() {
    // TODO
  }

  /**
   * Reconstructs this Canvas object from a previous JSON export
   *
   * @param {Map<string,Object>} description JSON formatted dictionary
   */
  importJSON(description) {
    // TODO
  }

  /**
   * Handles a mousedown event when the currently selected tool is 'select'
   *
   * @param {MouseEvent} e The mousedown event
   */
  selector(e) {
    const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height;

    const x = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX;
    const y = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY;

    if (this.focus !== null && this.focus.overSelection(x, y)) {
      if (this.focus.onMouseDown(e)) {
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.onMouseUp);
      };

      return;
    }

    for (let i = this.draw_stack.length - 1; i >= 0; i--) {
      if (this.draw_stack[i].overSelf(x, y)) {
        if (this.focus !== null && this.focus !== this.draw_stack[i]) {
          this.focus.selected = false;
        }

        this.focus = this.draw_stack[i];
        if (this.draw_stack[i].onMouseDown(e)) {
          document.addEventListener('mousemove', this.onDrag);
          document.addEventListener('mouseup', this.onMouseUp);
        };

        return;
      }
    }

    if (this.focus !== null) {
      this.focus.selected = false;
      this.focus = null;
    }
  }

  /**
   * Handles clicks that aren't on the \<canvas\> element.
   *
   * If this Canvas isn't active or we clicked on the \<canvas\>, return
   * and let onMouseDown handle the evetn.
   *
   * If the click was on over the attribute selector menu, only disable
   * keyboard shortcuts (we don't want to click off the currently selected
   * element but want the user to interact with the menu smoothly)
   *
   * Otherwise, deselect the currently selected element
   *
   * @param {MouseEvent} e The click event
   */
  onClickElsewhere(e) {
    if (!this.active) { return; }

    const popupMenu = document.querySelector('#popup-menu');
    if (popupMenu && popupMenu.style.display !== 'none') {
      const bbox1 = popupMenu.getBoundingClientRect();
      const over = (bbox1.x <= e.clientX && e.clientX <= bbox1.x + bbox1.width &&
        bbox1.y <= e.clientY && e.clientY <= bbox1.y + bbox1.height) ||
        e.clientY <= 55;

      if (!over) { Topbar.removePopupMenu(); }
    }

    if (e.target === this.canvas) {
      this.enableKeyboardShortcuts = true;
      return;
    }

    const bbox = document.querySelector('#attribute-sel').getBoundingClientRect();
    const over = (bbox.x <= e.clientX && e.clientX <= bbox.x + bbox.width &&
                  bbox.y <= e.clientY && e.clientY <= bbox.y + bbox.height);

    if (over) {
      this.enableKeyboardShortcuts = false;
    } else {
      this.enableKeyboardShortcuts = false;
      this.focus = null;

      this.attr.setObject(this.focus);
      this.renderCanvas();
    }
  }

  /**
   * Handles clicks on the \<canvas\> element.
   *
   * If the current tool is 'selector', call selector() and let it
   * handle it.
   *
   * Otherwise, create a new element and be ready to modify it (in the case
   * of squares or circles) or to simply select it and go to the selector tool
   *
   * @param {MouseEvent} e The mousedown event
   */
  onMouseDown(e) {
    const tool = this.toolbar.getCurTool();

    if (tool === 0) {
      this.selector(e);
    } else {
      let element;
      switch (tool) {
        case 1: // line tool, doesn't exist anymore
          element = new Drawable.Line(this);
          break;
        case 2: // box tool
          element = new Drawable.Box(this);
          break;
        case 3: // ellipse tool
          element = new Drawable.Ellipse(this);
          break;
        case 4: // image tool
          element = new Drawable.Image(this);
          break;
        case 5: // textbox tool
          element = new Drawable.Textbox(this);
          break;
      }

      this.draw_stack.push(element);
      this.focus = element;
      if (element.init(e)) {
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.onMouseUp);
      } else {
        this.onAnyChange();
        this.focus.selected = true;
        this.toolbar.setTool(0);
      }
    }

    this.attr.setObject(this.focus);
    this.renderCanvas();
  }

  /**
   * Handle moving the cursor after a mousedown event, either
   * to drag elements around or to resize them
   *
   * @param {MouseEvent} e The drag event
   */
  onDrag(e) {
    if (this.focus !== null) { this.focus.onDrag(e); }

    this.attr.updateObject();
    this.renderCanvas();
  }

  /**
   * Handle letting go of a mouse press
   *
   * @param {MouseEvent} e  The mouseup event
   */
  onMouseUp(e) {
    if (this.focus !== null && !this.focus.onMouseUp(e)) {
      this.focus = null;
    } else {
      this.focus.selected = true;
    }

    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.onMouseUp);

    this.toolbar.setTool(0);

    this.onAnyChange();
    this.attr.updateObject();
    this.renderCanvas();
  }

  /**
   * Handles a left key trigger by the user.
   *
   * Currently, only moves objects left when keyboard shortcuts
   * are enabled.
   *
   * @param {boolean} meta Whether the meta button is held
   * @param {boolean} shift Whether the shift button is held
   */
  triggerLeftKey(meta, shift) {
    if (this.focus === null) { return; }

    this.focus.moveX(shift ? -1 : -10);
    this.renderCanvas();
  }

  /**
   * Handles a right key trigger by the user.
   *
   * Currently, only moves objects right when keyboard shortcuts
   * are enabled.
   *
   * @param {boolean} meta Whether the meta button is held
   * @param {boolean} shift Whether the shift button is held
   */
  triggerRightKey(meta, shift) {
    if (this.focus === null) { return; }

    this.focus.moveX(shift ? 1 : 10);
    this.renderCanvas();
  }

  /**
   * Handles a down key trigger by the user.
   *
   * Moves objects down when the meta button is not held.
   *
   * Moves objects down in the render stack when the meta button
   * is held, either by one or to the bottom depending on whether
   * the shift button is held.
   *
   * @param {boolean} meta Whether the meta button is held
   * @param {boolean} shift Whether the shift button is held
   */
  triggerDownKey(meta, shift) {
    if (this.focus === null) { return; }

    if (!meta) {
      this.focus.moveY(shift ? 1 : 10);
      this.renderCanvas();
      return;
    }

    let itemId;
    for (let i = 0; i < this.draw_stack.length; i++) {
      if (this.draw_stack[i] === this.focus) {
        itemId = i;
        break;
      }
    }

    if (shift) {
      this.draw_stack.splice(itemId, 1);
      this.draw_stack.unshift(this.focus);
    } else if (itemId > 0) {
      this.draw_stack[itemId] = this.draw_stack[itemId - 1];
      this.draw_stack[itemId - 1] = this.focus;
    }

    this.renderCanvas();
  }

  /**
   * Handles a up key trigger by the user.
   *
   * Moves objects up when the meta button is not held.
   *
   * Moves objects up in the render stack when the meta button
   * is held, either by one or to the top depending on whether
   * the shift button is held.
   *
   * @param {boolean} meta Whether the meta button is held
   * @param {boolean} shift Whether the shift button is held
   */
  triggerUpKey(meta, shift) {
    if (this.focus === null) { return; }

    if (!meta) {
      this.focus.moveY(shift ? -1 : -10);
      this.renderCanvas();
      return;
    }

    let itemId;
    for (let i = 0; i < this.draw_stack.length; i++) {
      if (this.draw_stack[i] === this.focus) {
        itemId = i;
        break;
      }
    }

    if (shift) {
      this.draw_stack.splice(itemId, 1);
      this.draw_stack.push(this.focus);
    } else if (itemId < this.draw_stack.length - 1) {
      this.draw_stack[itemId] = this.draw_stack[itemId + 1];
      this.draw_stack[itemId + 1] = this.focus;
    }

    this.renderCanvas();
  }

  /**
   * Handle a delete key trigger by the user.
   *
   * Deletes the currently selected object.
   */
  triggerDeleteKey() {
    if (this.focus === null) { return; }

    let itemId;
    for (let i = 0; i < this.draw_stack.length; i++) {
      if (this.draw_stack[i] === this.focus) {
        itemId = i;
        break;
      }
    }

    this.draw_stack.splice(itemId, 1);
    this.focus = null;

    this.attr.setObject(this.focus);
    this.renderCanvas();
  }

  /**
   * Handles keyboard presses by the user, delegating the task
   * handling to their respective functions.
   *
   * @param {KeyboardEvent} e The keypress event
   */
  onKeyDown(e) {
    const key = e.key;
    if (key === 'Shift') {
      this.shiftHeld = true;
    }

    if (!this.enableKeyboardShortcuts) { return; } // shortcuts aren't enabled right now

    if (key === 'ArrowDown') {
      this.triggerDownKey(e.metaKey, e.shiftKey);
    } else if (key === 'ArrowUp') {
      this.triggerUpKey(e.metaKey, e.shiftKey);
    } else if (key === 'ArrowLeft') {
      this.triggerLeftKey(e.metaKey, e.shiftKey);
    } else if (key === 'ArrowRight') {
      this.triggerRightKey(e.metaKey, e.shiftKey);
    } else if (key === 'Delete' || key === 'Backspace') {
      this.triggerDeleteKey();
    }

    this.onAnyChange();
  }

  /**
   * Handles a user letting go of a key.
   *
   * Only used for tracking whether shift is held for now.
   *
   * @param {KeyboardEvent} e The keypress event
   */
  onKeyUp(e) {
    const key = e.key;
    if (key === 'Shift') {
      this.shiftHeld = false;
    }
  }

  /**
   * Renders the canvas, going from the bottom to the top
   * of the draw stack. Each object has its own drawing
   * functionality, so hand it off to them. Finally draw the
   * focus box of the currently selected item.
   */
  renderCanvas() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.draw_stack.length; i++) {
      this.draw_stack[i].drawSelf(ctx);
    }

    if (this.focus !== null) { this.focus.drawFocus(ctx); }
  }

  onAnyChange() {
    if (Editor.saved) {
      Editor.setSaved(false);
      Topbar.setName(Editor.cardName);
    }
  }
}
