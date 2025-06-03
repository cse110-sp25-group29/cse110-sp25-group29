/**
 * Contains all of the Shadow DOMs we want to make
 * the right column work without bloating to code too much
 */

const consistentStyle =
`form {
  height: 100%;
  position: relative;
}

fieldset {
  width: 85%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%)
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

#attr-font-style {
  width: 80px;
}

#attr-color-picker {
  border-radius: 50%;
  inline-size: 30px;
  block-size: 30px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(153, 153, 153);
}

#attr-hex-color {
  width: 100px;
}

#attr-color-div {
  vertical-align: middle;
}`;

class TextboxElement extends HTMLElement {
  constructor() {
    super();

    const shadowDOM = this.attachShadow({ mode: 'open' });
    const elementRoot = document.createElement('form');
    elementRoot.innerHTML =
        `<h2>Attribute Editor</h2>
        
        <fieldset>
        <h3>Content</h3>
        <input type="text" id="attr-text" name="attr-text" autocomplete="off" />
        
        <hr>

        <h3>Typeface</h3>
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
        <input type="number" id="attr-font-size" name="attr-font-size" class="thin-number" />
        
        <label for="attr-bold"><img src="./icons/bold.png" class="attr-button"/></label>
        <input type="checkbox" id="attr-bold" name="attr-bold" />
        
        <label for="attr-italics"><img src="./icons/italics.png" class="attr-button"/></label>
        <input type="checkbox" id="attr-italics" name="attr-italics" />

        <label for="attr-underline"><img src="./icons/underline.png" class="attr-button"/></label>
        <input type="checkbox" id="attr-underline" name="attr-underline" />
        
        <hr>
        
        <h3>Color</h3>
        <div id="attr-color-div">
        <input type="color" id="attr-color-picker" name="attr-color-picker">
        <input type="text" id="attr-hex-color" name="attr-hex-color" />
        </div>

        <hr>

        <h3>Layer & Position</h3>

        <div id="attr-layer">
          Layer
          <button type="button" id="attr-up-one">Up</button>
          <button type="button" id="attr-down-one">Dwn</button>
          <button type="button" id="attr-up-all">AUp</button>
          <button type="button" id="attr-down-all">ADwn</button>
        </div>

        <label for="attr-x">x: </label>
        <input type="number" id="attr-x" name="attr-x" class="thin-number" />
        <label for="attr-y">y: </label>
        <input type="number" id="attr-y" name="attr-y" class="thin-number" />

        </fieldset>

        <button type="button" id="attr-delete" name="attr-delete">Delete</button>`;

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
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const bold = this.shadowRoot.querySelector('#attr-bold');
    bold.addEventListener('change', () => {
      this.obj.bold = bold.checked;
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const italics = this.shadowRoot.querySelector('#attr-italics');
    italics.addEventListener('change', () => {
      this.obj.italics = italics.checked;
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const underline = this.shadowRoot.querySelector('#attr-underline');
    underline.addEventListener('change', () => {
      this.obj.underline = underline.checked;
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const fontStyle = this.shadowRoot.querySelector('#attr-font-style');
    fontStyle.addEventListener('input', () => {
      this.obj.fontStyle = fontStyle.value;
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const x = this.shadowRoot.querySelector('#attr-x');
    x.addEventListener('input', () => {
      this.obj.x = parseInt(x.value, 10);
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const y = this.shadowRoot.querySelector('#attr-y');
    y.addEventListener('input', () => {
      this.obj.y = parseInt(y.value, 10);
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const color = this.shadowRoot.querySelector('#attr-color-picker');
    const rgb = this.shadowRoot.querySelector('#attr-hex-color');
    color.addEventListener('input', (e) => {
      rgb.value = color.value;
      const rgbVal = hexToRgb(e.target.value);
      this.obj.r = rgbVal[0];
      this.obj.g = rgbVal[1];
      this.obj.b = rgbVal[2];
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    rgb.addEventListener('input', () => {
      color.value = rgb.value;
      const rgbVal = hexToRgb(rgb.value);
      this.obj.r = rgbVal[0];
      this.obj.g = rgbVal[1];
      this.obj.b = rgbVal[2];
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const up = this.shadowRoot.querySelector('#attr-up-one');
    up.addEventListener('click', () => { this.obj.parent.triggerUpKey(true, false); });

    const down = this.shadowRoot.querySelector('#attr-down-one');
    down.addEventListener('click', () => { this.obj.parent.triggerDownKey(true, false); });

    const upAll = this.shadowRoot.querySelector('#attr-up-all');
    upAll.addEventListener('click', () => { this.obj.parent.triggerUpKey(true, true); });

    const downAll = this.shadowRoot.querySelector('#attr-down-all');
    downAll.addEventListener('click', () => { this.obj.parent.triggerDownKey(true, true); });

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
    const underline = this.shadowRoot.querySelector('#attr-underline');
    bold.checked = this.obj.bold;
    italics.checked = this.obj.italics;
    underline.checked = this.obj.underline;

    const fontStyle = this.shadowRoot.querySelector('#attr-font-style');
    fontStyle.value = this.obj.fontStyle;

    const x = this.shadowRoot.querySelector('#attr-x');
    const y = this.shadowRoot.querySelector('#attr-y');
    x.value = Math.round(this.obj.x);
    y.value = Math.round(this.obj.y);

    const rgb = this.shadowRoot.querySelector('#attr-hex-color');
    rgb.value = rgbToHex(this.obj.r, this.obj.g, this.obj.b);

    const color = this.shadowRoot.querySelector('#attr-color-picker');
    color.value = rgb.value;
  }
}

class BoxElement extends HTMLElement {
  constructor() {
    super();

    const shadowDOM = this.attachShadow({ mode: 'open' });
    const elementRoot = document.createElement('form');
    elementRoot.innerHTML =
        `<h2>Attribute Editor</h2>
        
        <fieldset>
        
        <h3>Dimensions</h3>

        <label for="attr-width">width: </label>
        <input type="number" id="attr-width" name="attr-width" class="thin-number" />
        <label for="attr-height">height: </label>
        <input type="number" id="attr-height" name="attr-height" class="thin-number" />

        <hr>

        <h3>Color</h3>
        <div id="attr-color-div">
        <input type="color" id="attr-color-picker" name="attr-color-picker">
        <input type="text" id="attr-hex-color" name="attr-hex-color" />
        </div>

        <hr>

        <h3>Layer & Position</h3>

        <div id="attr-layer">
          Layer
          <button type="button" id="attr-up-one">Up</button>
          <button type="button" id="attr-down-one">Dwn</button>
          <button type="button" id="attr-up-all">AUp</button>
          <button type="button" id="attr-down-all">ADwn</button>
        </div>

        <label for="attr-x">x: </label>
        <input type="number" id="attr-x" name="attr-x" class="thin-number" />
        <label for="attr-y">y: </label>
        <input type="number" id="attr-y" name="attr-y" class="thin-number" />

        </fieldset>
        
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
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    width.addEventListener('input', () => {
      this.obj.x1 = parseInt(x.value, 10);
      this.obj.x2 = parseInt(x.value, 10) + parseInt(width.value, 10);
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const y = this.shadowRoot.querySelector('#attr-y');
    const height = this.shadowRoot.querySelector('#attr-height');
    y.addEventListener('input', () => {
      this.obj.y1 = parseInt(y.value, 10);
      this.obj.y2 = parseInt(y.value, 10) + parseInt(height.value, 10);
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    height.addEventListener('input', () => {
      this.obj.y1 = parseInt(y.value, 10);
      this.obj.y2 = parseInt(y.value, 10) + parseInt(height.value, 10);
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const color = this.shadowRoot.querySelector('#attr-color-picker');
    const rgb = this.shadowRoot.querySelector('#attr-hex-color');
    color.addEventListener('input', (e) => {
      rgb.value = color.value;
      const rgbVal = hexToRgb(e.target.value);
      this.obj.r = rgbVal[0];
      this.obj.g = rgbVal[1];
      this.obj.b = rgbVal[2];
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    rgb.addEventListener('input', () => {
      color.value = rgb.value;
      const rgbVal = hexToRgb(rgb.value);
      this.obj.r = rgbVal[0];
      this.obj.g = rgbVal[1];
      this.obj.b = rgbVal[2];
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const up = this.shadowRoot.querySelector('#attr-up-one');
    up.addEventListener('click', () => { this.obj.parent.triggerUpKey(true, false); });

    const down = this.shadowRoot.querySelector('#attr-down-one');
    down.addEventListener('click', () => { this.obj.parent.triggerDownKey(true, false); });

    const upAll = this.shadowRoot.querySelector('#attr-up-all');
    upAll.addEventListener('click', () => { this.obj.parent.triggerUpKey(true, true); });

    const downAll = this.shadowRoot.querySelector('#attr-down-all');
    downAll.addEventListener('click', () => { this.obj.parent.triggerDownKey(true, true); });

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

    const rgb = this.shadowRoot.querySelector('#attr-hex-color');
    rgb.value = rgbToHex(this.obj.r, this.obj.g, this.obj.b);

    const color = this.shadowRoot.querySelector('#attr-color-picker');
    color.value = rgb.value;
  }
}

class ImageElement extends HTMLElement {
  constructor() {
    super();

    const shadowDOM = this.attachShadow({ mode: 'open' });
    const elementRoot = document.createElement('form');

    elementRoot.innerHTML =
        `<h2>Attribute Editor</h2>
        
        <fieldset>
        
        <h3>Dimensions</h3>

        <label for="attr-width">width: </label>
        <input type="number" id="attr-width" name="attr-width" class="thin-number" />
        <label for="attr-height">height: </label>
        <input type="number" id="attr-height" name="attr-height" class="thin-number" />

        <hr>

        <h3>Layer & Position</h3>

        <div id="attr-layer">
          Layer
          <button type="button" id="attr-up-one">Up</button>
          <button type="button" id="attr-down-one">Dwn</button>
          <button type="button" id="attr-up-all">AUp</button>
          <button type="button" id="attr-down-all">ADwn</button>
        </div>

        <label for="attr-x">x: </label>
        <input type="number" id="attr-x" name="attr-x" class="thin-number" />
        <label for="attr-y">y: </label>
        <input type="number" id="attr-y" name="attr-y" class="thin-number" />

        </fieldset>

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
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    width.addEventListener('input', () => {
      this.obj.x1 = parseInt(x.value, 10);
      this.obj.x2 = parseInt(x.value, 10) + parseInt(width.value, 10);
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const y = this.shadowRoot.querySelector('#attr-y');
    const height = this.shadowRoot.querySelector('#attr-height');
    y.addEventListener('input', () => {
      this.obj.y1 = parseInt(y.value, 10);
      this.obj.y2 = parseInt(y.value, 10) + parseInt(height.value, 10);
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    height.addEventListener('input', () => {
      this.obj.y1 = parseInt(y.value, 10);
      this.obj.y2 = parseInt(y.value, 10) + parseInt(height.value, 10);
      this.obj.parent.onAnyChange();
      this.obj.parent.renderCanvas();
    });

    const up = this.shadowRoot.querySelector('#attr-up-one');
    up.addEventListener('click', () => { this.obj.parent.triggerUpKey(true, false); });

    const down = this.shadowRoot.querySelector('#attr-down-one');
    down.addEventListener('click', () => { this.obj.parent.triggerDownKey(true, false); });

    const upAll = this.shadowRoot.querySelector('#attr-up-all');
    upAll.addEventListener('click', () => { this.obj.parent.triggerUpKey(true, true); });

    const downAll = this.shadowRoot.querySelector('#attr-down-all');
    downAll.addEventListener('click', () => { this.obj.parent.triggerDownKey(true, true); });

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
  try {
    const rgb = parseInt(hex.substring(1), 16);
    const r = rgb >> 16;
    const g = (rgb >> 8) % 256;
    const b = rgb % 256;
    return [r, g, b];
  } catch (e) {
    return [0, 0, 0];
  }
}

customElements.define('textbox-attributes', TextboxElement);
customElements.define('box-attributes', BoxElement);
customElements.define('icon-attributes', ImageElement);
