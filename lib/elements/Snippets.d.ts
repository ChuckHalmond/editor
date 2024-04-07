export { snakeToCamel };
export { camelToSnake };
export { trainToCamel };
export { camelToTrain };
export { constructor };
declare function snakeToCamel(str: string): string;
declare function camelToSnake(str: string): string;
declare function trainToCamel(str: string): string;
declare function camelToTrain(str: string): string;
declare const constructor: <P extends {
    new (...args: any): any;
}>(prototype: InstanceType<P>, construct: (...args: ConstructorParameters<P>) => InstanceType<P>, constructors?: Omit<P, "new" | "prototype">) => P;
