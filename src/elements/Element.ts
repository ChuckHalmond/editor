import { EventDispatcher } from "../events/EventDispatcher";
import { ListModel, ListModelChangeEvent, ObjectModel, ObjectModelChangeEvent } from "../models/Model";
import { camelToTrain } from "./Snippets";

export { CustomElement };
export { AttributeProperty }
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
        const { name, options } = init;

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

interface AttributePropertyDecorator {
    (init: {
        type: "string" | "number" | "boolean" | "json"
    }): <E extends HTMLElement>(target: E, propertyKey: keyof E) => void;
}

const AttributeProperty: AttributePropertyDecorator = function(init: {
    type: "string" | "number" | "boolean" | "json"
}) {
    return <E extends HTMLElement>(
        target: E, propertyKey: keyof E
    ) => {
        const type = init.type;
        const propertyName = propertyKey.toString();
        const attributeName = camelToTrain(propertyName);
        switch (type) {
            case "boolean":
                Object.defineProperty(target.constructor.prototype, propertyName, {
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
            case "json":
                Object.defineProperty(target.constructor.prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        const val = this.getAttribute(attributeName);
                        return (val !== null) ? JSON.parse(val) : null;
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
            case "number":
                Object.defineProperty(target.constructor.prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        const val = this.getAttribute(attributeName);
                        return (val !== null) ? parseFloat(val) : val;
                    },
                    set: function(this: HTMLElement, value) {
                        if (value) {
                            this.setAttribute(attributeName, value);
                        }
                        else {
                            this.removeAttribute(attributeName);
                        }
                    }
                });
                break;
            case "string":
            default:
                Object.defineProperty(target.constructor.prototype, propertyName, {
                    get: function(this: HTMLElement) {
                        return this.getAttribute(attributeName);
                    },
                    set: function(this: HTMLElement, value) {
                        if (value) {
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

function Fragment(...nodes: (Node | string)[]): DocumentFragment {
    const fragment = document.createDocumentFragment();
    fragment.append(...nodes);
    return fragment;
}

function TextNode(text: string = ""): Node {
    return document.createTextNode(text);
}

type _IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

type WritableKeys<T> = {
    [P in keyof T]-?:
        T[P] extends Function ? never : _IfEquals<
            { [Q in P]: T[P] },
            { -readonly [Q in P]: T[P] }
        , P>
}[keyof T];

interface HTMLInit<E extends HTMLElement> {
    options?: ElementCreationOptions,
    properties?: Partial<Pick<E, WritableKeys<E>>>,
    part?: string[],
    exportparts?: string[],
    attributes?: {[name: string]: number | string | boolean},
    styles?: {
        [property: string]: string | [string, string]
    },
    dataset?: DOMStringMap,
    children?: Node[] | NodeList | ReactiveChildNodes,
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined]
    }
}

function HTML<E extends HTMLElementTagNameMap[K], K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLInit<E>): E;
    function HTML(
        tagName: string, init?: HTMLInit<HTMLElement>): HTMLElement;
function HTML<K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLInit<HTMLElementTagNameMap[K]>): HTMLElementTagNameMap[K] {
        const element = document.createElement(tagName, init?.options);
        if (init && init.options && init.options.is) {
            element.setAttribute("is", init.options.is)
        }
        if (init) {
            const { properties, part, exportparts, attributes, dataset, children, listeners, styles } = init;
            if (properties) {
                const keys = Object.keys(properties) as (keyof Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>)[];
                keys.forEach((key) => {
                    const value = properties[key];
                    if (typeof properties[key] !== "undefined") {
                        Object.assign(
                            element, {
                                [key]: value
                            }
                        );
                    }
                });
            }
            if (part) {
                part.forEach((part) => {
                    element.part.add(part);
                });
            }
            if (exportparts) {
                element.setAttribute("exportparts", exportparts.join(", "));
            }
            if (attributes) {
                Object.keys(attributes).forEach((attributeName) => {
                    const attributeValue = attributes[attributeName];
                    if (typeof attributeValue === "boolean") {
                        if (attributeValue) {
                            element.setAttribute(camelToTrain(attributeName), "");
                        }
                    }
                    else {
                        element.setAttribute(camelToTrain(attributeName), attributeValue.toString());
                    }
                });
            }
            if (styles) {
                Object.keys(styles).forEach((property) => {
                    if (Array.isArray(styles[property])) {
                        element.style.setProperty(property, styles[property][0], styles[property][1]);
                    }
                    else {
                        element.style.setProperty(property, styles[property] as string);
                    }
                });
            }
            if (dataset) {
                Object.keys(dataset).forEach((datasetEntry) => {
                    element.dataset[datasetEntry] = dataset[datasetEntry];
                });
            }
            if (children) {
                if (typeof children === "function") {
                    element.replaceChildren(...children(element));
                }
                else {
                    element.replaceChildren(...(Array.isArray(children) ? children : Array.from(children)));
                }
            }
            if (listeners) {
                Object.entries(listeners).forEach((entry) => {
                    if (Array.isArray(entry[1])) {
                        element.addEventListener(entry[0], entry[1][0], entry[1][1]);
                    }
                    else {
                        element.addEventListener(entry[0], entry[1]);
                    }
                });
            }
        }
        return element;
}

type ReactiveNode = Node & {
    _reactiveNodeAttributes: {
        addReactListener: () => void;
        removeReactListener: () => void;
    }
};

type ReactiveParentNode = Node & {
    _reactiveParentNodeAttributes: {
        addReactListener: () => void;
        removeReactListener: () => void;
    }
};

function isReactiveNode(node: Node): node is ReactiveNode {
    return typeof (node as ReactiveNode)._reactiveNodeAttributes === "object" &&
        typeof (node as ReactiveNode)._reactiveNodeAttributes.addReactListener === "function" &&
        typeof (node as ReactiveNode)._reactiveNodeAttributes.removeReactListener === "function";
}

function isReactiveParentNode(node: Node): node is ReactiveParentNode {
    return typeof (node as ReactiveParentNode)._reactiveParentNodeAttributes === "object" &&
        typeof (node as ReactiveParentNode)._reactiveParentNodeAttributes.addReactListener === "function" &&
        typeof (node as ReactiveParentNode)._reactiveParentNodeAttributes.removeReactListener === "function";
}

function ReactiveNode<Data extends object, N extends Node>
    (list: ListModel<Data>, node: N, react: (node: N, addedItems: Data[], removedItems: Data[], index: number) => void): N
function ReactiveNode<Model extends ObjectModel, N extends Node>
    (object: Model, node: N, react: <K extends Exclude<keyof Model, keyof EventDispatcher>>(node: N, property: K, oldValue: Model[K], newValue: Model[K]) => void): N
function ReactiveNode<Data extends object, N extends Node>
    (objectOrList: ObjectModel | ListModel<Data>, node: N, react: (<K extends keyof Data>(node: N, property: K, oldValue: Data[K], newValue: Data[K]) => void)
    | ((node: N, addedItems: Data[], removedItems: Data[], index: number) => void)): N {
        if ("clear" in objectOrList) {
            const listener = ((event: ListModelChangeEvent) => {
                react(node,  event.detail.addedItems as any, event.detail.removedItems as any, event.detail.index as any);
            }) as EventListener;
            Object.assign(
                node, {
                    _reactiveNodeAttributes: {
                        addReactListener: () => {
                            objectOrList.addEventListener("listmodelchange", listener);
                        },
                        removeReactListener: () => {
                            objectOrList.removeEventListener("listmodelchange", listener);
                        }
                    }
                }
            ) as ReactiveNode;
        }
        else {
            const listener = ((event: ObjectModelChangeEvent) => {
                react(node, event.detail.property as any, event.detail.oldValue, event.detail.newValue);
            }) as EventListener;
            Object.assign(
                node, {
                    _reactiveNodeAttributes: {
                        addReactListener: () => {
                            objectOrList.addEventListener("objectmodelchange", listener);
                        },
                        removeReactListener: () => {
                            objectOrList.removeEventListener("objectmodelchange", listener);
                        }
                    }
                }
            ) as ReactiveNode;
        }
        return node;
}

interface ReactiveChildNodes {
    (parent: Node & ParentNode): (Node | string)[]
}

function ReactiveChildNodes<Item extends any>(list: ListModel<Item>, map: (item: Item) => Node | string, placeholder?: Node): ReactiveChildNodes {
    return (parent: Node & ParentNode) => {
        const mapping = (item: Item) => {
            const node = map(item);
            if (node instanceof DocumentFragment) {
                console.warn("DocumentFragment with several child nodes are not supported in ReactiveChildNodes map.");
                return node.firstChild || "";
            }
            return node;
        };
        const listener = ((event: ListModelChangeEvent) => {
            const listLength = list.length();
            if (listLength === event.detail.addedItems.length) {
                parent.replaceChildren("");
            }
            if (event.detail.removedItems.length) {
                for (let i = 0; i < event.detail.removedItems.length; i++) {
                    if (parent.childNodes.length > event.detail.index) {
                        parent.childNodes.item(event.detail.index).remove();
                    }
                }
            }
            if (event.detail.addedItems.length) {
                const addedNodes = event.detail.addedItems.map(mapping);
                if (event.detail.index >= listLength - event.detail.addedItems.length) {
                    parent.append(...addedNodes);
                }
                else {
                    parent.childNodes.item(event.detail.index - event.detail.removedItems.length)!.before(...addedNodes);
                }
            }
            if (listLength === 0 && placeholder) {
                parent.replaceChildren(placeholder);
            }
        }) as EventListener;
        Object.assign(
            parent, {
                _reactiveParentNodeAttributes: {
                    addReactListener: () => {
                        list.addEventListener("listmodelchange", listener);
                    },
                    removeReactListener: () => {
                        list.removeEventListener("listmodelchange", listener);
                    }
                }
            }
        ) as ReactiveParentNode;
        return list.length() === 0 && placeholder ?
            [placeholder] : list.getAll().map(mapping);
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

function areAttributesMatching(refAttributeType: AttributeType, refAttrName: string, refAttrValue: string, attrName: string, attrValue: string | null): boolean {
    if (refAttrName == attrName) {
        switch (refAttributeType) {
            case "boolean":
                return refAttrValue == "" && attrValue == "";
            case "string":
                return refAttrValue !== "" && (refAttrValue === attrValue);
            case "list":
                return (refAttrValue !== "" && attrValue !== null) && new RegExp(`${refAttrValue}\s*?`, "g").test(attrValue);
        }
    }
    return false;
}

abstract class AttributeMutationMixinBase implements AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;

    constructor(attributeName: string, attributeType: AttributeType = "boolean", attributeValue: string = "") {
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValue = attributeValue;
    }

    public abstract attach(element: Element): void;
    public abstract detach(element: Element): void;
}