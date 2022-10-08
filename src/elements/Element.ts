import { ModelList, ModelNode, ModelChangeRecord, ModelChangeObserver, ModelChangeObserverOptions } from "../models/Model";
import { camelToTrain } from "./Snippets";
/*
export { subtreeNodes };
export { ancestorNodes };*/
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
    (
        init: {
            type: typeof String;
            observed?: boolean;
            defaultValue?: string | null;
            name?: string;
        }
    ): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (
        init: {
            type: typeof Number;
            observed?: boolean;
            defaultValue?: number | null;
            name?: string;
        }
    ): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (
        init: {
            type: typeof Boolean;
            observed?: boolean;
            name?: string;
        }
    ): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (
        init: {
            type: typeof Object;
            observed?: boolean;
            defaultValue?: any | null;
            name?: string;
        }
    ): <E extends HTMLElement>(target: E, property: keyof E) => void;
}

const AttributeProperty: AttributePropertyDecorator = function(
    init: {
        type: typeof String | typeof Number | typeof Boolean | typeof Object;
        observed?: boolean;
        defaultValue?: string | number | any | null;
        name?: string;
    }
) {
    return <E extends HTMLElement>(
        target: E, property: keyof E
    ) => {
        const {constructor} = target;
        const {prototype} = constructor;
        const propertyName = String(property);
        const {defaultValue = null, observed = false, name = camelToTrain(propertyName)} = init;
        if (observed) {
            const observedAttributes = Reflect.get(constructor, "observedAttributes", constructor);
            if (Array.isArray(observedAttributes)) {
                observedAttributes.push(name);
            }
            else {
                Object.defineProperty(
                    constructor, "observedAttributes", {
                        value: [name],
                        writable: false
                    }
                );
            }
        }
        const {type} = init;
        switch (type) {
            case Boolean: {
                Object.defineProperty(prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        return this.hasAttribute(name);
                    },
                    set: function(this: HTMLElement, value) {
                        if (value) {
                            this.setAttribute(name, "");
                        }
                        else {
                            this.removeAttribute(name);
                        }
                    }
                });
                break;
            }
            case Object: {
                Object.defineProperty(prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        const val = this.getAttribute(name);
                        return (val !== null) ? JSON.parse(val) : defaultValue;
                    },
                    set: function(this: HTMLElement, value) {
                        if (value !== null) {
                            this.setAttribute(name, JSON.stringify(value));
                        }
                        else {
                            this.removeAttribute(name);
                        }
                    }
                });
                break;
            }
            case Number: {
                Object.defineProperty(prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        const val = this.getAttribute(name);
                        return (val !== null) ? parseFloat(val) : defaultValue;
                    },
                    set: function(this: HTMLElement, value) {
                        if (value !== null) {
                            this.setAttribute(name, value);
                        }
                        else {
                            this.removeAttribute(name);
                        }
                    }
                });
                break;
            }
            case String:
            default: {
                Object.defineProperty(prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        const val = this.getAttribute(name);
                        return (val !== null) ? val : defaultValue;
                    },
                    set: function(this: HTMLElement, value) {
                        if (value !== null) {
                            this.setAttribute(name, value);
                        }
                        else {
                            this.removeAttribute(name);
                        }
                    }
                });
                break;
            }
        }
    }
}
    
function Stylesheet(text: string): CSSStyleSheet {
    const stylesheet = new CSSStyleSheet();
    (stylesheet as any).replaceSync(text);
    return stylesheet;
}

function trimMultilineIndent(text: string): string {
    const newlineIndex = text.indexOf("\n");
    text = text.substring(newlineIndex + 1);
    const indentMatch = text.match(/^[\s]*/);
    if (indentMatch) {
        const indent = text.substring(0, indentMatch[0].length);
        text = text.replaceAll(indent, "").trimEnd();
    }
    return text;
}

interface CustomElementDecorator {
    (init: {
        name: string;
        options?: ElementDefinitionOptions
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}

const CustomElement: CustomElementDecorator = function(init: {
    name: string;
    options?: ElementDefinitionOptions
}) {
    return <C extends CustomElementConstructor>(
        elementCtor: C
    ) => {
        const {name, options} = init;
        if (!customElements.get(name)) {
            customElements.define(
                name,
                elementCtor,
                options
            );
        }
        return elementCtor;
    }
}

interface QueryPropertyDecorator {
    (
        init: {
            selector: string;
            withinShadowRoot?: boolean;
        }
    ): <E extends HTMLElement>(target: E, propertyKey: keyof E) => void;
}

const QueryProperty: QueryPropertyDecorator = function(
        init: {
            selector: string;
            withinShadowRoot?: boolean;
        }
    ) {
    return <E extends HTMLElement>(
        target: E, propertyKey: keyof E
    ) => {
        const {constructor} = target;
        const {prototype} = constructor;
        const propertyName = String(propertyKey);
        const {selector} = init;
        const withinShadowRoot = init.withinShadowRoot ?? false;
        const getter = withinShadowRoot ? function(this: HTMLElement) {
            return this.shadowRoot!.querySelector(selector);
        } : function(this: HTMLElement) {
            return this.querySelector(selector);
        }
        Object.defineProperty(prototype, propertyName, {
            get: getter
        });
    }
}

interface QueryAllPropertyDecorator {
    (
        init: {
            selector: string;
            withinShadowRoot?: boolean;
        }
    ): <E extends HTMLElement>(target: E, propertyKey: keyof E) => void;
}

const QueryAllProperty: QueryAllPropertyDecorator = function(
        init: {
            selector: string;
            withinShadowRoot?: boolean;
        }
    ) {
    return <E extends HTMLElement>(
        target: E, propertyKey: keyof E
    ) => {
        const {constructor} = target;
        const {prototype} = constructor;
        const propertyName = String(propertyKey);
        const {selector} = init;
        const withinShadowRoot = init.withinShadowRoot ?? false;
        const getter = withinShadowRoot ? function(this: HTMLElement) {
            return Array.from(this.shadowRoot!.querySelectorAll(selector));
        } : function(this: HTMLElement) {
            return Array.from(this.querySelectorAll(selector));
        };
        Object.defineProperty(prototype, propertyName, {
            get: getter
        });
    }
}

function fragment(...nodes: (Node | string)[]): DocumentFragment {
    const fragment = document.createDocumentFragment();
    fragment.append(...nodes);
    return fragment;
}

function textNode(text: string): Node {
    return document.createTextNode(text);
}

interface HTMLElementInit {
    options?: ElementCreationOptions,
    attributes?: {
        [name: string]: number | string | boolean | undefined
    },
    dataset?: {
        [property: string]: string | number | boolean
    },
    children?: Node | string | (Node | string)[] | NodeList | ReactiveChildElements,
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined]
    }
}

function element<E extends HTMLElementTagNameMap[K], K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLElementInit): E;
function element(
    tagName: string, init?: HTMLElementInit): HTMLElement;
function element<K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLElementInit): HTMLElementTagNameMap[K] {
    if (init) {
        const {options, attributes, dataset, children, listeners} = init;
        const element = document.createElement(tagName, options);
        if (attributes) {
            Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
                if (attributeValue !== undefined) {
                    if (typeof attributeValue === "boolean") {
                        element.toggleAttribute(camelToTrain(attributeName), attributeValue);
                    }
                    else {
                        element.setAttribute(camelToTrain(attributeName), String(attributeValue));
                    }
                }
            });
        }
        if (dataset) {
            const {dataset: elementDataset} = element;
            Object.keys(dataset).forEach((datasetEntry_i) => {
                elementDataset[datasetEntry_i] = String(dataset[datasetEntry_i]);
            });
        }
        if (children) {
            if (typeof children === "function") {
                children(element);
            }
            else if (typeof children === "object" && "length" in children) {
                element.append(...Array.from(children));
            }
            else {
                element.append(children);
            }
        }
        if (listeners) {
            Object.entries(listeners).forEach(([name_i, listener_i]) => {
                if (Array.isArray(listener_i)) {
                    element.addEventListener(name_i, listener_i[0], listener_i[1]);
                }
                else {
                    element.addEventListener(name_i, listener_i);
                }
            });
        }
        return element;
    }
    return document.createElement(tagName);
}

const reactiveElementsMap = new WeakMap<ModelNode, {
    observerOptions: ModelChangeObserverOptions,
    reactiveElementsArray: {
        elementRef: WeakRef<Element>,
        properties: string[],
        react: (element: any, property: string, oldValue: any, newValue: any) => void;
    }[]
}>();

const reactiveElementsFinalizationRegistry = new FinalizationRegistry((heldValue: {
    model: ModelNode,
    reactiveElement: {
        elementRef: WeakRef<Element>,
        properties: string[],
        react: (element: any, property: string, oldValue: any, newValue: any) => void;
    }
}) => {
    const {model, reactiveElement} = heldValue;
    const reactiveElementsMapEntry = reactiveElementsMap.get(model);
    if (reactiveElementsMapEntry !== undefined) {
        const {reactiveElementsArray} = reactiveElementsMapEntry;
        reactiveElementsArray.splice(reactiveElementsArray.indexOf(reactiveElement), 1);
    }
});

const reactiveElementsPropertyObserver = new ModelChangeObserver((records: ModelChangeRecord[]) => {
    records.forEach((record_i) => {
        const {target, propertyName, oldValue, newValue} = record_i;
        const {reactiveElementsArray} = reactiveElementsMap.get(target)!;
        reactiveElementsArray.forEach(reactiveElement_i => {
            const {elementRef, react, properties} = reactiveElement_i;
            const element = elementRef.deref();
            if (element) {
                if (properties.includes(propertyName!)) {
                    react(element, propertyName!, oldValue, newValue);
                }
            }
        });
    });
});

function reactiveElement<M extends ModelNode, E extends Element, K extends string>(
    model: M,
    element: E,
    properties: K[],
    react: (object: E, property: K, oldValue: any, newValue: any) => void
): E;
function reactiveElement<M extends ModelNode, E extends Element>(
    model: M,
    element: E,
    properties: string[],
    react: (element: E, property: string, oldValue: any, newValue: any) => void
): E {
    const elementRef = new WeakRef(element);
    const reactiveElement = {elementRef, react, properties};
    const reactiveElementsMapEntry = reactiveElementsMap.get(model);
    reactiveElementsFinalizationRegistry.register(element, {model, reactiveElement});
    if (!reactiveElementsMapEntry) {
        const observerOptions = {
            properties: true,
            propertiesFilter: properties
        };
        const reactiveElementsArray = [reactiveElement];
        reactiveElementsMap.set(model, {observerOptions, reactiveElementsArray});
        reactiveElementsPropertyObserver.observe(model, observerOptions);
    }
    else {
        const {reactiveElementsArray, observerOptions} = reactiveElementsMapEntry;
        const {propertiesFilter} = observerOptions;
        reactiveElementsArray.push(reactiveElement);
        observerOptions.propertiesFilter = propertiesFilter ?
            propertiesFilter.concat(properties.filter(
                property_i => !propertiesFilter.includes(property_i)
            )) : properties.filter(
                (property_i, i, properties) => properties.indexOf(property_i) === i
            )
    }
    properties.forEach((property_i) => {
        if (property_i in model) {
            const value = Reflect.get(model, property_i, model);
            if (value !== undefined) {
                react(element, <any>property_i, <any>undefined, value);
            }
        }
    });
    return element;
}

interface ReactiveChildElements {
    (parent: Node & ParentNode): void;
}

const reactiveChildElementsMap = new WeakMap<ModelList, {
    reactiveChildElementsArray: {
        parentRef: WeakRef<ParentNode>,
        mapping: (item: any) => Element,
        placeholder?: Element
    }[]
}>();

const reactiveChildElementsFinalizationRegistry = new FinalizationRegistry((heldValue: {
    list: ModelList,
    reactiveChildElement: {
        parentRef: WeakRef<ParentNode>,
        mapping: (item: any) => Element,
        placeholder?: Element
    }
}) => {
    const {list, reactiveChildElement} = heldValue;
    const reactiveChildrenElementsMapEntry = reactiveChildElementsMap.get(list);
    if (reactiveChildrenElementsMapEntry) {
        const {reactiveChildElementsArray} = reactiveChildrenElementsMapEntry;
        reactiveChildElementsArray.splice(reactiveChildElementsArray.indexOf(reactiveChildElement), 1);
    }
});

const reactiveChildElementsObserver = new ModelChangeObserver((records: ModelChangeRecord[]) => {
    let range: null | Range = null;
    Array.from(records.values()).forEach((record_i) => {
        const {target} = record_i;
        const list = <ModelList>target;
        const {length: listLength} = list;
        const {reactiveChildElementsArray} = reactiveChildElementsMap.get(list)!;
        reactiveChildElementsArray.forEach((reactiveChildElements_i) => {
            const {parentRef, mapping, placeholder} = reactiveChildElements_i;
            const parent = parentRef.deref();
            if (parent) {
                const {firstChild, children} = parent;
                const {length: childrenCount} = children;
                if (placeholder && listLength > 0 && firstChild == placeholder) {
                    parent.removeChild(placeholder);
                }
                const {changeType, LIST_INSERT, LIST_REMOVE, LIST_SORT} = record_i;
                switch (changeType) {
                    case LIST_INSERT: {
                        const {insertedIndex, insertedItems} = record_i;
                        const insertedItemsArray = Array.from(insertedItems.values()).map(mapping);
                        const {length: childrenCount} = children;
                        if (insertedIndex < childrenCount) {
                            children[insertedIndex].before(...insertedItemsArray);
                        }
                        else {
                            parent.append(...insertedItemsArray);
                        }
                        break;
                    }
                    case LIST_REMOVE: {
                        const {removedIndex, removedItems} = record_i;
                        const {length: removedCount} = removedItems;
                        range = range ?? document.createRange();
                        const removeEndIndex = removedIndex + (removedCount - 1);
                        if (removeEndIndex < childrenCount) {
                            range.setStartBefore(children[removedIndex]);
                            range.setEndAfter(children[removeEndIndex]);
                            range.deleteContents();
                        }
                        break;
                    }
                    case LIST_SORT: {
                        const {sortedIndices} = record_i;
                        const childrenArray = Array.from(children);
                        parent.append(
                            ...sortedIndices.filter(
                                index_i => index_i < childrenCount
                            ).map(
                                index_i => childrenArray[index_i]
                            )
                        );
                        break;
                    }
                }
                if (listLength == 0 && placeholder) {
                    parent.append(placeholder);
                }
            }
        });
    });
});

function reactiveChildElements<Model extends ModelNode>(
    list: ModelList<Model>,
    mapping: (item: Model) => Element,
    placeholder?: Element
): ReactiveChildElements {
    return (parent: Node & ParentNode) => {
        const parentRef = new WeakRef(parent);
        const reactiveChildElementsMapEntry = reactiveChildElementsMap.get(list);
        const reactiveChildElement = {parentRef, mapping, placeholder};
        reactiveChildElementsFinalizationRegistry.register(parent, {list, reactiveChildElement});
        if (!reactiveChildElementsMapEntry) {
            const reactiveChildElementsArray = [reactiveChildElement];
            reactiveChildElementsMap.set(list, {reactiveChildElementsArray});
            reactiveChildElementsObserver.observe(list, {
                childList: true
            });
        }
        else {
            const {reactiveChildElementsArray} = reactiveChildElementsMapEntry;
            reactiveChildElementsArray.push(reactiveChildElement);
        }
        const children = list.length == 0 && placeholder ?
            [placeholder] : Array.from(list.values()).map(mapping);
        parent.replaceChildren(...children);
    }
}

interface AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;
    attach(element: Element): void;
    detach(element: Element): void;
}

type AttributeType = "string" | "boolean" | "list";

function areAttributesMatching(
    referenceAttributeType: AttributeType,
    referenceAttributeName: string, referenceAttributeValue: string,
    attributeName: string, attributeValue: string | null): boolean {
    if (referenceAttributeName == attributeName) {
        switch (referenceAttributeType) {
            case "boolean":
                return referenceAttributeValue == "" && attributeValue == "";
            case "string":
                return referenceAttributeValue !== "" && (referenceAttributeValue == attributeValue);
            case "list":
                return (referenceAttributeValue !== "" && attributeValue !== null) && new RegExp(`${referenceAttributeValue}\s*?`, "g").test(attributeValue );
        }
    }
    return false;
}

class AttributeMutationMixinBase implements AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;

    constructor(attributeName: string, attributeType: AttributeType = "boolean", attributeValue: string = "") {
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValue = attributeValue;
    }

    attach(): void {
        throw new TypeError("Not implemented method.");
    }

    detach(): void {
        throw new TypeError("Not implemented method.");
    }
}