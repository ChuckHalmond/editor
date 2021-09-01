export { forAllSubtreeElements };
export { forAllSubtreeNodes };
export { getPropertyFromPath };
export { setPropertyFromPath };
export { pointIntersectsWithDOMRect };
declare function forAllSubtreeElements(element: Element, func: (element: Element) => void): void;
declare function forAllSubtreeNodes(parent: Node & ParentNode, func: (childNode: Node & ChildNode, parentNode: Node & ParentNode) => void): void;
declare function getPropertyFromPath(src: object, path: string): any;
declare function setPropertyFromPath(src: object, path: string, value: any): object;
declare function pointIntersectsWithDOMRect(x: number, y: number, rect: DOMRect): boolean;