import * as Toolbar from "./toolbar.js"
import * as Drawable from "./drawable.js"
import * as AttributeMenu from "./attribute-menu.js"

window.addEventListener('DOMContentLoaded', init);

class Canvas {
    constructor(id) {
        this.canvas = document.querySelector(id);
        this.canvas.width = 1000;
        this.canvas.height = 1000;

        this.draw_stack = [];
        this.focus = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.canvas.addEventListener('mousedown', this.onMouseDown);

        this.onDrag = this.onDrag.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
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
            case 1: // line tool
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
            case 3: // image tool
                element = new Drawable.Image(this);
                this.draw_stack.push(element);
                this.focus = null;
                if (element.init(e)) {
                    document.addEventListener('mousemove', this.onDrag);
                    document.addEventListener('mouseup', this.onMouseUp);
                }
                break;
            case 4: // textbox tool
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