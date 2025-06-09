# Meeting Notes

Date: 05/31/2025

## Attendees

- Sarah
- Hugo
- Joseph
- Xiaogeng
- Susan
- Aarav

## Topics

- Sprint Review

## What Happened

Sprint Review:
 
- Editor
  - Color picker set up
  - Save on click, save as on hover
  - Delete card confirmation
  - Delete makes a new blank card, deletes previous in local storage
  - To Add: open icon -> new card | gallery
  - Import JSON
  - Save as -> locally on website, export -> computer
  - Card JSON accessible through card key in localStorage

- UI/UX
  - Toolbar set for the most part
    - icon: maybe replace tumblr w GitHub
  - Attribute editors done
    - top / bottom layer
  - Decided with team: Home Page - centered title as final version
  - UX flow charts made for editor page
    - Can we detect unsaved changes: effectively yes
  - Will be finalizing all the designs by next sprint

- DevOps 
  - Added homepage unit and E2E testing
  - Troubles with testing on editor page
    - The way it has been implemented makes it hard for testing, due to the canvas element
  - Communication with home page and editor page team to continously update the pipeline 

- Home Page:
  - Upload functionality: can drag & drop or select file to upload
  - Added cancel button for upload
  - Concern: file limitations
    - PNG can't be edited so will only allow users to upload JSON files
    - Some browsers don't have sufficient file limitation functionality so will implement warning for invalid files - not sure if filetype can actually be validated (vs filename)
  - Gallery page thumbnail preview is doable
  - Your Card button is implemented - just waiting for canvas format & rendering
  - Need to test the preview rendering and know the format for implementing searching
  - What counts as duplicate cards - limit filenames as duplicates

- General:
  - Sizing implemented
  - CI/CD pipeline going well
  - Remember to stay on top of issues
  - Focus on the stuff we have and don't add anymore stuff - test a lot!