import { ListModel, ObjectModel } from "../models/Model";
export { isTagElement };
export { RegisterCustomHTMLElement };
export { GenerateAttributeAccessors };
export { bindShadowRoot };
export { setElementProperties };
export { setElementAttributes };
export { setElementChildren };
export { isParentNode };
export { isReactiveNode };
export { isReactiveParentNode };
export { ReactiveNode };
export { ReactiveParentNode };
export { ReactiveChildNodes };
export { isElement };
export { Element };
export { AttributeMutationMixin };
export { AttributeType };
export { areAttributesMatching };
export { AttributeMutationMixinBase };
export { createAttributeMutationObserverCallback };
export { createReactiveNodesMutationObserverCallback };
export { Fragment };
export { TextNode };
export { setHTMLElementEventListeners };
export { parseStringTemplate };
declare function isTagElement<K extends keyof HTMLElementTagNameMap>(tagName: K, obj: any): obj is HTMLElementTagNameMap[K];
interface RegisterCustomHTMLElementDecorator {
    (args: {
        name: string;
        observedAttributes?: string[];
        options?: ElementDefinitionOptions;
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}
declare function parseStringTemplate(template: string, items: {
    [key: string]: Node | string;
}): DocumentFragment;
declare const RegisterCustomHTMLElement: RegisterCustomHTMLElementDecorator;
interface GenerateAttributeAccessorsDecorator {
    (attributes: {
        name: string;
        type?: "string" | "number" | "boolean" | "json";
    }[]): <C extends CustomElementConstructor>(elementCtor: C) => C;
}
declare const GenerateAttributeAccessors: GenerateAttributeAccessorsDecorator;
declare function bindShadowRoot(element: HTMLElement, templateContent?: string): ShadowRoot;
declare function Fragment(...nodes: (Node | string)[]): DocumentFragment;
declare function TextNode(text?: string): Node;
declare type _IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
declare type WritableKeys<T> = {
    [P in keyof T]-?: _IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P>;
}[keyof T];
interface HTMLInit<K extends keyof HTMLElementTagNameMap> {
    options?: ElementCreationOptions;
    props?: Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>;
    attrs?: {
        [name: string]: number | string | boolean;
    };
    children?: Node[] | NodeList | ReactiveChildNodes;
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[EventName]) => void | [(event: HTMLElementEventMap[EventName]) => void, Partial<boolean | AddEventListenerOptions>];
    };
    styles?: {
        [property: string]: string | [string, string];
    };
}
declare function Element<K extends keyof HTMLElementTagNameMap>(tagName: K, init?: HTMLInit<K>): HTMLElementTagNameMap[K];
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
declare function isParentNode(node: Node): node is Node & ParentNode;
declare function isElement(node: Node): node is Element;
declare function isReactiveNode(node: Node): node is ReactiveNode;
declare function isReactiveParentNode(node: Node): node is ReactiveParentNode;
declare function ReactiveNode<Data extends object, N extends Node>(list: ListModel<Data>, node: N, react: (node: N, addedItems: Data[], removedItems: Data[], index: number) => void): N;
declare function ReactiveNode<Data extends object, N extends Node>(object: ObjectModel<Data>, node: N, react: <K extends keyof Data>(node: N, property: K, oldValue: Data[K], newValue: Data[K]) => void): N;
interface ReactiveChildNodes {
    (parent: Node & ParentNode): (Node | string)[];
}
declare function ReactiveChildNodes<Item extends object>(list: ListModel<Item>, map: (item: Item) => Node | string, placeholder?: Node): ReactiveChildNodes;
declare function setHTMLElementEventListeners<K extends keyof HTMLElementTagNameMap>(element: HTMLElementTagNameMap[K], listeners: {
    [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K]) => void | [(event: HTMLElementEventMap[K]) => void, Partial<boolean | AddEventListenerOptions>];
}): HTMLElementTagNameMap[K];
declare function setElementChildren<E extends Element>(element: E, children: (Node | string)[] | NodeList): E;
declare function setElementProperties<E extends Element>(element: E, properties?: Partial<Pick<E, WritableKeys<E>>>): E;
declare function setElementAttributes<E extends Element>(element: E, attributes?: {
    [attrName: string]: number | string | boolean;
}): E;
interface AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;
    attach(element: Element): void;
    detach(element: Element): void;
}
declare type AttributeType = "string" | "boolean" | "listitem";
declare function areAttributesMatching(refAttributeType: AttributeType, refAttrName: string, refAttrValue: string, attrName: string, attrValue: string | null): boolean;
declare abstract class AttributeMutationMixinBase implements AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;
    constructor(attributeName: string, attributeType?: AttributeType, attributeValue?: string);
    abstract attach(element: Element): void;
    abstract detach(element: Element): void;
}
declare function createAttributeMutationObserverCallback(mixins: AttributeMutationMixin[]): (mutationsList: MutationRecord[]) => void;
declare function createReactiveNodesMutationObserverCallback(): (mutationsList: MutationRecord[]) => void;
