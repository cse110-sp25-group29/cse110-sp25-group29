/**
 * Contains all of the Shadow DOMs we want to make
 * the right column work without bloating to code too much
 */

const consistentStyle = `form {
  height: 100%;
  position: relative;
}

.thin-number {
  width: 40px;
}

#attr-delete {
  display: block;
  position: absolute;
  bottom: 10px;
  left: min(50px, (20vw - 100px) / 2);
  right: auto;

  color: red;
  background-color: lightcoral;
  width: 100px;
  height: 25px;
  border-color: red;
  border-radius: 3px;
}

.attr-button {
  width: 10px;
  height: 10px;
}

#attr-color-picker {
border-radius: 50%;
inline-size: 30px;
block-size: 30px;
border-width: 1px;
border-style: solid;
border-color: rgb(153, 153, 153);
}`;

class TextboxElement extends HTMLElement {
  constructor() {
    super();

    const shadowDOM = this.attachShadow({ mode: 'open' });
    const elementRoot = document.createElement('form');
    elementRoot.innerHTML =
        `<label for="attr-text">Text: </label>
        <input type="text" id="attr-text" name="attr-text" autocomplete="off" />
        <label for="attr-font-size">Font Size: </label>
        <input type="number" id="attr-font-size" name="attr-font-size" class="thin-number" />
        
        <label for="attr-bold"><img src="./icons/bold.png" class="attr-button"/></label>
        <input type="checkbox" id="attr-bold" name="attr-bold" />
        
        <label for="attr-italics"><img src="./icons/italics.png" class="attr-button"/></label>
        <input type="checkbox" id="attr-italics" name="attr-italics" />
        
        <select id="attr-font-style" name="attr-font-style">
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Futura">Futura</option>
          <option value="Garamond">Garamond</option>
          <option value="Verdana">Verdana</option>
          <option value="Trebuchet">Trebuchet</option>
          <option value="Georgia">Georgia</option>
        </select>
        
        <label for="attr-red">r: </label>
        <input type="number" id="attr-red" name="attr-red" class="thin-number" />
        <label for="attr-green">g: </label>
        <input type="number" id="attr-green" name="attr-green" class="thin-number" />
        <label for="attr-blue">b: </label>
        <input type="number" id="attr-blue" name="attr-blue" class="thin-number" />

        <label for="attr-x">x: </label>
        <input type="number" id="attr-x" name="attr-x" class="thin-number" />
        <label for="attr-y">y: </label>
        <input type="number" id="attr-y" name="attr-y" class="thin-number" />

        <input type="color" id="attr-color-picker" name="attr-color-picker">
        
        <button type="button" id="attr-delete" name="attr-delete">DELETE</button>`;

    const style = document.createElement('style');
    style.innerHTML = consistentStyle;

    shadowDOM.append(elementRoot);
    shadowDOM.append(style);

    this.initListeners();
  }

  initListeners() {
    const text = this.shadowRoot.querySelector('#attr-text');
    text.addEventListener('input', () => {
      this.obj.text = text.value;
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const fontSize = this.shadowRoot.querySelector('#attr-font-size');
    fontSize.addEventListener('input', () => {
      this.obj.fontSize = parseInt(fontSize.value, 10);
      this.obj.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const bold = this.shadowRoot.querySelector('#attr-bold');
    bold.addEventListener('change', () => {
      this.obj.bold = bold.checked;
      this.obj.parent.renderCanvas();
    });

    const italics = this.shadowRoot.querySelector('#attr-italics');
    italics.addEventListener('change', () => {
      this.obj.italics = italics.checked;
      this.obj.parent.renderCanvas();
    });

    const fontStyle = this.shadowRoot.querySelector('#attr-font-style');
    fontStyle.addEventListener('input', () => {
      this.obj.fontStyle = fontStyle.value;
      this.obj.parent.renderCanvas();
    });

    const r = this.shadowRoot.querySelector('#attr-red');
    r.addEventListener('input', () => {
      this.obj.r = parseInt(r.value, 10);
      this.obj.parent.renderCanvas();
    });

    const g = this.shadowRoot.querySelector('#attr-green');
    g.addEventListener('input', () => {
      this.obj.g = parseInt(g.value, 10);
      this.obj.parent.renderCanvas();
    });

    const b = this.shadowRoot.querySelector('#attr-blue');
    b.addEventListener('input', () => {
      this.obj.b = parseInt(b.value, 10);
      this.obj.parent.renderCanvas();
    });

    const x = this.shadowRoot.querySelector('#attr-x');
    x.addEventListener('input', () => {
      this.obj.x = parseInt(x.value, 10);
      this.obj.parent.renderCanvas();
    });

    const y = this.shadowRoot.querySelector('#attr-y');
    y.addEventListener('input', () => {
      this.obj.y = parseInt(y.value, 10);
      this.obj.parent.renderCanvas();
    });

    const color = this.shadowRoot.querySelector('#attr-color-picker');
    color.addEventListener('input', (e) => {
      const rgb = hexToRgb(e.target.value);
      this.obj.r = rgb[0];
      this.obj.g = rgb[1];
      this.obj.b = rgb[2];
      this.obj.parent.renderCanvas();
    });

    const del = this.shadowRoot.querySelector('#attr-delete');
    del.addEventListener('click', () => {
      this.obj.parent.triggerDeleteKey();
    });
  }

  load(obj) {
    this.obj = obj;
    this.update();
  }

  update() {
    const text = this.shadowRoot.querySelector('#attr-text');
    text.value = this.obj.text;

    const fontSize = this.shadowRoot.querySelector('#attr-font-size');
    fontSize.value = this.obj.fontSize;

    const bold = this.shadowRoot.querySelector('#attr-bold');
    const italics = this.shadowRoot.querySelector('#attr-italics');
    bold.value = this.obj.bold;
    italics.checked = this.obj.italics;

    const fontStyle = this.shadowRoot.querySelector('#attr-font-style');
    fontStyle.value = this.obj.fontStyle;

    const r = this.shadowRoot.querySelector('#attr-red');
    const g = this.shadowRoot.querySelector('#attr-green');
    const b = this.shadowRoot.querySelector('#attr-blue');
    r.value = this.obj.r;
    g.value = this.obj.g;
    b.value = this.obj.b;

    const x = this.shadowRoot.querySelector('#attr-x');
    const y = this.shadowRoot.querySelector('#attr-y');
    x.value = Math.round(this.obj.x);
    y.value = Math.round(this.obj.y);

    const color = this.shadowRoot.querySelector('#attr-color-picker');
    color.value = rgbToHex(clampToInt(r.value, 0, 255),
      clampToInt(g.value, 0, 255),
      clampToInt(b.value, 0, 255));
  }
}

class BoxElement extends HTMLElement {
  constructor() {
    super();

    const shadowDOM = this.attachShadow({ mode: 'open' });
    const elementRoot = document.createElement('form');
    elementRoot.innerHTML =
        `<label for="attr-x">x: </label>
        <input type="number" id="attr-x" name="attr-x" class="thin-number" />
        <label for="attr-y">y: </label>
        <input type="number" id="attr-y" name="attr-y" class="thin-number" />

        <label for="attr-width">width: </label>
        <input type="number" id="attr-width" name="attr-width" class="thin-number" />
        <label for="attr-height">height: </label>
        <input type="number" id="attr-height" name="attr-height" class="thin-number" />
        
        <label for="attr-red">r: </label>
        <input type="number" id="attr-red" name="attr-red" class="thin-number" />
        <label for="attr-green">g: </label>
        <input type="number" id="attr-green" name="attr-green" class="thin-number" />
        <label for="attr-blue">b: </label>
        <input type="number" id="attr-blue" name="attr-blue" class="thin-number" />
        
        <button type="button" id="attr-delete" name="attr-delete">DELETE</button>`;

    const style = document.createElement('style');
    style.innerHTML = consistentStyle;

    shadowDOM.append(elementRoot);
    shadowDOM.append(style);

    this.initListeners();
  }

  initListeners() {
    const x = this.shadowRoot.querySelector('#attr-x');
    const width = this.shadowRoot.querySelector('#attr-width');
    x.addEventListener('input', () => {
      this.obj.x1 = parseInt(x.value, 10);
      this.obj.x2 = parseInt(x.value, 10) + parseInt(width.value, 10);
      this.obj.parent.renderCanvas();
    });

    width.addEventListener('input', () => {
      this.obj.x1 = parseInt(x.value, 10);
      this.obj.x2 = parseInt(x.value, 10) + parseInt(width.value, 10);
      this.obj.parent.renderCanvas();
    });

    const y = this.shadowRoot.querySelector('#attr-y');
    const height = this.shadowRoot.querySelector('#attr-height');
    y.addEventListener('input', () => {
      this.obj.y1 = parseInt(y.value, 10);
      this.obj.y2 = parseInt(y.value, 10) + parseInt(height.value, 10);
      this.obj.parent.renderCanvas();
    });

    height.addEventListener('input', () => {
      this.obj.y1 = parseInt(y.value, 10);
      this.obj.y2 = parseInt(y.value, 10) + parseInt(height.value, 10);
      this.obj.parent.renderCanvas();
    });

    const r = this.shadowRoot.querySelector('#attr-red');
    r.addEventListener('input', () => {
      this.obj.r = parseInt(r.value, 10);
      this.obj.parent.renderCanvas();
    });

    const g = this.shadowRoot.querySelector('#attr-green');
    g.addEventListener('input', () => {
      this.obj.g = parseInt(g.value, 10);
      this.obj.parent.renderCanvas();
    });

    const b = this.shadowRoot.querySelector('#attr-blue');
    b.addEventListener('input', () => {
      this.obj.b = parseInt(b.value, 10);
      this.obj.parent.renderCanvas();
    });

    const del = this.shadowRoot.querySelector('#attr-delete');
    del.addEventListener('click', () => {
      this.obj.parent.triggerDeleteKey();
    });
  }

  load(obj) {
    this.obj = obj;
    this.update();
  }

  update() {
    const x = this.shadowRoot.querySelector('#attr-x');
    const y = this.shadowRoot.querySelector('#attr-y');
    x.value = Math.round(Math.min(this.obj.x1, this.obj.x2));
    y.value = Math.round(Math.min(this.obj.y1, this.obj.y2));

    const width = this.shadowRoot.querySelector('#attr-width');
    const height = this.shadowRoot.querySelector('#attr-height');
    width.value = Math.round(Math.abs(this.obj.x2 - this.obj.x1));
    height.value = Math.round(Math.abs(this.obj.y2 - this.obj.y1));

    const r = this.shadowRoot.querySelector('#attr-red');
    const g = this.shadowRoot.querySelector('#attr-green');
    const b = this.shadowRoot.querySelector('#attr-blue');
    r.value = this.obj.r;
    g.value = this.obj.g;
    b.value = this.obj.b;
  }
}

class ImageElement extends HTMLElement {
  constructor() {
    super();

    const shadowDOM = this.attachShadow({ mode: 'open' });
    const elementRoot = document.createElement('form');

    elementRoot.innerHTML =
        `<label for="attr-x">x: </label>
        <input type="number" id="attr-x" name="attr-x" class="thin-number" />
        <label for="attr-y">y: </label>
        <input type="number" id="attr-y" name="attr-y" class="thin-number" />

        <label for="attr-width">width: </label>
        <input type="number" id="attr-width" name="attr-width" class="thin-number" />
        <label for="attr-height">height: </label>
        <input type="number" id="attr-height" name="attr-height" class="thin-number" />

        <select id="attr-icon-image" name="attr-icon-image">
          <option value="./icons/facebook.png">Facebook</option>
          <option value="./icons/instagram.webp">Instagram</option>
          <option value="./icons/linkedin.png">LinkedIn</option>
          <option value="./icons/github.png">GitHub</option>
        </select>

        <button type="button" id="attr-delete" name="attr-delete">DELETE</button>`;

    const style = document.createElement('style');
    style.innerHTML = consistentStyle;

    shadowDOM.append(elementRoot);
    shadowDOM.append(style);

    this.initListeners();
  }

  initListeners() {
    const x = this.shadowRoot.querySelector('#attr-x');
    const width = this.shadowRoot.querySelector('#attr-width');
    x.addEventListener('input', () => {
      this.obj.x1 = parseInt(x.value, 10);
      this.obj.x2 = parseInt(x.value, 10) + parseInt(width.value, 10);
      this.obj.parent.renderCanvas();
    });

    width.addEventListener('input', () => {
      this.obj.x1 = parseInt(x.value, 10);
      this.obj.x2 = parseInt(x.value, 10) + parseInt(width.value, 10);
      this.obj.parent.renderCanvas();
    });

    const y = this.shadowRoot.querySelector('#attr-y');
    const height = this.shadowRoot.querySelector('#attr-height');
    y.addEventListener('input', () => {
      this.obj.y1 = parseInt(y.value, 10);
      this.obj.y2 = parseInt(y.value, 10) + parseInt(height.value, 10);
      this.obj.parent.renderCanvas();
    });

    height.addEventListener('input', () => {
      this.obj.y1 = parseInt(y.value, 10);
      this.obj.y2 = parseInt(y.value, 10) + parseInt(height.value, 10);
      this.obj.parent.renderCanvas();
    });

    const icon = this.shadowRoot.querySelector('#attr-icon-image');
    icon.addEventListener('input', () => {
      this.obj.src = icon.value;
      this.obj.img.src = icon.value;
      this.obj.parent.renderCanvas();
    });

    const del = this.shadowRoot.querySelector('#attr-delete');
    del.addEventListener('click', () => {
      this.obj.parent.triggerDeleteKey();
    });
  }

  load(obj) {
    this.obj = obj;
    this.update();
  }

  update() {
    const x = this.shadowRoot.querySelector('#attr-x');
    const y = this.shadowRoot.querySelector('#attr-y');
    x.value = Math.round(Math.min(this.obj.x1, this.obj.x2));
    y.value = Math.round(Math.min(this.obj.y1, this.obj.y2));

    const width = this.shadowRoot.querySelector('#attr-width');
    const height = this.shadowRoot.querySelector('#attr-height');
    width.value = Math.round(Math.abs(this.obj.x2 - this.obj.x1));
    height.value = Math.round(Math.abs(this.obj.y2 - this.obj.y1));

    const icon = this.shadowRoot.querySelector('#attr-icon-image');
    icon.value = this.obj.src;
  }
}

function clampToInt(value, lo, hi) {
  value = parseInt(value, 10);
  value = Math.min(Math.max(value, lo), hi);
  return value;
}

function rgbToHex(r, g, b) {
  const rgb = (r << 16) | (g << 8) | b;
  const str = rgb.toString(16);
  const fill = '0';
  return `#${fill.repeat(6 - str.length)}${str}`;
}

function hexToRgb(hex) {
  const rgb = parseInt(hex.substring(1), 16);
  const r = rgb >> 16;
  const g = (rgb >> 8) % 256;
  const b = rgb % 256;
  return [r, g, b];
}

customElements.define('textbox-attributes', TextboxElement);
customElements.define('box-attributes', BoxElement);
customElements.define('icon-attributes', ImageElement);
