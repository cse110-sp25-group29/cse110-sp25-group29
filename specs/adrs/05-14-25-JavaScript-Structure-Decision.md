# date: 2025-05-14
# decision-makers: Hugo, Joey, Kian

---
# Editor Page JavaScript Structure

## Context and Problem Statement

How can we structure the JavaScript code for the editor page in a way that supports modularity, parallel development, and ease of maintenance?


## Decision Drivers

* Allow for people to work in parallel on different modules
* Should be easily scalable when adding new editing features


## Considered Options

* Object-oriented modules
* Fully Functional Programming


## Decision Outcome

Chosen option: “Object-oriented modules”, because it results in a cleaner and more modular javascript structure. It also provides a clear approach to working in parallel, which would increase the efficiency of the team.
 

## Pros and Cons of the Options

### Object-oriented modules

* Good, because each team member can work on a single module, allowing for parallel progress

* Good, because its very modular and as such easily scalable

* Bad, because JavaScript doesn’t have formal interfaces so we would have to find a way to implement them.


### Fully Functional Programming

* Good, because actions and state changes can be replayed or serialized easily

* Bad, because it reduces maintainability unless functions are managed, documented, and organized carefully

* Bad, because it makes it more difficult for parallel work to be done.

