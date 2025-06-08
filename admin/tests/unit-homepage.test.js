/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../source/assets/scripts/editor-page.js', () => ({
  importCardsList: () => ({
    testCard: {
      front: { content: 'mock front' },
      back: { content: 'mock back' }
    }
  }),
}));

jest.unstable_mockModule(
  '../../source/assets/scripts/view_all_card.js',
  () => ({
    renderScaledPreview: jest.fn(),
    renderAllCards:      jest.fn(),
    deleteCard:          jest.fn(),
    downloadCardJSON:    jest.fn(),   // ← new stub
    // If you add more named imports later, drop them here:
    // shareCardImage:   jest.fn(),
    // etc.
  })
);


const {
  yourCardFeature,
  uploadFeature,
  handleFiles,
  searchLocalStorage
} = await import('../../source/assets/scripts/homepage.js');

// Theme tests
describe('theme toggle button', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="theme-toggle">🌙</button>
    `;
    document.body.className = ''; 
    const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      toggleBtn.textContent = document.body.classList.contains('dark-theme') ? '🔆' : '🌙';
    });
  });

  it('toggles to dark-theme and updates icon', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn.click();
    expect(document.body.className).toBe('dark-theme');
    expect(toggleBtn.textContent).toBe('🔆');
  });

  it('toggles back to light-theme and updates icon', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    document.body.className = 'dark-theme';
    toggleBtn.textContent = '🔆';
    toggleBtn.click();
    expect(document.body.className).toBe('');
    expect(toggleBtn.textContent).toBe('🌙');
  });
});

describe('DOMContentLoaded theme toggle', () => {
  beforeEach(() => {
    localStorage.setItem('theme', 'dark');

    /*  homepage.js now expects:
        - #theme-toggle > img
        - #concard  (the title image)
        - #search-input
        - #your-card-button  and  #upload-button                 */
    document.body.innerHTML = `
      <button id="theme-toggle"><img src=""></button>
      <img id="concard" src="">
      <div class="search-bar"><input id="search-input" /></div>
      <button id="your-card-button"></button>
      <button id="upload-button"></button>
      <button id="new-card-button"></button>
    `;
  });

  it('applies dark theme when stored', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.body.classList.contains('dark-theme')).toBe(true);

    // verify icon swap
    const iconSrc = document.querySelector('#theme-toggle img').getAttribute('src');
    expect(iconSrc).toContain('light-mode.svg');
  });
});


// Search bar tests
describe('searchLocalStorage', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="search-bar"></div>
      <input id="search-input" />
    `;
  });

  it('shows matching result when card name matches input', () => {
    localStorage.setItem(
      'cards',
      JSON.stringify({
        MyCard: { front: {}, back: {} },
        AnotherCard: { front: {}, back: {} },
      })
    );

    const input = document.getElementById('search-input');
    input.value = 'my';

    searchLocalStorage(input);

    const link = document.querySelector('#search-results a');
    expect(link).not.toBeNull();
    expect(link.textContent).toContain('Found: MyCard');
  });

  it('shows "no results found" if no match', () => {
    localStorage.setItem(
      'cards',
      JSON.stringify({
        MyCard: { front: {}, back: {} },
        AnotherCard: { front: {}, back: {} },
      })
    );

    // ensure DOM has required elements again
    document.body.innerHTML = `
      <div class="search-bar"></div>
      <input id="search-input" />
    `;

    const input = document.getElementById('search-input');
    input.value = 'xyzdoesnotexist';

    searchLocalStorage(input);

    const results = document.getElementById('search-results');
    expect(results).not.toBeNull();
    expect(results.innerText.toLowerCase()).toContain('no results found');
  });

  it('shows error message if localStorage "cards" key is invalid JSON', () => {
    localStorage.setItem('cards', '{not:"json"}');

    const input = document.getElementById('search-input');
    input.value = 'anything';

    searchLocalStorage(input);

    const results = document.getElementById('search-results');
    expect(results).not.toBeNull();
    expect(results.innerText.toLowerCase()).toMatch(/error parsing cards/i);
  });

  it('shows message if no cards are in localStorage', () => {
    localStorage.removeItem('cards');

    const input = document.getElementById('search-input');
    input.value = 'something';

    searchLocalStorage(input);

    const results = document.getElementById('search-results');
    expect(results).not.toBeNull();
    expect(results.innerText.toLowerCase()).toMatch(/no cards found in localstorage/i);
  });
});
// upload card tests
describe('uploadFeature', () => {
  beforeEach(() => {
    document.body.innerHTML = `<button id="upload-button">Upload</button>`;
    uploadFeature();
  });

  it('should create overlay and dropZone on upload button click', () => {

    document.getElementById('upload-button').click();
    const overlay = document.getElementById('overlay');
    const dropZone = document.getElementById('dropZone');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    expect(overlay).not.toBeNull();
    expect(dropZone).not.toBeNull();
    expect(confirmBtn).not.toBeNull();
    expect(cancelBtn).not.toBeNull();
  });
});


describe('handleFiles happy-path', () => {
  it('alerts after reading & confirming JSON upload', async () => {
    window.confirm = jest.fn(() => true);
    window.alert   = jest.fn();

    /* Mock FileReader so it synchronously invokes onload
       with valid JSON text. */
    class MockReader {
      readAsText() {
        this.result = JSON.stringify({ ok: true });
        if (this.onload) this.onload({ target: this });
      }
    }
    global.FileReader = MockReader;

    const file = new File(['{}'], 'card.json', { type: 'application/json' });
    handleFiles([file]);

    // no need for setTimeout because onload fired immediately
    expect(window.alert).toHaveBeenCalledWith(
      'Card "card" uploaded successfully!'
    );
  });
});


describe('uploadFeature Confirm button state', () => {
  let fakeFile;

  beforeEach(() => {
    document.body.innerHTML = `<button id="upload-button">Upload</button>`;
    uploadFeature();
    fakeFile = new File(['dummy'], 'dummy.png', { type: 'image/png' });
    // open modal
    document.getElementById('upload-button').click();
  });

  it('is disabled at first and enabled after file input change', () => {
    const confirmBtn = document.getElementById('confirmBtn');
    const fileInput  = document.querySelector('#dialogBox input[type=file]');
    expect(confirmBtn.disabled).toBe(true);

    Object.defineProperty(fileInput, 'files', { value: [fakeFile] });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

    expect(confirmBtn.disabled).toBe(false);
  });
});
describe('uploadFeature overlay dismissals', () => {
  beforeEach(() => {
    document.body.innerHTML = `<button id="upload-button">Upload</button>`;
    uploadFeature();
    document.getElementById('upload-button').click();
  });

  it('removes overlay when Cancel is clicked', () => {
    document.getElementById('cancelBtn').click();
    expect(document.getElementById('overlay')).toBeNull();
  });

  it('removes overlay when background is clicked', () => {
    const overlay = document.getElementById('overlay');
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(document.getElementById('overlay')).toBeNull();
  });
});

// Your card features

describe('yourCardFeature', () => {
  beforeEach(() => {
    document.body.innerHTML = `<button id="your-card-button"></button>`;

    // seed a starred card
    localStorage.setItem('star', JSON.stringify({ name: 'testCard' }));
    localStorage.setItem('current_card', 'testCard');

    yourCardFeature();
    document.getElementById('your-card-button').click();
  });

  it('renders popup with front & back canvases', () => {
    expect(document.getElementById('overlay')).not.toBeNull();
    expect(document.getElementById('front-card')).not.toBeNull();
    expect(document.getElementById('back-card')).not.toBeNull();
  });
});
