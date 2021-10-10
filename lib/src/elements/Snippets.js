export { forAllSubtreeElements };
export { forAllSubtreeNodes };
export { getPropertyFromPath };
export { setPropertyFromPath };
export { pointIntersectsWithDOMRect };
export { snakeToCamel };
export { camelToSnake };
export { trainToCamel };
export { camelToTrain };
export { titlize };
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
function setPropertyFromPath(src, path, value) {
    const props = path.split(".");
    let obj = src;
    if (src == null) {
        console.error("Source data can't be null");
    }
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
            if (idx === props.length - 1) {
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
            if (idx === props.length - 1) {
                obj[prop] = value;
            }
            else {
                if (typeof obj[prop] !== "object") {
                    obj[prop] = {};
                }
                obj = obj[prop];
            }
        }
    });
    return src;
}
function pointIntersectsWithDOMRect(x, y, rect) {
    return !(rect.left > x ||
        rect.right < x ||
        rect.top > y ||
        rect.bottom < y);
}
function titlize(str) {
    return `${str.charAt(0).toUpperCase()}${str.substr(1).toLowerCase()}`;
}
function snakeToCamel(str) {
    return str.split('_').map(str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()).join("");
}
function camelToSnake(str) {
    return str.replace(/(?<!^)(?=[A-Z])/g, '_').toLowerCase();
}
function trainToCamel(str) {
    return str.split('-').map(str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()).join("");
}
function camelToTrain(str) {
    return str.replace(/(?<!^)(?=[A-Z])/g, '-').toLowerCase();
}
//# sourceMappingURL=Snippets.js.map