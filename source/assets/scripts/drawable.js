export class Drawable {
  constructor() { this.selected = false; }

  init() {}
  onMouseDown() { return false; }
  onDrag() {}
  onMouseUp() {}
  drawSelf(ctx) {}
  drawFocus() {}
  overSelf(x, y) { return false; }
  overSelection(x, y) { return false; }

  moveX(dx) {}
  moveY(dy) {}
}

/* 
 * Has been deprecated
 * Keeping around in case we want to add a line tool
**/
export class Line extends Drawable {
  constructor(parent) {
    super();

    this.parent = parent;
    this.canvas = this.parent.canvas;

        this.r = 255;
        this.g = 0;
        this.b = 0;
    }

  init(e) {
    const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height;

    this.x1 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX;
    this.y1 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY;
    this.x2 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX;
    this.y2 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY;

    return true;
  }

  onMouseDown(e) {
    return false;
  }

  onDrag(e) {
    const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height;

    this.x2 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX;
    this.y2 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY;
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

  }
}

export class Box extends Drawable {
  constructor(parent) {
    super();

    this.parent = parent;
    this.canvas = this.parent.canvas;

        this.r = 255;
        this.g = 0;
        this.b = 0;
    }

  init(e) {
    const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height;

    this.startMouseX = e.clientX;
    this.startMouseY = e.clientY;

    this.x1 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX;
    this.y1 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY;
    this.x2 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX;
    this.y2 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY;

    this.startX1 = this.x1;
    this.startY1 = this.y1;
    this.startX2 = this.x2;
    this.startY2 = this.y2;

    this.selectionID = 3; // bottom right corner

    return true;
  }

  onMouseDown(e) {
    this.selected = true;

    this.startMouseX = e.clientX;
    this.startMouseY = e.clientY;

    this.startX1 = this.x1;
    this.startY1 = this.y1;
    this.startX2 = this.x2;
    this.startY2 = this.y2;

    const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height;

    this.selectionID = this.overSelection(
      (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX,
      (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY
    );

    return true;
  }

  onDrag(e) {
    const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height;

    let xi = 0; let yi = 0;

    switch (this.selectionID) {
      case 0: xi = 3; yi = 3; break;
      case 1: xi = 1; yi = 1; break;
      case 2: xi = 1; yi = 2; break;
      case 3: xi = 2; yi = 2; break; // bottom right
      case 4: xi = 2; yi = 1; break;
      case 5: xi = 0; yi = 1; break;
      case 6: xi = 0; yi = 2; break;
      case 7: xi = 1; yi = 0; break;
      case 8: xi = 2; yi = 0; break;
      case 9: break; // rotate, TBD
    }

    const mouseX = (e.clientX - this.startMouseX) * scaleX;
    const mouseY = (e.clientY - this.startMouseY) * scaleY;

    if (xi % 2 === 1) { this.x1 = this.startX1 + mouseX; }
    if (yi % 2 === 1) { this.y1 = this.startY1 + mouseY; }

    if (xi / 2 >= 1) { this.x2 = this.startX2 + mouseX; }
    if (yi / 2 >= 1) { this.y2 = this.startY2 + mouseY; }

    // for snapping to aspect ratio
    if (this.parent.shiftHeld && xi % 3 !== 0 && yi % 3 !== 0) {
      if (Math.abs(this.x1 - this.x2) >= Math.abs(this.y1 - this.y2)) {
        const dx = Math.abs(this.x1 - this.x2);

        if (yi % 2 === 1) {
          this.y1 = this.startY2 + dx *
                        (this.startY2 > (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY ? -1 : 1);
        } else {
          this.y2 = this.startY1 + dx *
                        (this.startY1 > (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY ? -1 : 1);
        }
      } else {
        const dy = Math.abs(this.y1 - this.y2);

        if (xi % 2 === 1) {
          this.x1 = this.startX2 + dy *
                        (this.startX2 > (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX ? -1 : 1);
        } else {
          this.x2 = this.startX1 + dy *
                        (this.startX1 > (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX ? -1 : 1);
        }
      }
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
    if (!this.selected) { return; }

    const minX = Math.min(this.x1, this.x2);
    const minY = Math.min(this.y1, this.y2);
    const width = Math.abs(this.x2 - this.x1);
    const height = Math.abs(this.y2 - this.y1);

    ctx.strokeStyle = 'rgb(200, 200, 255)';
    ctx.lineWidth = 4;
    ctx.strokeRect(minX - 2, minY - 2, width + 4, height + 4);

    ctx.strokeStyle = 'rgb(50, 50, 255)';
    ctx.lineWidth = 2;
    ctx.strokeRect(minX, minY, width, height);

    ctx.beginPath();
    ctx.moveTo((this.x1 + this.x2) / 2, minY);
    ctx.lineTo((this.x1 + this.x2) / 2, minY - 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc((this.x1 + this.x2) / 2, minY - 40, 7, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgb(50, 50, 255)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    ctx.stroke();

    const pts = [[this.x1, this.y1], [this.x1, this.y2], [this.x2, this.y2], [this.x2, this.y1],
      [(this.x1 + this.x2) / 2, this.y1], [(this.x1 + this.x2) / 2, this.y2],
      [this.x1, (this.y1 + this.y2) / 2], [this.x2, (this.y1 + this.y2) / 2]];

    for (let pt = 0; pt < pts.length; pt++) {
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(pts[pt][0] - 7, pts[pt][1] - 7, 15, 15);

      ctx.fillStyle = 'rgb(50, 50, 255)';
      ctx.fillRect(pts[pt][0] - 5, pts[pt][1] - 5, 11, 11);
    }
  }

  overSelf(x, y) {
    const minX = Math.min(this.x1, this.x2);
    const maxX = Math.max(this.x1, this.x2);
    const minY = Math.min(this.y1, this.y2);
    const maxY = Math.max(this.y1, this.y2);

    return minX <= x && x <= maxX && minY <= y && y <= maxY;
  }

  overSelection(x, y) {
    const pts = [[this.x1, this.y1], [this.x1, this.y2], [this.x2, this.y2], [this.x2, this.y1],
      [(this.x1 + this.x2) / 2, this.y1], [(this.x1 + this.x2) / 2, this.y2],
      [this.x1, (this.y1 + this.y2) / 2], [this.x2, (this.y1 + this.y2) / 2],
      [(this.x1 + this.x2) / 2, Math.min(this.y1, this.y2) - 40]];

    for (let pt = 0; pt < pts.length; pt++) {
      const dx = Math.abs(pts[pt][0] - x);
      const dy = Math.abs(pts[pt][1] - y);
      if (dx <= 7 && dy <= 7) { return pt + 1; }
    }

    return 0;
  }

  moveX(dx) {
    this.x1 += dx;
    this.x2 += dx;
  }

  moveY(dy) {
    this.y1 += dy;
    this.y2 += dy;
  }
}

export class Image extends Box {
  constructor(parent, src) {
    super(parent);

    if (src) { this.src = src; } else {
      this.src = this.parent.toolbar.getToolInfo().src;
    }

    this.img = document.createElement('img');
    this.img.src = this.src;
  }

  init(e) {
    const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height;

    this.x1 = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX;
    this.y1 = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY;

    const startupInfo = this.parent.toolbar.getToolInfo();
    this.x2 = this.x1 + startupInfo.width;
    this.y2 = this.y1 + startupInfo.height;

    return false;
  }

  drawSelf(ctx) {
    ctx.drawImage(this.img, this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
  }
}

export class Textbox extends Drawable {
  constructor(parent) {
    super(parent);

    this.parent = parent;
    this.canvas = this.parent.canvas;

        this.r = 0;
        this.g = 0;
        this.b = 0;

        const startupInfo = this.parent.toolbar.getToolInfo();
        this.text = startupInfo["text"];
        this.fontSize = startupInfo["fontSize"];
        this.fontStyle = startupInfo["fontStyle"];

        this.bold = false;
        this.italics = false;
    }

  init(e) {
    const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height;

    this.x = (e.clientX - this.canvas.getBoundingClientRect().x) * scaleX;
    this.y = (e.clientY - this.canvas.getBoundingClientRect().y) * scaleY;

    return false;
  }

  onMouseDown(e) {
    this.selected = true;

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    return true;
  }

  onDrag(e) {
    const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
    const scaleY = this.canvas.height / this.canvas.getBoundingClientRect().height;

    this.x += (e.clientX - this.lastX) * scaleX;
    this.y += (e.clientY - this.lastY) * scaleY;

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  onMouseUp(e) {
    return this.selected;
  }

  overSelf(x, y) { // probably needs improvement
    return this.x <= x && x <= this.x + this.canvas.getContext('2d').measureText(this.text).width && this.y <= y + this.fontSize && y <= this.y;
  }


    drawSelf(ctx) {
        ctx.font = `${this.bold ? " bold" : ""} ${this.italics ? " italic" : ""} ${this.fontSize}px ${this.fontStyle}`;
        ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;

        ctx.fillText(this.text, this.x, this.y);
    }

  drawFocus(ctx) {
    if (!this.selected) { return; }


    ctx.font = `${this.bold ? " bold" : ""} ${this.italics ? " italic" : ""} ${this.fontSize}px ${this.fontStyle}`;
    ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;

    const text = ctx.measureText(this.text);

    const minX = this.x;
    const width = text.width;
    const height = this.fontSize;
    const minY = this.y - height;

    ctx.strokeStyle = 'rgb(200, 200, 255)';
    ctx.lineWidth = 4;
    ctx.strokeRect(minX - 7, minY + 3, width + 14, height + 4);

    ctx.strokeStyle = 'rgb(50, 50, 255)';
    ctx.lineWidth = 2;
    ctx.strokeRect(minX - 5, minY + 5, width + 10, height);
  }

  moveX(dx) {
    this.x += dx;
  }

  moveY(dy) {
    this.y += dy;
  }
}

export class Ellipse extends Box {
    constructor(parent) {
        super(parent);

        this.parent = parent;
        this.canvas = this.parent.canvas;

        this.r = 255;
        this.g = 0;
        this.b = 0;
    }

    drawSelf(ctx) {
        ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;

        ctx.beginPath();
        ctx.ellipse((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2, 
            Math.abs(this.x2 - this.x1) / 2, Math.abs(this.y2 - this.y1) / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawFocus(ctx) { // almost the same as for box but different border
        if (!this.selected)
            return;

        let minX = Math.min(this.x1, this.x2);
        let minY = Math.min(this.y1, this.y2);
        let width = Math.abs(this.x2 - this.x1);
        let height = Math.abs(this.y2 - this.y1);

        ctx.strokeStyle = "rgb(200, 200, 255)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2, 
            (Math.abs(this.x2 - this.x1) + 2) / 2, (Math.abs(this.y2 - this.y1) + 2) / 2, 
            0, 0, 2 * Math.PI);
        ctx.stroke();

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
        let centerX = (this.x1 + this.x2) / 2;
        let centerY = (this.y1 + this.y2) / 2;
        let rx = Math.abs(this.x2 - this.x1) / 2;
        let ry = Math.abs(this.y2 - this.y1) / 2;

        return ((centerX - x) / rx) ** 2 + ((centerY - y) / ry) ** 2 <= 1;
    }
}

