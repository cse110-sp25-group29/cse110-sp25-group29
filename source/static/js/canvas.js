window.addEventListener('DOMContentLoaded', init);

class Tool {
    constructor() { this.selected = false; }

    init() {}
    onMouseDown() { return false; }
    onDrag() {}
    onMouseUp() {}
    drawSelf(ctx) {}
    drawFocus() {}
    overSelf(x, y) { return false; }
    overSelection(x, y) { return false; }
    toggleSelected(value) { this.selected = value }
}

class Line extends Tool {
    constructor(parent) {
        super();

        this.parent = parent;
        this.canvas = this.parent.canvas;

        // for testing purposes
        this.r = Math.floor(Math.random() * 256);
        this.g = Math.floor(Math.random() * 256);
        this.b = Math.floor(Math.random() * 256);
    }

    init(e) {
        let scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width
        let scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height

        this.x1 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX
        this.y1 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY
        this.x2 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX
        this.y2 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY

        return true;
    }

    onMouseDown(e) {
        return false;
    }

    onDrag(e) {
        let scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width
        let scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height

        this.x2 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX
        this.y2 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY
    }

    onMouseUp(e) {
        return false;
    }

    drawSelf(ctx) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;

        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }

    drawFocus(ctx) {
        return;
    }
}

class Box extends Tool {
    constructor(parent) {
        super();

        this.parent = parent;
        this.canvas = this.parent.canvas;

        // for testing purposes
        this.r = Math.floor(Math.random() * 256);
        this.g = Math.floor(Math.random() * 256);
        this.b = Math.floor(Math.random() * 256);
    }

    init(e) {
        let scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width
        let scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height

        this.x1 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX
        this.y1 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY
        this.x2 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX
        this.y2 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY

        return true;
    }

    onMouseDown(e) {
        this.selected = true;

        this.lastX = e.clientX;
        this.lastY = e.clientY;

        let scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width
        let scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height

        this.selectionID = this.overSelection(
            (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX,
            (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY
        );

        return true;
    }

    onDrag(e) {
        let scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width
        let scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height

        if (this.selected) {
            let xi = 0, yi = 0;
            console.log(this.selectionID);
            switch (this.selectionID) {
                case 0: xi = 3; yi = 3; break;
                case 1: xi = 1, yi = 1; break;
                case 2: xi = 1, yi = 2; break;
                case 3: xi = 2, yi = 2; break;
                case 4: xi = 2, yi = 1; break;
                case 5: xi = 0, yi = 1; break;
                case 6: xi = 0, yi = 2; break;
                case 7: xi = 1, yi = 0; break;
                case 8: xi = 2, yi = 0; break;
                case 9: break; // rotate, TBD
            }

            if (xi % 2 == 1)
                this.x1 += (e.clientX - this.lastX) * scaleX
            if (yi % 2 == 1)
                this.y1 += (e.clientY - this.lastY) * scaleY

            if (xi / 2 >= 1)
                this.x2 += (e.clientX - this.lastX) * scaleX
            if (yi / 2 >= 1)
                this.y2 += (e.clientY - this.lastY) * scaleY

            this.lastX = e.clientX;
            this.lastY = e.clientY;
        } else {
            this.x2 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX
            this.y2 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY
        }
    }

    onMouseUp(e) {
        return this.selected;
    }

    drawSelf(ctx) {
        ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
        ctx.fillRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
    }

    drawFocus(ctx) {
        if (!this.selected)
            return;

        let minX = Math.min(this.x1, this.x2);
        let minY = Math.min(this.y1, this.y2);
        let width = Math.abs(this.x2 - this.x1);
        let height = Math.abs(this.y2 - this.y1);

        ctx.strokeStyle = "rgb(200, 200, 255)";
        ctx.lineWidth = 4;
        ctx.strokeRect(minX - 2, minY - 2, width + 4, height + 4);

        ctx.strokeStyle = "rgb(50, 50, 255)";
        ctx.lineWidth = 2;
        ctx.strokeRect(minX, minY, width, height);

        ctx.beginPath();
        ctx.moveTo((this.x1 + this.x2) / 2, minY);
        ctx.lineTo((this.x1 + this.x2) / 2, minY - 40);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc((this.x1 + this.x2) / 2, minY - 40, 7, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(50, 50, 255)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.stroke();

        const pts = [[this.x1, this.y1], [this.x1, this.y2], [this.x2, this.y2], [this.x2, this.y1],
                    [(this.x1 + this.x2) / 2, this.y1], [(this.x1 + this.x2) / 2, this.y2], 
                    [this.x1, (this.y1 + this.y2) / 2], [this.x2, (this.y1 + this.y2) / 2]];

        for (let pt = 0; pt < pts.length; pt++) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillRect(pts[pt][0] - 7, pts[pt][1] - 7, 15, 15);

            ctx.fillStyle = "rgb(50, 50, 255)";
            ctx.fillRect(pts[pt][0] - 5, pts[pt][1] - 5, 11, 11);
        }
    }

    overSelf(x, y) {
        let minX = Math.min(this.x1, this.x2);
        let maxX = Math.max(this.x1, this.x2);
        let minY = Math.min(this.y1, this.y2);
        let maxY = Math.max(this.y1, this.y2);

        return minX <= x && x <= maxX && minY <= y && y <= maxY;
    }

    overSelection(x, y) {
        const pts = [[this.x1, this.y1], [this.x1, this.y2], [this.x2, this.y2], [this.x2, this.y1],
                    [(this.x1 + this.x2) / 2, this.y1], [(this.x1 + this.x2) / 2, this.y2], 
                    [this.x1, (this.y1 + this.y2) / 2], [this.x2, (this.y1 + this.y2) / 2],
                    [(this.x1 + this.x2) / 2, Math.min(this.y1, this.y2) - 40]];

        for (let pt = 0; pt < pts.length; pt++) {
            let dx = Math.abs(pts[pt][0] - x);
            let dy = Math.abs(pts[pt][1] - y);
            if (dx <= 7 && dy <= 7)
                return pt+1;
        }

        return 0;
    }
}

class Image extends Box {
    constructor(parent, src) {
        super(parent);

        if (!src)
            this.src = "effect.png";
        else
            this.src = src;

        this.img = document.createElement("img");
        this.img.src = this.src;
    }

    init(e) {
        let scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width
        let scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height

        this.x1 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX
        this.y1 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY
        this.x2 = this.x1 + this.img.width * scaleX / 5;
        this.y2 = this.y1 + this.img.height * scaleY / 5;

        return false;
    }

    drawSelf(ctx) {
        ctx.drawImage(this.img, this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
    }
}

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
        const toolbar = new FormData(document.querySelector("#toolbox"));
        const tool = Number(toolbar.get("tool"));

        let element;
        switch (tool) {
            case 0: // selector tool
                this.selector(e);
                break;
            case 1: // line tool
                element = new Line(this);
                this.draw_stack.push(element);
                if (element.init(e)) {
                    this.focus = element;
                    document.addEventListener('mousemove', this.onDrag);
                    document.addEventListener('mouseup', this.onMouseUp);
                }
                break;
            case 2: // box tool
                element = new Box(this);
                this.draw_stack.push(element);
                if (element.init(e)) {
                    this.focus = element;
                    document.addEventListener('mousemove', this.onDrag);
                    document.addEventListener('mouseup', this.onMouseUp);
                }
                break;
            case 3: // image tool
                element = new Image(this);
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
}