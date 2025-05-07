---
name: Basic
about: What the template is for
title: "[TAG] Default Title"
labels: 
assignees: ''

---
**Notes for subsequent issue templates:**
- This is a basic issue template that *other* issue templates can build on, so this template content can (and should) be edited as necessary based on the issue template being designed
- To copy this markdown file, pull the main branch on your local machine and create a copy of `basic.md`
- Change the `name` field to the name of the template you are designing and update the other fields as necessary
- `[TAG]` in the title must have a 3-4 letter abbreviation of the issue template (BUG, FIX, ASGN, DOC, FTR, etc)
- there must be *some* default labels
- The status list must be included in every issue template

**Description:** What is the issue about? Be descriptive and specific.

**Subtasks:** List of relevant subtasks (as issue numbers)
- [ ] #x
- [ ] #y

**Status:** Does it pass our definition of done?
- [ ] Pass HTML and CSS validators
- [ ] Pass end-to-end automation
- [ ] Follow the style guides
- [ ] Reviewed by group
- [ ] Checked off by DevOps
- [ ] Specified behaviors are met (*expand on this list per issue*)
  - [ ] Specified behavior 1