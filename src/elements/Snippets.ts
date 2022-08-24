
export { snakeToCamel };
export { camelToSnake };
export { trainToCamel };
export { camelToTrain };

function snakeToCamel(str: string) {
  return str.split('_').map(str =>  str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()).join("");
}

function camelToSnake(str: string) {
  return str.replace(/(?<!^)(?=[A-Z])/g, '_').toLowerCase();
}

function trainToCamel(str: string) {
  return str.split('-').map(str =>  str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()).join("");
}

function camelToTrain(str: string) {
  return str.replace(/(?<!^)(?=[A-Z])/g, '-').toLowerCase();
}