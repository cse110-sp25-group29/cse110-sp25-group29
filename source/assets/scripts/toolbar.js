/**
 * Wrapper class around the left column on the editor page.
 * Used to get and set what the currently selected tool is, as well
 * as give Drawable info some pointers on how to initialize themselves.
 */
export class Toolbar {
  /**
   * Gives an enumeration for Canvas object to choose what to do
   * on a click event.
   *
   * @returns {Number} An enumeration for the currently selected tool.
   */
  getCurTool() {
    const toolbar = new FormData(document.querySelector('#toolbox'));
    this.val = Number(toolbar.get('tool'));
    switch (this.val) {
      case 0: return 0;
      case 1:
      case 2:
      case 3:
      case 4:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15: return 4;
      case 5:
      case 6:
      case 7: return 5;
      case 8: return 2;
      case 9: return 3;
    }
  }

  /**
   * Gives a dictionary of values for Drawable objects
   * to initialize themselves with
   *
   * @returns {Map<string, Object>} Mapping of values to follow
   */
  getToolInfo() {
    switch (this.val) {
      case 0: return {};
      case 1: return { src: './icons/facebook.png', width: 80, height: 80 };
      case 2: return { src: './icons/instagram.webp', width: 80, height: 80 };
      case 3: return { src: './icons/linkedin.png', width: 80, height: 80 };
      case 4: return { src: './icons/gmail.webp', width: 80, height: 80 };
      case 5: return { text: 'Heading', fontStyle: 'Arial', fontSize: 80 };
      case 6: return { text: 'Subheading', fontStyle: 'Arial', fontSize: 50 };
      case 7: return { text: 'Body', fontStyle: 'Arial', fontSize: 30 };
      case 8: return {};
      case 9: return {};
      case 10: return { src: './icons/youtube.webp', width: 80, height: 80 };
      case 11: return { src: './icons/tiktok.png', width: 80, height: 80 };
      case 12: return { src: './icons/tumblr.png', width: 80, height: 80 };
      case 13: return { src: './icons/x.png', width: 80, height: 80 };
      case 14: return { src: './icons/globe.svg', width: 80, height: 80 };
      case 15: return { src: './icons/phone.svg', width: 80, height: 80 };
      default: {
        return {};
      }
    }
  }

  /**
   * Sets the currently selected tool
   *
   * @param {Number} tool The tool to select
   */
  setTool(tool) {
    switch (tool) {
      case 0: document.getElementById('select').checked = true; break;
      case 1: document.getElementById('facebook').checked = true; break;
      case 2: document.getElementById('instagram').checked = true; break;
      case 3: document.getElementById('linkedin').checked = true; break;
      case 4: document.getElementById('mail').checked = true; break;
      case 5: document.getElementById('heading').checked = true; break;
      case 6: document.getElementById('subheading').checked = true; break;
      case 7: document.getElementById('body').checked = true; break;
      case 8: document.getElementById('square').checked = true; break;
      case 9: document.getElementById('circle').checked = true; break;
      case 10: document.getElementById('youtube').checked = true; break;
      case 11: document.getElementById('tiktok').checked = true; break;
      case 12: document.getElementById('tumblr').checked = true; break;
      case 13: document.getElementById('x').checked = true; break;
      case 14: document.getElementById('website').checked = true; break;
      case 15: document.getElementById('phone').checked = true; break;
      default: break;
    }
  }
}
