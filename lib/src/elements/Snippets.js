export { getPropertyFromPath };
export { setPropertyFromPath };
export { snakeToCamel };
export { camelToSnake };
export { trainToCamel };
export { camelToTrain };
export { titlize };
function getPropertyFromPath(src, path) {
    const props = path.split(".");
    let obj = src;
    props.forEach((prop) => {
        if (prop.includes("[")) {
            const index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
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
            const index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
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