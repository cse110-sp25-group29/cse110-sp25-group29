# date: 25-06-04  
# decision-makers: Joey, Hugo, Jeffrey, Kian
---

# Title  
Use Shadow DOM for Schema Viewer Components

## Context and Problem Statement  

How can we scope our web component styling and encapsulation to avoid CSS conflicts across the Schema Viewer app and ensure reusability across different parts of the app (or future apps)?

## Decision Drivers  

* Style encapsulation  
* Component reusability  
* Minimizing global CSS leakage and maintenance burden  

## Considered Options  

* Use Shadow DOM to encapsulate styling within components  
* Use regular DOM with strict naming conventions and BEM methodology  
* Use CSS Modules or scoped styles without Shadow DOM  

## Decision Outcome  

Chosen option: "Use Shadow DOM for component encapsulation", because this offers native isolation of styles and structure, eliminates global CSS collisions, and makes our components more portable with minimal overhead.

## Pros and Cons of the Options  

### Option 1: Shadow DOM  

* Good, because encapsulates CSS and DOM structure, avoiding styling conflicts  
* Good, because makes components portable and less reliant on parent context  
* Good, because reduces need for custom naming conventions or scoping workarounds  

* Bad, because adds slight learning curve for team members unfamiliar with Shadow DOM  
* Bad, because testing/debugging styles can be slightly more involved due to encapsulation  

### Option 2: Regular DOM + BEM  

* Good, because familiar to most front-end developers  
* Good, because easier to debug without encapsulation  

* Bad, because high chance of global style leakage and naming collisions  
* Bad, because requires rigorous discipline around class naming  

### Option 3: Scoped CSS / CSS Modules  

* Good, because offers partial scoping without Shadow DOM  
* Good, because tooling (e.g. in React) supports it out of the box  

* Bad, because still susceptible to runtime conflicts if components are reused in non-React apps  
* Bad, because doesn’t fully isolate DOM tree, risking style bleed in complex trees