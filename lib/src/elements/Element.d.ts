import { EventDispatcher } from "../events/EventDispatcher";
import { ListModel, ObjectModel } from "../models/Model";
export { CustomElement };
export { AttributeProperty };
export { isReactiveNode };
export { isReactiveParentNode };
export { ReactiveNode };
export { ReactiveParentNode };
export { ReactiveChildNodes };
export { HTML };
export { Fragment };
export { TextNode };
export { AttributeMutationMixin };
export { AttributeType };
export { areAttributesMatching };
export { AttributeMutationMixinBase };
interface CustomElementDecorator {
    (init: {
        name: string;
        options?: ElementDefinitionOptions;
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}
declare const CustomElement: CustomElementDecorator;
interface AttributePropertyDecorator {
    (init: {
        type: "string" | "number" | "boolean" | "json";
    }): <E extends HTMLElement>(target: E, propertyKey: keyof E) => void;
}
declare const AttributeProperty: AttributePropertyDecorator;
declare function Fragment(...nodes: (Node | string)[]): DocumentFragment;
declare function TextNode(text?: string): Node;
declare type _IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
declare type WritableKeys<T> = {
    [P in keyof T]-?: T[P] extends Function ? never : _IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P>;
}[keyof T];
interface HTMLInit<E extends HTMLElement> {
    options?: ElementCreationOptions;
    properties?: Partial<Pick<E, WritableKeys<E>>>;
    part?: string[];
    exportparts?: string[];
    attributes?: {
        [name: string]: number | string | boolean;
    };
    styles?: {
        [property: string]: string | [string, string];
    };
    dataset?: DOMStringMap;
    children?: Node[] | NodeList | ReactiveChildNodes;
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined];
    };
}
declare function HTML<E extends HTMLElementTagNameMap[K], K extends keyof HTMLElementTagNameMap>(tagName: K, init?: HTMLInit<E>): E;
declare function HTML(tagName: string, init?: HTMLInit<HTMLElement>): HTMLElement;
declare type ReactiveNode = Node & {
    _reactiveNodeAttributes: {
        addReactListener: () => void;
        removeReactListener: () => void;
    };
};
declare type ReactiveParentNode = Node & {
    _reactiveParentNodeAttributes: {
        addReactListener: () => void;
        removeReactListener: () => void;
    };
};
declare function isReactiveNode(node: Node): node is ReactiveNode;
declare function isReactiveParentNode(node: Node): node is ReactiveParentNode;
declare function ReactiveNode<Data extends object, N extends Node>(list: ListModel<Data>, node: N, react: (node: N, addedItems: Data[], removedItems: Data[], index: number) => void): N;
declare function ReactiveNode<Model extends ObjectModel, N extends Node>(object: Model, node: N, react: <K extends Exclude<keyof Model, keyof EventDispatcher>>(node: N, property: K, oldValue: Model[K], newValue: Model[K]) => void): N;
interface ReactiveChildNodes {
    (parent: Node & ParentNode): (Node | string)[];
}
declare function ReactiveChildNodes<Item extends any>(list: ListModel<Item>, map: (item: Item) => Node | string, placeholder?: Node): ReactiveChildNodes;
interface AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;
    attach(element: Element): void;
    detach(element: Element): void;
}
declare type AttributeType = "string" | "boolean" | "list";
declare function areAttributesMatching(refAttributeType: AttributeType, refAttrName: string, refAttrValue: string, attrName: string, attrValue: string | null): boolean;
declare abstract class AttributeMutationMixinBase implements AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;
    constructor(attributeName: string, attributeType?: AttributeType, attributeValue?: string);
    abstract attach(element: Element): void;
    abstract detach(element: Element): void;
}
