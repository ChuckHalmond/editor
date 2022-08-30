import { ModelList, ModelNode } from "../models/Model";
export { CustomElement };
export { ReactiveChildElements };
export { QueryProperty };
export { QueryAllProperty };
export { AttributeProperty };
export { reactiveElement };
export { reactiveChildElements };
export { element };
export { fragment };
export { textNode };
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
        name?: string;
    }): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (init: {
        type: typeof Number;
        observed?: boolean;
        defaultValue?: number | null;
        name?: string;
    }): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (init: {
        type: typeof Boolean;
        observed?: boolean;
        name?: string;
    }): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (init: {
        type: typeof Object;
        observed?: boolean;
        defaultValue?: any | null;
        name?: string;
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
declare function fragment(...nodes: (Node | string)[]): DocumentFragment;
declare function textNode(text: string): Node;
interface HTMLElementInit {
    options?: ElementCreationOptions;
    attributes?: {
        [name: string]: number | string | boolean | undefined;
    };
    dataset?: {
        [property: string]: string | number | boolean;
    };
    children?: Node | string | (Node | string)[] | NodeList | ReactiveChildElements;
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined];
    };
}
declare function element<E extends HTMLElementTagNameMap[K], K extends keyof HTMLElementTagNameMap>(tagName: K, init?: HTMLElementInit): E;
declare function element(tagName: string, init?: HTMLElementInit): HTMLElement;
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
