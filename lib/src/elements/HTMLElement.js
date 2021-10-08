import { camelToTrain } from "./Snippets";
export { isTagElement };
export { RegisterCustomHTMLElement };
export { GenerateAttributeAccessors };
export { bindShadowRoot };
export { setElementProperties };
export { setElementAttributes };
export { isParentNode };
export { isReactiveNode };
export { isReactiveParentNode };
export { ReactiveNode };
export { ReactiveChildNodes };
export { isElement };
export { Element };
export { areAttributesMatching };
export { AttributeMutationMixinBase };
export { Fragment };
export { TextNode };
export { setHTMLElementEventListeners };
function isTagElement(tagName, obj) {
    return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() == tagName;
}
const RegisterCustomHTMLElement = function (args) {
    return (elementCtor) => {
        const { name, observedAttributes, options } = args;
        if (observedAttributes) {
            Object.defineProperty(elementCtor.prototype.constructor, 'observedAttributes', {
                get: () => {
                    return observedAttributes;
                }
            });
        }
        if (!customElements.get(name)) {
            customElements.define(name, elementCtor, options);
        }
        return elementCtor;
    };
};
const GenerateAttributeAccessors = function (attributes) {
    return (elementCtor) => {
        attributes.forEach((attr) => {
            const { name, type } = attr;
            switch (type) {
                case "boolean":
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function () {
                            const val = this.getAttribute(name);
                            return (val === "" || false);
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
                case "json":
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function () {
                            const val = this.getAttribute(name);
                            return (val !== null) ? JSON.parse(val) : null;
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
                case "number":
                    Object.defineProperty(elementCtor.prototype, name, {
                        get: function () {
                            const val = this.getAttribute(name);
                            return (val !== null) ? parseFloat(val) : val;
                        },
                        set: function (value) {
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
                        get: function () {
                            const val = this.getAttribute(name);
                            return val;
                        },
                        set: function (value) {
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
    };
};
function bindShadowRoot(element, templateContent) {
    const root = element.attachShadow({ mode: "open" });
    const template = document.createElement("template");
    if (typeof templateContent !== "undefined") {
        template.innerHTML = templateContent;
    }
    root.appendChild(template.content.cloneNode(true));
    return root;
}
function Fragment(...nodes) {
    let fragment = document.createDocumentFragment();
    fragment.append(...nodes);
    return fragment;
}
function TextNode(text = "") {
    return document.createTextNode(text);
}
function Element(tagName, init) {
    const element = document.createElement(tagName, init === null || init === void 0 ? void 0 : init.options);
    if (init) {
        if (init.props) {
            setElementProperties(element, init.props);
        }
        if (init.attrs) {
            setElementAttributes(element, init.attrs);
        }
        if (init.children) {
            if (typeof init.children === "function") {
                element.replaceChildren(...init.children(element));
            }
            else {
                element.replaceChildren(...init.children);
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
function isParentNode(node) {
    return node.hasChildNodes();
}
function isElement(node) {
    return node.nodeType === node.ELEMENT_NODE;
}
function isReactiveNode(node) {
    return typeof node._reactiveNodeAttributes === "object" &&
        typeof node._reactiveNodeAttributes.addReactListener === "function" &&
        typeof node._reactiveNodeAttributes.removeReactListener === "function";
}
function isReactiveParentNode(node) {
    return typeof node._reactiveParentNodeAttributes === "object" &&
        typeof node._reactiveParentNodeAttributes.addReactListener === "function" &&
        typeof node._reactiveParentNodeAttributes.removeReactListener === "function";
}
function ReactiveNode(objectOrList, node, react) {
    if ("items" in objectOrList) {
        const listener = (event) => {
            react(node, event.data.addedItems, event.data.removedItems, event.data.index);
        };
        Object.assign(node, {
            _reactiveNodeAttributes: {
                addReactListener: () => {
                    objectOrList.addEventListener("listmodelchange", listener);
                },
                removeReactListener: () => {
                    objectOrList.removeEventListener("listmodelchange", listener);
                }
            }
        });
        react(node, objectOrList.items, [], 0);
    }
    else {
        const listener = (event) => {
            react(node, event.data.property, event.data.oldValue, event.data.newValue);
        };
        Object.assign(node, {
            _reactiveNodeAttributes: {
                addReactListener: () => {
                    objectOrList.addEventListener("objectmodelchange", listener);
                },
                removeReactListener: () => {
                    objectOrList.removeEventListener("objectmodelchange", listener);
                }
            }
        });
        const keys = Object.keys(objectOrList.data);
        keys.forEach((key) => {
            react(node, key, void 0, objectOrList.data[key]);
        });
    }
    return node;
}
function ReactiveChildNodes(list, map, placeholder) {
    return (parent) => {
        const listener = (event) => {
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
                    parent.childNodes.item(event.data.index - event.data.removedItems.length).before(...addedElements);
                }
            }
            if (list.items.length === 0 && placeholder) {
                parent.append(placeholder);
            }
        };
        Object.assign(parent, {
            _reactiveParentNodeAttributes: {
                addReactListener: () => {
                    list.addEventListener("listmodelchange", listener);
                },
                removeReactListener: () => {
                    list.removeEventListener("listmodelchange", listener);
                }
            }
        });
        const children = placeholder && list.items.length === 0 ? [placeholder] : list.items.map(map);
        return children;
    };
}
function setHTMLElementEventListeners(element, listeners) {
    Object.entries(listeners).forEach((entry) => {
        if (Array.isArray(entry[1])) {
            element.addEventListener(entry[0], entry[1][0], entry[1][1]);
        }
        else {
            element.addEventListener(entry[0], entry[1]);
        }
    });
    return element;
}
;
function setHTMLElementStyles(element, styles) {
    Object.keys(styles).forEach((property) => {
        if (Array.isArray(styles[property])) {
            element.style.setProperty(property, styles[property][0], styles[property][1]);
        }
        else {
            element.style.setProperty(property, styles[property]);
        }
    });
    return element;
}
;
function setElementProperties(element, properties) {
    for (const property in properties) {
        let value = properties[property];
        if (typeof value !== "undefined") {
            element[property] = value;
        }
    }
    return element;
}
;
function setElementAttributes(element, attributes) {
    for (const key in attributes) {
        const value = attributes[key];
        const attributeName = camelToTrain(key);
        if (typeof value === "boolean") {
            if (value) {
                element.setAttribute(attributeName, "");
            }
        }
        else {
            element.setAttribute(attributeName, value.toString());
        }
    }
    return element;
}
;
function areAttributesMatching(refAttributeType, refAttrName, refAttrValue, attrName, attrValue) {
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
class AttributeMutationMixinBase {
    constructor(attributeName, attributeType = "boolean", attributeValue = "") {
        this.attributeName = attributeName;
        this.attributeType = attributeType;
        this.attributeValue = attributeValue;
    }
}
//# sourceMappingURL=HTMLElement.js.map