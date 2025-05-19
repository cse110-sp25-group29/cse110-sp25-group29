export class Toolbar {
    constructor() {

    }

    getCurTool() {
        const toolbar = new FormData(document.querySelector("#toolbox"));
        this.val = Number(toolbar.get("tool"));
        switch(this.val) {
            case 0: return 0;
            case 1:
            case 2:
            case 3:
            case 4: return 4;
            case 5:
            case 6:
            case 7: return 5;
            case 8: return 2;
            case 9: return 3;
        }
    }

    getToolInfo() {
        switch (this.val) {
            case 0: return {};
            case 1: return {"src": "./icons/facebook.png", "width": 80, "height": 80};
            case 2: return {"src": "./icons/instagram.webp", "width": 80, "height": 80};
            case 3: return {"src": "./icons/linkedin.png", "width": 80, "height": 80};
            case 4: return {"src": "./icons/github.png", "width": 80, "height": 80};
            case 5: return {"text": "Heading", "fontStyle": "Arial", "fontSize": 80};
            case 6: return {"text": "Subheading", "fontStyle": "Arial", "fontSize": 50};
            case 7: return {"text": "Body", "fontStyle": "Arial", "fontSize": 30};
            case 8: return {};
            case 9: return {};
            default: {
                console.log("shouldn't reach");
                return {};
            }
        }
    }
}