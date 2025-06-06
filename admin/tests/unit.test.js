/**
 * @jest-environment jsdom
 */
import { uploadFeature, handleFiles } from '../../source/assets/scripts/homepage.js';
import { jest } from '@jest/globals';
describe('uploadFeature', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="upload-button">Upload</button>
    `;
    uploadFeature();
  });

  it('should open upload overlay on button click', () => {
    document.getElementById('upload-button').click();
    const overlay = document.getElementById('overlay');
    const dropZone = document.getElementById('dropZone');
    expect(overlay).not.toBeNull();
    expect(dropZone).not.toBeNull();
  });
});

describe('handleFiles', () => {
  it('should alert uploaded file name', () => {
    window.alert = jest.fn();
    const fakeFile = new File(['dummy'], 'test.png', { type: 'image/png' });
    handleFiles([fakeFile]);
    expect(window.alert).toHaveBeenCalledWith('You uploaded: test.png');
  });
});

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