define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pointIntersectsWithDOMRect = exports.setPropertyFromPath = exports.getPropertyFromPath = exports.forAllSubtreeNodes = exports.forAllSubtreeElements = void 0;
    function forAllSubtreeElements(element, func) {
        let index = 0;
        func(element);
        while (index < element.children.length) {
            let child = element.children.item(index);
            if (child) {
                forAllSubtreeElements(child, func);
            }
            index++;
        }
    }
    exports.forAllSubtreeElements = forAllSubtreeElements;
    function forAllSubtreeNodes(parent, func) {
        let index = 0;
        while (index < parent.childNodes.length) {
            let child = parent.childNodes.item(index);
            if (child) {
                func(child, parent);
                if (child.hasChildNodes()) {
                    forAllSubtreeNodes(child, func);
                }
            }
            index++;
        }
    }
    exports.forAllSubtreeNodes = forAllSubtreeNodes;
    function getPropertyFromPath(src, path) {
        const props = path.split(".");
        let obj = src;
        props.forEach((prop) => {
            if (prop.includes("[")) {
                let index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
                if (Number.isNaN(index)) {
                    console.error(`Wrong indexed path: ${prop}`);
                }
                prop = prop.substring(0, prop.indexOf("["));
                if (typeof obj === "object" && prop in obj && Array.isArray(obj[prop])) {
                    obj = obj[prop][index];
                }
            }
            else if (typeof obj === "object" && prop in obj) {
                obj = obj[prop];
            }
            else {
                obj = void 0;
            }
        });
        return obj;
    }
    exports.getPropertyFromPath = getPropertyFromPath;
    function setPropertyFromPath(src, path, value) {
        const props = path.split(".");
        let obj = src;
        let lastPropIdx = props.length - 1;
        props.forEach((prop, idx) => {
            if (prop.includes("[")) {
                let index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
                if (Number.isNaN(index)) {
                    console.error(`Wrong indexed path: ${prop}`);
                }
                prop = prop.substring(0, prop.indexOf("["));
                if (!Array.isArray(obj[prop])) {
                    obj[prop] = [];
                }
                if (idx === lastPropIdx) {
                    obj[prop][index] = value;
                }
                else {
                    if (typeof obj[prop][index] !== "object") {
                        obj[prop][index] = {};
                    }
                    obj = obj[prop][index];
                }
            }
            else {
                if (typeof obj[prop] !== "object") {
                    obj[prop] = {};
                }
                if (idx === lastPropIdx) {
                    obj[prop] = value;
                }
                else {
                    obj = obj[prop];
                }
            }
        });
        return src;
    }
    exports.setPropertyFromPath = setPropertyFromPath;
    function pointIntersectsWithDOMRect(x, y, rect) {
        return !(rect.left > x ||
            rect.right < x ||
            rect.top > y ||
            rect.bottom < y);
    }
    exports.pointIntersectsWithDOMRect = pointIntersectsWithDOMRect;
});
//# sourceMappingURL=Snippets.js.map