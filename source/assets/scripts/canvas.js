import * as Toolbar from "./toolbar.js"
import * as Drawable from "./drawable.js"
import * as AttributeMenu from "./attribute-menu.js"

window.addEventListener('DOMContentLoaded', init);

class Canvas {
    constructor(id) {
        this.canvas = document.querySelector(id);
        this.canvas.width = 1080;
        this.canvas.height = 600;

        this.draw_stack = [];
        this.focus = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.canvas.addEventListener('mousedown', this.onMouseDown);

        this.onDrag = this.onDrag.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.shiftHeld = false;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    attachToolbar(toolbar) {
        this.toolbar = toolbar;
    }

    attachAttributeMenu(attr) {
        this.attr = attr;
    }

    export() {
        // TODO
    }

    import(description) {
        // TODO
    }

    selector(e) {
        let scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width
        let scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height

        let x = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX
        let y = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY

        if (this.focus != null && this.focus.overSelection(x, y)) {
            if (this.focus.onMouseDown(e)) {
                document.addEventListener('mousemove', this.onDrag);
                document.addEventListener('mouseup', this.onMouseUp);
            };

            return;
        }

        for (let i = this.draw_stack.length - 1; i >= 0; i--) {
            if (this.draw_stack[i].overSelf(x, y)) {
                if (this.focus != null && this.focus != this.draw_stack[i]) {
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

        if (this.focus != null) {
            this.focus.selected = false;
            this.focus = null;
        }
    }

    onMouseDown(e) {
        const tool = this.toolbar.getCurTool();

        let element;
        switch (tool) {
            case 0: // selector tool
                this.selector(e);
                break;
            case 1: // line tool, doesn't exist anymore
                element = new Drawable.Line(this);
                this.draw_stack.push(element);
                if (element.init(e)) {
                    this.focus = element;
                    document.addEventListener('mousemove', this.onDrag);
                    document.addEventListener('mouseup', this.onMouseUp);
                }
                break;
            case 2: // box tool
                element = new Drawable.Box(this);
                this.draw_stack.push(element);
                if (element.init(e)) {
                    this.focus = element;
                    document.addEventListener('mousemove', this.onDrag);
                    document.addEventListener('mouseup', this.onMouseUp);
                }
                break;
            case 3: // ellipse tool
                element = new Drawable.Ellipse(this);
                this.draw_stack.push(element);
                if (element.init(e)) {
                    this.focus = element;
                    document.addEventListener('mousemove', this.onDrag);
                    document.addEventListener('mouseup', this.onMouseUp);
                }
                break;
            case 4: // image tool
                element = new Drawable.Image(this);
                this.draw_stack.push(element);
                this.focus = null;
                if (element.init(e)) {
                    document.addEventListener('mousemove', this.onDrag);
                    document.addEventListener('mouseup', this.onMouseUp);
                }
                break;
            case 5: // textbox tool
                element = new Drawable.Textbox(this);
                this.draw_stack.push(element);
                this.focus = null;
                if (element.init(e)) {
                    document.addEventListener('mousemove', this.onDrag);
                    document.addEventListener('mouseup', this.onMouseUp);
                }
                break;
        }

        this.renderCanvas();
    }

    onDrag(e) {
        if (this.focus != null)
            this.focus.onDrag(e);

        this.renderCanvas();
    }

    onMouseUp(e) {
        if (this.focus != null && !this.focus.onMouseUp(e)) {
            this.focus = null;
        }

        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.onMouseUp);

        this.renderCanvas();
    }

    triggerDownKey(meta, shift) {
        if (this.focus == null || !meta) // handle movement later
            return;
        
        let item_id;
        for (let i = 0; i < this.draw_stack.length; i++) {
            if (this.draw_stack[i] == this.focus) {
                item_id = i;
                break;
            }
        }

        console.log(item_id)

        if (shift) {
            this.draw_stack.splice(item_id, 1);
            this.draw_stack.unshift(this.focus)
        } else if (item_id > 0) {
            this.draw_stack[item_id] = this.draw_stack[item_id-1];
            this.draw_stack[item_id-1] = this.focus;
        }

        this.renderCanvas();
    }

    triggerUpKey(meta, shift) {
        if (this.focus == null || !meta) // handle movement later
            return;
        
        let item_id;
        for (let i = 0; i < this.draw_stack.length; i++) {
            if (this.draw_stack[i] == this.focus) {
                item_id = i;
                break;
            }
        }

        console.log(item_id)

        if (shift) {
            this.draw_stack.splice(item_id, 1);
            this.draw_stack.push(this.focus)
        } else if (item_id < this.draw_stack.length-1) {
            this.draw_stack[item_id] = this.draw_stack[item_id+1];
            this.draw_stack[item_id+1] = this.focus;
        }

        this.renderCanvas();
    }

    triggerDeleteKey() {
        if (this.focus == null)
            return;
        
        let item_id;
        for (let i = 0; i < this.draw_stack.length; i++) {
            if (this.draw_stack[i] == this.focus) {
                item_id = i;
                break;
            }
        }

        this.draw_stack.splice(item_id, 1);
        this.focus = null;
        this.renderCanvas();
    }

    onKeyDown(e) {
        const key = e.key;
        if (key === 'Shift') {
            this.shiftHeld = true;
        }
        else if (key == 'ArrowDown') {
            this.triggerDownKey(e.metaKey, e.shiftKey)
        }
        else if (key == 'ArrowUp') {
            this.triggerUpKey(e.metaKey, e.shiftKey)
        }
        else if (key == 'Delete' || key == 'Backspace') {
            this.triggerDeleteKey()
        }
    }

    onKeyUp(e) {
        const key = e.key;
        if (key === 'Shift') {
            this.shiftHeld = false;
        }
    }

    renderCanvas() {
        let ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.draw_stack.length; i++) {
            this.draw_stack[i].drawSelf(ctx);
        }

        if (this.focus != null)
            this.focus.drawFocus(ctx);
    }
}

function init() {
    const canvas = new Canvas("#business_card")
    canvas.attachToolbar(new Toolbar.Toolbar());
    canvas.attachAttributeMenu(new AttributeMenu.AttributeMenu());
}