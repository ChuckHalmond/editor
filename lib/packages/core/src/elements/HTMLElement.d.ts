import { ListModel, ListModelChangeEvent, ObjectModel, ObjectModelChangeEvent } from "../models/Model";
export { isTagElement };
export { RegisterCustomHTMLElement };
export { GenerateAttributeAccessors };
export { createTemplate };
export { bindShadowRoot };
export { HTMLElementDescription };
export { setElementProperties };
export { setElementAttributes };
export { setElementChildren };
export { HTMLElementConstructor };
export { isParentNode };
export { isReactiveNode };
export { isReactiveParentNode };
export { ReactiveNode };
export { ReactiveParentNode };
export { ReactiveChildNodes };
export { isElement };
export { Element };
export { HTMLElementInit };
export { AttributeMutationMixin };
export { AttributeType };
export { areAttributesMatching };
export { AttributeMutationMixinBase };
export { createMutationObserverCallback };
export { Fragment };
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
declare function createTemplate<E extends Element | DocumentFragment>(templateContent?: string): E;
declare function bindShadowRoot(element: HTMLElement, templateContent?: string): ShadowRoot;
declare function Fragment(...nodes: (Node | string)[]): DocumentFragment;
declare type HTMLElementDescription<K extends keyof HTMLElementTagNameMap> = {
    tagName: K;
    init?: HTMLElementInit<K>;
};
declare type _IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
declare type WritableKeys<T> = {
    [P in keyof T]-?: _IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P>;
}[keyof T];
interface HTMLElementInit<K extends keyof HTMLElementTagNameMap> {
    options?: ElementCreationOptions;
    props?: Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>;
    attrs?: {
        [name: string]: number | string | boolean;
    };
    children?: (Node | string)[];
    listeners?: {
        [ListenerEvent in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[ListenerEvent]) => any | [(event: HTMLElementEventMap[ListenerEvent]) => any, Partial<boolean | AddEventListenerOptions>];
    };
}
declare function HTMLElementConstructor<K extends keyof HTMLElementTagNameMap>(tagName: K, init?: HTMLElementInit<K>): HTMLElementTagNameMap[K];
interface HTMLInit<K extends keyof HTMLElementTagNameMap> {
    options?: ElementCreationOptions;
    props?: Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>;
    attrs?: {
        [name: string]: number | string | boolean;
    };
    children?: Node[] | NodeList | ReactiveChildNodes;
    listeners?: {
        [ListenerEvent in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[ListenerEvent]) => any | [(event: HTMLElementEventMap[ListenerEvent]) => any, Partial<boolean | AddEventListenerOptions>];
    };
    styles?: {
        [property: string]: string | [string, string];
    };
}
declare function Element<K extends keyof HTMLElementTagNameMap>(tagName: K, init?: HTMLInit<K>): HTMLElementTagNameMap[K];
declare type ReactiveNode = Node & {
    _reactAttributes: {
        _reactModel: ObjectModel<object>;
        _reactEvent: "objectmodelchange";
        _reactListener: (event: ObjectModelChangeEvent) => void;
    };
};
declare function isParentNode(node: Node): node is Node & ParentNode;
declare function isElement(node: Node): node is Element;
declare function isReactiveNode(node: Node): node is ReactiveNode;
declare type ReactiveParentNode = (Node & ParentNode) & {
    _reactAttributes: {
        _reactModel: ListModel<object>;
        _reactEvent: "listmodelchange";
        _reactListener: (event: ListModelChangeEvent) => void;
    };
};
declare function isReactiveParentNode(node: Node): node is ReactiveParentNode;
declare function ReactiveNode<Data extends object, N extends Node>(node: N, object: ObjectModel<Data>, react: <K extends keyof Data>(node: N, property: K, oldValue: Data[K], newValue: Data[K]) => void): N;
interface ReactiveChildNodes {
    (parent: Node & ParentNode): (Node | string)[];
}
declare function ReactiveChildNodes<Item extends object>(list: ListModel<Item>, map: (item: Item) => Node | string): ReactiveChildNodes;
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
declare function createMutationObserverCallback(mixins: AttributeMutationMixin[]): (mutationsList: MutationRecord[]) => void;
