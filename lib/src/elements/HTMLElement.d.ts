import { EventDispatcher } from "../events/EventDispatcher";
import { ListModel, ObjectModel } from "../models/Model";
export { RegisterCustomHTMLElement };
export { GenerateAttributeAccessors };
export { bindShadowRoot };
export { isParentNode };
export { isReactiveNode };
export { isReactiveParentNode };
export { ReactiveNode };
export { ReactiveParentNode };
export { ReactiveChildNodes };
export { isElement };
export { Element };
export { Fragment };
export { TextNode };
export { AttributeMutationMixin };
export { AttributeType };
export { areAttributesMatching };
export { AttributeMutationMixinBase };
export { GenerateDatasetAccessors };
interface RegisterCustomHTMLElementDecorator {
    (args: {
        name: string;
        observedAttributes?: string[];
        options?: ElementDefinitionOptions;
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}
declare const RegisterCustomHTMLElement: RegisterCustomHTMLElementDecorator;
interface GenerateAttributeAccessorsDecorator {
    (attributes: {
        name: string;
        type?: "string" | "number" | "boolean" | "json";
    }[]): <C extends CustomElementConstructor>(elementCtor: C) => C;
}
declare const GenerateAttributeAccessors: GenerateAttributeAccessorsDecorator;
interface GenerateDatasetAccessorsDecorator {
    (attributes: {
        name: string;
        type?: "string" | "number" | "boolean" | "json";
    }[]): <C extends CustomElementConstructor>(elementCtor: C) => C;
}
declare const GenerateDatasetAccessors: GenerateDatasetAccessorsDecorator;
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
    styles?: {
        [property: string]: string | [string, string];
    };
    dataset?: {
        [DatasetEntry in keyof HTMLElementTagNameMap[K]["dataset"]]?: HTMLElementTagNameMap[K]["dataset"][DatasetEntry];
    };
    children?: Node[] | NodeList | ReactiveChildNodes;
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[EventName]) => void | [(event: HTMLElementEventMap[EventName]) => void, Partial<boolean | AddEventListenerOptions>];
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
