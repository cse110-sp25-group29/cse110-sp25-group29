export class Toolbar {
    constructor() {

    }

    getCurTool() { // temporary stand-in
        const toolbar = new FormData(document.querySelector("#toolbox"));
        return Number(toolbar.get("tool"));
    }

    getToolInfo() {
        return null
    }
}