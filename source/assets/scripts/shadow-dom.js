/**
 * Contains all of the Shadow DOMs we want to make
 * the right column work without bloating to code too much
 */

const consistentStyle =
`form {
  --input-bg: #D9D9D9;
  height: 100%;
  position: relative;
  color: black;
  font-size: 0.8em;
}

fieldset {
  width: 99%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  background-color: #BDBCBC;
}

#attr-delete {
  display: block;
  position: absolute;
  bottom: 2.5em;
  left: 50%;
  transform: translateX(-50%);
  right: auto;

  width: 80%;
  font-size: 1.5em;
  background-color: red;
  border: 0;
  padding: 0.4rem;
  color: white;
  border-radius: 3px;
}

#attr-delete:hover {
  background-color: rgb(227, 0, 0);
}

.attr-button {
  width: 10px;
  height: 10px;
}

#attr-text {
  width: 90%;
  height: 7em;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1em;
  border: none;
  background-color: var(--input-bg);
  padding: 0.4em;
  resize: none;
}

#attr-font-size, #attr-font-style {
  background-color: var(--input-bg);
  border: none;
  padding-left: 0.3em;
  border-radius: 6px;
  margin: 0.2em 0.2em 0.5em 0.2em;
  height: 1.5em;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

#attr-font-style {
  width: 65%;
}

#attr-font-size {
  width: 20%
}

#attr-bold, #attr-italics, #attr-underline {
  accent-color: var(--input-bg);
}

#attr-height {
  margin-right: 0.5em;
}

#attr-width {
  margin-right: 0.5em;
}

.thin-number {
  width: 22%;
  border-radius: 6px;
  border: none;
  background-color: var(--input-bg);
  margin-bottom: 1em;
  height: 1.5em;
}

#attr-color-div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  margin-bottom: 1em;
  margin-top: -0.2em
}
  
#attr-color-picker {
  border-radius: 50%;
  inline-size: 30px;
  block-size: 30px;
  border-width: 1px;
  border-style: solid;
  border: white;
  background-color: var(--input-bg);
}

#attr-hex-color {
  width: 65%;
  height: 1.7em;
  border-radius: 6px;
  border: none;
  background-color: var(--input-bg);
}

#attr-up-one, #attr-up-all, #attr-down-one, #attr-down-all {
  border-radius: 6px;
  background-color: var(--input-bg);
  border: none;
  width: 15%;
  height: 1.5em;
  margin: 0 0.1em 1em;
  padding: 0;
}

#attr-up-one img {
  transform: rotate(90deg);
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

#attr-down-one img {
  transform: rotate(-90deg);
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

#attr-up-all img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

#attr-down-all img {
  transform: rotate(-180deg);
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

#attr-x, #attr-y {
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: var(--input-bg);
  border: none;
  height 1.7em;
  width: 25%;
  padding-left: 0.5em;
}

`;

class TextboxElement extends HTMLElement {
  constructor() {
    super();

    const shadowDOM = this.attachShadow({ mode: 'open' });
    const elementRoot = document.createElement('form');
    elementRoot.innerHTML =
        `<h2>Attribute Editor</h2>
        
        <fieldset>
        <h3>Content</h3>
        <textarea id="attr-text" name="attr-text"></textarea>
        
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
          <button type="button" id="attr-up-one">
             <img src="./icons/arrow_back.png" />
          </button>
          <button type="button" id="attr-down-one">
            <img src="./icons/arrow_back.png" />
          </button>
          <button type="button" id="attr-up-all">
            <img src="./icons/arrow_double.png" />
          </button>
          <button type="button" id="attr-down-all">
            <img src="./icons/arrow_double.png" />
          </button>
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

        <label for="attr-width">w: </label>
        <input type="number" id="attr-width" name="attr-width" class="thin-number" />
        <label for="attr-height">h: </label>
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
          <button type="button" id="attr-up-one">
             <img src="./icons/arrow_back.png" />
          </button>
          <button type="button" id="attr-down-one">
            <img src="./icons/arrow_back.png" />
          </button>
          <button type="button" id="attr-up-all">
            <img src="./icons/arrow_double.png" />
          </button>
          <button type="button" id="attr-down-all">
            <img src="./icons/arrow_double.png" />
          </button>
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

        <label for="attr-width">w: </label>
        <input type="number" id="attr-width" name="attr-width" class="thin-number" />
        <label for="attr-height">h: </label>
        <input type="number" id="attr-height" name="attr-height" class="thin-number" />

        <hr>

        <h3>Layer & Position</h3>

        <div id="attr-layer">
          Layer
          <button type="button" id="attr-up-one">
             <img src="./icons/arrow_back.png" />
          </button>
          <button type="button" id="attr-down-one">
            <img src="./icons/arrow_back.png" />
          </button>
          <button type="button" id="attr-up-all">
            <img src="./icons/arrow_double.png" />
          </button>
          <button type="button" id="attr-down-all">
            <img src="./icons/arrow_double.png" />
          </button>
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
