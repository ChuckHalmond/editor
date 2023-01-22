import { ModelChangeObserver } from "../models/Model";
import { camelToTrain } from "./Snippets";
export { CustomElement };
export { QueryProperty };
export { QueryAllProperty };
export { AttributeProperty };
export { reactiveElement };
export { revokeReactiveElement };
export { reactiveChildElements };
export { revokeReactiveChildElements };
export { element };
export { fragment };
export { textNode };
export { areAttributesMatching };
export { AttributeMutationMixinBase };
export { trimMultilineIndent };
export { Stylesheet };
export { reactiveElementsMap };
const AttributeProperty = function (init) {
    return (target, property) => {
        const { constructor } = target;
        const { prototype } = constructor;
        const propertyName = String(property);
        const { defaultValue = null, observed = false, name = camelToTrain(propertyName) } = init;
        if (observed) {
            const observedAttributes = Reflect.get(constructor, "observedAttributes", constructor);
            if (Array.isArray(observedAttributes)) {
                observedAttributes.push(name);
            }
            else {
                Object.defineProperty(constructor, "observedAttributes", {
                    value: [name],
                    writable: false
                });
            }
        }
        const { type } = init;
        switch (type) {
            case Boolean: {
                Object.defineProperty(prototype, propertyName, {
                    get: function () {
                        return this.hasAttribute(name);
                    },
                    set: function (value) {
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
                    get: function () {
                        const val = this.getAttribute(name);
                        return (val !== null) ? JSON.parse(val) : defaultValue;
                    },
                    set: function (value) {
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
                    get: function () {
                        const val = this.getAttribute(name);
                        return (val !== null) ? parseFloat(val) : defaultValue;
                    },
                    set: function (value) {
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
                    get: function () {
                        const val = this.getAttribute(name);
                        return (val !== null) ? val : defaultValue;
                    },
                    set: function (value) {
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
    };
};
function Stylesheet(text) {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(text);
    return stylesheet;
}
function trimMultilineIndent(text) {
    const newlineIndex = text.indexOf("\n");
    text = text.substring(newlineIndex + 1);
    const indentMatch = text.match(/^[\s]*/);
    if (indentMatch) {
        const indent = text.substring(0, indentMatch[0].length);
        text = text.replaceAll(indent, "").trimEnd();
    }
    return text;
}
const CustomElement = function (init) {
    return (elementCtor) => {
        const { name, options } = init;
        if (!customElements.get(name)) {
            customElements.define(name, elementCtor, options);
        }
        return elementCtor;
    };
};
const QueryProperty = function (init) {
    return (target, propertyKey) => {
        const { constructor } = target;
        const { prototype } = constructor;
        const propertyName = String(propertyKey);
        const { selector } = init;
        const withinShadowRoot = init.withinShadowRoot ?? false;
        const getter = withinShadowRoot ? function () {
            return this.shadowRoot.querySelector(selector);
        } : function () {
            return this.querySelector(selector);
        };
        Object.defineProperty(prototype, propertyName, {
            get: getter
        });
    };
};
const QueryAllProperty = function (init) {
    return (target, propertyKey) => {
        const { constructor } = target;
        const { prototype } = constructor;
        const propertyName = String(propertyKey);
        const { selector } = init;
        const withinShadowRoot = init.withinShadowRoot ?? false;
        const getter = withinShadowRoot ? function () {
            return Array.from(this.shadowRoot.querySelectorAll(selector));
        } : function () {
            return Array.from(this.querySelectorAll(selector));
        };
        Object.defineProperty(prototype, propertyName, {
            get: getter
        });
    };
};
function fragment(...nodes) {
    const fragment = document.createDocumentFragment();
    fragment.append(...nodes);
    return fragment;
}
function textNode(text) {
    return document.createTextNode(text);
}
function element(tagName, init) {
    if (init) {
        const { options, attributes, dataset, children, listeners } = init;
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
            const { dataset: elementDataset } = element;
            Object.entries(dataset).forEach(([attributeName, attributeValue]) => {
                if (typeof attributeValue === "boolean") {
                    if (attributeValue) {
                        elementDataset[camelToTrain(attributeName)] = "";
                    }
                    else {
                        delete elementDataset[camelToTrain(attributeName)];
                    }
                }
                else {
                    elementDataset[camelToTrain(attributeName)] = String(attributeValue);
                }
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
const reactiveElementsMap = new WeakMap();
const reactiveElementsFinalizationRegistry = new FinalizationRegistry((heldValue) => {
    const { model, reactiveElement } = heldValue;
    const reactiveElementsMapEntry = reactiveElementsMap.get(model);
    if (reactiveElementsMapEntry !== undefined) {
        const { reactiveElementsArray } = reactiveElementsMapEntry;
        reactiveElementsArray.splice(reactiveElementsArray.indexOf(reactiveElement), 1);
    }
});
const reactiveElementsPropertyObserver = new ModelChangeObserver((records) => {
    records.forEach((record_i) => {
        const { target, propertyName, oldValue, newValue } = record_i;
        const { reactiveElementsArray } = reactiveElementsMap.get(target);
        reactiveElementsArray.forEach(reactiveElement_i => {
            const { elementRef, react, properties } = reactiveElement_i;
            const element = elementRef.deref();
            if (element) {
                if (properties.includes(propertyName)) {
                    react(element, propertyName, oldValue, newValue);
                }
            }
        });
    });
});
function reactiveElement(model, element, properties, react) {
    const elementRef = new WeakRef(element);
    const reactiveElement = { elementRef, react, properties };
    const reactiveElementsMapEntry = reactiveElementsMap.get(model);
    reactiveElementsFinalizationRegistry.register(element, { model, reactiveElement });
    if (!reactiveElementsMapEntry) {
        const observerOptions = {
            properties: true,
            propertiesFilter: properties
        };
        const reactiveElementsArray = [reactiveElement];
        reactiveElementsMap.set(model, { observerOptions, reactiveElementsArray });
        reactiveElementsPropertyObserver.observe(model, observerOptions);
    }
    else {
        const { reactiveElementsArray, observerOptions } = reactiveElementsMapEntry;
        const { propertiesFilter } = observerOptions;
        reactiveElementsArray.push(reactiveElement);
        observerOptions.propertiesFilter = propertiesFilter ?
            propertiesFilter.concat(properties.filter(property_i => !propertiesFilter.includes(property_i))) : properties.filter((property_i, i, properties) => properties.indexOf(property_i) === i);
    }
    properties.forEach((property_i) => {
        if (property_i in model) {
            const value = Reflect.get(model, property_i, model);
            react(element, property_i, undefined, value);
        }
    });
    return element;
}
function revokeReactiveElement(model, element) {
    const reactiveElementsMapEntry = reactiveElementsMap.get(model);
    if (reactiveElementsMapEntry) {
        const { reactiveElementsArray } = reactiveElementsMapEntry;
        const reactiveElementIndex = reactiveElementsArray.findIndex(reactiveElement => reactiveElement.elementRef.deref() === element);
        if (reactiveElementIndex > -1) {
            reactiveElementsArray.splice(reactiveElementIndex, 1);
        }
        if (reactiveElementsArray.length === 0) {
            reactiveElementsMap.delete(model);
        }
    }
}
const reactiveChildElementsMap = new WeakMap();
const reactiveChildElementsFinalizationRegistry = new FinalizationRegistry((heldValue) => {
    const { list, reactiveChildElement } = heldValue;
    const reactiveChildrenElementsMapEntry = reactiveChildElementsMap.get(list);
    if (reactiveChildrenElementsMapEntry) {
        const { reactiveChildElementsArray } = reactiveChildrenElementsMapEntry;
        reactiveChildElementsArray.splice(reactiveChildElementsArray.indexOf(reactiveChildElement), 1);
    }
});
const reactiveChildElementsObserver = new ModelChangeObserver((records) => {
    let range = null;
    Array.from(records.values()).forEach((record_i) => {
        const { target } = record_i;
        const list = target;
        const { length: listLength } = list;
        const { reactiveChildElementsArray } = reactiveChildElementsMap.get(list);
        reactiveChildElementsArray.forEach((reactiveChildElements_i) => {
            const { parentRef, mapping, placeholder } = reactiveChildElements_i;
            const parent = parentRef.deref();
            if (parent) {
                const { firstChild, children } = parent;
                const { length: childrenCount } = children;
                if (placeholder && listLength > 0 && firstChild == placeholder) {
                    parent.removeChild(placeholder);
                }
                const { changeType, LIST_INSERT, LIST_REMOVE, LIST_SORT } = record_i;
                switch (changeType) {
                    case LIST_INSERT: {
                        const { insertedIndex, insertedItems } = record_i;
                        const insertedItemsArray = Array.from(insertedItems.values()).map(mapping);
                        const { length: childrenCount } = children;
                        if (insertedIndex < childrenCount) {
                            children[insertedIndex].before(...insertedItemsArray);
                        }
                        else {
                            parent.append(...insertedItemsArray);
                        }
                        break;
                    }
                    case LIST_REMOVE: {
                        const { removedIndex, removedItems } = record_i;
                        const { length: removedCount } = removedItems;
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
                        const { sortedIndices } = record_i;
                        const childrenArray = Array.from(children);
                        parent.append(...sortedIndices.filter(index_i => index_i < childrenCount).map(index_i => childrenArray[index_i]));
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
function reactiveChildElements(list, mapping, placeholder) {
    return (parent) => {
        const parentRef = new WeakRef(parent);
        const reactiveChildElementsMapEntry = reactiveChildElementsMap.get(list);
        const reactiveChildElement = { parentRef, mapping, placeholder };
        reactiveChildElementsFinalizationRegistry.register(parent, { list, reactiveChildElement });
        if (!reactiveChildElementsMapEntry) {
            const reactiveChildElementsArray = [reactiveChildElement];
            reactiveChildElementsMap.set(list, { reactiveChildElementsArray });
            reactiveChildElementsObserver.observe(list, {
                childList: true
            });
        }
        else {
            const { reactiveChildElementsArray } = reactiveChildElementsMapEntry;
            reactiveChildElementsArray.push(reactiveChildElement);
        }
        const children = list.length == 0 && placeholder ?
            [placeholder] : Array.from(list.values()).map(mapping);
        parent.replaceChildren(...children);
    };
}
function revokeReactiveChildElements(list, parent) {
    const reactiveChildElementsMapEntry = reactiveChildElementsMap.get(list);
    if (reactiveChildElementsMapEntry) {
        const { reactiveChildElementsArray } = reactiveChildElementsMapEntry;
        const reactiveChildElementsIndex = reactiveChildElementsArray.findIndex(reactiveChildElement => reactiveChildElement.parentRef.deref() === parent);
        if (reactiveChildElementsIndex > -1) {
            reactiveChildElementsArray.splice(reactiveChildElementsIndex, 1);
        }
        if (reactiveChildElementsArray.length === 0) {
            reactiveChildElementsMap.delete(list);
        }
    }
}
function areAttributesMatching(referenceAttributeType, referenceAttributeName, referenceAttributeValue, attributeName, attributeValue) {
    if (referenceAttributeName == attributeName) {
        switch (referenceAttributeType) {
            case "boolean":
                return referenceAttributeValue == "" && attributeValue == "";
            case "string":
                return referenceAttributeValue !== "" && (referenceAttributeValue == attributeValue);
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