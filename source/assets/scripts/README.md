### Purpose of Scripts in this Directory

`attribute-menu.js` - Class that handles creating the right side menu for attribute selectors.

`canvas.js` - Class that handles the main card functionality. In a sense the "centerpiece" of the editor page that orchestrates how other parts of it should interact.

`drawable.js` - Interface for different drawable objects in the editor page as well as implementations of it, that being Box, Ellipse, Image, and Textbox, each of which have slightly different functionality. A Drawable object should be able to render itself and react to mouse movements.

`editor-page.js` - The script that initializes the editor page and interacts with localStorage to store user cards.

`homepage.js` - The script that runs the homepage interactivity.

`shadow-dom.js` - An abstraction for the attribute menus to avoid cluttering the code and DOM tree. Each element created by this script initializes a set of listeners and then changes the attached Drawable object when interacted with.

`toolbar.js` - An abstraction for the left side toolbar that the Canvas object interacts with.

`topbar.js` - Initializes functionality for the top bar of the editor page. Very tightly connected to `editor-page.js` but separated into a separate file to keep things clean.

`view_all_card.js` - The script that runs the gallery.