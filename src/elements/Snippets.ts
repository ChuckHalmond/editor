
export { snakeToCamel };
export { camelToSnake };
export { trainToCamel };
export { camelToTrain };
export { constructor };

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

const constructor: <
  P extends {
    new(...args: any): any
  }
>(
  prototype: InstanceType<P>,
  construct: (...args: ConstructorParameters<P>) => InstanceType<P>,
  constructors?: Omit<P, "new" | "prototype">
) => P = <
  P extends {
    new(...args: any): any;
  }
>(
  prototype: InstanceType<P>,
  construct: (...args: ConstructorParameters<P>) => InstanceType<P>,
  constructors?: Omit<P, "new" | "prototype">
) => {
  return <P>Object.assign(
    <Function>construct, {
      prototype,
      ...constructors
    }
  );
}