import { isListModel, isObjectModel, ListModel, ListModelChangeEvent, ObjectModel, ObjectModelChangeEvent } from "../models/Model";
import { camelToTrain, forAllSubtreeElements } from "./Snippets";

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
export { createMutationObserverCallback };
export { Fragment };
export { TextNode };
export { setHTMLElementEventListeners };
export { parseStringTemplate };

function isTagElement<K extends keyof HTMLElementTagNameMap>(tagName: K, obj: any): obj is HTMLElementTagNameMap[K] {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && (obj as Element).tagName.toLowerCase() == tagName;
}

interface RegisterCustomHTMLElementDecorator {
    (args: {
        name: string;
        observedAttributes?: string[],
        options?: ElementDefinitionOptions
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}

function parseStringTemplate(template: string, items: {[key: string]: Node | string}): DocumentFragment {
    const regexp = /\[(.*?)\]/gm;
    const itemsKeys = Object.keys(items);
    let result: RegExpExecArray  | null;
    let resultNodes: (Node | string)[] = [];
    let lastResultIndex = 0;
    while ((result = regexp.exec(template)) !== null) {
        if (result.index >= lastResultIndex) {
            resultNodes.push(document.createTextNode(template.substring(lastResultIndex, result.index)));
        }
        if (itemsKeys.indexOf(result[1]) > -1) {
            resultNodes.push(items[result[1]]);
        }
        lastResultIndex = result.index + result[0].length;
    }
    let fragment = new DocumentFragment();
    fragment.append(...resultNodes, template.substring(lastResultIndex, template.length));
    return fragment;
}

const RegisterCustomHTMLElement: RegisterCustomHTMLElementDecorator = function(args: {
    name: string;
    attributes?: string[],
    observedAttributes?: string[],
    options?: ElementDefinitionOptions
}) {
    return <C extends CustomElementConstructor>(
        elementCtor: C
    ) => {
        const { name, observedAttributes, options } = args;

        if (observedAttributes) {
            Object.defineProperty(elementCtor.prototype.constructor, 'observedAttributes', {
                get: () => {
                    return observedAttributes;
                }
            });
        }

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
    }[]): <C extends CustomElementConstructor>(elementCtor: C) => C;
}

const GenerateAttributeAccessors: GenerateAttributeAccessorsDecorator = function(attributes: {
    name: string,
    type?: "string" | "number" | "boolean" | "json"
}[]) {
    return <C extends CustomElementConstructor>(
        elementCtor: C
    ) => {
        attributes.forEach((attr: {
            name: string,
            type?: "string" | "number" | "boolean" | "json"
        }) => {
            const { name,  type } = attr;
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
    let fragment = document.createDocumentFragment();
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

interface HTMLInit<K extends keyof HTMLElementTagNameMap> {
    options?: ElementCreationOptions,
    props?: Partial<Pick<HTMLElementTagNameMap[K], WritableKeys<HTMLElementTagNameMap[K]>>>,
    attrs?: {[name: string]: number | string | boolean},
    children?: Node[] | NodeList | ReactiveChildNodes,
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[EventName]) => void | [(event: HTMLElementEventMap[EventName]) => void, Partial<boolean | AddEventListenerOptions>]
    },
    styles?: {
        [property: string]: string | [string, string]
    }
}

function Element<K extends keyof HTMLElementTagNameMap>(
    tagName: K, init?: HTMLInit<K>): HTMLElementTagNameMap[K] {
        const element = document.createElement(tagName, init?.options);
        if (init) {
            if (init.props) {
                setElementProperties(element, init.props);
            }
            if (init.attrs) {
                setElementAttributes(element, init.attrs);
            }
            if (init.children) {
                if (typeof init.children === "function") {
                    setElementChildren(element, init.children(element));
                }
                else {
                    setElementChildren(element, init.children);
                }
            }
            if (init.listeners) {
                setHTMLElementEventListeners(element, init.listeners);
            }
            if (init.styles) {
                setHTMLElementStyles(element, init.styles);
            }
        }
        return element;
}

type ReactiveNode = Node & ({
    _reactAttributes: {
        _reactModel: ObjectModel<object>,
        _reactEvent: "objectmodelchange",
        _reactListener: (event: ObjectModelChangeEvent) => void;
    }
 } | {
    _reactAttributes: {
        _reactModel: ListModel<object>,
        _reactEvent: "listmodelchange",
        _reactListener: (event: ListModelChangeEvent) => void;
    }
})

function isParentNode(node: Node): node is Node & ParentNode {
    return node.hasChildNodes();
}

function isElement(node: Node): node is Element {
    return node.nodeType === node.ELEMENT_NODE;
}

function isReactiveNode(node: Node): node is ReactiveNode {
    return typeof (node as ReactiveNode)._reactAttributes === "object" &&
        (node as ReactiveNode)._reactAttributes._reactEvent === "objectmodelchange" &&
        typeof (node as ReactiveNode)._reactAttributes._reactListener === "function" &&
        isObjectModel((node as ReactiveNode)._reactAttributes._reactModel) ||
        isListModel((node as ReactiveNode)._reactAttributes._reactModel);
}

type ReactiveParentNode = (Node & ParentNode) & {
    _reactAttributes: {
        _reactModel: ListModel<object>,
        _reactEvent: "listmodelchange",
        _reactListener: (event: ListModelChangeEvent) => void;
    }
}

function isReactiveParentNode(node: Node): node is ReactiveParentNode {
    return typeof (node as ReactiveParentNode)._reactAttributes === "object" &&
        (node as ReactiveParentNode)._reactAttributes._reactEvent === "listmodelchange" &&
        typeof (node as ReactiveParentNode)._reactAttributes._reactListener === "function" &&
        isListModel((node as ReactiveParentNode)._reactAttributes._reactModel);
}

function ReactiveNode<Data extends object, N extends Node>
    (node: N, list: ListModel<Data>, react: (node: N, index: number, removedItems: Data[], addedItems: Data[]) => void): N
function ReactiveNode<Data extends object, N extends Node>
    (node: N, object: ObjectModel<Data>, react: <K extends keyof Data>(node: N, property: K, oldValue: Data[K], newValue: Data[K]) => void): N
function ReactiveNode<Data extends object, N extends Node>
    (node: N, objectOrList: ObjectModel<Data> | ListModel<Data>, react: (<K extends keyof Data>(node: N, property: K, oldValue: Data[K], newValue: Data[K]) => void)
    | ((node: N, index: number, removedItems: Data[], addedItems: Data[]) => void)): N {
        if ("items" in objectOrList) {
            Object.assign(
                node, {
                    _reactAttributes: {
                        _reactModel: objectOrList,
                        _reactEvent: "listmodelchange",
                        _reactListener: (event: ListModelChangeEvent) => {
                            react(node, event.data.index as any, event.data.removedItems as any, event.data.addedItems as any);
                        }
                    }
                }
            ) as ReactiveNode;
            react(node, 0 as any, objectOrList.items as any, []);
        }
        else {
            Object.assign(
                node, {
                    _reactAttributes: {
                        _reactModel: objectOrList,
                        _reactEvent: "objectmodelchange",
                        _reactListener: (event: ObjectModelChangeEvent) => {
                            react(node, event.data.property as any, event.data.oldValue, event.data.newValue);
                        }
                    }
                }
            ) as ReactiveNode;
            const keys = Object.keys(objectOrList.data) as (keyof Data)[];
            keys.forEach((key) => {
                react(node, key as any, void 0 as any, objectOrList.data[key] as any);
            });
        }
        return node;
}

interface ReactiveChildNodes {
    (parent: Node & ParentNode): (Node | string)[]
}

function ReactiveChildNodes<Item extends object>(list: ListModel<Item>, map: (item: Item) => Node | string): ReactiveChildNodes {
    return (parent: Node & ParentNode) => {
        Object.assign(
            parent, {
                _reactAttributes: {
                    _reactModel: list,
                    _reactEvent: "listmodelchange",
                    _reactListener: (event: ListModelChangeEvent) => {
                        if (event.data.removedItems.length) {
                            for (let i = 0; i < event.data.removedItems.length; i++) {
                                parent!.children.item(event.data.index)!.remove();
                            }
                        }
                        if (event.data.addedItems.length) {
                            let addedElements = event.data.addedItems.map(item => map(item));
                            if (event.data.index >= list.items.length - event.data.addedItems.length) {
                                parent!.append(...addedElements);
                            }
                            else {
                                parent!.children.item(event.data.index - event.data.removedItems.length)!.before(...addedElements);
                            }
                        }
                    }
                }
            }
        ) as ReactiveParentNode;
        return list.items.map(map);
    }
}

function setHTMLElementEventListeners<K extends keyof HTMLElementTagNameMap>(
    element: HTMLElementTagNameMap[K],
    listeners: {
        [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K]) => void | [(event: HTMLElementEventMap[K]) => void, Partial<boolean | AddEventListenerOptions>]
    }
): HTMLElementTagNameMap[K] {
    Object.entries(listeners).forEach((entry) => {
        if (Array.isArray(entry[1])) {
            element.addEventListener(entry[0], entry[1][0] as EventListener, entry[1][1]);
        }
        else {
            element.addEventListener(entry[0], entry[1] as EventListener);
        }
    });
    return element;
};

function setHTMLElementStyles<E extends HTMLElement>(
    element: E,
    styles: {
        [property: string]: string | [string, string]
    }
): E {
    Object.keys(styles).forEach((property) => {
        if (Array.isArray(styles[property])) {
            element.style.setProperty(property, styles[property][0], styles[property][1]);
        }
        else {
            element.style.setProperty(property, styles[property] as string);
        }
    });
    return element;
};

function setElementChildren<E extends Element>(
    element: E,
    children: (Node | string)[] | NodeList
): E {
    element.textContent = "";
    element.append(...children);
    return element;
};

function setElementProperties<E extends Element>(
        element: E,
        properties?: Partial<Pick<E, WritableKeys<E>>>
    ): E {
    for (const property in properties) {
        let value = properties[property];
        if (typeof value !== "undefined") {
            element[property] = value!;
        }
    }
    return element;
};

function setElementAttributes<E extends Element>(
        element: E,
        attributes?: {[attrName: string]: number | string | boolean}
    ): E {
    for (const key in attributes) {
        const value = attributes[key];
        if (typeof value === "boolean") {
            if (value) {
                element.setAttribute(camelToTrain(key), "");
            }
        }
        else {
            element.setAttribute(camelToTrain(key), value.toString());
        }
    }
    return element;
};

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

function createMutationObserverCallback(
    mixins: AttributeMutationMixin[]
    ) {
    return (mutationsList: MutationRecord[]) =>  {
        mutationsList.forEach((mutation: MutationRecord) => {
            mutation.addedNodes.forEach((node: Node) => {
                if (isElement(node)) {
                    forAllSubtreeElements(node, (childElement: Element) => {
                        [...childElement.attributes].forEach((attr) => {
                            let matchingMixins = mixins.filter(
                                mixin => areAttributesMatching(
                                    mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                    attr.name, attr.value
                                )
                            );
                            matchingMixins.forEach((mixin) => {
                                mixin.attach(childElement);
                            });
                        });
                    });
                }
            });
            mutation.removedNodes.forEach((node: Node) => {
                if (isElement(node)) {
                    forAllSubtreeElements(node, (childElement: Element) => {
                        [...childElement.attributes].forEach((attr) => {
                            let matchingMixins = mixins.filter(
                                mixin => areAttributesMatching(
                                    mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                    attr.name, attr.value
                                )
                            );
                            matchingMixins.forEach((mixin) => {
                                mixin.detach(childElement);
                            });
                        });
                    });
                }
            });
            if (isElement(mutation.target)) {
                let targetElement = mutation.target;
                let attrName = mutation.attributeName;
                if (attrName) {
                    let relatedMixins = mixins.filter(mixin => mixin.attributeName === attrName);
                    relatedMixins.forEach((mixin) => {
                        if (areAttributesMatching(
                                mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                attrName!, targetElement.getAttribute(attrName!)
                            )) {
                                mixin.attach(targetElement);
                        }
                        else {
                            mixin.detach(targetElement);
                        }
                    });
                }
            }
        });
    }
}