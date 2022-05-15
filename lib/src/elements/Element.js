import { ModelChangeObserver } from "../models/Model";
import { camelToTrain } from "./Snippets";
export { subtreeNodes };
export { ancestorNodes };
export { CustomElement };
export { Query };
export { QueryAll };
export { AttributeProperty };
export { isReactiveNode };
export { isReactiveParentNode };
export { ReactiveNode };
export { ReactiveChildNodes };
export { HTML };
export { Fragment };
export { TextNode };
export { areAttributesMatching };
export { AttributeMutationMixinBase };
const CustomElement = function (init) {
    return (elementCtor) => {
        const { name, options } = init;
        if (!customElements.get(name)) {
            customElements.define(name, elementCtor, options);
        }
        return elementCtor;
    };
};
function* subtreeNodes(node) {
    yield node;
    const childNodes = node.childNodes;
    const childNodesCount = childNodes.length;
    let childIndex = 0;
    while (childIndex < childNodesCount) {
        const child = childNodes.item(childIndex);
        if (child !== null) {
            yield* subtreeNodes(child);
        }
        childIndex++;
    }
}
function* ancestorNodes(node) {
    const { parentNode } = node;
    if (parentNode) {
        yield parentNode;
        yield* ancestorNodes(parentNode);
    }
}
const AttributeProperty = function (init) {
    return (target, property) => {
        const { constructor } = target;
        const { prototype } = constructor;
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
                Object.defineProperty(constructor, "observedAttributes", {
                    value: [attributeName],
                    writable: false
                });
            }
        }
        const { type } = init;
        switch (type) {
            case Boolean: {
                Object.defineProperty(prototype, propertyName, {
                    get: function () {
                        return this.hasAttribute(attributeName);
                    },
                    set: function (value) {
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
                    get: function () {
                        const val = this.getAttribute(attributeName);
                        return (val !== null) ? JSON.parse(val) : defaultValue;
                    },
                    set: function (value) {
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
                    get: function () {
                        const val = this.getAttribute(attributeName);
                        return (val !== null) ? parseFloat(val) : defaultValue;
                    },
                    set: function (value) {
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
                    get: function () {
                        const val = this.getAttribute(attributeName);
                        return (val !== null) ? val : defaultValue;
                    },
                    set: function (value) {
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
    };
};
const Query = function (init) {
    return (target, propertyKey) => {
        const { constructor } = target;
        const { prototype } = constructor;
        const propertyName = propertyKey.toString();
        const { selector } = init;
        const shadowRoot = init.shadowRoot ?? false;
        const cached = init.cached ?? false;
        const instanceOf = init.instanceOf ?? [];
        if (cached) {
            const privateProperty = `_${propertyName}`;
            const getter = function () {
                let element = Reflect.get(this, privateProperty, this);
                if (!element) {
                    element = shadowRoot ?
                        this.shadowRoot.querySelector(selector) :
                        this.querySelector(selector);
                    const isValidInstance = instanceOf.length === 0 || instanceOf.some(constructor_i => element instanceof constructor_i);
                    if (!isValidInstance) {
                        element = null;
                    }
                    Reflect.set(this, privateProperty, element, this);
                }
                return element;
            };
            Object.defineProperty(prototype, propertyName, {
                get: getter
            });
        }
        else {
            const getter = function () {
                const element = shadowRoot ?
                    this.shadowRoot.querySelector(selector) :
                    this.querySelector(selector);
                const isValidInstance = instanceOf.length === 0 || instanceOf.some(constructor_i => element instanceof constructor_i);
                return isValidInstance ? element : null;
            };
            Object.defineProperty(prototype, propertyName, {
                get: getter
            });
        }
    };
};
const QueryAll = function (init) {
    return (target, propertyKey) => {
        const { constructor } = target;
        const { prototype } = constructor;
        const propertyName = propertyKey.toString();
        const { selector } = init;
        const shadowRoot = init.shadowRoot ?? false;
        const cached = init.cached ?? false;
        const instanceOf = init.instanceOf ?? [];
        if (cached) {
            const privateProperty = `_${propertyName}`;
            const getter = function () {
                let elements = Reflect.get(this, privateProperty, this);
                if (!elements) {
                    elements = shadowRoot ?
                        Array.from(this.shadowRoot.querySelectorAll(selector)) :
                        Array.from(this.querySelectorAll(selector));
                    if (instanceOf.length > 0) {
                        elements.filter(element_i => instanceOf.some(constructor_i => element_i instanceof constructor_i));
                    }
                    Reflect.set(this, privateProperty, elements, this);
                }
                return elements;
            };
            Object.defineProperty(prototype, propertyName, {
                get: getter
            });
        }
        else {
            const getter = function () {
                const elements = shadowRoot ?
                    Array.from(this.shadowRoot.querySelectorAll(selector)) :
                    Array.from(this.querySelectorAll(selector));
                if (instanceOf.length > 0) {
                    elements.filter(element_i => instanceOf.some(constructor_i => element_i instanceof constructor_i));
                }
                return elements;
            };
            Object.defineProperty(prototype, propertyName, {
                get: getter
            });
        }
    };
};
function Fragment(...nodes) {
    const fragment = document.createDocumentFragment();
    fragment.append(...nodes);
    return fragment;
}
function TextNode(text = "") {
    return document.createTextNode(text);
}
function HTML(tagName, init) {
    if (init) {
        const { options, properties, part, exportParts, attributes, dataset, children, eventListeners, style } = init;
        const element = document.createElement(tagName, options);
        if (options) {
            const { is: isBuiltinElement } = options;
            if (isBuiltinElement) {
                element.setAttribute("is", isBuiltinElement);
            }
        }
        if (properties) {
            const keys = Object.keys(properties);
            keys.forEach((key_i) => {
                const value = properties[key_i];
                if (typeof properties[key_i] !== "undefined") {
                    Object.assign(element, {
                        [key_i]: value
                    });
                }
            });
        }
        if (properties) {
            const keys = Object.keys(properties);
            keys.forEach((key_i) => {
                const value = properties[key_i];
                if (typeof properties[key_i] !== "undefined") {
                    Object.assign(element, {
                        [key_i]: value
                    });
                }
            });
        }
        if (part) {
            const { part: elementPart } = element;
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
        if (style) {
            const { style: elementStyle } = element;
            Object.keys(style).forEach((property_i) => {
                if (Array.isArray(style[property_i])) {
                    elementStyle.setProperty(property_i, style[property_i][0], style[property_i][1]);
                }
                else {
                    elementStyle.setProperty(property_i, style[property_i]);
                }
            });
        }
        if (dataset) {
            const { dataset: elementDataset } = element;
            Object.keys(dataset).forEach((datasetEntry_i) => {
                elementDataset[datasetEntry_i] = dataset[datasetEntry_i].toString();
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
        return element;
    }
    return document.createElement(tagName);
}
function isReactiveNode(node) {
    const reactiveNodeAttributes = node._reactiveNodeAttributes;
    return typeof reactiveNodeAttributes === "object" &&
        typeof reactiveNodeAttributes.addReactListener === "function" &&
        typeof reactiveNodeAttributes.removeReactListener === "function";
}
function isReactiveParentNode(node) {
    const reactiveParentNodeAttributes = node._reactiveParentNodeAttributes;
    return typeof reactiveParentNodeAttributes === "object" &&
        typeof reactiveParentNodeAttributes.addReactListener === "function" &&
        typeof reactiveParentNodeAttributes.removeReactListener === "function";
}
const reactiveNodesMap = new WeakMap();
const reactiveNodesFinalizationRegistry = new FinalizationRegistry((heldValue) => {
    const { modelRef, reactiveNode } = heldValue;
    const model = modelRef.deref();
    if (model) {
        const reactiveNodesMapEntry = reactiveNodesMap.get(model);
        if (reactiveNodesMapEntry) {
            const { reactiveNodes } = reactiveNodesMapEntry;
            reactiveNodes.splice(reactiveNodes.indexOf(reactiveNode), 1);
        }
    }
});
const reactiveNodePropertyObserver = new ModelChangeObserver((records) => {
    records.forEach((record_i) => {
        const { target, propertyName, oldValue, newValue } = record_i;
        const { reactiveNodes } = reactiveNodesMap.get(target);
        reactiveNodes.forEach((reactiveNode_i) => {
            const { nodeRef, react, properties } = reactiveNode_i;
            const node = nodeRef.deref();
            if (node) {
                if (properties.includes(propertyName)) {
                    react(node, propertyName, oldValue, newValue);
                }
            }
        });
    });
});
function ReactiveNode(model, node, properties, react) {
    const nodeRef = new WeakRef(node);
    const modelRef = new WeakRef(model);
    const reactiveNode = { nodeRef, react, properties };
    const reactiveNodesMapEntry = reactiveNodesMap.get(model);
    reactiveNodesFinalizationRegistry.register(node, { modelRef, reactiveNode });
    if (!reactiveNodesMapEntry) {
        const observerOptions = {
            properties: true,
            propertiesFilter: properties
        };
        const reactiveNodes = [reactiveNode];
        reactiveNodesMap.set(model, { observerOptions, reactiveNodes });
        reactiveNodePropertyObserver.observe(model, observerOptions);
    }
    else {
        const { reactiveNodes, observerOptions } = reactiveNodesMapEntry;
        const { propertiesFilter } = observerOptions;
        reactiveNodes.push(reactiveNode);
        observerOptions.propertiesFilter = propertiesFilter ?
            propertiesFilter.concat(properties.filter(property_i => !propertiesFilter.includes(property_i))) : Array.from(new Set(properties));
    }
    properties.forEach((property_i) => {
        const value = Reflect.get(model, property_i, model);
        if (value !== void 0) {
            react(node, property_i, void 0, value);
        }
    });
    return node;
}
const reactiveChildNodesMap = new WeakMap();
const reactiveChildNodesRegistry = new FinalizationRegistry((heldValue) => {
    const { modelRef, reactiveChildNode } = heldValue;
    const model = modelRef.deref();
    if (model) {
        const reactiveChildNodesMapEntry = reactiveChildNodesMap.get(model);
        if (reactiveChildNodesMapEntry) {
            const { reactiveChildNodes } = reactiveChildNodesMapEntry;
            reactiveChildNodes.splice(reactiveChildNodes.indexOf(reactiveChildNode), 1);
        }
    }
});
const reactiveChildNodesObserver = new ModelChangeObserver((records) => {
    Array.from(records.values()).forEach((record_i) => {
        const { target } = record_i;
        const list = target;
        const { length: listLength } = list;
        const { reactiveChildNodes } = reactiveChildNodesMap.get(target);
        reactiveChildNodes.forEach((reactiveChildNode_i, i) => {
            const { parentRef, mapping, placeholder } = reactiveChildNode_i;
            const parent = parentRef.deref();
            if (parent) {
                const { firstChild, childNodes } = parent;
                const { length: childNodesCount } = childNodes;
                if (placeholder && listLength > 0 && firstChild === placeholder) {
                    parent.removeChild(placeholder);
                }
                const { changeType, LIST_INSERT, LIST_REMOVE, LIST_SORT } = record_i;
                switch (changeType) {
                    case LIST_INSERT: {
                        const { insertedIndex, insertedItems } = record_i;
                        const insertedItemsArray = Array.from(insertedItems.values())
                            .map(item_i => mapping(item_i));
                        const { length: childNodesCount } = childNodes;
                        if (insertedIndex < childNodesCount) {
                            childNodes[insertedIndex].before(...insertedItemsArray);
                        }
                        else {
                            parent.append(...insertedItemsArray);
                        }
                        break;
                    }
                    case LIST_REMOVE: {
                        const { removedIndex, removedCount } = record_i;
                        const range = document.createRange();
                        const removeEndIndex = removedIndex + (removedCount - 1);
                        if (removeEndIndex < childNodesCount) {
                            range.setStartBefore(childNodes[removedIndex]);
                            range.setEndAfter(childNodes[removeEndIndex]);
                            range.deleteContents();
                        }
                        break;
                    }
                    case LIST_SORT: {
                        const { sortedIndices } = record_i;
                        const childNodesArray = Array.from(childNodes);
                        parent.append(...sortedIndices.filter(index_i => index_i < childNodesCount).map(index_i => childNodesArray[index_i]));
                        break;
                    }
                }
                if (listLength === 0 && placeholder) {
                    parent.append(placeholder);
                }
            }
            else {
                reactiveChildNodes.splice(i, 1);
            }
        });
    });
});
function ReactiveChildNodes(list, map, placeholder) {
    return (parent) => {
        const mapping = (item) => {
            const node = map(item);
            if (node instanceof DocumentFragment) {
                if (node.childElementCount > 0) {
                    console.warn("ReactiveChildNodes mapping function only accept a single child node.");
                }
                const { firstChild } = node;
                return firstChild ?? "";
            }
            return node;
        };
        const parentRef = new WeakRef(parent);
        const modelRef = new WeakRef(list);
        const reactiveChildNodesMapEntry = reactiveChildNodesMap.get(list);
        const reactiveChildNode = { parentRef, mapping, placeholder };
        reactiveChildNodesRegistry.register(parent, { modelRef, reactiveChildNode });
        if (!reactiveChildNodesMapEntry) {
            const reactiveChildNodes = [reactiveChildNode];
            reactiveChildNodesMap.set(list, { reactiveChildNodes });
            reactiveChildNodesObserver.observe(list, {
                childList: true
            });
        }
        else {
            const { reactiveChildNodes } = reactiveChildNodesMapEntry;
            reactiveChildNodes.push(reactiveChildNode);
        }
        return list.length === 0 && placeholder ?
            [placeholder] : Array.from(list.values()).map(mapping);
    };
}
function areAttributesMatching(referenceAttributeType, referenceAttributeName, referenceAttributeValue, attributeName, attributeValue) {
    if (referenceAttributeName == attributeName) {
        switch (referenceAttributeType) {
            case "boolean":
                return referenceAttributeValue == "" && attributeValue == "";
            case "string":
                return referenceAttributeValue !== "" && (referenceAttributeValue === attributeValue);
            case "list":
                return (referenceAttributeValue !== "" && attributeValue !== null) && new RegExp(`${referenceAttributeValue}\s*?`, "g").test(attributeValue);
        }
    }
    return false;
}
class AttributeMutationMixinBase {
    attributeName;
    attributeValue;
    attributeType;
    constructor(attributeName, attributeType = "boolean", attributeValue = "") {
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValue = attributeValue;
    }
    attach() {
        throw new TypeError("Not implemented method.");
    }
    detach() {
        throw new TypeError("Not implemented method.");
    }
}
//# sourceMappingURL=Element.js.map