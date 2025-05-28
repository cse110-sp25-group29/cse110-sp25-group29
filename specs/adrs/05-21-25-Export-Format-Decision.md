## date: 25-05-21

## decision-makers: Hugo, Joey, Kian, Jeffrey

---
# Export Format ADR

## Context and Problem Statement

How can we allow users to export the contents of the HTML canvas and save to local storage for future reloading.


## Decision Drivers

* Exported business cards should be able to be loaded in the same state they were saved.
* Minimizing the space that saved cards take up in local storage


## Considered Options

* Export as serializable JSON
* Save as JPEG


## Decision Outcome

Chosen option: Export as serializable JSON, because it efficiently preserves full internal structure allowing for easy rendering and editing. 


## Pros and Cons of the Options

### Export as serializable JSON

* Good, because it captures the full internal structure of the canvas (shape types, positions, styles, contents), allowing for complete restoration and future editing

* Bad, because it will be slightly more complicated in requiring implementation and maintenance of serialization schema and logic.


### Save as JPEG

* Good, because it's easy to implement natively with HTML canvases
* Good, because it's easy to display as a thumbnail
* Bad, because does not preserve structure so it will not support future editing


