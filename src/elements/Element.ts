import { Widget, widgets } from "../views/widgets/Widget";
import { ModelList, ModelNode, ModelChangeRecord, ModelChangeObserver, ModelChangeObserverOptions } from "../models/Model";
import { camelToTrain } from "./Snippets";

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
    (
        init: {
            type: typeof String;
            observed?: boolean;
            defaultValue?: string | null;
        }
    ): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (
        init: {
            type: typeof Number;
            observed?: boolean;
            defaultValue?: number | null;
        }
    ): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (
        init: {
            type: typeof Boolean;
            observed?: boolean;
        }
    ): <E extends HTMLElement>(target: E, property: keyof E) => void;
    (
        init: {
            type: typeof Object;
            observed?: boolean;
            defaultValue?: any | null;
        }
    ): <E extends HTMLElement>(target: E, property: keyof E) => void;
}

const AttributeProperty: AttributePropertyDecorator = function(
    init: {
        type: typeof String | typeof Number | typeof Boolean | typeof Object;
        observed?: boolean;
        defaultValue?: string | number | any | null;
    }
) {
    return <E extends HTMLElement>(
        target: E, property: keyof E
    ) => {
        const {constructor} = target;
        const {prototype} = constructor;
        const propertyName = property.toString();
        const attributeName = camelToTrain(propertyName);
        const defaultValue = init.defaultValue ?? null;
        const observed = init.observed ?? false;
        if (observed) {
            const observedAttributes = Reflect.get(constructor, "observedAttributes", constructor);
            if (Array.isArray(observedAttributes)) {
                observedAttributes.push(attributeName);
            }
            else {
                Object.defineProperty(
                    constructor, "observedAttributes", {
                        value: [attributeName],
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
                        return this.hasAttribute(attributeName);
                    },
                    set: function(this: HTMLElement, value) {
                        if (value) {
                            this.setAttribute(attributeName, "");
                        }
                        else {
                            this.removeAttribute(attributeName);
                        }
                    }
                });
                break;
            }
            case Object: {
                Object.defineProperty(prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        const val = this.getAttribute(attributeName);
                        return (val !== null) ? JSON.parse(val) : defaultValue;
                    },
                    set: function(this: HTMLElement, value) {
                        if (value !== null) {
                            this.setAttribute(attributeName, JSON.stringify(value));
                        }
                        else {
                            this.removeAttribute(attributeName);
                        }
                    }
                });
                break;
            }
            case Number: {
                Object.defineProperty(prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        const val = this.getAttribute(attributeName);
                        return (val !== null) ? parseFloat(val) : defaultValue;
                    },
                    set: function(this: HTMLElement, value) {
                        if (value !== null) {
                            this.setAttribute(attributeName, value);
                        }
                        else {
                            this.removeAttribute(attributeName);
                        }
                    }
                });
                break;
            }
            case String:
            default: {
                Object.defineProperty(prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        const val = this.getAttribute(attributeName);
                        return (val !== null) ? val : defaultValue;
                    },
                    set: function(this: HTMLElement, value) {
                        if (value !== null) {
                            this.setAttribute(attributeName, value);
                        }
                        else {
                            this.removeAttribute(attributeName);
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

interface WidgetDecorator {
    (init: {
        name: string;
    }): <W extends Widget>(widget: W) => W;
}

const CustomWidget: WidgetDecorator = function(init: {
    name: string;
}) {
    return <W extends Widget>(
        widget: W
    ) => {
        const {name} = init;
        widgets.define(
            name,
            widget
        );
        return widget;
    }
}

function *subtreeNodes(node: Node): Generator<Node> {
    yield node;
    const childNodes = node.childNodes;
    const childNodesCount = childNodes.length;
    let childIndex = 0;
    while (childIndex < childNodesCount) {
        const child = childNodes.item(childIndex);
        if (child !== null) {
            yield * subtreeNodes(child);
        }
        childIndex++;
    }
}

function *ancestorNodes(node: Node): Generator<Node> {
    const {parentNode} = node;
    if (parentNode) {
        yield parentNode;
        yield *ancestorNodes(parentNode);
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
        const propertyName = propertyKey.toString();
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
        const propertyName = propertyKey.toString();
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

function Fragment(...nodes: (Node | string)[]): DocumentFragment {
    const fragment = document.createDocumentFragment();
    fragment.append(...nodes);
    return fragment;
}

function TextNode(text: string): Node {
    return document.createTextNode(text);
}

type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>
}[keyof T];

type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T];

interface HTMLElementInit<E extends HTMLElement> {
    options?: ElementCreationOptions,
    properties?: Partial<Pick<E, WritableKeys<E>>>,
    part?: string[],
    exportParts?: string[],
    attributes?: {[name: string]: number | string | boolean},
    style?: {
        [property: string]: string | [string, string]
    },
    dataset?: {
        [property: string]: string | number | boolean
    },
    children?: (Node | string)[] | NodeList | ReactiveChildElements,
    eventListeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined]
    }
}

interface HTMLElementInitMap {
    "template": HTMLTemplateInit;
}

interface HTMLTemplateInit extends HTMLElementInit<HTMLTemplateElement> {
    content?: (Node | string)[] | NodeList;
}

function element<E extends HTMLElementTagNameMap[K], K extends keyof HTMLElementInitMap>(
    tagName: K, init?: HTMLElementInitMap[K]): E;
function element<E extends HTMLElementTagNameMap[K], K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLElementInit<E>): E;
function element(
    tagName: string, init?: HTMLElementInit<HTMLElement>): HTMLElement;
function element<K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLElementInit<HTMLElementTagNameMap[K]>): HTMLElementTagNameMap[K] {
    if (init) {
        const {options, properties, part, exportParts, attributes, dataset, children, eventListeners, style} = init;
        const element = document.createElement(tagName, options);
        if (options) {
            const {is: isBuiltinElement} = options;
            if (isBuiltinElement) {
                element.setAttribute("is", isBuiltinElement)
            }
        }
        if (properties) {
            const keys = Object.keys(properties);
            keys.forEach((key_i) => {
                const value = Reflect.get(properties, key_i, properties);
                if (value !== void 0) {
                    Object.assign(
                        element, {
                            [key_i]: value
                        }
                    );
                }
            });
        }
        if (part) {
            const {part: elementPart} = element;
            part.forEach((part) => {
                elementPart.add(part);
            });
        }
        if (exportParts) {
            element.setAttribute("exportparts", exportParts.join(", "));
        }
        if (attributes) {
            Object.keys(attributes).forEach((attributeName) => {
                const attributeValue = attributes[attributeName];
                if (typeof attributeValue == "boolean") {
                    if (attributeValue) {
                        element.setAttribute(camelToTrain(attributeName), "");
                    }
                }
                else {
                    element.setAttribute(camelToTrain(attributeName), attributeValue.toString());
                }
            });
        }
        if (style) {
            const {style: elementStyle} = element;
            Object.keys(style).forEach((property_i) => {
                if (Array.isArray(style[property_i])) {
                    elementStyle.setProperty(property_i, style[property_i][0], style[property_i][1]);
                }
                else {
                    elementStyle.setProperty(property_i, <string>style[property_i]);
                }
            });
        }
        if (dataset) {
            const {dataset: elementDataset} = element;
            Object.keys(dataset).forEach((datasetEntry_i) => {
                elementDataset[datasetEntry_i] = dataset[datasetEntry_i].toString();
            });
        }
        if (children) {
            if (typeof children == "function") {
                element.append(...children(element));
            }
            else {
                element.append(...Array.from(children));
            }
        }
        if (eventListeners) {
            Object.entries(eventListeners).forEach(([name_i, listener_i]) => {
                if (Array.isArray(listener_i)) {
                    element.addEventListener(name_i, listener_i[0], listener_i[1]);
                }
                else {
                    element.addEventListener(name_i, listener_i);
                }
            });
        }
        switch (tagName) {
            case "template":
                const {content} = init as HTMLTemplateInit;
                if (content) {
                    (<HTMLTemplateElement>element).content.append(
                        ...Array.from(content)
                    );
                }
                break;
        }
        return element;
    }
    return document.createElement(tagName);
}

interface WidgetInit<K extends keyof WidgetNameMap> {
    properties?: Parameters<WidgetNameMap[K]["create"]>[0],
    attributes?: {[name: string]: number | string | boolean},
    style?: {
        [property: string]: string | [string, string]
    },
    dataset?: {
        [property: string]: string | number | boolean
    },
    children?: (Node | string)[] | NodeList | ReactiveChildElements,
    eventListeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined]
    }
}

function widget<K extends keyof WidgetNameMap>(
    name: K, init?: WidgetInit<K>): ReturnType<WidgetNameMap[K]["create"]>;
function widget<K extends keyof WidgetNameMap>(
    name: string, init?: WidgetInit<K>): HTMLElement
function widget<K extends keyof WidgetNameMap>(
    name: K, init?: WidgetInit<K>): HTMLElement {
    const element = <HTMLElement>widgets.create(name, init?.properties);
    if (init) {
        const {attributes, dataset, children, eventListeners, style} = init;
        if (attributes) {
            Object.keys(attributes).forEach((attributeName) => {
                const attributeValue = attributes[attributeName];
                if (typeof attributeValue == "boolean") {
                    if (attributeValue) {
                        element.setAttribute(camelToTrain(attributeName), "");
                    }
                }
                else {
                    element.setAttribute(camelToTrain(attributeName), attributeValue.toString());
                }
            });
        }
        if (style) {
            const {style: elementStyle} = element;
            Object.keys(style).forEach((property_i) => {
                if (Array.isArray(style[property_i])) {
                    elementStyle.setProperty(property_i, style[property_i][0], style[property_i][1]);
                }
                else {
                    elementStyle.setProperty(property_i, <string>style[property_i]);
                }
            });
        }
        if (dataset) {
            const {dataset: elementDataset} = element;
            Object.keys(dataset).forEach((datasetEntry_i) => {
                elementDataset[datasetEntry_i] = dataset[datasetEntry_i].toString();
            });
        }
        if (children) {
            if (typeof children == "function") {
                element.append(...children(element));
            }
            else {
                element.append(...Array.from(children));
            }
        }
        if (eventListeners) {
            Object.entries(eventListeners).forEach(([name_i, listener_i]) => {
                if (Array.isArray(listener_i)) {
                    element.addEventListener(name_i, listener_i[0], listener_i[1]);
                }
                else {
                    element.addEventListener(name_i, listener_i);
                }
            });
        }
    }
    return element;
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
    if (reactiveElementsMapEntry !== void 0) {
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
            )) : Array.from(new Set(properties));
    }
    properties.forEach((property_i) => {
        if (property_i in model) {
            const value = Reflect.get(model, property_i, model);
            if (value !== void 0) {
                react(element, <any>property_i, <any>void 0, value);
            }
        }
    });
    return element;
}

interface ReactiveChildElements {
    (parent: Node & ParentNode): (Node | string)[]
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
        return list.length == 0 && placeholder ?
            [placeholder] : Array.from(list.values()).map(mapping);
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