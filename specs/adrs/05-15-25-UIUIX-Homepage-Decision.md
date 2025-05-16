# date: yy-mm-dd
# decision-makers: Aarav, Sarah, Xiaogeng


---
# Title
Define MVP Core Features and Defer Scan-Card Functionality
## Context and Problem Statement

How can we scope the initial MVP of Concard so that we deliver core value with minimal external dependencies and complexity?

## Decision Drivers

* Simplicity & Speed
* Short Time Frame
* Giving Importance to Core User Flows


## Considered Options

*  Integrate a third-party scanning service (e.g. Camera API) for digitizing cards.
* Exclude scanning entirely for MVP; focus on manual creation, upload of Concard JSON, and basic export.


## Decision Outcome

Chosen option: "Exclude scanning functionality and focus on manual creation and upload of Concard files", because this approach cuts out complex dependencies, accelerates development, and delivers core values without overcomplicating a short project.


## Pros and Cons of the Options

### Option 1

* Good, because would allow users to share cards seamlessly.

* Bad, because Requires integration of Hardware modules, increasing complexity.
* Bad, because this option will likely prolong development.


### Option 2

* Good, because simlifies architecture and reduces external dependencies.
* Good, because Focuses effort on core UI/UX flow: New Card, Upload Concard, Your Card(view, edit, download)
* Good, because faster to implement

* Bad, because Users have to download and share .json or other files, instead of scanning which comes naturally
* Bad, because may be perceived as lacking convenience

