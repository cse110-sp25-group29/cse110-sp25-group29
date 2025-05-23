# JavaScript Style Guide
Welcome to the official JavaScript style guide for  **Team Boom Boom Powell**.  

All team members are expected to  **read through each section carefully**  and  **follow the listed guidelines consistently** throughout the project. These conventions ensure our code stays clean, readable, and maintainable.

If you have suggestions for improvements or additions, please don’t hesitate to reach out to the team leads.

> This guide has been adapted from [Google's JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html#introduction) based on our project needs. For a more in-depth overview, please feel free to read through Google's guide as well.
---
## Sections
1. [Setup](#setup)
	- [Tabs, Spaces and Whitespace Rendering](#tabs-spaces-and-whitespace-rendering)
	- [Vertical Ruler](#vertical-ruler)
	- [Linting tool](#linting-tool)
		- To be completed
2. [Basics](#basics)
	- [File Name, Format and Encoding](#file-name-format-and-encoding)
	- [Special Characters](#special-characters)
3. [Formatting](#formatting)
	- [Braces](#braces)
	- [Indentation](#indentation)
	- [Statements](#statements)
	- [Column Limit](#column-limit)
	- [Line-Wrapping](#line-wrapping)
	- [Whitespace](#whitespace)
4. [Language Features](#language-features)
	- [Local Variable Declaration](#local-variable-declaration)
	- [Array Literals](#array-literals)
		- [Array Deconstructing](#array-deconstructing)
	- To be completed
5. [Naming](#naming)
	- [Classes, Interfaces, Enums](#classes-interfaces-enums)
	- [Variables, Parameters, Methods](#variables-parameters-methods)
	- [Constants](#constants)
6. [Documentation](#documentation)
7. [Miscellaneous](#miscellaneous)
8. [Pipeline](#pipeline)
	- To be completed
---
## Setup
### Tabs, Spaces and Whitespace Rendering
1. Open the Command Palette (`cmd + shift + P` on macOs or `ctrl + shift + P` on windows) and type `Preferences: Open Settigs (UI)`.
2. Search for the `Tab Size` option and set it to `2`.
3. Search for the `Render Whitespace` option and select `all` from the dropdown list.
4. Search for the `Insert Spaces` options and make sure it is enabled.
5. Search for the `Detect Indentation` option and make sure it is enabled.

### Vertical ruler
### Linting tool
> The DevOps team is working hard to get this section completed as soon as possible. Sorry for the inconvenience.
---
## Basics
### File Name, Format and Encoding

- File names must all be lowercase and may include underscores ( _ ) or dashes ( - ), but no additional punctuation. 
- All files must have extension `.js`.
- All files are encoded in `UTF-8`.

### Special Characters
#### Whitespaces characters
> **NOTE**: This section contains basic information about whitespaces and indentation. For more information, skip to the [indentation](#indentation) or [whitespace](#whitespace) sub-sections under the [formatting](#formatting) section.

- The ASCII horizontal space character (hitting space bar) is the only whitespace character allowed.
- For formatting strings, use escaped whitespace characters.

```js
// Correct
const message = 'Name:\tJohn\nAge:\t25';

// Incorrect - raw tab and newline character
const badMessage = 'Name:	John
Age:	25';
```

- Tab is `not` used for indentation. Instead, use 2 horizontal space characters.
```js
// Correct
function·addCard(card)·{
··if·(card.name)·{
····wallet.push(card);
··}
}

// Incorrect: Uses tab or incorrect indentation
function·addCard(card)·{
→if·(card.name)·{
····wallet.push(card);
}
}
```
> **NOTE**: In all the code snippets in this guide, ( · ) represents whitespaces, while ( → ) represents a tab. For steps on how to set up your editor correctly, please refer to the [setup](#setup) section.

#### Non-ASCII characters
- For non-ASCII characters, use the actual Unicode character (e.g. `∞`) or Unicode escape (e.g. `\u221e`), depending only on which makes the code easier to read and understand.
```js
// Best: perfectly clear even without a comment. 
const limit =  '∞';
// Allowed: avoid for printable characters
const units =  '\u221e';  // '∞'
```
---
## Formatting
### Braces
- Always use braces for all control structures like `if`, `else`, `for`, etc.), even if the body contains only a single statement.
```js
if·(isValid)·{
··saveCard();
}
```

- For all non-empty blocks, follow the Kernighan and Ritchie style ("Egyptian Brackets"), which requires:
	- No line break before the opening brace.
	- Line break after the opening brace.
	- Line break before the closing brace.
	- Line break after the closing brace  *if*  that brace terminates a statement or the body of a function or class statement, or a class method. Specifically, there is  *no*  line break after the brace if it is followed by  `else`,  `catch`,  `while`, or a comma, semicolon, or right-parenthesis.

```js
function·processCard(card)·{
··if·(card.isValid)·{
····try·{
······validate(card);
····}·catch·(err)·{
······logError(err);
····}
··}·else·{
····reject(card);
··}

··while·(card.needsUpdate())·{
····update(card);
··}

··const·metadata·=·{
····name:·card.name,
····tags:·['valid',·'active'],
··};

··return metadata;
}
```

- Empty code blocks may be closed immediately after it is opened, with no characters, space, or line breaks in between, **unless** it is a part of a _multi-block statement_ (one that directly contains multiple blocks: `if`/`else` or `try`/`catch`/`finally`). 

```js
// Correct
function·doNothing()·{}

// Incorrect
if·(condition)·{
··// Code here
}·else·if·(otherCondition)·{}·else·{
··// Code here
}

// Correct
if·(condition)·{
··// Code here
}·else·if·(otherCondition)·{
··// Intentionally left blank - better to refactor code
}·else·{
··// Code here
}
```
### Indentation
- Use 2 ASCII horizontal space characters for each level of indentation. **Never** use `Tab` for indentation. Every time a new block or scope is opened, increase indentation by 2. 
```js
// Example
function·addCard(card)·{
··if·(card.isValid)·{
····saveToWallet(card);
··}
}
```
- If a function’s arguments don’t fit on one line, wrap them onto the next line and indent **4 spaces** from the original line.
```js
// Example
createCard(
····'Very·Long·Name·That·Won’t·Fit',
····'A·Very·Important·Title'
);
```
- When writing object literals across multiple lines, place each key–value pair on its own line and indent them by **2 spaces** inside the enclosing braces. Start the opening brace on the same line as the assignment, and align the closing brace with the start of the statement. Always include a trailing comma after the last property.
```js
// Example
const·user·=·{
··name:·'John',
··email:·'john@example.com',
};
```
- When chaining method calls across multiple lines, place each call on its own line and indent it by **4 spaces** relative to the line where the chain starts.
```js
// Example
query()
····.filterBy('tag')
····.sortBy('timestamp')
····.limit(10);

```
- Inside a `switch` statement, indent each `case` block by **2 spaces** from the `switch`, and indent the code inside each case by another **2 spaces**. Add a line break after each `case` label and place a `break` at the end of each case block unless explicitly falling through.
```js
// Example
switch·(card.type)·{
··case·'student':
····handleStudentCard();
····break;

··case·'pro':
····handleProCard();
····break;

··default:
····handleUnknown();
}
```

### Statements
Each statement must appear on its own line and be explicitly terminated with a semicolon; relying on automatic semicolon insertion is forbidden.

### Column Limit
>For line-wrapping guidelines, refer to the [line-wrapping](#line-wrapping) section.

JavaScript code has a column limit of 80 characters. Any line that would exceed this limit must be line-wrapped.

> For steps on how to set up a visual vertical ruler in your VS Code environment, please refer to the [vertical ruler](#vertical-ruler) section.

### Line-Wrapping
- Long lines that exceed the 80 character column limit should be wrapped.
- When wrapping, break at logical boundaries such as after an assignment or operator, rather than within nested sub-expressions. When breaking a line at an operator, place the operator at the end of the current line—not the beginning of the next.
```js
// Correct
function·currentEstimate·=
····calc(currentEstimate·+·x·*·currentEstimate)·/·2.0;

// Incorrect
function·currentEstimate·=·calc(currentEstimate·+·x·*
····currentEstimate)·/·2.0;
```
- Each wrapped line should be indented at least 4 spaces more than the original line, keeping the logical structure clear.
```js
// Example
const·card·=·createCard(
····'John·Doe',
····'Software·Engineer'
);
```
- When calling a method or constructor, never place the opening parenthesis on a new line.
```js
// Correct
const·id·=·getCardById(
····cardList,
····targetId
);

// Incorrect
const·id·=·getCardById
(····cardList,·targetId);
```
- Breaking a `return` statement before the value changes program behavior. Always keep them on the same line.
```js
// Correct
return·computeScore(user);

// Incorrect
return
····computeScore(user);
```
### Whitespace
- Use a single blank line between methods in classes or objects, and sparingly within functions to separate logical sections. Avoid blank lines at the start or end of a function body.
```js
// Example
class·Wallet·{
··add(card)·{
····this.cards.push(card);
··}

··clear()·{
····this.cards·=·[];
··}
}
```
- Use single spaces where appropriate: after keywords like `if` or `for`, around binary operators such as `+`, `-`, `=`, after commas and colons in object literals, and after `//` in comments. Avoid spaces before commas, semicolons, equal signs, or parentheses.
```js
// Correct
if·(isValid)·{
··const·card·=·{·name:·'Arnav',·email:·'a@b.com'·};
··console.log(card);·//·Log·card
}

// Incorrect
if(isValid){
··const·card={name:'Arnav',email :'a@b.com'};
··console.log(card);//Log card
}
```
---
## Language Features
### Local Variable Declaration
- All local variables must be declared using `const` or `let`. Use `const` by default to indicate that the binding won’t change, and switch to `let` only when reassignment is required. 
- **Do not use `var` under any circumstances**
- Declare one variable per statement. Do not combine multiple declarations on the same line.
- Declare variables as close as possible to where they are first used, and initialize them immediately. Avoid hoisting variables unnecessarily to the top of a block.
```js
// Correct
function·processCard(card)·{
··if·(card.isValid)·{
····const·timestamp·=·Date.now();
····wallet.push({...card,·timestamp});
··}

··const·count·=·wallet.length;
}

// Incorrect
function·processCard(card)·{
··var·count,·timestamp;
··if(card.isValid){
····timestamp·=·Date.now();
····wallet.push({...card,·timestamp});
··}
··count·=·wallet.length;
}
```
### Array Literals
- Do not use the variadic  `Array`  constructor. The constructor is error-prone if arguments are added or removed. Use a literal instead.
```js
// Correct
const·a1·=·[x1,·x2,·x3];
const·a2·=·[x1,·x2];
const·a3·=·[x1];
const·a4·=·[];

// Incorrect
const·a1·=·new·Array(x1,·x2,·x3);
const·a2·=·new·Array(x1,·x2);
const·a3·=·new·Array(x1);
const·a4·=·new·Array();
```
- Explicitly allocating an array of a given length using `new Array(length)` is allowed when appropriate.
- Since arrays are technically objects, JavaScript allows you to assign custom (non-numeric) properties to them. Do not define or use non-numeric properties on an array (other than `length`). Use a `Map` (or `Object`) instead.
```js
// Incorrect
const·list·=·['Thomas',·'Powell'];
list.role·=·'Professor';

console.log(list.role); // Returns 'Professor' — confusing


// Correct - Object approach
const·user·=·{
··name:·'Thomas Powell',
··role:·'Professor'
};

// Correct - Map approach
const·userMap·=·new·Map();
userMap.set('name',·'Thomas·Powell');
userMap.set('role',·'Professor');
```
#### Array Deconstructing
- Destructuring is the preferred way to extract values from arrays. It improves clarity when unpacking multiple values from a known position.
```js
const·[firstName,·lastName]·=·userFullName.split('·');
```
- Use `...rest` at the end of a de-structuring pattern to collect the remaining elements into a new array.
```js
const·[name·=·'Unknown']·=·values;
```
- Use extra commas to skip over elements which aren't needed.
```js
const·[,·second]·=·list;
```
- When a function returns an array, de-structure the result directly to assign values.
```js
const·[status,·data]·=·getCardInfo();
```
- De-structuring can be used to swap variables in a single line.
```js
let·a·=·1,·b·=·2;
[a,·b]·=·[b,·a];
```

>**NOTE:** To read more about array manipulation and array deconstructing, please refer to the [MDN Web Docs](#https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring) page.
---
## Naming
- Identifiers should be written using ASCII characters, and be as descriptive as necessary to convey meaning. Avoid unclear abbreviations or shortened internal letters. Favor readability over brevity.
- Short variable names (e.g.,  `i`,  `x`,  `r`) are acceptable only if they are used in a narrow scope (≤10 lines), such as loop counters or simple destructuring.
#### Classes, Interfaces, Enums
- Use `UpperCamelCase` for classes, interfaces, enums, and type definitions to clearly distinguish them from variables and functions.
```js
class·CardManager·{}
interface·Readable·{}
enum·StatusType·{ACTIVE,·INACTIVE}
```
#### Variables, Parameters, Methods
- Use `lowerCamelCase` for all function names, method names, variables, and parameters. This includes destructured parameters and arrow functions.
```js
let·userName;
function·sendMessage()·{}
function drawChart({radius·=·25}·=·{})·{}
```
#### Constants
- Use `CONSTANT_CASE` for values that are fixed, deeply immutable, and conceptually constant throughout the program.
```js
const·MAX_CARDS·=·50;
const·API_URL·=·'https://api.example.com';
```
---
## Documentation
- All classes, methods, and constants must include JSDoc. This includes parameter types, return types, and descriptions.
- Every function should explicitly document input and output types. Use optional `=` for optional parameters.
```js
/**
 * Shares a card via a dynamically generated QR code.
 *
 * @param {!Card} card The card to be shared.
 * @param {boolean=} forceRefresh Optional flag to regenerate QR.
 * @return {string} A data URI of the QR code.
 */
function shareCard(card, forceRefresh) {
  return generateQRCode(card, forceRefresh);
}
```
- If the description doesn’t fit on one line, use `/** ... */` style with wrapped lines. Avoid inline comments that overflow. When describing multiple bullet points, use proper Markdown formatting for tools to parse and for clarity.
```js
/**
 * Computes weight based on:
 * - number of cards
 * - number of interactions
 * - time since last scan
 */
```
- Use `@private` for internal properties and methods. Combine simple tags like `@private` and `@const` inline when short.
```js
/** @private @const {!Array<Card>} */
this.localCache_ = [];
```
- Classes must have a JSDoc block describing their purpose.
- Constructors must document all parameters.
```js
/**
 * Manages all stored contact cards.
 * @implements {Iterable<!Card>}
 */
class CardManager {
  /**
   * @param {!Array<!Card>} initialCards List of cards to preload.
   */
  constructor(initialCards) {
    ...
  }
}
```
- In callbacks or promises, include JSDoc **only when types aren't obvious** or for clarity.
```js
promise.then(
  /** @return {string} */
  (/** !Array<string> */ items) => items.join(', ')
);
```
- Use `@typedef` and `@enum` for reusable types. Document purpose and individual keys when relevant.
```js
/**
 * Supported card categories.
 * @enum {string}
 */
const CardCategory = {
  STUDENT: 'student',
  PROFESSIONAL: 'pro',
};
```
- Do not use JSDoc inline in function expressions or declarations. Place block-style JSDoc above the declaration.
```js
// Correct
/**
 * Retrieves cards from storage.
 * @return {!Array<!Card>}
 */
function getCards() { ... }

// Incorrect
function /** @return {!Array<!Card>} */ getCards() { ... }
```
- At the top of files, include a file overview.
```js
/**
 * @fileoverview Handles card import/export via QR codes and NFC.
 * Includes card encoding, compression, and permission checks.
 */
```
---
## Miscellaneous
---
## Pipeline
> The DevOps team is working hard to get this section completed as soon as possible. Sorry for the inconvenience. 
---
