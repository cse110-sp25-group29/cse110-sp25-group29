# Setup Guide
## Sections
- [Tabs, Spaces and Whitespace Rendering](#tabs-spaces-and-whitespace-rendering)
- [General Guidelines](#general-guidelines)
- [Pipeline](#pipeline)
- [Installing Jest](#installing-jest)

---
### Tabs, Spaces and Whitespace Rendering
> This section only lays out steps to set up your local VS code IDE environment to match the team's standards. For more information about coding style and standard practices, please refer to the style guide attached above.
1. Open the Command Palette (`cmd + shift + P` on macOs or `ctrl + shift + P` on windows) and type `Preferences: Open Settigs (UI)`.
2. Search for the `Tab Size` option and set it to `2`.
3. Search for the `Render Whitespace` option and select `all` from the dropdown list.
4. Search for the `Insert Spaces` options and make sure it is enabled.
5. Search for the `Detect Indentation` option and make sure it is enabled.
---
### General Guidelines
1. Before making any changes, **create an issue** using the appropriate template. Clearly describe the problem or proposed update, and apply relevant **labels** to help with tracking. Be sure to include a clear and specific **definition of done** that outlines the criteria for completing the task successfully.
> For the team's definition of done, please refer to the appropriate section below.
2. Clone the repository onto your local machine.
```bash
git clone [Repository SSH Link]
```
3. Create a **new branch** with a descriptive branch name, which reflects the feature you're adding or the bug you're fixing.

To create and switch to a new branch via terminal:
```bash
git checkout -b [NEW BRANCH NAME]
``` 
Alternatively, you can create a branch directly on GitHub using the **branch dropdown menu** on the repository’s main page.

4. Make the necessary changes to the codebase. Be sure to follow the **established directory structure** outlined in this document to maintain consistency and organization.
5. We strongly recommend testing your code before committing and opening a pull request to merge with main.
> The team uses Jest and Puppeteer tests for unit tests and e2e testing respectively. For instructions to install and configure Jest and Puppeteer in your local environment, refer to the following sections.
6. Place your test files in the `admin/tests` directory of the repository.  
To ensure your tests run as part of the CI/CD pipeline—alongside the team’s sanity checks for code quality—add the following entry to the GitHub Actions workflow in `.github/workflows/main.yml` file in the repository:
```yml
name: [Description of test]
run: npm run [Name of testfile]
```
7. Add the test script to the `"scripts"` section of the `package.json` file located at the root of the repository, as shown below:
```json
"[Name of testfile]": "jest [Path to testfile]"
```
> You are not required to add your tests to the pipeline. Feel free to skip the above steps if you have extensively tested your code locally.

> To run tests locally, there's no need to modify any configuration files. Simply use the command `npm run [test-script-name]` in your terminal to execute a specific test file. The `package.json` file is already configured to run Jest tests.

8. Open a pull request and assign a teammate for manual review. Once your code passes all automated sanity checks and receives approval from a reviewer, it will be eligible to be merged into the  `main`  branch.
---
### Pipeline

The pipeline runs the following test:
- **Linter Test**  – Ensures that the code follows the team's style and development standards.
- **Codacy Analysis**  – Performs static code analysis to detect complexity issues and maintain code quality.
- **Unit & E2E Tests** - Sanity tests to make sure that functionality of the app is preserved
- **Manual Code Review**  – A fellow developer manually reviews your code as the final quality assurance step before merging.
- >To understand more about how the pipeline works, please refer to this [video](admin/cipipeline/phase2.mov).
---
### Installing Jest
#### For MacOS
1. If not already installed, use Homebrew to install **Node.js**:
```
brew install node
```
2. Navigate to your project directory:
```
cd project-directory
```
3. Install Jest as a dev dependency:
```
npm install --save-dev jest
```
4. Add a test script to your `package.json`:
```json
"scripts": {
  "test": "jest"
}
```
>**NOTE:** This step can be skipped if you've already cloned the project repository and only intend to run tests locally.
5. To run a specific test file:
```
npx jest [Path to testfile]
```

#### For Windows
1. If not already installed, install [Node.js](https://nodejs.org/).
2. Navigate to your project directory:
```
cd path\to\your-project
```
3. Install Jest as a dev dependency:
```
npm install --save-dev jest
```
> If you receive an error saying `NODE_OPTIONS is not recognized as an internal or external command`, run the following command:
> `npm I- D cross-env`
> Then, repeat step 3.

4. Add a test script to your `package.json`:
```json
"scripts": {
  "test": "jest"
}
```
>**NOTE:** This step can be skipped if you've already cloned the project repository and only intend to run tests locally.
5. To run a specific test file:
```
npx jest [Path to testfile]
```


 
