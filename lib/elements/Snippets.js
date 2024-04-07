export { snakeToCamel };
export { camelToSnake };
export { trainToCamel };
export { camelToTrain };
export { constructor };
function snakeToCamel(str) {
    return str.split('_').map(str => str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()).join("");
}
function camelToSnake(str) {
    return str.replace(/(?<!^)(?=[A-Z])/g, '_').toLowerCase();
}
function trainToCamel(str) {
    return str.split('-').map(str => str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()).join("");
}
function camelToTrain(str) {
    return str.replace(/(?<!^)(?=[A-Z])/g, '-').toLowerCase();
}
const constructor = (prototype, construct, constructors) => {
    return Object.assign(construct, {
        prototype,
        ...constructors
    });
};
//# sourceMappingURL=Snippets.js.map