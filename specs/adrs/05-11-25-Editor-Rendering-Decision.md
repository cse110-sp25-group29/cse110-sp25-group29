# date: 2025-05-11
# decision-makers: Carl, Jeffrey, Joseph


---
# Use HTML Canvases for Editor Screen

## Context and Problem Statement

How do we allow the user to interact with the card editor in a way that is structured and easy to export?


## Decision Drivers

* Easy and intuitive to interact with.
* Allow for flexibility of business card designs.
* Simple enough to implement within four weeks.


## Considered Options

* HTML canvases
* Individual HTML objects for each rendered element


## Decision Outcome

Chosen option: “HTML canvases”, because it allows for the greatest control over what is rendered on the business card and it can be easily exported and saved for sharing.
 
Chosen option: "{title of option 1}", because {justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force {force} | … | comes out best (see below)}.

## Pros and Cons of the Options

### HTML Canvases

* Good, because it allows us for a lot of flexibility since it's pretty much just choosing where to place pixels on a screen

* Good, because they already come with a decent level of functionality (i.e. can write text, print images) + are a fairly common use case for other people, so there's a lot of documentation online

* Good, because it makes it easy to render the cards on the homepage since all we need is a description on the canvas; HTML handles resizing it (coordinates of drawn things are relative to the canvas), so we don't need to think about that

* Good, because it is easy to export (can be saved as a png).

* Bad, because there's a bit of danger in how much control you have, largely in that it can become way too complex if we don't structure and document it well.

* Bad, because we lose out on the accessibility features that using pure HTML objects would allow since the canvas is just a single object (i.e. a screenreader couldn't tell someone what's on the business card)

### Individual HTML objects

* Good, because it allows for easy implementation of text box features, HTML canvases would require custom implementation of text boxes. 

* Good, because it allows for insertion of hyperlinks within the business card.

* Bad, less control over elements within the business card (can’t cut off elements that don’t fit on the card).
