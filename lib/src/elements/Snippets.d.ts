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
declare function forAllSubtreeElements(element: Element, func: (element: Element) => void): void;
declare function forAllSubtreeNodes(parent: Node & ParentNode, func: (childNode: Node & ChildNode, parentNode: Node & ParentNode) => void): void;
declare function getPropertyFromPath(src: object, path: string): any;
declare function setPropertyFromPath(src: object, path: string, value: any): object;
declare function pointIntersectsWithDOMRect(x: number, y: number, rect: DOMRect): boolean;
declare function titlize(str: string): string;
declare function snakeToCamel(str: string): string;
declare function camelToSnake(str: string): string;
declare function trainToCamel(str: string): string;
declare function camelToTrain(str: string): string;
