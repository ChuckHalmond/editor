import { EventDispatcher } from "../events/EventDispatcher";
import { ListModel, ListModelChangeEvent, ObjectModel, ObjectModelChangeEvent } from "../models/Model";
import { camelToTrain, titlize } from "./Snippets";

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
        options?: ElementDefinitionOptions
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}

const RegisterCustomHTMLElement: RegisterCustomHTMLElementDecorator = function(args: {
    name: string;
    attributes?: string[],
    options?: ElementDefinitionOptions
}) {
    return <C extends CustomElementConstructor>(
        elementCtor: C
    ) => {
        const { name, options } = args;

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

interface GenerateAttributeAccessorsDecorator {
    (attributes: {
        name: string,
        type?: "string" | "number" | "boolean" | "json"
    }[]): <C extends {readonly prototype: HTMLElement}>(elementCtor: C) => C;
}

const GenerateAttributeAccessors: GenerateAttributeAccessorsDecorator = function(attributes: {
    name: string,
    type?: "string" | "number" | "boolean" | "json"
}[]) {
    return <C extends {readonly prototype: HTMLElement}>(
        elementCtor: C
    ) => {
        attributes.forEach((attr: {
            name: string,
            type?: "string" | "number" | "boolean" | "json"
        }) => {
            const name = camelToTrain(attr.name);
            const type = attr.type;
            switch (type) {
                case "boolean":
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function(this: HTMLElement) {
                            const val = this.getAttribute(name);
                            return (val === "" || false);
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
                case "json":
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function(this: HTMLElement) {
                            const val = this.getAttribute(name);
                            return (val !== null) ? JSON.parse(val) : null;
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
                case "number":
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function(this: HTMLElement) {
                            const val = this.getAttribute(name);
                            return (val !== null) ? parseFloat(val) : val;
                        },
                        set: function(this: HTMLElement, value) {
                            if (value) {
                                this.setAttribute(name, value);
                            }
                            else {
                                this.removeAttribute(name);
                            }
                        }
                    });
                    break;
                case "string":
                default:
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function(this: HTMLElement) {
                            const val = this.getAttribute(name);
                            return val;
                        },
                        set: function(this: HTMLElement, value) {
                            if (value) {
                                this.setAttribute(name, value);
                            }
                            else {
                                this.removeAttribute(name);
                            }
                        }
                    });
                    break;
            }
        });

        return elementCtor;
    }
}

interface GenerateDatasetAccessorsDecorator {
    (attributes: {
        name: string,
        type?: "string" | "number" | "boolean" | "json"
    }[]): <C extends {readonly prototype: HTMLElement}>(elementCtor: C) => C;
}

const GenerateDatasetAccessors: GenerateDatasetAccessorsDecorator = function(dataset: {
    name: string,
    type?: "string" | "number" | "boolean" | "json"
}[]) {
    return <C extends {readonly prototype: HTMLElement}>(
        elementCtor: C
    ) => {
        dataset.forEach((datasetEntry: {
            name: string,
            type?: "string" | "number" | "boolean" | "json"
        }) => {
            const dataEntryName = datasetEntry.name;
            const accessorName = `data${titlize(dataEntryName)}`;
            const type = datasetEntry.type;
            switch (type) {
                case "boolean":
                    Object.defineProperty(elementCtor.prototype, accessorName, {
                        get: function(this: HTMLElement) {
                            const val = this.dataset[dataEntryName];
                            return (val === "");
                        },
                        set: function(this: HTMLElement, value) {
                            if (value) {
                                this.dataset[dataEntryName] = "";
                            }
                            else {
                                this.dataset[dataEntryName] = void 0;
                            }
                        }
                    });
                    break;
                case "json":
                    Object.defineProperty(elementCtor.prototype, accessorName, {
                        get: function(this: HTMLElement) {
                            const val = this.dataset[dataEntryName];
                            return (typeof val !== "undefined") ? JSON.parse(val) : val;
                        },
                        set: function(this: HTMLElement, value) {
                            if (typeof value !== "undefined") {
                                this.dataset[dataEntryName] = JSON.stringify(value);
                            }
                            else {
                                this.dataset[dataEntryName] = void 0;
                            }
                        }
                    });
                    break;
                case "number":
                    Object.defineProperty(elementCtor.prototype, accessorName, {
                        get: function(this: HTMLElement) {
                            const val = this.dataset[dataEntryName];
                            return (typeof val !== "undefined") ? parseFloat(val) : val;
                        },
                        set: function(this: HTMLElement, value) {
                            if (typeof value !== "undefined") {
                                this.dataset[dataEntryName] = value.toString();
                            }
                            else {
                                this.dataset[dataEntryName] = void 0;
                            }
                        }
                    });
                    break;
                case "string":
                default:
                    Object.defineProperty(elementCtor.prototype, accessorName, {
                        get: function(this: HTMLElement) {
                            return this.dataset[dataEntryName];
                        },
                        set: function(this: HTMLElement, value) {
                            this.dataset[dataEntryName] = value;
                        }
                    });
                    break;
            }
        });

        return elementCtor;
    }
}

function bindShadowRoot(element: HTMLElement, templateContent?: string): ShadowRoot {
    const root = element.attachShadow({mode: "open"});
    const template = document.createElement("template");
    if (typeof templateContent !== "undefined") {
        template.innerHTML = templateContent;
    }
    root.appendChild(template.content.cloneNode(true));
    return root;
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
    [P in keyof T]-?: _IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

interface HTMLInit<E extends HTMLElement> {
    options?: ElementCreationOptions,
    props?: Partial<Pick<E, WritableKeys<E>>>,
    part?: string[],
    attrs?: {[name: string]: number | string | boolean},
    styles?: {
        [property: string]: string | [string, string]
    },
    dataset?: DOMStringMap,
    children?: Node[] | NodeList | ReactiveChildNodes,
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[EventName]) => void | [(event: HTMLElementEventMap[EventName]) => void, Partial<boolean | AddEventListenerOptions>]
    }
}

function Element<E extends HTMLElementTagNameMap[K], K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLInit<E>):E;
function Element<K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLInit<HTMLElementTagNameMap[K]>): HTMLElementTagNameMap[K] {
        const element = document.createElement(tagName, init?.options);
        if (init) {
            const { props, part, attrs, dataset, children, listeners, styles } = init;
            if (props) {
                const keys = Object.keys(props) as (keyof Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>)[];
                keys.forEach((key) => {
                    const value = props[key];
                    if (typeof props[key] !== "undefined") {
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
            if (attrs) {
                Object.keys(attrs).forEach((attrName) => {
                    const value = attrs[attrName];
                    if (typeof value === "boolean") {
                        if (value) {
                            element.setAttribute(camelToTrain(attrName), "");
                        }
                    }
                    else {
                        element.setAttribute(camelToTrain(attrName), value.toString());
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
                    element.replaceChildren(...children);
                }
            }
            if (listeners) {
                Object.entries(listeners).forEach((entry) => {
                    if (Array.isArray(entry[1])) {
                        element.addEventListener(entry[0], entry[1][0] as EventListener, entry[1][1]);
                    }
                    else {
                        element.addEventListener(entry[0], entry[1] as EventListener);
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

function isParentNode(node: Node): node is Node & ParentNode {
    return node.hasChildNodes();
}

function isElement(node: Node): node is Element {
    return node.nodeType === node.ELEMENT_NODE;
}

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
        if ("items" in objectOrList) {
            const listener = (event: ListModelChangeEvent) => {
                react(node,  event.data.addedItems as any, event.data.removedItems as any, event.data.index as any);
            };
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
            react(node, objectOrList.items as any, [], 0 as any);
        }
        else {
            const listener = (event: ObjectModelChangeEvent) => {
                react(node, event.data.property as any, event.data.oldValue, event.data.newValue);
            };
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
            const keys = Object.keys(objectOrList) as (keyof Data)[];
            keys.forEach((key) => {
                react(node, key as any, void 0 as any, (objectOrList as any)[key] as any);
            });
        }
        return node;
}

interface ReactiveChildNodes {
    (parent: Node & ParentNode): (Node | string)[]
}

function ReactiveChildNodes<Item extends any>(list: ListModel<Item>, map: (item: Item) => Node | string, placeholder?: Node): ReactiveChildNodes {
    return (parent: Node & ParentNode) => {
        const listener = (event: ListModelChangeEvent) => {
            if (event.data.addedItems.length === list.items.length) {
                parent.textContent = "";
            }
            if (event.data.removedItems.length) {
                for (let i = 0; i < event.data.removedItems.length; i++) {
                    if (parent.childNodes.length > event.data.index) {
                        parent.childNodes.item(event.data.index).remove();
                    }
                }
            }
            if (event.data.addedItems.length) {
                let addedElements = event.data.addedItems.map(item => map(item));
                if (event.data.index >= list.items.length - event.data.addedItems.length) {
                    parent.append(...addedElements);
                }
                else {
                    parent.childNodes.item(event.data.index - event.data.removedItems.length)!.before(...addedElements);
                }
            }
            if (list.items.length === 0 && placeholder) {
                parent.append(placeholder);
            }
        };
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
        const children = placeholder && list.items.length === 0 ? [placeholder] : list.items.map(map);
        return children;
    }
}

interface AttributeMutationMixin {
    readonly attributeName: string;
    readonly attributeValue: string;
    readonly attributeType: AttributeType;
    attach(element: Element): void;
    detach(element: Element): void;
}

type AttributeType = "string" | "boolean" | "listitem";

function areAttributesMatching(refAttributeType: AttributeType, refAttrName: string, refAttrValue: string, attrName: string, attrValue: string | null): boolean {
    if (refAttrName == attrName) {
        switch (refAttributeType) {
            case "boolean":
                return refAttrValue == "" && attrValue == "";
            case "string":
                return refAttrValue !== "" && (refAttrValue === attrValue);
            case "listitem":
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