# date: 25-05-14
# decision-makers: Sarah, Hugo


---
# Editor Page MVP Toolset

## Context and Problem Statement

How can we give the users enough customization in our editor without overexerting our dev team? i.e., how big of a toolset should our editor have?

## Decision Drivers

* Provide users with enough freedom to customize their cards
* Develop our editor toolset within the scope of the course
* Create a satisfying user experience through our user interface


## Considered Options

* Minimized toolset
  - img: 5 presets + social media presets
  - shape: rectangle, circle
  - text: heading, subheading, body
    - default: arial; 10 preset fonts
    - coloring	
  - right menu "attribute selector": font size, font, color, formatting, position, delete
  - flip card button for editor view, flip ON card in home page view
  - top bar "file management": return to menu, save, reset canvas, import/export
* Expanded toolset
  - img: 5 presets + social media presets, upload custom image (via local storage)
    - shape: rectangle, circle
    - text: heading, subheading, body, business card fields (preloaded through some kind of form)
      - default: arial; 10 preset fonts
      - coloring
      - working hyperlinks	
    - right menu "attribute selector": font size, font, color, formatting, position, delete
  - flip card button for editor view, flip ON card in home page view
  - undo button
  - top bar "file management": return to menu, save, reset canvas, import/export, open other cards

## Decision Outcome

Chosen option: "Minimized toolset", because many of the additional features/tools in the expanded toolset are much harder to implement within the scope of the course. Additionally, the minimized toolset is enough customization for a minimum viable product.

## Pros and Cons of the Options

### Option 1

* Good, because easier to develop within the scope of the course.

* Bad, because limits the options that the users have.


### Option 2

* Good, because users will have greater freedom with their customizations.

* Bad, because may take too long for development and lead to a lower quality end product by the end of the course.


