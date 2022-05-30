import { Widget } from "../views/widgets/Widget";
import { ModelList, ModelNode } from "../models/Model";
export { subtreeNodes };
export { ancestorNodes };
export { CustomElement };
export { CustomWidget };
export { widget };
export { QueryProperty };
export { QueryAllProperty };
export { AttributeProperty };
export { reactiveElement };
export { reactiveChildElements };
export { element };
export { Fragment };
export { TextNode };
export { AttributeMutationMixin };
export { AttributeType };
export { areAttributesMatching };
export { AttributeMutationMixinBase };
export { trimMultilineIndent };
export { Stylesheet };
interface AttributePropertyDecorator {
    (init: {
        type: typeof String;
        observed?: boolean;
        defaultValue?: string | null;
    }): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (init: {
        type: typeof Number;
        observed?: boolean;
        defaultValue?: number | null;
    }): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (init: {
        type: typeof Boolean;
        observed?: boolean;
    }): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (init: {
        type: typeof Object;
        observed?: boolean;
        defaultValue?: any | null;
    }): <E extends HTMLElement>(target: E, property: keyof E) => void;
}
declare const AttributeProperty: AttributePropertyDecorator;
declare function Stylesheet(text: string): CSSStyleSheet;
declare function trimMultilineIndent(text: string): string;
interface CustomElementDecorator {
    (init: {
        name: string;
        options?: ElementDefinitionOptions;
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}
declare const CustomElement: CustomElementDecorator;
interface WidgetDecorator {
    (init: {
        name: string;
    }): <W extends Widget>(widget: W) => W;
}
declare const CustomWidget: WidgetDecorator;
declare function subtreeNodes(node: Node): Generator<Node>;
declare function ancestorNodes(node: Node): Generator<Node>;
interface QueryPropertyDecorator {
    (init: {
        selector: string;
        withinShadowRoot?: boolean;
    }): <E extends HTMLElement>(target: E, propertyKey: keyof E) => void;
}
declare const QueryProperty: QueryPropertyDecorator;
interface QueryAllPropertyDecorator {
    (init: {
        selector: string;
        withinShadowRoot?: boolean;
    }): <E extends HTMLElement>(target: E, propertyKey: keyof E) => void;
}
declare const QueryAllProperty: QueryAllPropertyDecorator;
declare function Fragment(...nodes: (Node | string)[]): DocumentFragment;
declare function TextNode(text: string): Node;
declare type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
declare type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P, never>;
}[keyof T];
interface HTMLElementInit<E extends HTMLElement> {
    options?: ElementCreationOptions;
    properties?: Partial<Pick<E, WritableKeys<E>>>;
    part?: string[];
    exportParts?: string[];
    attributes?: {
        [name: string]: number | string | boolean;
    };
    style?: {
        [property: string]: string | [string, string];
    };
    dataset?: {
        [property: string]: string | number | boolean;
    };
    children?: (Node | string)[] | NodeList | ReactiveChildElements;
    eventListeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined];
    };
}
interface HTMLElementInitMap {
    "template": HTMLTemplateInit;
}
interface HTMLTemplateInit extends HTMLElementInit<HTMLTemplateElement> {
    content?: (Node | string)[] | NodeList;
}
declare function element<E extends HTMLElementTagNameMap[K], K extends keyof HTMLElementInitMap>(tagName: K, init?: HTMLElementInitMap[K]): E;
declare function element<E extends HTMLElementTagNameMap[K], K extends keyof HTMLElementTagNameMap>(tagName: K, init?: HTMLElementInit<E>): E;
declare function element(tagName: string, init?: HTMLElementInit<HTMLElement>): HTMLElement;
interface WidgetInit<K extends keyof WidgetNameMap> {
    properties?: Parameters<WidgetNameMap[K]["create"]>[0];
    attributes?: {
        [name: string]: number | string | boolean;
    };
    style?: {
        [property: string]: string | [string, string];
    };
    dataset?: {
        [property: string]: string | number | boolean;
    };
    children?: (Node | string)[] | NodeList | ReactiveChildElements;
    eventListeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined];
    };
}
declare function widget<K extends keyof WidgetNameMap>(name: K, init?: WidgetInit<K>): ReturnType<WidgetNameMap[K]["create"]>;
declare function widget<K extends keyof WidgetNameMap>(name: string, init?: WidgetInit<K>): HTMLElement;
declare function reactiveElement<M extends ModelNode, E extends Element, K extends string>(model: M, element: E, properties: K[], react: (object: E, property: K, oldValue: any, newValue: any) => void): E;
interface ReactiveChildElements {
    (parent: Node & ParentNode): (Node | string)[];
}
declare function reactiveChildElements<Model extends ModelNode>(list: ModelList<Model>, mapping: (item: Model) => Element, placeholder?: Element): ReactiveChildElements;
interface AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;
    attach(element: Element): void;
    detach(element: Element): void;
}
declare type AttributeType = "string" | "boolean" | "list";
declare function areAttributesMatching(referenceAttributeType: AttributeType, referenceAttributeName: string, referenceAttributeValue: string, attributeName: string, attributeValue: string | null): boolean;
declare class AttributeMutationMixinBase implements AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;
    constructor(attributeName: string, attributeType?: AttributeType, attributeValue?: string);
    attach(): void;
    detach(): void;
}
