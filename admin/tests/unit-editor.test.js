/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../source/assets/scripts/toolbar.js', () => ({
  Toolbar: jest.fn().mockImplementation(() => ({
    getCurTool: jest.fn(() => 0),
    getToolInfo: jest.fn(() => ({ fontSize: 14, fontStyle: 'Arial', text: 'Example' }))
  }))
}));

jest.unstable_mockModule('../../source/assets/scripts/attribute-menu.js', () => ({
  AttributeMenu: jest.fn().mockImplementation(() => ({
    setObject: jest.fn(),
    clear: jest.fn()
  }))
}));

jest.unstable_mockModule('../../source/assets/scripts/canvas.js', () => ({
  Canvas: jest.fn().mockImplementation((selector, isFront) => ({
    canvas: document.createElement('canvas'),
    active: isFront,
    setActive: jest.fn(),
    exportJSON: jest.fn(() => ({ objects: [] })),
    importJSON: jest.fn(),
    attachToolbar: jest.fn(),
    attachAttributeMenu: jest.fn(),
    renderCanvas: jest.fn()
  }))
}));

jest.unstable_mockModule('../../source/assets/scripts/topbar.js', () => ({
  setName: jest.fn(),
  initListeners: jest.fn()
}));

const editor = await import('../../source/assets/scripts/editor-page.js');

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = `
    <canvas id="front-card"></canvas>
    <canvas id="back-card"></canvas>
    <button id="flip-button"></button>
    <span id="card-title"></span>
    <div id="save-star"></div>
  `;
});

describe('editor-page.js state management', () => {
  it('sets card name and save status correctly', () => {
    editor.setCardName('DemoCard');
    editor.setSaved(false);
    expect(editor.cardName).toBe('DemoCard');
    expect(editor.saved).toBe(false);
  });
});

describe('editor-page.js localStorage logic', () => {
  it('imports and exports cards list as expected', () => {
    localStorage.setItem('cards', JSON.stringify({ X: {} }));
    const imported = editor.importCardsList();
    expect(imported).toHaveProperty('X');
  });

  it('saves cards list to localStorage on exportCardsList()', () => {
    const spy = jest.spyOn(window.localStorage.__proto__, 'setItem'); // or Storage.prototype
    spy.mockImplementation(() => {}); // optional

    editor.exportCardsList();

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });


  it('returns nextUntitled if current_card is not set', () => {
  // Set up localStorage with known cards
    localStorage.removeItem('current_card');
    localStorage.setItem('cards', JSON.stringify({ Untitled: {}, Untitled1: {} }));

    // Force cardsList to be initialized
    editor.reset(); // this sets cardsList internally

    const name = editor.importCurrentCardName(); // now safe
    expect(name).toBe('Untitled2'); // because Untitled and Untitled1 are taken
  });

  it('exports card name to localStorage', () => {
    editor.setCardName('CoolCard');
    editor.exportCurrentCardName();
    expect(localStorage.getItem('current_card')).toBe('CoolCard');
  });
});

describe('editor-page.js UI logic', () => {
  it('initializes DOMContentLoaded logic', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(document.querySelector('#front-card').style.transform).toBe('rotateY(0deg)');
    expect(document.querySelector('#back-card').style.transform).toBe('rotateY(180deg)');
  });

  it('flip button toggles card sides', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const flipBtn = document.getElementById('flip-button');
    flipBtn.click();
    expect(flipBtn.innerHTML.toLowerCase()).toContain('flip');
  });
});
