# Tutorial

## Homepage 

Welcome! This part walks you through the main features of the **home page** of **ConCard**.

---

### 1. Dark/Light Mode Switch

- Find the theme toggle button at the top right of the page.
- Clicking it switches the site between dark mode and light mode.
- Your selected theme is saved locally, so it stays the same the next time you visit.

---

### 2. Search for Cards

- Use the search bar to find cards by keyword.
- A dropdown list will show all cards that contain the keyword.
- Clicking on a result takes you directly to the corresponding card in the editor.

---

### 3. Create a New Card

- Click the "New Card" button.
- You will be directed to the editor page to create a new card from scratch.

---

### 4. Upload a Card

- Click the "Upload" button to open an upload dialog with an overlay.
- You can either:
  - Select a file from your computer.
  - Drag and drop a file into the dialog area.
- Only valid JSON files are accepted.
- The "Confirm" button remains disabled until a valid file is selected or dropped.
- To close the dialog:
  - Click the "Cancel" button, or
  - Click on the overlay background.

---

### 5. Gallery

- Click the "Gallery" / "View All Cards" button to go to the gallery page.
- You can browse and view all saved cards from this page.

---

### 6. Your Card

- Click the "Your Card" button to view your selected (starred) card.

- If no card is starred:

  - A prompt appears asking you to visit the gallery and select one.
  - All buttons except the "Close" button are disabled.

- If a starred card exists:

  - The starred card will be set as the current card and displayed.
  - You can flip the card, and the following buttons become active:
    - Edit
    - Delete
    - Download
  - Clicking "Delete" opens a confirmation dialog.
    - If confirmed, the page reloads and clears the current card.


## Gallery Page

The Gallery Page is where we display all the cards saved by the user.  
It provides interactive tools for navigating, editing, and managing these cards.
### Topbar

The topbar on the Gallery Page provides quick access to core navigation and card management features. Here's a breakdown of each component:

- **Back Button** 
  
  Clicking this button will return the user to the homepage.
  
- **Home Button** 
  
  Another way to return to the homepage by clicking the home icon.
  
- **New Card** 
  
  Clicking this button opens the editor page with a blank new card, allowing users to create content from scratch.
  
- **Upload** 
  
  Opens a file selection dialog where users can either choose a file or drag and drop it into the designated area. Once a file is selected, users must confirm to complete the upload process.
  
- **Search Bar** 
  As the user types into the search input, a list of matching card titles will appear in real time. 
  Pressing Enter or clicking the Search button will confirm the search and render only the matching cards in the gallery.



### Cards

Each card in the gallery has interactive features to support editing, organization, and previewing.

- **Starred Card** 
  Only one card can be starred at any given time. The starred card is always displayed at the beginning of the gallery.

- **Hover Actions** 
  When hovering over a card, four buttons will appear:
  
  - **Edit Button** 
    Opens the editor page with the current card loaded for editing.
  
  - **Star Button** 
    - Only one card can be starred. 
    - If a card is already starred, attempting to star a different card will trigger an alert. 
    - If no card is currently starred, clicking this will star the card and move it to the front. 
    - If the card is already starred (highlighted in yellow), clicking the button again will unstar it.

  - **Download Button** 
    Downloads the current card as a `.json` file to the user's local.

  - **Delete Button** 
    Clicking this button will prompt a confirmation dialog: *"Are you sure to delete this card?"* 
    The user can choose **Cancel** to abort or **Confirm** to proceed. 
    If confirmed, the card will be removed from local storage.

- **Card Click Behavior** 
  Clicking anywhere on the card (outside the hover buttons) opens a preview page.

### Preview

- **Left-Side Buttons** 
  The four buttons on the left (Edit, Star, Download, Delete) function identically to those shown on hover.

- **Main Display Area** 
  Shows an enlarged view of the selected card. Users can navigate between the front and back of the card using left/right arrows.

- **Close Button** 
  Located at the top-right corner. Clicking this button will close the preview and return to the gallery view.