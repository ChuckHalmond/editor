"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("libs/events/EventDispatcher", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventDispatcherBase = exports.EventDispatcher = exports.Event = exports.EventBase = void 0;
    class EventBase {
        constructor(type, data) {
            this.type = type;
            this.data = data;
        }
    }
    exports.EventBase = EventBase;
    var Event = EventBase;
    exports.Event = Event;
    class EventDispatcherBase {
        constructor() {
            this._listeners = new Map();
        }
        addEventListener(event, handler, once) {
            let listeners = this._listeners.get(event.toString());
            let newListener = {
                handler: handler,
                once: once
            };
            if (typeof listeners === "undefined") {
                this._listeners.set(event.toString(), [newListener]);
            }
            else if (!listeners.find(listener => listener.handler === handler && listener.once === once)) {
                listeners.push(newListener);
            }
            return handler;
        }
        removeEventListener(event, handler, once) {
            let listeners = this._listeners.get(event);
            if (typeof listeners !== "undefined") {
                const count = listeners.length;
                const idx = listeners.findIndex(listener => listener.handler === handler && listener.once === once);
                if (idx > -1) {
                    if (count > 1) {
                        listeners[idx] = listeners.pop();
                        return count - 1;
                    }
                    else {
                        this._listeners.delete(event.toString());
                        return 0;
                    }
                }
            }
            return -1;
        }
        dispatchEvent(event) {
            let listeners = this._listeners.get(event.type);
            if (typeof listeners !== 'undefined') {
                listeners = listeners.filter((listener) => {
                    listener.handler(event);
                    return !listener.once;
                });
                if (listeners.length === 0) {
                    this._listeners.delete(event.type);
                }
            }
        }
    }
    exports.EventDispatcherBase = EventDispatcherBase;
    const EventDispatcher = EventDispatcherBase;
    exports.EventDispatcher = EventDispatcher;
});
define("editor/model/Model", ["require", "exports", "libs/events/EventDispatcher"], function (require, exports, EventDispatcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListModelBase = exports.ObjectModelBase = void 0;
    class ObjectModelBase extends EventDispatcher_1.EventDispatcher {
        constructor(data) {
            super();
            this._data = data;
        }
        get data() {
            return this._data;
        }
        setData(key, value) {
            let oldValue = this._data[key];
            this._data[key] = value;
            this.dispatchEvent(new EventDispatcher_1.Event("objectmodelchange", { property: key, oldValue: oldValue, newValue: value }));
        }
    }
    exports.ObjectModelBase = ObjectModelBase;
    class ListModelBase extends EventDispatcher_1.EventDispatcher {
        constructor(items) {
            super();
            this._items = items;
        }
        get items() {
            return this._items;
        }
        insertItem(index, item) {
            if (index >= 0 && index <= this._items.length) {
                this._items.splice(index, 0, item);
                this.dispatchEvent(new EventDispatcher_1.Event("listmodelchange", { addedItems: [item], removedItems: [], index: index }));
            }
        }
        removeItem(index) {
            if (index >= 0 && index < this._items.length) {
                let item = this._items.splice(index, 1)[0];
                this.dispatchEvent(new EventDispatcher_1.Event("listmodelchange", { addedItems: [], removedItems: [item], index: index }));
            }
        }
        clearItems() {
            let items = this._items;
            this._items = [];
            this.dispatchEvent(new EventDispatcher_1.Event("listmodelchange", { addedItems: [], removedItems: items, index: 0 }));
        }
    }
    exports.ListModelBase = ListModelBase;
});
define("editor/elements/Snippets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pointIntersectsWithDOMRect = exports.setPropertyFromPath = exports.getPropertyFromPath = exports.forAllSubtreeNodes = exports.forAllSubtreeElements = void 0;
    function forAllSubtreeElements(element, func) {
        let index = 0;
        func(element);
        while (index < element.children.length) {
            let child = element.children.item(index);
            if (child) {
                forAllSubtreeElements(child, func);
            }
            index++;
        }
    }
    exports.forAllSubtreeElements = forAllSubtreeElements;
    function forAllSubtreeNodes(parent, func) {
        let index = 0;
        while (index < parent.childNodes.length) {
            let child = parent.childNodes.item(index);
            if (child) {
                func(child, parent);
                if (child.hasChildNodes()) {
                    forAllSubtreeNodes(child, func);
                }
            }
            index++;
        }
    }
    exports.forAllSubtreeNodes = forAllSubtreeNodes;
    function getPropertyFromPath(src, path) {
        const props = path.split(".");
        let obj = src;
        props.forEach((prop) => {
            if (prop.includes("[")) {
                let index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
                if (Number.isNaN(index)) {
                    console.error(`Wrong indexed path: ${prop}`);
                }
                prop = prop.substring(0, prop.indexOf("["));
                if (typeof obj === "object" && prop in obj && Array.isArray(obj[prop])) {
                    obj = obj[prop][index];
                }
            }
            else if (typeof obj === "object" && prop in obj) {
                obj = obj[prop];
            }
            else {
                obj = void 0;
            }
        });
        return obj;
    }
    exports.getPropertyFromPath = getPropertyFromPath;
    function setPropertyFromPath(src, path, value) {
        const props = path.split(".");
        let obj = src;
        let lastPropIdx = props.length - 1;
        props.forEach((prop, idx) => {
            if (prop.includes("[")) {
                let index = parseInt(prop.substring(prop.indexOf("[") + 1, prop.indexOf("]")));
                if (Number.isNaN(index)) {
                    console.error(`Wrong indexed path: ${prop}`);
                }
                prop = prop.substring(0, prop.indexOf("["));
                if (!Array.isArray(obj[prop])) {
                    obj[prop] = [];
                }
                if (idx === lastPropIdx) {
                    obj[prop][index] = value;
                }
                else {
                    if (typeof obj[prop][index] !== "object") {
                        obj[prop][index] = {};
                    }
                    obj = obj[prop][index];
                }
            }
            else {
                if (typeof obj[prop] !== "object") {
                    obj[prop] = {};
                }
                if (idx === lastPropIdx) {
                    obj[prop] = value;
                }
                else {
                    obj = obj[prop];
                }
            }
        });
        return src;
    }
    exports.setPropertyFromPath = setPropertyFromPath;
    function pointIntersectsWithDOMRect(x, y, rect) {
        return !(rect.left > x ||
            rect.right < x ||
            rect.top > y ||
            rect.bottom < y);
    }
    exports.pointIntersectsWithDOMRect = pointIntersectsWithDOMRect;
});
define("editor/elements/HTMLElement", ["require", "exports", "editor/elements/Snippets"], function (require, exports, Snippets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseStringTemplate = exports.Fragment = exports.createMutationObserverCallback = exports.AttributeMutationMixinBase = exports.areAttributesMatching = exports.Element = exports.isElement = exports.ReactiveChildNodes = exports.ReactiveNode = exports.isReactiveParentNode = exports.isReactiveNode = exports.isParentNode = exports.HTMLElementConstructor = exports.setElementChildren = exports.setElementAttributes = exports.setElementProperties = exports.bindShadowRoot = exports.createTemplate = exports.GenerateAttributeAccessors = exports.RegisterCustomHTMLElement = exports.isTagElement = void 0;
    function isTagElement(tagName, obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() == tagName;
    }
    exports.isTagElement = isTagElement;
    function parseStringTemplate(template, items) {
        const regexp = /\[(.*?)\]/gm;
        const itemsKeys = Object.keys(items);
        let result;
        let resultNodes = [];
        let lastResultIndex = 0;
        while ((result = regexp.exec(template)) !== null) {
            if (result.index >= lastResultIndex) {
                resultNodes.push(template.substring(lastResultIndex, result.index));
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
    exports.parseStringTemplate = parseStringTemplate;
    /*
    function fragment(parts: TemplateStringsArray, ...slots: (Node | string)[]): DocumentFragment {
        let timestamp = new Date().getTime();
        let html = parts.reduce((html, part, index) => {
            return `${html}${part}${(index < slots.length) ? `<div id="${timestamp}-${index}"></div>` : ""}`;
        }, "");
        let parser = new DOMParser();
        let fragment = new DocumentFragment();
        fragment.append(...parser.parseFromString(html, "text/html").body.children);
        slots.forEach((slot, index) => {
            let placeholder = fragment.getElementById(`${timestamp}-${index}`);
            if (placeholder) {
                if (slot instanceof Node) {
                    placeholder.replaceWith(slot);
                }
                else {
                    placeholder.replaceWith(document.createTextNode(slot));
                }
            }
        });
        return fragment;
    }
    */
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
            customElements.define(name, elementCtor, options);
            return elementCtor;
        };
    };
    exports.RegisterCustomHTMLElement = RegisterCustomHTMLElement;
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
                                return (val !== null) ? JSON.parse(val) : void 0;
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
    exports.GenerateAttributeAccessors = GenerateAttributeAccessors;
    function createTemplate(templateContent) {
        const template = document.createElement("template");
        if (typeof templateContent !== "undefined") {
            template.innerHTML = templateContent;
        }
        return template.content;
    }
    exports.createTemplate = createTemplate;
    function bindShadowRoot(element, templateContent) {
        const root = element.attachShadow({ mode: "open" });
        const template = document.createElement("template");
        if (typeof templateContent !== "undefined") {
            template.innerHTML = templateContent;
        }
        root.appendChild(template.content.cloneNode(true));
        return root;
    }
    exports.bindShadowRoot = bindShadowRoot;
    function HTMLFragment(content) {
        let template = document.createElement("template");
        template.innerHTML = content;
        return template.content;
    }
    function Fragment(...nodes) {
        let fragment = new DocumentFragment();
        fragment.append(...nodes);
        return fragment;
    }
    exports.Fragment = Fragment;
    function HTMLElementConstructor(tagName, init) {
        const element = document.createElement(tagName, init === null || init === void 0 ? void 0 : init.options);
        if (init) {
            if (init.props) {
                setElementProperties(element, init.props);
            }
            if (init.attrs) {
                setElementAttributes(element, init.attrs);
            }
            if (init.children) {
                setElementChildren(element, init.children);
            }
            if (init.listeners) {
                setHTMLElementEventListeners(element, init.listeners);
            }
        }
        return element;
    }
    exports.HTMLElementConstructor = HTMLElementConstructor;
    ;
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
    exports.Element = Element;
    function isParentNode(node) {
        return node.hasChildNodes();
    }
    exports.isParentNode = isParentNode;
    function isElement(node) {
        return node.nodeType === node.ELEMENT_NODE;
    }
    exports.isElement = isElement;
    function isReactiveNode(node) {
        let testNode = node;
        return (typeof testNode._reactAttributes !== "undefined") && testNode._reactAttributes._reactEvent === "objectmodelchange";
    }
    exports.isReactiveNode = isReactiveNode;
    function isReactiveParentNode(node) {
        let testNode = node;
        return (isParentNode(node) && typeof testNode._reactAttributes !== "undefined") && testNode._reactAttributes._reactEvent === "listmodelchange";
    }
    exports.isReactiveParentNode = isReactiveParentNode;
    function ReactiveNode(node, object, react) {
        Object.assign(node, {
            _reactAttributes: {
                _reactModel: object,
                _reactEvent: "objectmodelchange",
                _reactListener: (event) => {
                    react(node, event.data.property, event.data.oldValue, event.data.newValue);
                }
            }
        });
        const keys = Object.keys(object.data);
        keys.forEach((key) => {
            react(node, key, void 0, object.data[key]);
        });
        return node;
    }
    exports.ReactiveNode = ReactiveNode;
    function ReactiveChildNodes(list, map) {
        return (parent) => {
            Object.assign(parent, {
                _reactAttributes: {
                    _reactModel: list,
                    _reactEvent: "listmodelchange",
                    _reactListener: (event) => {
                        //TODO: Create a direct map between model items and child nodes to get rid of index
                        if (event.data.removedItems.length) {
                            for (let i = 0; i < event.data.removedItems.length; i++) {
                                parent.children.item(event.data.index).remove();
                            }
                        }
                        if (event.data.addedItems.length) {
                            let addedElements = event.data.addedItems.map(item => map(item));
                            if (event.data.index >= list.items.length) {
                                parent.append(...addedElements);
                            }
                            else {
                                parent.children.item(event.data.index - event.data.removedItems.length).before(...addedElements);
                            }
                        }
                    }
                }
            });
            return list.items.map(map);
        };
    }
    exports.ReactiveChildNodes = ReactiveChildNodes;
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
    function setElementChildren(element, children) {
        element.textContent = "";
        element.append(...children);
        return element;
    }
    exports.setElementChildren = setElementChildren;
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
    exports.setElementProperties = setElementProperties;
    ;
    function setElementAttributes(element, attributes) {
        for (const key in attributes) {
            const value = attributes[key];
            if (typeof value === "boolean") {
                if (value) {
                    element.setAttribute(key, "");
                }
            }
            else {
                element.setAttribute(key, value.toString());
            }
        }
        return element;
    }
    exports.setElementAttributes = setElementAttributes;
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
    exports.areAttributesMatching = areAttributesMatching;
    class AttributeMutationMixinBase {
        constructor(attributeName, attributeType = "boolean", attributeValue = "") {
            this.attributeName = attributeName;
            this.attributeType = attributeType;
            this.attributeValue = attributeValue;
        }
    }
    exports.AttributeMutationMixinBase = AttributeMutationMixinBase;
    function createMutationObserverCallback(mixins) {
        return (mutationsList) => {
            mutationsList.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (isElement(node)) {
                        Snippets_1.forAllSubtreeElements(node, (childElement) => {
                            [...childElement.attributes].forEach((attr) => {
                                let matchingMixins = mixins.filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
                                matchingMixins.forEach((mixin) => {
                                    mixin.attach(childElement);
                                });
                            });
                        });
                    }
                });
                mutation.removedNodes.forEach((node) => {
                    if (isElement(node)) {
                        Snippets_1.forAllSubtreeElements(node, (childElement) => {
                            [...childElement.attributes].forEach((attr) => {
                                let matchingMixins = mixins.filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
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
                            if (areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attrName, targetElement.getAttribute(attrName))) {
                                mixin.attach(targetElement);
                            }
                            else {
                                mixin.detach(targetElement);
                            }
                        });
                    }
                }
            });
        };
    }
    exports.createMutationObserverCallback = createMutationObserverCallback;
});
define("editor/elements/lib/controls/draggable/Draggable", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEDraggableElementBase = void 0;
    let HTMLEDraggableElementBase = class HTMLEDraggableElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_1.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                    padding: 3px 4px;
                    cursor: pointer;
                    white-space: nowrap;
                    border-radius: 4px;
                    border: 1px solid black;
                    user-select: none;
                }

                :host([disabled]) {
                    pointer-events: none;
                    color: gray;
                    border-color: gray;
                }

                :host([selected]:active) {
                    cursor: grabbing;
                }
                
                :host([selected]) {
                    cursor: grab;
                    font-weight: bold;
                    outline: 1px auto black;
                }

                :host([dragovered]) {
                    border-style: dotted;
                }
                
                [part="container"] {
                    display: flex;
                    align-items: center;
                }
            </style>
            <div part="container">
                <slot>&nbsp;</slot>
            </div>
        `);
        }
        connectedCallback() {
            this.tabIndex = this.tabIndex;
            this.draggable = true;
        }
    };
    HTMLEDraggableElementBase = __decorate([
        HTMLElement_1.RegisterCustomHTMLElement({
            name: "e-draggable"
        }),
        HTMLElement_1.GenerateAttributeAccessors([
            { name: "selected", type: "boolean" },
            { name: "dragged", type: "boolean" },
            { name: "dragovered", type: "boolean" },
            { name: "disabled", type: "boolean" },
            { name: "type", type: "string" },
        ])
    ], HTMLEDraggableElementBase);
    exports.HTMLEDraggableElementBase = HTMLEDraggableElementBase;
});
define("editor/elements/lib/controls/draggable/Dragzone", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEDragzoneElementBase = void 0;
    let HTMLEDragzoneElementBase = class HTMLEDragzoneElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_2.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }

                :host([disabled]) {
                    pointer-events: none;
                }

                [part~="container"]:empty {
                    display: none !important;
                }

                [part~="container"] {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    padding: 2px;
                }

                ::slotted(e-draggable:not(:only-child)) {
                    margin-top: 2px;
                    margin-bottom: 2px;
                }
            </style>
            <div part="container">
                <span part="label"/></span>
                <slot></slot>
            </div>
        `);
            this.draggables = [];
            this.selectedDraggables = [];
        }
        selectDraggable(draggable) {
            draggable.selected = true;
            if (!this.selectedDraggables.includes(draggable)) {
                this.selectedDraggables.push(draggable);
            }
        }
        unselectDraggable(draggable) {
            let index = this.selectedDraggables.indexOf(draggable);
            if (index > -1) {
                draggable.selected = false;
                this.selectedDraggables.splice(index, 1);
            }
        }
        clearSelection() {
            this.selectedDraggables.forEach((draggable) => {
                draggable.selected = false;
            });
            this.selectedDraggables = [];
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const draggables = slot.assignedElements().filter(elem => HTMLElement_2.isTagElement("e-draggable", elem));
                    this.draggables = draggables;
                    this.draggables.forEach((draggable) => {
                        draggable.draggable = true;
                    });
                });
            }
            this.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "Escape":
                        this.clearSelection();
                        this.focus();
                        break;
                }
            });
            this.addEventListener("dragstart", (event) => {
                let target = event.target;
                if (this.draggables.includes(target)) {
                    this.selectedDraggables.forEach((thisSelectedDraggable) => {
                        thisSelectedDraggable.dragged = true;
                    });
                    let dataTransfer = event.dataTransfer;
                    if (dataTransfer) {
                        dataTransfer.effectAllowed = "move";
                        dataTransfer.setData("text/plain", this.id);
                    }
                }
            });
            this.addEventListener("dragend", (event) => {
                let target = event.target;
                if (this.draggables.includes(target)) {
                    let thisDraggedDraggables = this.draggables.filter(draggable => draggable.dragged);
                    thisDraggedDraggables.forEach((thisDraggedDraggable) => {
                        thisDraggedDraggable.dragged = false;
                    });
                }
            });
            this.addEventListener("focusout", (event) => {
                let relatedTarget = event.relatedTarget;
                if (!this.contains(relatedTarget)) {
                    this.clearSelection();
                }
            });
            this.addEventListener("mousedown", (event) => {
                let target = event.target;
                if (event.button === 0) {
                    if (this.draggables.includes(target)) {
                        if (!event.shiftKey && !event.ctrlKey) {
                            if (!target.selected) {
                                this.clearSelection();
                                this.selectDraggable(target);
                            }
                        }
                        else if (event.ctrlKey) {
                            (!target.selected) ?
                                this.selectDraggable(target) :
                                this.unselectDraggable(target);
                        }
                        else if (event.shiftKey) {
                            if (this.selectedDraggables.length > 0) {
                                let targetIndex = this.draggables.indexOf(target);
                                let firstIndex = this.draggables.indexOf(this.selectedDraggables[0]);
                                let direction = Math.sign(targetIndex - firstIndex);
                                let fromIndex = (direction > 0) ? 0 : this.draggables.length - 1;
                                let toIndex = (direction > 0) ? this.draggables.length - 1 : 0;
                                let startRangeIndex = (direction > 0) ? firstIndex : targetIndex;
                                let endRangeIndex = (direction > 0) ? targetIndex : firstIndex;
                                for (let index = fromIndex; index !== toIndex; index += direction) {
                                    (index >= startRangeIndex && index <= endRangeIndex) ?
                                        this.selectDraggable(this.draggables[index]) :
                                        this.unselectDraggable(this.draggables[index]);
                                }
                            }
                            else {
                                this.selectDraggable(target);
                            }
                        }
                    }
                    else {
                        this.clearSelection();
                    }
                }
            });
            this.addEventListener("mouseup", (event) => {
                let target = event.target;
                if (event.button === 0) {
                    if (this.draggables.includes(target)) {
                        if (!event.shiftKey && !event.ctrlKey) {
                            this.draggables.forEach((thisDraggable) => {
                                if (thisDraggable !== target) {
                                    this.unselectDraggable(thisDraggable);
                                }
                            });
                        }
                    }
                }
            });
        }
    };
    HTMLEDragzoneElementBase = __decorate([
        HTMLElement_2.RegisterCustomHTMLElement({
            name: "e-dragzone"
        })
    ], HTMLEDragzoneElementBase);
    exports.HTMLEDragzoneElementBase = HTMLEDragzoneElementBase;
});
define("editor/elements/lib/controls/draggable/Dropzone", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEDropzoneElementBase = void 0;
    let HTMLEDropzoneElementBase = class HTMLEDropzoneElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_3.bindShadowRoot(this, /*html*/ `
            <style>
                :host {
                    display: block;
                    border: 1px dashed gray;
                }

                :host([disabled]) {
                    pointer-events: none;
                }

                :host(:empty) [part~="container"] {
                    display: none !important;
                }

                [part~="container"] {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    padding: 2px;
                }

                ::slotted(e-draggable:not(:only-child)) {
                    margin-top: 2px;
                    margin-bottom: 2px;
                }

                :host(:not([multiple]):not(:empty)) [part="appendarea"],
                :host(:not(:empty):not([dragovered])) [part="appendarea"] {
                    display: none !important;
                }

                [part="appendarea"] {
                    display: block;
                    margin: 2px;
                    border-radius: 4px;
                    border: 1px dotted black;
                }

                :host(:not([dragovered="appendarea"])) [part="appendarea"] {
                    border-color: transparent;
                }
                
                [part="placeholder"] {
                    display: inline-block;
                    color: grey;
                    pointer-events: none;
                    user-select: none;
                }
            </style>
            <div part="container">
                <slot></slot>
            </div>
            <div part="appendarea">
                <span part="placeholder">&nbsp;</span>
            </div>
            `);
            this.draggables = [];
            this.selectedDraggables = [];
            this.droptest = null;
        }
        selectDraggable(draggable) {
            draggable.selected = true;
            if (!this.selectedDraggables.includes(draggable)) {
                this.selectedDraggables.push(draggable);
            }
        }
        unselectDraggable(draggable) {
            let index = this.selectedDraggables.indexOf(draggable);
            if (index > -1) {
                draggable.selected = false;
                this.selectedDraggables.splice(index, 1);
            }
        }
        clearSelection() {
            this.selectedDraggables.forEach((draggable) => {
                draggable.selected = false;
            });
            this.selectedDraggables = [];
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const draggables = slot.assignedElements().filter(elem => HTMLElement_3.isTagElement("e-draggable", elem));
                    this.draggables = draggables;
                    this.draggables.forEach((draggable) => {
                        draggable.draggable = false;
                    });
                });
            }
            const appendAreaPart = this.shadowRoot.querySelector("[part='appendarea']");
            this.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "Delete":
                        if (this == event.target) {
                            this.removeDraggables();
                        }
                        else {
                            this.removeDraggables(draggable => draggable.selected);
                        }
                        event.stopPropagation();
                        break;
                    case "Escape":
                        this.clearSelection();
                        this.focus();
                        break;
                }
            });
            this.addEventListener("focusout", (event) => {
                let relatedTarget = event.relatedTarget;
                if (!this.contains(relatedTarget)) {
                    this.clearSelection();
                }
            });
            this.addEventListener("mousedown", (event) => {
                let target = event.target;
                if (event.button === 0) {
                    if (this.draggables.includes(target)) {
                        if (!event.shiftKey && !event.ctrlKey) {
                            if (!target.selected) {
                                this.clearSelection();
                                this.selectDraggable(target);
                            }
                        }
                        else if (event.ctrlKey) {
                            (!target.selected) ?
                                this.selectDraggable(target) :
                                this.unselectDraggable(target);
                        }
                        else if (event.shiftKey) {
                            if (this.selectedDraggables.length > 0) {
                                let targetIndex = this.draggables.indexOf(target);
                                let firstIndex = this.draggables.indexOf(this.selectedDraggables[0]);
                                let direction = Math.sign(targetIndex - firstIndex);
                                let fromIndex = (direction > 0) ? 0 : this.draggables.length - 1;
                                let toIndex = (direction > 0) ? this.draggables.length - 1 : 0;
                                let startRangeIndex = (direction > 0) ? firstIndex : targetIndex;
                                let endRangeIndex = (direction > 0) ? targetIndex : firstIndex;
                                for (let index = fromIndex; index !== toIndex; index += direction) {
                                    (index >= startRangeIndex && index <= endRangeIndex) ?
                                        this.selectDraggable(this.draggables[index]) :
                                        this.unselectDraggable(this.draggables[index]);
                                }
                            }
                            else {
                                this.selectDraggable(target);
                            }
                        }
                    }
                    else {
                        this.clearSelection();
                    }
                }
            });
            this.addEventListener("mouseup", (event) => {
                let target = event.target;
                if (event.button === 0) {
                    if (this.draggables.includes(target)) {
                        if (!event.shiftKey && !event.ctrlKey) {
                            this.draggables.forEach((thisDraggable) => {
                                if (thisDraggable !== target) {
                                    this.unselectDraggable(thisDraggable);
                                }
                            });
                        }
                    }
                }
            });
            this.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
            this.shadowRoot.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
            this.addEventListener("dragenter", (event) => {
                let target = event.target;
                if (this.draggables.includes(target)) {
                    target.dragovered = true;
                    this.dragovered = "draggable";
                }
                else {
                    this.dragovered = "self";
                }
                event.preventDefault();
            });
            this.shadowRoot.addEventListener("dragenter", (event) => {
                let target = event.target;
                if (target == appendAreaPart) {
                    this.dragovered = "appendarea";
                }
                event.preventDefault();
            });
            this.addEventListener("dragleave", (event) => {
                let relatedTarget = event.relatedTarget;
                let target = event.target;
                if (target == this || this.draggables.includes(target)) {
                    if (target == this) {
                        if (appendAreaPart) {
                            this.dragovered = "self";
                        }
                        if (!this.draggables.includes(relatedTarget)) {
                            this.dragovered = null;
                        }
                    }
                    else {
                        target.dragovered = false;
                    }
                }
                event.preventDefault();
            });
            this.shadowRoot.addEventListener("dragleave", (event) => {
                let target = event.target;
                if (target == appendAreaPart) {
                    this.dragovered = "self";
                }
                event.preventDefault();
            });
            this.addEventListener("drop", (event) => {
                let target = event.target;
                if (target == this || this.draggables.includes(target)) {
                    let dropIndex = this.draggables.length;
                    if (target == this) {
                        this.dragovered = null;
                    }
                    else {
                        target.dragovered = false;
                        dropIndex = this.draggables.indexOf(target);
                    }
                    let dataTransfer = event.dataTransfer;
                    if (dataTransfer) {
                        let dragzoneId = dataTransfer.getData("text/plain");
                        let dragzone = document.getElementById(dragzoneId);
                        if (dragzone) {
                            let selectedDraggables = dragzone.selectedDraggables;
                            if (selectedDraggables) {
                                selectedDraggables.forEach((selectedDraggable) => {
                                    selectedDraggable.dragged = false;
                                });
                                dragzone.clearSelection();
                                this.addDraggables(selectedDraggables, dropIndex);
                            }
                        }
                    }
                }
                this.dragovered = null;
                event.preventDefault();
            });
        }
        attributeChangedCallback(name, oldValue, newValue) {
            var _a;
            if (newValue !== oldValue) {
                switch (name) {
                    case "placeholder":
                        if (oldValue !== newValue) {
                            const placeholderPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=placeholder]");
                            if (placeholderPart) {
                                placeholderPart.textContent = newValue;
                            }
                        }
                        break;
                }
            }
        }
        addDraggables(draggables, position) {
            var _a;
            if (draggables.length > 0) {
                let dataTransferSuccess = true;
                if (this.droptest) {
                    dataTransferSuccess = this.droptest(this, draggables);
                }
                let newDraggables = [];
                let insertionPosition = -1;
                if (dataTransferSuccess) {
                    if (this.multiple) {
                        draggables.forEach((draggable) => {
                            let newDraggable = draggable.cloneNode(true);
                            if (position > -1 && position < this.draggables.length) {
                                this.draggables[position].insertAdjacentElement("beforebegin", newDraggable);
                                insertionPosition = (insertionPosition < 0) ? position : insertionPosition;
                            }
                            else {
                                this.appendChild(newDraggable);
                                insertionPosition = (insertionPosition < 0) ? this.draggables.length - 1 : insertionPosition;
                            }
                            newDraggables.push(newDraggable);
                        });
                    }
                    else {
                        let newDraggable = draggables[0].cloneNode(true);
                        if (this.draggables.length > 0) {
                            this.replaceChild(newDraggable, this.draggables[0]);
                        }
                        else {
                            this.appendChild(newDraggable);
                        }
                        newDraggables.push(newDraggable);
                        insertionPosition = 0;
                    }
                }
                const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
                if (slot) {
                    slot.addEventListener("slotchange", () => {
                        this.dispatchEvent(new CustomEvent("datachange", {
                            bubbles: true,
                            detail: {
                                action: "insert",
                                draggables: newDraggables,
                                position: insertionPosition
                            }
                        }));
                    }, { once: true });
                }
                return newDraggables;
            }
            return null;
        }
        removeDraggables(predicate = () => true) {
            var _a;
            let toRemove = this.draggables.filter((value, index) => {
                return predicate(value, index);
            });
            let atPosition = this.draggables.indexOf(toRemove[0]);
            toRemove.forEach((draggable) => {
                draggable.remove();
            });
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    this.dispatchEvent(new CustomEvent("datachange", {
                        bubbles: true,
                        detail: {
                            action: "remove",
                            draggables: toRemove,
                            position: atPosition
                        }
                    }));
                }, { once: true });
            }
        }
    };
    HTMLEDropzoneElementBase = __decorate([
        HTMLElement_3.RegisterCustomHTMLElement({
            name: "e-dropzone",
            observedAttributes: ["placeholder", "label"]
        }),
        HTMLElement_3.GenerateAttributeAccessors([
            { name: "dragovered", type: "string" },
            { name: "placeholder", type: "string" },
            { name: "disabled", type: "boolean" },
            { name: "multiple", type: "boolean" },
            { name: "input", type: "string" },
            { name: "label", type: "string" },
            { name: "name", type: "string" },
            { name: "type", type: "string" },
        ])
    ], HTMLEDropzoneElementBase);
    exports.HTMLEDropzoneElementBase = HTMLEDropzoneElementBase;
});
define("editor/elements/lib/containers/menus/MenuBar", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuBarElementBase = void 0;
    let HTMLEMenuBarElementBase = class HTMLEMenuBarElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_4.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    user-select: none;
                }
                
                :host(:focus) {
                    /*outline: 1px solid -webkit-focus-ring-color;*/
                    color: black;
                    background-color: gainsboro;
                }

                /*:host(:focus) ::slotted(:first-child),*/
                :host(:not(:focus-within)) ::slotted(:hover) {
                    color: black;
                    background-color: gainsboro;
                }

                [part~="ul"] {
                    display: flex;
                    flex-direction: row;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);
            this.items = [];
            this._activeIndex = -1;
        }
        get activeIndex() {
            return this._activeIndex;
        }
        get activeItem() {
            return this.items[this.activeIndex] || null;
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const items = slot.assignedElements()
                        .filter(item => HTMLElement_4.isTagElement("e-menuitem", item));
                    this.items = items;
                    items.forEach((item) => {
                        item.parentMenu = this;
                    });
                });
            }
            this.addEventListener("mouseover", (event) => {
                let targetIndex = this.items.indexOf(event.target);
                if (targetIndex >= 0) {
                    if (this.contains(document.activeElement)) {
                        if (this.active) {
                            this.focusItemAt(targetIndex, true);
                        }
                        else {
                            this._activeIndex = targetIndex;
                        }
                    }
                }
            });
            this.addEventListener("keydown", (event) => {
                var _a, _b, _c;
                switch (event.key) {
                    case "ArrowLeft":
                        this.focusItemAt((this.activeIndex <= 0) ? this.items.length - 1 : this.activeIndex - 1);
                        if (this.active && ((_a = this.activeItem) === null || _a === void 0 ? void 0 : _a.childMenu)) {
                            this.activeItem.childMenu.focusItemAt(0);
                        }
                        break;
                    case "ArrowRight":
                        this.focusItemAt((this.activeIndex >= this.items.length - 1) ? 0 : this.activeIndex + 1);
                        if (this.active && ((_b = this.activeItem) === null || _b === void 0 ? void 0 : _b.childMenu)) {
                            this.activeItem.childMenu.focusItemAt(0);
                        }
                        break;
                    case "ArrowDown":
                        this.focusItemAt(this.activeIndex);
                        if (this.active && ((_c = this.activeItem) === null || _c === void 0 ? void 0 : _c.childMenu)) {
                            this.activeItem.childMenu.focusItemAt(0);
                        }
                        break;
                    case "Enter":
                        this.active = true;
                        if (this.activeItem) {
                            this.activeItem.trigger();
                        }
                        break;
                    case "Escape":
                        this.focusItemAt(this.activeIndex);
                        this.active = false;
                        break;
                }
            });
            this.addEventListener("mousedown", (event) => {
                let targetIndex = this.items.indexOf(event.target);
                if (targetIndex >= 0) {
                    if (!this.contains(document.activeElement)) {
                        this.active = true;
                        this.focusItemAt(targetIndex, true);
                    }
                    else {
                        this.active = false;
                        document.body.focus();
                    }
                    event.preventDefault();
                }
            });
            this.addEventListener("focus", () => {
                this._activeIndex = 0;
            });
        }
        focusItemAt(index, childMenu) {
            let item = this.items[index];
            if (item) {
                this._activeIndex = index;
                item.focus();
                if (childMenu && item.childMenu) {
                    item.childMenu.focus();
                }
            }
        }
        focusItem(predicate, subtree) {
            let item = this.findItem(predicate, subtree);
            if (item) {
                item.focus();
            }
        }
        reset() {
            let item = this.activeItem;
            this._activeIndex = -1;
            if (item === null || item === void 0 ? void 0 : item.childMenu) {
                item.childMenu.reset();
            }
        }
        findItem(predicate, subtree) {
            let foundItem = null;
            for (let idx = 0; idx < this.items.length; idx++) {
                let item = this.items[idx];
                if (predicate(item)) {
                    return item;
                }
                if (subtree && item.childMenu) {
                    foundItem = item.childMenu.findItem(predicate, subtree);
                    if (foundItem) {
                        return foundItem;
                    }
                }
            }
            return foundItem;
        }
    };
    HTMLEMenuBarElementBase = __decorate([
        HTMLElement_4.RegisterCustomHTMLElement({
            name: "e-menubar"
        }),
        HTMLElement_4.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "active", type: "boolean" },
        ])
    ], HTMLEMenuBarElementBase);
    exports.HTMLEMenuBarElementBase = HTMLEMenuBarElementBase;
});
define("editor/Input", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MouseButton = exports.HotKey = exports.KeyModifier = exports.Key = void 0;
    var Key;
    (function (Key) {
        Key["A"] = "a";
        Key["B"] = "b";
        Key["C"] = "c";
        Key["D"] = "d";
        Key["E"] = "e";
        Key["F"] = "f";
        Key["G"] = "g";
        Key["H"] = "h";
        Key["I"] = "i";
        Key["J"] = "j";
        Key["K"] = "k";
        Key["L"] = "l";
        Key["M"] = "m";
        Key["O"] = "o";
        Key["P"] = "p";
        Key["Q"] = "q";
        Key["R"] = "r";
        Key["S"] = "s";
        Key["T"] = "t";
        Key["U"] = "u";
        Key["V"] = "v";
        Key["W"] = "w";
        Key["X"] = "x";
        Key["Y"] = "y";
        Key["Z"] = "z";
        Key["ENTER"] = "Enter";
        Key["BACKSPACE"] = "Backspace";
        Key["ARROW_DOWN"] = "ArrowDown";
        Key["ARROW_LEFT"] = "ArrowLeft";
        Key["ARROW_RIGHT"] = "ArrowRight";
        Key["ARROW_UP"] = "ArrowUp";
        Key["SHIFT"] = "Shift";
    })(Key || (Key = {}));
    exports.Key = Key;
    var KeyModifier;
    (function (KeyModifier) {
        KeyModifier["Alt"] = "Alt";
        KeyModifier["Control"] = "Control";
        KeyModifier["Shift"] = "Shift";
    })(KeyModifier || (KeyModifier = {}));
    exports.KeyModifier = KeyModifier;
    function displayKeyModifier(mode) {
        switch (mode) {
            case KeyModifier.Control:
                return "Ctrl";
            default:
                return mode;
        }
    }
    var MouseButton;
    (function (MouseButton) {
        MouseButton[MouseButton["LEFT"] = 1] = "LEFT";
        MouseButton[MouseButton["WHEEL"] = 2] = "WHEEL";
        MouseButton[MouseButton["RIGHT"] = 3] = "RIGHT";
        MouseButton[MouseButton["FORWARD"] = 4] = "FORWARD";
        MouseButton[MouseButton["BACK"] = 5] = "BACK";
    })(MouseButton || (MouseButton = {}));
    exports.MouseButton = MouseButton;
    const testKeyModifier = (mod, event) => {
        switch (mod) {
            case 'Alt':
                return event.altKey;
            case 'Control':
                return event.ctrlKey;
            case 'Shift':
                return event.shiftKey;
            default:
                return () => true;
        }
    };
    class HotKey {
        constructor(key, mod1, mod2) {
            this.key = key;
            this.mod1 = mod1;
            this.mod2 = mod2;
        }
        toString() {
            return `${this.mod1 ? `${displayKeyModifier(this.mod1)}+` : ''}${this.mod2 ? `${displayKeyModifier(this.mod2)}+` : ''}${(this.key.length === 1) ? this.key.toUpperCase() : this.key}`;
        }
        test(event) {
            return ((!this.mod1 || testKeyModifier(this.mod1, event)) && (!this.mod2 || testKeyModifier(this.mod2, event)) && event.key === this.key);
        }
    }
    exports.HotKey = HotKey;
});
define("editor/elements/lib/containers/menus/MenuItemGroup", ["require", "exports", "editor/elements/HTMLElement", "editor/elements/Snippets"], function (require, exports, HTMLElement_5, Snippets_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemGroupElementBase = void 0;
    let HTMLEMenuItemGroupElementBase = class HTMLEMenuItemGroupElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_5.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    user-select: none;
                }

                :host(:focus) {
                    outline: none;
                }
                
                :host(:not([label])) [part~="li"] {
                    display: none;
                }

                [part~="label"] {
                    position: relative;
                    display: inline-block;
                    width: 100%;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px 6px 6px;
                    font-weight: bold;
                }

                [part~="li"] {
                    list-style-type: none;
                }

                [part~="separator"] {
                    margin: 6px 0;
                }

                :host(:first-child) [part~="separator"] {
                    display: none;
                }
            </style>
            <hr part="separator"/>
            <li part="li">
                <span part="label"></span>
            </li>
            <slot></slot>
        `);
            this._activeIndex = -1;
            this.parentMenu = null;
            this.items = [];
        }
        get activeIndex() {
            return this._activeIndex;
        }
        get activeItem() {
            return this.items[this.activeIndex] || null;
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const items = slot.assignedElements()
                        .filter(item => HTMLElement_5.isTagElement("e-menuitem", item));
                    this.items = items;
                    items.forEach((item) => {
                        item.group = this;
                    });
                });
            }
            this.addEventListener("mousedown", (event) => {
                let target = event.target;
                if (this.items.includes(target)) {
                    target.trigger();
                }
            });
            this.addEventListener("mouseover", (event) => {
                let target = event.target;
                let targetIndex = this.items.indexOf(target);
                if (this === target) {
                    this.reset();
                    this.focus();
                }
                else if (targetIndex >= 0) {
                    this.focusItemAt(this.items.indexOf(target), true);
                }
            });
            this.addEventListener("mouseout", (event) => {
                let target = event.target;
                let thisIntersectsWithMouse = Snippets_2.pointIntersectsWithDOMRect(event.clientX, event.clientY, this.getBoundingClientRect());
                if ((this === target || this.items.includes(target)) && !thisIntersectsWithMouse) {
                    this.reset();
                    this.focus();
                }
            });
            this.addEventListener("focusin", (event) => {
                let target = event.target;
                this._activeIndex = this.items.findIndex((item) => item.contains(target));
            });
            this.addEventListener("focusout", (event) => {
                let newTarget = event.relatedTarget;
                if (!this.contains(newTarget)) {
                    this.reset();
                }
            });
            this.addEventListener("radiochangerequest", (event) => {
                let target = event.target;
                if (HTMLElement_5.isTagElement("e-menuitem", target)) {
                    let item = target;
                    if (item.type === "radio" && !item.checked) {
                        let checkedRadio = this.findItem((item) => {
                            return item.type === "radio" && item.checked;
                        });
                        if (checkedRadio) {
                            checkedRadio.checked = false;
                        }
                        item.checked = true;
                    }
                }
            });
            this.addEventListener("keydown", (event) => {
                var _a;
                switch (event.key) {
                    case "ArrowUp":
                        if (this.activeIndex > 0) {
                            this.focusItemAt(this.activeIndex - 1);
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowDown":
                        if (this.activeIndex < this.items.length - 1) {
                            this.focusItemAt(this.activeIndex + 1);
                            event.stopPropagation();
                        }
                        break;
                    case "Enter":
                        if (this.activeItem) {
                            this.activeItem.trigger();
                            event.stopPropagation();
                        }
                        break;
                    case "ArrowRight":
                        if (this.items.includes(event.target)) {
                            if ((_a = this.activeItem) === null || _a === void 0 ? void 0 : _a.childMenu) {
                                this.activeItem.childMenu.focusItemAt(0);
                                event.stopPropagation();
                            }
                        }
                        break;
                    case "Home":
                        this.focusItemAt(0);
                        break;
                    case "End":
                        this.focusItemAt(this.items.length - 1);
                        break;
                    case "Escape":
                        this.reset();
                        break;
                }
            });
        }
        attributeChangedCallback(name, oldValue, newValue) {
            var _a;
            if (oldValue !== newValue) {
                switch (name) {
                    case "label":
                        if (oldValue !== newValue) {
                            const label = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                            if (label) {
                                label.textContent = newValue;
                            }
                        }
                }
            }
        }
        focusItemAt(index, childMenu) {
            let item = this.items[index];
            if (item) {
                this._activeIndex = index;
                item.focus();
                if (childMenu && item.childMenu) {
                    item.childMenu.focus();
                }
            }
        }
        reset() {
            let item = this.activeItem;
            this._activeIndex = -1;
            if (item === null || item === void 0 ? void 0 : item.childMenu) {
                item.childMenu.reset();
            }
        }
        focusItem(predicate, subitems) {
            let item = this.findItem(predicate, subitems);
            if (item) {
                item.focus();
            }
        }
        findItem(predicate, subitems) {
            let foundItem = null;
            for (let idx = 0; idx < this.items.length; idx++) {
                let item = this.items[idx];
                if (predicate(item)) {
                    return item;
                }
                if (subitems && item.childMenu) {
                    foundItem = item.childMenu.findItem(predicate, subitems);
                    if (foundItem) {
                        return foundItem;
                    }
                }
            }
            return foundItem;
        }
    };
    HTMLEMenuItemGroupElementBase = __decorate([
        HTMLElement_5.RegisterCustomHTMLElement({
            name: "e-menuitemgroup",
            observedAttributes: ["label"]
        }),
        HTMLElement_5.GenerateAttributeAccessors([
            { name: "label", type: "string" },
            { name: "type", type: "string" },
            { name: "name", type: "string" },
            { name: "rows", type: "number" },
            { name: "cells", type: "number" },
        ])
    ], HTMLEMenuItemGroupElementBase);
    exports.HTMLEMenuItemGroupElementBase = HTMLEMenuItemGroupElementBase;
});
define("editor/elements/lib/containers/menus/MenuItem", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemElementBase = void 0;
    let HTMLEMenuItemElementBase = class HTMLEMenuItemElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_6.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px;
                    cursor: pointer;
                }

                :host(:not([type="menu"])) {
                    padding-left: 12px;
                    padding-right: 12px;
                }

                :host(:focus-within) {
                    color: black;
                    background-color: lightgray;
                }

                :host([disabled]) {
                    color: lightgray;
                }

                :host([type="submenu"]) ::slotted([slot="menu"]),
                :host([type="menu"]) ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    color: initial;
                }

                :host([type="menu"]) ::slotted([slot="menu"]) {
                    top: 100%;
                    left: 0;
                }

                :host([type="submenu"]) ::slotted([slot="menu"]) {
                    left: 100%;
                    top: -6px;
                }
                
                :host([type="submenu"]) ::slotted([slot="menu"][overflowing]) {
                    right: 100%;
                    left: auto;
                }
                
                :host([type="menu"]) ::slotted([slot="menu"][overflowing]) {
                    right: 0;
                    left: auto;
                }

                :host([type="menu"]) ::slotted([slot="menu"]:not([expanded])),
                :host([type="submenu"]) ::slotted([slot="menu"]:not([expanded])) {
                    opacity: 0;
                    pointer-events: none !important;
                }

                [part~="li"] {
                    display: flex;
                    list-style-type: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    flex: auto;
                    display: flex;
                    overflow: hidden;
                    pointer-events: none;
                }

                [part~="input"] {
                    display: inline-block;
                    flex: none;
                    width: 16px;
                    height: 16px;
                    margin: auto 1px;
                }

                [part~="label"] {
                    flex: auto;
                    text-align: left;
                }

                [part~="hotkey"] {
                    flex: none;
                    text-align: right;
                    margin-left: 16px;
                }

                [part~="hotkey"]:empty {
                    display: none !important;
                }

                [part~="arrow"] {
                    display: inline-block;
                    flex: none;
                    margin: auto;
                    color: inherit;
                    text-align: center;
                    font-weight: bold;
                    width: 18px;
                    height: 18px;
                }

                [part~="arrow"]::after {
                    position: absolute;
                    content: "›";
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    transform: scale(1.2) translateY(-15%);
                }

                :host([type="menu"]) [part~="arrow"],
                :host([type="menu"]) [part~="icon"],
                :host([type="menu"]) [part~="input"] {
                    display: none;
                }

                :host(:not([type="menu"])) [part~="label"] {
                    padding-left: 10px;
                    padding-right: 12px;
                }
                
                :host([type="checkbox"]) [part~="icon"],
                :host([type="radio"]) [part~="icon"],
                :host(:not([type="checkbox"]):not([type="radio"])) [part~="input"] {
                    display: none;
                }

                :host([type="submenu"]) [part~="icon"] {
                    visibility: hidden;
                }
                
                :host(:not([type="submenu"])) [part~="arrow"] {
                    visibility: hidden;
                }
            </style>
            <li part="li">
                <span part="content">
                    <slot name="label"></slot>
                    <span part="icon"></span>
                    <input part="input" type="button" tabindex="-1"></input>
                    <span part="label"></span>
                    <span part="hotkey"></span>
                    <span part="description"></span>
                    <span part="arrow"></span>
                </span>
                <slot name="menu"></slot>
            </li>
        `);
            this.childMenu = null;
            this.parentMenu = null;
            this.group = null;
            this.command = null;
            this._hotkey = null;
        }
        get hotkey() {
            return this._hotkey;
        }
        set hotkey(hotkey) {
            var _a;
            this.dispatchEvent(new CustomEvent("e-hotkeychange", {
                bubbles: true,
                detail: {
                    oldHotKey: this._hotkey,
                    newHotKey: hotkey
                }
            }));
            this._hotkey = hotkey;
            let hotkeyPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=hotkey]");
            if (hotkeyPart) {
                hotkeyPart.textContent = hotkey ? hotkey.toString() : "";
            }
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            this.setAttribute("aria-label", this.label);
            const menuSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name=menu]");
            if (menuSlot) {
                menuSlot.addEventListener("slotchange", () => {
                    const menuElem = menuSlot.assignedElements()[0];
                    if (HTMLElement_6.isTagElement("e-menu", menuElem)) {
                        this.childMenu = menuElem;
                        menuElem.parentItem = this;
                    }
                });
            }
        }
        attributeChangedCallback(name, oldValue, newValue) {
            var _a, _b, _c, _d;
            if (newValue !== oldValue) {
                switch (name) {
                    case "label":
                        if (oldValue !== newValue) {
                            const labelPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                            if (labelPart) {
                                labelPart.textContent = newValue;
                            }
                        }
                        break;
                    case "icon":
                        if (oldValue !== newValue) {
                            const iconPart = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("[part~=icon]");
                            if (iconPart) {
                                iconPart.dataset.value = newValue;
                            }
                        }
                        break;
                    case "checked":
                        if (oldValue !== newValue) {
                            const inputPart = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelector("[part~=input]");
                            if (inputPart) {
                                inputPart.checked = (newValue !== null);
                                this.dispatchEvent(new CustomEvent("e-change", { bubbles: true }));
                            }
                        }
                        break;
                    case "type":
                        if (oldValue !== newValue) {
                            const inputPart = (_d = this.shadowRoot) === null || _d === void 0 ? void 0 : _d.querySelector("[part~=input]");
                            if (inputPart) {
                                switch (this.type) {
                                    case "radio":
                                        inputPart.type = "radio";
                                        break;
                                    case "menu":
                                        inputPart.type = "hidden";
                                        break;
                                    default:
                                        inputPart.type = "checkbox";
                                        break;
                                }
                            }
                        }
                        break;
                }
            }
        }
        trigger() {
            if (!this.disabled) {
                switch (this.type) {
                    case "checkbox":
                        this.checked = !this.checked;
                        break;
                    case "radio":
                        this.dispatchEvent(new CustomEvent("radiochangerequest", { bubbles: true }));
                        break;
                    case "menu":
                        if (this.childMenu) {
                            this.childMenu.focusItemAt(0);
                        }
                        break;
                }
                this.dispatchEvent(new CustomEvent("trigger", { bubbles: true }));
            }
        }
    };
    HTMLEMenuItemElementBase = __decorate([
        HTMLElement_6.RegisterCustomHTMLElement({
            name: "e-menuitem",
            observedAttributes: ["icon", "label", "checked", "type"]
        }),
        HTMLElement_6.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "label", type: "string" },
            { name: "icon", type: "string" },
            { name: "type", type: "string" },
            { name: "disabled", type: "boolean" },
            { name: "checked", type: "boolean" },
        ])
    ], HTMLEMenuItemElementBase);
    exports.HTMLEMenuItemElementBase = HTMLEMenuItemElementBase;
});
define("editor/elements/lib/containers/menus/Menu", ["require", "exports", "editor/elements/HTMLElement", "editor/elements/Snippets"], function (require, exports, HTMLElement_7, Snippets_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuElementBase = void 0;
    let HTMLEMenuElementBase = class HTMLEMenuElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_7.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    position: relative;
                    user-select: none;

                    padding: 6px 0;
                    background-color: white;
                    cursor: initial;

                    -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.75);
                    -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.75);
                    box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.75);
                }
                
                :host(:focus) {
                    outline: none;
                }

                [part~="ul"] {
                    display: flex;
                    flex-direction: column;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }

                ::slotted(hr) {
                    margin: 6px 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);
            this.parentItem = null;
            this.items = [];
            this._activeIndex = -1;
        }
        get activeIndex() {
            return this._activeIndex;
        }
        get activeItem() {
            return this.items[this.activeIndex] || null;
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const items = slot.assignedElements().filter(elem => HTMLElement_7.isTagElement("e-menuitem", elem) || HTMLElement_7.isTagElement("e-menuitemgroup", elem));
                    this.items = items;
                    items.forEach((item) => {
                        item.parentMenu = this;
                    });
                });
            }
            this.addEventListener("mousedown", (event) => {
                let target = event.target;
                if (HTMLElement_7.isTagElement("e-menuitem", target)) {
                    let thisIncludesTarget = this.items.includes(target);
                    if (thisIncludesTarget) {
                        target.trigger();
                    }
                }
            });
            this.addEventListener("mouseover", (event) => {
                let target = event.target;
                let targetIndex = this.items.indexOf(target);
                if (this === target) {
                    this.reset();
                    this.focus();
                }
                else if (targetIndex >= 0) {
                    if (HTMLElement_7.isTagElement("e-menuitem", target)) {
                        this.focusItemAt(targetIndex, true);
                    }
                    else {
                        this._activeIndex = targetIndex;
                    }
                }
            });
            this.addEventListener("mouseout", (event) => {
                let target = event.target;
                let thisIntersectsWithMouse = Snippets_3.pointIntersectsWithDOMRect(event.clientX, event.clientY, this.getBoundingClientRect());
                if ((this === target || this.items.includes(target)) && !thisIntersectsWithMouse) {
                    this.reset();
                    this.focus();
                }
            });
            this.addEventListener("focusin", (event) => {
                let target = event.target;
                this._activeIndex = this.items.findIndex((item) => item.contains(target));
                this.expanded = true;
            });
            this.addEventListener("focusout", (event) => {
                let newTarget = event.relatedTarget;
                if (!this.contains(newTarget)) {
                    this.reset();
                    this.expanded = false;
                }
            });
            this.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "ArrowUp":
                        this.focusItemAt((this.activeIndex <= 0) ? this.items.length - 1 : this.activeIndex - 1);
                        if (HTMLElement_7.isTagElement("e-menuitemgroup", this.activeItem)) {
                            this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                        }
                        event.stopPropagation();
                        break;
                    case "ArrowDown":
                        this.focusItemAt((this.activeIndex >= this.items.length - 1) ? 0 : this.activeIndex + 1);
                        if (HTMLElement_7.isTagElement("e-menuitemgroup", this.activeItem)) {
                            this.activeItem.focusItemAt(0);
                        }
                        event.stopPropagation();
                        break;
                    case "Home":
                        this.focusItemAt(0);
                        if (HTMLElement_7.isTagElement("e-menuitemgroup", this.activeItem)) {
                            this.activeItem.focusItemAt(0);
                        }
                        event.stopPropagation();
                        break;
                    case "End":
                        this.focusItemAt(this.items.length - 1);
                        if (HTMLElement_7.isTagElement("e-menuitemgroup", this.activeItem)) {
                            this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                        }
                        event.stopPropagation();
                        break;
                    case "Enter":
                        if (HTMLElement_7.isTagElement("e-menuitem", this.activeItem)) {
                            this.activeItem.trigger();
                            event.stopPropagation();
                        }
                        break;
                    case "Escape":
                        if (this.parentItem) {
                            let parentGroup = this.parentItem.group;
                            let parentMenu = parentGroup ? parentGroup.parentMenu : this.parentItem.parentMenu;
                            if (HTMLElement_7.isTagElement("e-menu", parentMenu)) {
                                if (parentGroup) {
                                    parentGroup.focusItemAt(parentGroup.activeIndex);
                                }
                                else {
                                    parentMenu.focusItemAt(parentMenu.activeIndex);
                                }
                                this.reset();
                                event.stopPropagation();
                            }
                        }
                        else {
                            document.body.focus();
                        }
                        break;
                    case "ArrowLeft":
                        if (this.parentItem) {
                            let parentGroup = this.parentItem.group;
                            let parentMenu = parentGroup ? parentGroup.parentMenu : this.parentItem.parentMenu;
                            if (HTMLElement_7.isTagElement("e-menu", parentMenu)) {
                                if (parentGroup) {
                                    parentGroup.focusItemAt(parentGroup.activeIndex);
                                }
                                else {
                                    parentMenu.focusItemAt(parentMenu.activeIndex);
                                }
                                this.reset();
                                event.stopPropagation();
                            }
                        }
                        break;
                    case "ArrowRight":
                        if (this.items.includes(event.target)) {
                            if (HTMLElement_7.isTagElement("e-menuitem", this.activeItem) && this.activeItem.childMenu) {
                                this.activeItem.childMenu.focusItemAt(0);
                                event.stopPropagation();
                            }
                        }
                        break;
                }
            });
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (newValue !== oldValue) {
                switch (name) {
                    case "expanded":
                        if (newValue != null) {
                            let thisRect = this.getBoundingClientRect();
                            let thisIsOverflowing = thisRect.right > document.body.clientWidth;
                            if (thisIsOverflowing) {
                                this.overflowing = true;
                            }
                        }
                        else {
                            this.overflowing = false;
                        }
                        break;
                }
            }
        }
        focusItemAt(index, childMenu) {
            let item = this.items[index];
            if (item) {
                this._activeIndex = index;
                item.focus();
                if (HTMLElement_7.isTagElement("e-menuitem", item)) {
                    if (childMenu && item.childMenu) {
                        item.childMenu.focus();
                    }
                }
                else {
                    item.focusItemAt(0);
                }
            }
        }
        focusItem(predicate, subitems) {
            let item = this.findItem(predicate, subitems);
            if (item) {
                item.focus();
            }
        }
        reset() {
            let item = this.activeItem;
            this._activeIndex = -1;
            if (HTMLElement_7.isTagElement("e-menuitem", item) && item.childMenu) {
                item.childMenu.reset();
            }
        }
        findItem(predicate, subitems) {
            let foundItem = null;
            for (let idx = 0; idx < this.items.length; idx++) {
                let item = this.items[idx];
                if (HTMLElement_7.isTagElement("e-menuitem", item)) {
                    if (predicate(item)) {
                        return item;
                    }
                    if (subitems && item.childMenu) {
                        foundItem = item.childMenu.findItem(predicate, subitems);
                        if (foundItem) {
                            return foundItem;
                        }
                    }
                }
                else if (HTMLElement_7.isTagElement("e-menuitemgroup", item)) {
                    foundItem = item.findItem(predicate, subitems);
                    if (foundItem) {
                        return foundItem;
                    }
                }
            }
            return foundItem;
        }
    };
    HTMLEMenuElementBase = __decorate([
        HTMLElement_7.RegisterCustomHTMLElement({
            name: "e-menu",
            observedAttributes: ["expanded"]
        }),
        HTMLElement_7.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "expanded", type: "boolean" },
            { name: "overflowing", type: "boolean" }
        ])
    ], HTMLEMenuElementBase);
    exports.HTMLEMenuElementBase = HTMLEMenuElementBase;
});
define("editor/elements/lib/containers/menus/MenuButton", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuButtonElementBase = void 0;
    let HTMLEMenuButtonElementBase = class HTMLEMenuButtonElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_8.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px;
                    cursor: pointer;
                }

                :host(:hover) {
                    color: black;
                    background-color: gainsboro;
                }

                /*:host(:focus) {
                    outline: none;
                }*/

                :host(:focus-within) {
                    color: black;
                    background-color: lightgray;
                }

                :host([disabled]) {
                    color: lightgray;
                }

                :host ::slotted([slot="menu"]) {
                    z-index: 1;
                    position: absolute;
                    color: initial;
                }

                :host ::slotted([slot="menu"]) {
                    top: 100%;
                    left: 0;
                }
                
                :host ::slotted([slot="menu"][overflowing]) {
                    right: 0;
                    left: auto;
                }

                :host ::slotted([slot="menu"]:not([expanded])) {
                    opacity: 0;
                    pointer-events: none !important;
                }

                [part~="li"] {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    flex: auto;
                    display: flex;
                }

                [part~="icon"] {
                    display: none;
                    flex: none;
                    width: 16px;
                    height: 16px;
                    margin-right: 2px;
                    pointer-events: none;
                }

                [part~="input"] {
                    display: inline-block;
                    flex: none;
                    width: 16px;
                    height: 16px;
                    margin: auto;
                    pointer-events: none;
                }

                [part~="label"] {
                    flex: auto;
                    text-align: left;
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="icon"></span>
                    <span part="label"></span>
                    <span part="description"></span>
                </span>
                <slot name="menu"></slot>
            </li>
        `);
            this.childMenu = null;
            this.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "Enter":
                        if (!this.active) {
                            this.active = true;
                            if (this.childMenu) {
                                this.childMenu.focusItemAt(0);
                            }
                        }
                        break;
                    case "Escape":
                        this.focus();
                        this.active = false;
                        break;
                }
            });
            this.addEventListener("click", () => {
                this.trigger();
            });
            this.addEventListener("blur", (event) => {
                let containsNewFocus = (event.relatedTarget !== null) && this.contains(event.relatedTarget);
                if (!containsNewFocus) {
                    this.active = false;
                }
            }, { capture: true });
        }
        trigger() {
            if (!this.active) {
                this.active = true;
                if (this.childMenu) {
                    this.childMenu.focus();
                }
            }
            else {
                this.active = false;
            }
        }
        attributeChangedCallback(name, oldValue, newValue) {
            var _a, _b;
            if (newValue !== oldValue) {
                switch (name) {
                    case "label":
                        if (oldValue !== newValue) {
                            const labelPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                            if (labelPart) {
                                labelPart.textContent = newValue;
                            }
                        }
                        break;
                    case "icon":
                        if (oldValue !== newValue) {
                            const iconPart = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("[part~=icon]");
                            if (iconPart) {
                                iconPart.textContent = newValue;
                            }
                        }
                        break;
                }
            }
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const menuSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name=menu]");
            if (menuSlot) {
                menuSlot.addEventListener("slotchange", () => {
                    const menuElem = menuSlot.assignedElements()[0];
                    if (HTMLElement_8.isTagElement("e-menu", menuElem)) {
                        this.childMenu = menuElem;
                    }
                });
            }
        }
    };
    HTMLEMenuButtonElementBase = __decorate([
        HTMLElement_8.RegisterCustomHTMLElement({
            name: "e-menubutton",
            observedAttributes: ["icon", "label", "checked"]
        }),
        HTMLElement_8.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "active", type: "boolean" },
            { name: "label", type: "string" },
            { name: "icon", type: "string" },
            { name: "disabled", type: "boolean" },
        ])
    ], HTMLEMenuButtonElementBase);
    exports.HTMLEMenuButtonElementBase = HTMLEMenuButtonElementBase;
});
define("editor/elements/lib/containers/tabs/TabPanel", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLETabPanelElement = exports.isHTMLETabPanelElement = void 0;
    function isHTMLETabPanelElement(obj) {
        return obj instanceof Node && obj.nodeType === obj.ELEMENT_NODE && obj.tagName.toLowerCase() === "e-tabpanel";
    }
    exports.isHTMLETabPanelElement = isHTMLETabPanelElement;
    let BaseHTMLETabPanelElement = class BaseHTMLETabPanelElement extends HTMLElement {
        constructor() {
            super();
            HTMLElement_9.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }

                :host([hidden]) {
                    display: none;
                }
            </style>
            <slot></slot>
        `);
        }
        connectedCallback() {
            this.tabIndex = this.tabIndex;
        }
    };
    BaseHTMLETabPanelElement = __decorate([
        HTMLElement_9.RegisterCustomHTMLElement({
            name: "e-tabpanel"
        }),
        HTMLElement_9.GenerateAttributeAccessors([
            { name: "name", type: "string" }
        ])
    ], BaseHTMLETabPanelElement);
    exports.BaseHTMLETabPanelElement = BaseHTMLETabPanelElement;
});
define("editor/elements/lib/containers/tabs/Tab", ["require", "exports", "editor/elements/HTMLElement", "editor/elements/lib/containers/tabs/TabPanel"], function (require, exports, HTMLElement_10, TabPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLETabElement = void 0;
    let BaseHTMLETabElement = class BaseHTMLETabElement extends HTMLElement {
        constructor() {
            super();
            HTMLElement_10.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    user-select: none;
                    white-space: nowrap;
                    padding: 6px;
                    border-left: 4px solid transparent;
                    cursor: pointer;
                }
                
                :host([disabled]) {
                    color: grey;
                    pointer-events: none;
                }

                :host([active]) {
                    border-left: 4px solid black;
                }

                ::slotted(*) {
                    pointer-events: none;
                }
            </style>
            <slot></slot>
        `);
            this.panel = null;
        }
        connectedCallback() {
            this.tabIndex = this.tabIndex;
            let panel = document.getElementById(this.controls);
            if (HTMLElement_10.isTagElement("e-tabpanel", panel)) {
                this.panel = panel;
                this.panel.hidden = !this.active;
            }
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "controls":
                    if (oldValue !== newValue) {
                        let panel = document.getElementById(this.controls);
                        if (TabPanel_1.isHTMLETabPanelElement(panel)) {
                            this.panel = panel;
                        }
                    }
                    break;
                case "active":
                    if (this.active) {
                        this.dispatchEvent(new CustomEvent("tabchange", { detail: { tab: this }, bubbles: true }));
                    }
                    if (this.panel) {
                        this.panel.hidden = !this.active;
                    }
                    break;
            }
        }
    };
    BaseHTMLETabElement = __decorate([
        HTMLElement_10.RegisterCustomHTMLElement({
            name: "e-tab",
            observedAttributes: ["active", "controls"]
        }),
        HTMLElement_10.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "active", type: "boolean" },
            { name: "disabled", type: "boolean" },
            { name: "controls", type: "string" },
        ])
    ], BaseHTMLETabElement);
    exports.BaseHTMLETabElement = BaseHTMLETabElement;
});
define("editor/elements/lib/containers/tabs/TabList", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseHTMLETabListElement = void 0;
    let BaseHTMLETabListElement = class BaseHTMLETabListElement extends HTMLElement {
        constructor() {
            super();
            HTMLElement_11.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    position: relative;
                }
            </style>
            <slot></slot>
        `);
            this.tabs = [];
            this._activeIndex = 1;
        }
        get activeTab() {
            return this.tabs[this._activeIndex] || null;
        }
        connectedCallback() {
            this.tabIndex = this.tabIndex;
            const slot = this.shadowRoot.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", (event) => {
                    const tabs = event.target
                        .assignedElements()
                        .filter(tab => HTMLElement_11.isTagElement("e-tab", tab));
                    this.tabs = tabs;
                    this._activeIndex = this.tabs.findIndex(tab => tab.active);
                });
            }
            this.addEventListener("click", (event) => {
                let target = event.target;
                if (HTMLElement_11.isTagElement("e-tab", target)) {
                    target.active = true;
                }
            });
            this.addEventListener("tabchange", (event) => {
                let targetIndex = this.tabs.indexOf(event.detail.tab);
                this._activeIndex = targetIndex;
                this.tabs.forEach((thisTab, thisTabIndex) => {
                    if (thisTabIndex !== targetIndex) {
                        thisTab.active = false;
                    }
                });
            });
        }
        findTab(predicate) {
            return this.tabs.find(predicate) || null;
        }
        activateTab(predicate) {
            let tab = this.tabs.find(predicate);
            if (tab) {
                tab.active = true;
            }
        }
    };
    BaseHTMLETabListElement = __decorate([
        HTMLElement_11.RegisterCustomHTMLElement({
            name: "e-tablist"
        })
    ], BaseHTMLETabListElement);
    exports.BaseHTMLETabListElement = BaseHTMLETabListElement;
});
define("editor/elements/lib/controls/draggable/DropzoneInput", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let HTMLEDropzoneInputElementBase = class HTMLEDropzoneInputElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_12.bindShadowRoot(this, /*html*/ `
            <style>
                :host {
                    display: block;
                }

                [part~="container"] {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                }
                
                ::slotted(e-dropzone) {
                    flex: auto;
                }

                ::slotted(input) {
                    position: absolute;
                    flex: none;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    opacity: 0;
                    pointer-events: none;
                }
            </style>
            <div part="container">
                <slot name="input"></slot>
                <slot name="dropzone"></slot>
            </div>
            `);
            this.dropzone = null;
            this.input = null;
            this.converter = (dropzone) => dropzone.type;
        }
        connectedCallback() {
            var _a, _b;
            this.tabIndex = this.tabIndex;
            this.addEventListener("datachange", (event) => {
                let target = event.target;
                if (target == this.dropzone && this.dropzone && this.input && this.converter) {
                    this.input.value = this.converter(this.dropzone);
                }
            });
            const dropzoneSlot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot[name='dropzone']");
            if (dropzoneSlot) {
                dropzoneSlot.addEventListener("slotchange", () => {
                    const dropzone = dropzoneSlot.assignedElements().filter(elem => HTMLElement_12.isTagElement("e-dropzone", elem));
                    if (dropzone.length > 0) {
                        this.dropzone = dropzone[0];
                    }
                });
            }
            const inputSlot = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("slot[name='input']");
            if (inputSlot) {
                inputSlot.addEventListener("slotchange", () => {
                    const input = inputSlot.assignedElements().filter(elem => HTMLElement_12.isTagElement("input", elem));
                    if (input.length > 0) {
                        this.input = input[0];
                    }
                });
            }
        }
    };
    HTMLEDropzoneInputElementBase = __decorate([
        HTMLElement_12.RegisterCustomHTMLElement({
            name: "e-dropzoneinput"
        })
    ], HTMLEDropzoneInputElementBase);
});
define("editor/elements/lib/utils/Import", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEImportElementBase = void 0;
    let HTMLEImportElementBase = class HTMLEImportElementBase extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            const importRequest = async (src) => {
                this.outerHTML = await fetch(src).then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    else {
                        throw new Error(response.statusText);
                    }
                });
                this.dispatchEvent(new CustomEvent("e-load"));
            };
            if (this.src) {
                importRequest(this.src);
            }
        }
    };
    HTMLEImportElementBase = __decorate([
        HTMLElement_13.RegisterCustomHTMLElement({
            name: "e-import"
        }),
        HTMLElement_13.GenerateAttributeAccessors([
            { name: "src", type: "string" }
        ])
    ], HTMLEImportElementBase);
    exports.HTMLEImportElementBase = HTMLEImportElementBase;
});
define("editor/elements/lib/utils/Loader", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLELoaderElementBase = void 0;
    let HTMLELoaderElementBase = class HTMLELoaderElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_14.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: inline-block;
                }
                
                :host([type="bar"]) {
                    display: inline-block;
                    width: 64px;
                }

                :host([type]:not([type="circle"])) [part~="circle"] {
                    display: none !important;
                }
                
                :host(:not([type="bar"])) [part~="bar"] {
                    display: none !important;
                }

                [part~="circle"] {
                    position: relative;
                    width: 12px;
                    height: 12px;
                    border-top: 4px solid var(--loader-color, rgb(0, 128, 255));
                    border-right: 4px solid var(--loader-color, rgb(0, 128, 255));
                    border-left: 4px solid transparent;
                    border-bottom: 4px solid transparent;
                    border-radius: 50%;
                    animation-duration: 1s;
                    animation-name: circle;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                @keyframes circle {
                    0% {
                        transform: rotate(0);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                [part~="bar"] {
                    display: block;
                    position: relative;
                    overflow: hidden;
                }

                [part~="slider"] {
                    position: relative;
                    display: flex;
                    will-change: transform;
                    animation-duration: 1s;
                    animation-name: slider;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                [part~="cursor"] {
                    position: relative;
                    display: inline-block;
                    width: 32px;
                    height: 4px;
                    background-color: var(--loader-color, rgb(0, 128, 255));
                    border-radius: 4px;

                    will-change: transform;
                    animation-duration: 1s;
                    animation-name: cursor;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                @keyframes slider {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes cursor {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
            </style>
            <div part="bar">
                <div part="slider">
                    <div part="cursor"></div>
                </div>
            </div>
            <div part="circle"></div>
        `);
            this._promise = null;
        }
        set promise(promise) {
            if (promise) {
                promise.finally(() => {
                    this.remove();
                });
            }
            this._promise = promise;
        }
        get promise() {
            return this._promise;
        }
    };
    HTMLELoaderElementBase = __decorate([
        HTMLElement_14.RegisterCustomHTMLElement({
            name: "e-loader"
        }),
        HTMLElement_14.GenerateAttributeAccessors([
            { name: "type", type: "string" }
        ])
    ], HTMLELoaderElementBase);
    exports.HTMLELoaderElementBase = HTMLELoaderElementBase;
});
define("editor/elements/lib/utils/WidthSash", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEWidthSashElementBase = void 0;
    let HTMLEWidthSashElementBase = class HTMLEWidthSashElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_15.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;

                    width: 4px;
                    background-color: rgb(0, 128, 255);
                    cursor: ew-resize;

                    transition-property: opacity;
                    transition-delay: 0.2s;
                    transition-duration: 0.2s;
                    transition-timing-function: ease-out;
                    opacity: 0;
                }

                :host(:active),
                :host(:hover) {
                    opacity: 1;
                }
            </style>
        `);
            this._target = null;
            this._targetStyle = null;
        }
        connectedCallback() {
            let onPointerMove = (event) => {
                if (this._target && this._targetStyle) {
                    let directionToTarget = Math.sign(((this.getBoundingClientRect().left + this.getBoundingClientRect().right) / 2) -
                        ((this._target.getBoundingClientRect().right + this._target.getBoundingClientRect().right) / 2));
                    let width = parseFloat(this._targetStyle.getPropertyValue("width"));
                    let minWidth = parseFloat(this._targetStyle.getPropertyValue("min-width"));
                    let maxWidth = parseFloat(this._targetStyle.getPropertyValue("max-width"));
                    let newWidth = Math.trunc(width + directionToTarget * event.movementX);
                    if (!isNaN(minWidth)) {
                        newWidth = Math.max(newWidth, minWidth);
                    }
                    if (!isNaN(maxWidth)) {
                        newWidth = Math.min(newWidth, maxWidth);
                    }
                    this._target.style.setProperty("width", `${newWidth}px`);
                    this.dispatchEvent(new CustomEvent("resize"));
                }
            };
            this.addEventListener("pointerdown", (event) => {
                this.setPointerCapture(event.pointerId);
                this.addEventListener("pointermove", onPointerMove);
                this.addEventListener("pointerup", (event) => {
                    this.removeEventListener("pointermove", onPointerMove);
                    this.releasePointerCapture(event.pointerId);
                }, { once: true });
            });
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (newValue !== oldValue) {
                switch (name) {
                    case "controls":
                        if (oldValue !== newValue) {
                            const target = document.getElementById(this.controls);
                            if (target) {
                                this._target = target;
                                this._targetStyle = window.getComputedStyle(target);
                            }
                        }
                        break;
                }
            }
        }
    };
    HTMLEWidthSashElementBase = __decorate([
        HTMLElement_15.RegisterCustomHTMLElement({
            name: "e-wsash",
            observedAttributes: ["controls"]
        }),
        HTMLElement_15.GenerateAttributeAccessors([
            { name: "controls", type: "string" },
        ])
    ], HTMLEWidthSashElementBase);
    exports.HTMLEWidthSashElementBase = HTMLEWidthSashElementBase;
});
define("editor/elements/lib/utils/HeightSash", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEHeightSashElementBase = void 0;
    let HTMLEHeightSashElementBase = class HTMLEHeightSashElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_16.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;

                    height: 4px;
                    background-color: rgb(0, 128, 255);
                    cursor: ns-resize;

                    transition-property: opacity;
                    transition-delay: 0.2s;
                    transition-duration: 0.2s;
                    transition-timing-function: ease-out;
                    opacity: 0;
                }

                :host(:active),
                :host(:hover) {
                    opacity: 1;
                }
            </style>
        `);
            this._target = null;
            this._targetStyle = null;
        }
        connectedCallback() {
            let onPointerMove = (event) => {
                if (this._target && this._targetStyle) {
                    let directionToTarget = Math.sign(((this.getBoundingClientRect().top + this.getBoundingClientRect().bottom) / 2) -
                        ((this._target.getBoundingClientRect().top + this._target.getBoundingClientRect().bottom) / 2));
                    let height = parseFloat(this._targetStyle.getPropertyValue("height"));
                    let minHeight = parseFloat(this._targetStyle.getPropertyValue("min-height"));
                    let maxHeight = parseFloat(this._targetStyle.getPropertyValue("max-height"));
                    let newHeight = Math.trunc(height + directionToTarget * event.movementY);
                    if (!isNaN(minHeight)) {
                        newHeight = Math.max(newHeight, minHeight);
                    }
                    if (!isNaN(maxHeight)) {
                        newHeight = Math.min(newHeight, maxHeight);
                    }
                    this._target.style.setProperty("height", `${newHeight}px`);
                    this.dispatchEvent(new CustomEvent("resize"));
                }
            };
            this.addEventListener("pointerdown", (event) => {
                this.setPointerCapture(event.pointerId);
                this.addEventListener("pointermove", onPointerMove);
                this.addEventListener("pointerup", (event) => {
                    this.removeEventListener("pointermove", onPointerMove);
                    this.releasePointerCapture(event.pointerId);
                }, { once: true });
            });
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (newValue !== oldValue) {
                switch (name) {
                    case "controls":
                        if (oldValue !== newValue) {
                            const target = document.getElementById(this.controls);
                            if (target) {
                                this._target = target;
                                this._targetStyle = window.getComputedStyle(target);
                            }
                        }
                        break;
                }
            }
        }
    };
    HTMLEHeightSashElementBase = __decorate([
        HTMLElement_16.RegisterCustomHTMLElement({
            name: "e-hsash",
            observedAttributes: ["controls"]
        }),
        HTMLElement_16.GenerateAttributeAccessors([
            { name: "controls", type: "string" },
        ])
    ], HTMLEHeightSashElementBase);
    exports.HTMLEHeightSashElementBase = HTMLEHeightSashElementBase;
});
define("editor/elements/lib/containers/treeview/TreeViewItem", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLETreeViewItemElementBase = void 0;
    let HTMLETreeViewItemElementBase = class HTMLETreeViewItemElementBase extends HTMLElement {
        constructor() {
            super();
            let collapseArrowUrl = JSON.stringify("../assets/editor/icons/chevron_right_black_18dp.svg");
            let expandArrowUrl = JSON.stringify("../assets/editor/icons/expand_more_black_18dp.svg");
            HTMLElement_17.bindShadowRoot(this, /*template*/ `
            <link rel="preload" href=${collapseArrowUrl} as="image" crossorigin>
            <link rel="preload" href=${expandArrowUrl} as="image" crossorigin>
            <style>
                :host {
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 0;
                    cursor: pointer;

                    --indent-width: 6px;
                    --collapsed-arrow-url: url(${collapseArrowUrl});
                    --expanded-arrow-url: url(${expandArrowUrl});
                }
                
                :host([active]) [part~="content"],
                [part~="content"]:hover {
                    background-color: gainsboro;
                }

                :host(:not([expanded])) [part~="container"] {
                    display: none;
                }

                [part~="li"] {
                    display: block;
                    height: 100%;
                    list-style-type: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    display: flex;
                    padding-left: calc(var(--tree-indent) * var(--indent-width));
                }

                [part~="label"],
                ::slotted([slot="label"]) {
                    display: block;
                    width: 100%;
                    pointer-events: none;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                [part~="toggle_arrow"]:hover {
                    background-color: lightgray;
                }

                :host([leaf]) [part~="container"],
                [part~="container"]:empty {
                    display: none;
                }

                [part~="toggle_arrow"] {
                    flex: none;
                    display: inline-block;
                    width: 18px;
                    margin-right: 4px;
                }

                :host([leaf]) [part~="toggle_arrow"] {
                    visibility: hidden;
                }

                [part~="toggle_arrow"]::after {
                    content: "";
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    position: absolute;
                    background-color: dimgray;
                }

                :host([expanded]) [part~="toggle_arrow"]::after {
                    -webkit-mask-image: var(--expanded-arrow-url);
                    mask-image: var(--expanded-arrow-url);
                }
                
                :host(:not([expanded])) [part~="toggle_arrow"]::after {
                    -webkit-mask-image: var(--collapsed-arrow-url);
                    mask-image: var(--collapsed-arrow-url);
                }

                [part~="state"] {
                    flex: none;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    margin: 0;
                }
            </style>
            <li part="li">
                <span part="content">
                    <span part="toggle_arrow"></span>
                    <slot name="label"><span part="label"></span></slot>
                </span>
                <ul part="container">
                    <slot></slot>
                </ul>
            </li>
        `);
            this.items = [];
            this.parent = null;
            this.indent = 0;
            this._toggleArrow = this.shadowRoot.querySelector("[part~=toggle_arrow]");
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot:not([name])");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const items = slot.assignedElements()
                        .filter(item => HTMLElement_17.isTagElement("e-treeviewitem", item));
                    this.items = items;
                    this.items.forEach((item) => {
                        item.parent = this;
                        item.indent = this.indent + 1;
                    });
                    this.dataset.empty = (this.items.length > 0) ? "" : void 0;
                });
            }
            this.shadowRoot.addEventListener("mousedown", (event) => {
                let target = event.target;
                if (target === this._toggleArrow) {
                    this.toggle();
                }
            });
        }
        attributeChangedCallback(name, oldValue, newValue) {
            var _a, _b;
            if (newValue !== oldValue) {
                switch (name) {
                    case "label":
                        if (oldValue !== newValue) {
                            const labelPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                            if (labelPart) {
                                labelPart.textContent = newValue;
                            }
                        }
                        break;
                    case "icon":
                        if (oldValue !== newValue) {
                            const iconPart = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("[part~=icon]");
                            if (iconPart) {
                                iconPart.dataset.value = newValue;
                            }
                        }
                        break;
                    case "indent":
                        if (oldValue !== newValue) {
                            this.style.setProperty("--tree-indent", newValue);
                        }
                        break;
                }
            }
        }
        deepestVisibleChildItem() {
            if (this.expanded && this.items.length > 0) {
                let lastChildItem = this.items[this.items.length - 1];
                return lastChildItem.deepestVisibleChildItem();
            }
            return this;
        }
        previousVisibleItem() {
            if (this.parent) {
                let indexOfThis = this.parent.items.indexOf(this);
                if (indexOfThis > 0) {
                    let previousItem = this.parent.items[indexOfThis - 1];
                    return previousItem.deepestVisibleChildItem();
                }
                return HTMLElement_17.isTagElement("e-treeviewitem", this.parent) ? this.parent : this;
            }
            return this;
        }
        nextVisibleItem() {
            if (this.expanded && this.items.length > 0) {
                return this.items[0];
            }
            let nearestItem = this.nearestParentItem();
            if (nearestItem.parent) {
                let indexOfNearest = nearestItem.parent.items.indexOf(nearestItem);
                if (indexOfNearest < nearestItem.parent.items.length - 1) {
                    return nearestItem.parent.items[indexOfNearest + 1];
                }
            }
            return this;
        }
        nearestParentItem() {
            if (HTMLElement_17.isTagElement("e-treeviewitem", this.parent)) {
                let indexOfThis = this.parent.items.indexOf(this);
                if (indexOfThis === this.parent.items.length - 1) {
                    return this.parent.nearestParentItem();
                }
            }
            return this;
        }
        toggle() {
            this.expanded = !this.expanded;
            this.dispatchEvent(new CustomEvent("e-toggle", { bubbles: true }));
        }
        trigger() {
            this.dispatchEvent(new CustomEvent("e-trigger", { bubbles: true }));
        }
    };
    HTMLETreeViewItemElementBase = __decorate([
        HTMLElement_17.RegisterCustomHTMLElement({
            name: "e-treeviewitem",
            observedAttributes: ["icon", "label", "expanded", "indent"]
        }),
        HTMLElement_17.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "label", type: "string" },
            { name: "icon", type: "string" },
            { name: "indent", type: "number" },
            { name: "active", type: "boolean" },
            { name: "expanded", type: "boolean" },
            { name: "leaf", type: "boolean" }
        ])
    ], HTMLETreeViewItemElementBase);
    exports.HTMLETreeViewItemElementBase = HTMLETreeViewItemElementBase;
});
define("editor/elements/lib/containers/treeview/TreeViewList", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLETreeViewListElementBase = void 0;
    let HTMLETreeViewListElementBase = class HTMLETreeViewListElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_18.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    position: relative;
                    user-select: none;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    margin: 0;
                }
            </style>
            <ul part="container">
                <slot></slot>
            </ul>
        `);
            this.items = [];
            this._activeItem = null;
        }
        get activeItem() {
            return this._activeItem;
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const items = slot.assignedElements()
                        .filter(item => HTMLElement_18.isTagElement("e-treeviewitem", item));
                    this.items = items;
                    items.forEach((item) => {
                        item.parent = this;
                        item.indent = 1;
                    });
                });
            }
            this.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "ArrowLeft":
                        if (this.activeItem) {
                            if (this.activeItem.expanded) {
                                this.activeItem.toggle();
                            }
                            else {
                                if (HTMLElement_18.isTagElement("e-treeviewitem", this.activeItem.parent)) {
                                    this.activeItem.parent.focus();
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case "ArrowRight":
                        if (this.activeItem) {
                            if (!this.activeItem.expanded) {
                                this.activeItem.toggle();
                            }
                            else {
                                if (this.activeItem.items.length > 0) {
                                    this.activeItem.items[0].focus();
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case "ArrowUp":
                        if (this.activeItem) {
                            this.activeItem.previousVisibleItem().focus();
                        }
                        else if (this.items.length > 0) {
                            this.items[0].focus();
                        }
                        event.preventDefault();
                        break;
                    case "ArrowDown":
                        if (this.activeItem) {
                            this.activeItem.nextVisibleItem().focus();
                        }
                        else if (this.items.length > 0) {
                            this.items[this.items.length - 1].focus();
                        }
                        event.preventDefault();
                        break;
                    case "Home":
                        if (this.items.length > 0) {
                            this.items[0].focus({ preventScroll: true });
                        }
                        event.preventDefault();
                        break;
                    case "End":
                        if (this.items.length > 0) {
                            this.items[this.items.length - 1].deepestVisibleChildItem().focus();
                        }
                        event.preventDefault();
                        break;
                    case "Enter":
                        if (this.activeItem) {
                            this.activeItem.trigger();
                        }
                        break;
                    case "Escape":
                        this.active = false;
                        if (this.activeItem) {
                            this.activeItem.active = false;
                        }
                        this.focus();
                        break;
                }
            });
            this.addEventListener("mousedown", (event) => {
                let target = event.target;
                if (HTMLElement_18.isTagElement("e-treeviewitem", target)) {
                    target.trigger();
                }
            });
            this.addEventListener("focusin", (event) => {
                let target = event.target;
                if (!this.active) {
                    this.active = true;
                }
                if (HTMLElement_18.isTagElement("e-treeviewitem", target)) {
                    if (this._activeItem) {
                        this._activeItem.active = false;
                    }
                    this._activeItem = target;
                    this._activeItem.active = true;
                }
            });
            this.addEventListener("focusout", (event) => {
                let relatedTarget = event.relatedTarget;
                if (!this.contains(relatedTarget)) {
                    this.active = false;
                }
            });
        }
    };
    HTMLETreeViewListElementBase = __decorate([
        HTMLElement_18.RegisterCustomHTMLElement({
            name: "e-treeviewlist"
        }),
        HTMLElement_18.GenerateAttributeAccessors([
            { name: "active", type: "boolean" },
            { name: "name", type: "string" }
        ])
    ], HTMLETreeViewListElementBase);
    exports.HTMLETreeViewListElementBase = HTMLETreeViewListElementBase;
});
define("editor/elements/lib/controls/breadcrumb/BreadcrumbItem", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEBreadcrumbItemElementBase = void 0;
    let HTMLEBreadcrumbItemElementBase = class HTMLEBreadcrumbItemElementBase extends HTMLElement {
        constructor() {
            super();
            let separatorArrowUrl = JSON.stringify("../assets/editor/icons/chevron_right_black_18dp.svg");
            HTMLElement_19.bindShadowRoot(this, /*template*/ `
            <link rel="preload" href=${separatorArrowUrl} as="image" crossorigin>
            <style>
                :host {
                    display: inline-block;
                    cursor: pointer;

                    --separator-arrow-url: url(${separatorArrowUrl});
                }

                :host([active]) {
                    font-weight: bold;
                }

                :host([active]) [part~="li"]::after {
                    display: none;
                }

                [part~="li"]::after {
                    content: "";
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    background-color: dimgray;
                    transform: scale(1.2) translateY(4%);
                    -webkit-mask-image: var(--separator-arrow-url);
                    mask-image: var(--separator-arrow-url);
                }

                :host([hidden]) {
                    display: none;
                }

                [part~="li"] {
                    display: flex;
                    list-style-type: none;
                }
            </style>
            <li part="li">
                <slot></slot>
            </li>
        `);
        }
        connectedCallback() {
            this.tabIndex = this.tabIndex;
        }
        attributeChangedCallback(name, oldValue, newValue) {
            var _a;
            if (newValue !== oldValue) {
                switch (name) {
                    case "label":
                        if (oldValue !== newValue) {
                            const labelPart = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=label]");
                            if (labelPart) {
                                labelPart.textContent = newValue;
                            }
                        }
                        break;
                }
            }
        }
    };
    HTMLEBreadcrumbItemElementBase = __decorate([
        HTMLElement_19.RegisterCustomHTMLElement({
            name: "e-breadcrumbitem",
            observedAttributes: ["label"]
        }),
        HTMLElement_19.GenerateAttributeAccessors([
            { name: "label", type: "string" },
            { name: "active", type: "boolean" }
        ])
    ], HTMLEBreadcrumbItemElementBase);
    exports.HTMLEBreadcrumbItemElementBase = HTMLEBreadcrumbItemElementBase;
});
define("editor/elements/lib/controls/breadcrumb/BreadcrumbTrail", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEBreadcrumbTrailElementBase = void 0;
    let HTMLEBreadcrumbTrailElementBase = class HTMLEBreadcrumbTrailElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_20.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }
                
                [part~="ul"] {
                    display: flex;
                    flex-direction: row;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);
            this.items = [];
        }
        activateItem(item) {
            let itemIndex = this.items.indexOf(item);
            if (itemIndex > -1) {
                this.items.forEach((item, index) => {
                    item.active = (index == itemIndex);
                    item.hidden = (index > itemIndex);
                });
                let activeItem = this.items[itemIndex];
                activeItem.dispatchEvent(new CustomEvent("activate"));
            }
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", () => {
                    const items = slot.assignedElements().filter(item => HTMLElement_20.isTagElement("e-breadcrumbitem", item));
                    this.items = items;
                    items.forEach((item, index) => {
                        item.active = (index === items.length - 1);
                    });
                });
            }
            this.addEventListener("mousedown", (event) => {
                let target = event.target;
                if (HTMLElement_20.isTagElement("e-breadcrumbitem", target)) {
                    this.activateItem(target);
                }
            });
        }
    };
    HTMLEBreadcrumbTrailElementBase = __decorate([
        HTMLElement_20.RegisterCustomHTMLElement({
            name: "e-breadcrumbtrail"
        })
    ], HTMLEBreadcrumbTrailElementBase);
    exports.HTMLEBreadcrumbTrailElementBase = HTMLEBreadcrumbTrailElementBase;
});
define("editor/elements/view/View", ["require", "exports", "editor/elements/HTMLElement", "editor/elements/Snippets"], function (require, exports, HTMLElement_21, Snippets_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewBase = void 0;
    class ViewBase {
        constructor(model) {
            this._model = model;
            this._element = this.render();
            this._observer = new MutationObserver((mutations) => {
                mutations.forEach((record) => {
                    Array.from(record.removedNodes).map((node) => {
                        this._removeReactiveListeners(node);
                    });
                    Array.from(record.addedNodes).map((node) => {
                        this._addReactiveListeners(node);
                    });
                });
            });
            this._observer.observe(this._element, {
                subtree: true,
                childList: true
            });
            this._addReactiveListeners(this._element);
        }
        get element() {
            return this._element;
        }
        close() {
            this._element.remove();
            this._observer.disconnect();
            this._removeReactiveListeners(this._element);
        }
        get model() {
            return this._model;
        }
        _addReactiveListeners(node) {
            if (HTMLElement_21.isReactiveParentNode(node) || HTMLElement_21.isReactiveNode(node)) {
                const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes;
                _reactModel.addEventListener(_reactEvent, _reactListener);
            }
            if (HTMLElement_21.isParentNode(node)) {
                Snippets_4.forAllSubtreeNodes(node, (childNode) => {
                    this._addReactiveListeners(childNode);
                });
            }
        }
        _removeReactiveListeners(node) {
            if (HTMLElement_21.isReactiveParentNode(node) || HTMLElement_21.isReactiveNode(node)) {
                const { _reactModel, _reactEvent, _reactListener } = node._reactAttributes;
                _reactModel.removeEventListener(_reactEvent, _reactListener);
            }
            if (HTMLElement_21.isParentNode(node)) {
                Snippets_4.forAllSubtreeNodes(node, (childNode) => {
                    this._removeReactiveListeners(childNode);
                });
            }
        }
    }
    exports.ViewBase = ViewBase;
});
define("samples/temp", ["require", "exports", "editor/elements/HTMLElement", "editor/elements/view/View", "editor/model/Model"], function (require, exports, HTMLElement_22, View_1, Model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.temp = void 0;
    function temp() {
        class FieldModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
            }
        }
        class FieldsetModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
                this.fields = new Model_1.ListModelBase(data.fields.map(field => new FieldModel(field)));
            }
            getData() {
                return Object.assign(this.data, {
                    fields: this.fields.items.map(item => item.data)
                });
            }
        }
        class StatementLastExecutionModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
            }
        }
        class DataframeColumnModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
            }
        }
        class StatementResultModel extends Model_1.ObjectModelBase {
            constructor(data) {
                super(data);
                this.columns = new Model_1.ListModelBase(data.columns.map((column) => new DataframeColumnModel(column)));
            }
            getData() {
                return Object.assign(this.data, {
                    columns: this.columns.items.map(item => item.data)
                });
            }
        }
        class Statement {
            constructor(parent, data) {
                this.parent = parent;
                this.children = data.children.map(child => new Statement(this, child));
                this.fieldsetModel = new FieldsetModel(data.fieldset);
                this.lastExecutionModel = new StatementLastExecutionModel(data.lastExecution);
                this.resultModel = new StatementResultModel(data.result);
                this.fieldsetView = new StatementFieldsetView(this.fieldsetModel);
                this.lastExecutionView = new StatementLastExecutionView(this.lastExecutionModel);
                this.resultView = new StatementResultView(this.resultModel);
            }
            execute() {
            }
            invalidate() {
            }
        }
        /*class Expression {
            draggable: HTMLEDraggableElement;
    
            constructor() {
            }
        }*/
        const fieldset = new FieldsetModel({
            box: "Transformer",
            signature: "replace_transformer",
            is_expression: false,
            label: "Replace",
            doc: "Replace...",
            fields: [
                {
                    label: "Column",
                    name: "column",
                    type: "any",
                    allows_expression: true,
                    type_constraint: {
                        name: "same_as",
                        other: "value"
                    },
                    optional: false
                },
                {
                    label: "Value",
                    name: "value",
                    type: "any",
                    type_constraint: {
                        name: "same_as",
                        other: "column"
                    },
                    allows_expression: true,
                    optional: false
                }
            ]
        });
        const plusOperatorFieldset = new FieldsetModel({
            box: "Operator",
            signature: "plus_operator",
            is_expression: false,
            label: "[left] + [right]",
            doc: "Plus...",
            fields: [
                {
                    label: "Left",
                    name: "left",
                    type: "any",
                    allows_expression: true,
                    type_constraint: {
                        name: "same_as",
                        other: "right"
                    },
                    optional: false
                },
                {
                    label: "Right",
                    name: "right",
                    type: "any",
                    type_constraint: {
                        name: "same_as",
                        other: "left"
                    },
                    allows_expression: true,
                    optional: false
                }
            ]
        });
        const FieldFragment = (fieldset, field) => HTMLElement_22.Fragment(HTMLElement_22.Element("div", {
            children: [
                HTMLElement_22.ReactiveNode(HTMLElement_22.Element(/*html*/ "label"), field, (div, property, oldValue, newValue) => {
                    switch (property) {
                        case "label":
                            if (newValue !== oldValue) {
                                div.textContent = field.data.label;
                            }
                            break;
                    }
                }),
                DropzoneInputFragment(fieldset, field)
            ]
        }));
        const DropzoneInputFragment = (host, field) => HTMLElement_22.Fragment(HTMLElement_22.Element(/*html*/ "e-dropzoneinput", {
            children: [
                HTMLElement_22.ReactiveNode(HTMLElement_22.Element("e-dropzone", {
                    props: {
                        className: "field__dropzone",
                        slot: "dropzone",
                        droptest: (dropzone, draggables) => {
                            let accepts = draggables.every(draggable => dropzone.type === "any" || draggable.type === dropzone.type);
                            if (!accepts) {
                                alert(`Only ${dropzone.type} draggables are allowed.`);
                            }
                            return accepts;
                        }
                    },
                    listeners: {
                        datachange: (event) => {
                            let dropzone = event.target;
                            let constraint = field.data.type_constraint;
                            if (constraint) {
                                switch (constraint.name) {
                                    case "same_as":
                                        let otherDropzone = host.querySelector(`e-dropzone[name=${constraint.other}]`);
                                        if (otherDropzone) {
                                            if (event.detail.action === "insert") {
                                                let draggable = event.detail.draggables[0];
                                                if (draggable) {
                                                    dropzone.type = otherDropzone.type = draggable.type;
                                                    dropzone.placeholder = otherDropzone.placeholder = draggable.type;
                                                }
                                            }
                                            else {
                                                if (otherDropzone.draggables.length === 0) {
                                                    dropzone.type = otherDropzone.type = "any";
                                                    dropzone.placeholder = otherDropzone.placeholder = "any";
                                                }
                                            }
                                        }
                                        break;
                                }
                            }
                        }
                    }
                }), field, (dropzone, property, oldValue, newValue) => {
                    switch (property) {
                        case "name":
                            if (newValue !== oldValue) {
                                dropzone.name = newValue;
                            }
                            break;
                        case "type":
                            if (newValue !== oldValue) {
                                dropzone.placeholder = newValue;
                                dropzone.type = newValue;
                            }
                            break;
                    }
                }),
                HTMLElement_22.Element("input", {
                    props: {
                        className: "field__input",
                        slot: "input"
                    }
                })
            ]
        }));
        class StatementFieldsetView extends View_1.ViewBase {
            constructor(model) {
                super(model);
            }
            render() {
                return HTMLElement_22.Element("fieldset", {
                    props: {
                        className: "statement-fieldset"
                    },
                    children: HTMLElement_22.ReactiveChildNodes(this.model.fields, (item) => FieldFragment(this.element, item))
                });
            }
        }
        class StatementLastExecutionView extends View_1.ViewBase {
            constructor(model) {
                super(model);
            }
            render() {
                return HTMLElement_22.Element("div", {
                    children: [
                        HTMLElement_22.ReactiveNode(document.createTextNode(`Last execution date : ${this.model.data.datetime}`), this.model, (node, property, oldValue, newValue) => {
                            if (property === "datetime") {
                                node.textContent = `Last execution date : ${newValue}`;
                            }
                        })
                    ]
                });
            }
        }
        class StatementResultView extends View_1.ViewBase {
            constructor(model) {
                super(model);
            }
            render() {
                return HTMLElement_22.Element("e-dragzone", {
                    children: HTMLElement_22.ReactiveChildNodes(this.model.columns, (item) => HTMLElement_22.Element("e-draggable", {
                        props: {
                            textContent: item.data.name
                        }
                    }))
                });
            }
        }
        class ExpressionDraggableView extends View_1.ViewBase {
            constructor(model) {
                super(model);
            }
            render() {
                return HTMLElement_22.ReactiveNode(HTMLElement_22.Element("e-draggable"), this.model, (draggable, property, oldValue, newValue) => {
                    switch (property) {
                        case "label":
                            if (newValue !== oldValue) {
                                HTMLElement_22.setElementChildren(draggable, HTMLElement_22.parseStringTemplate(this.model.data.label, this.model.fields.items.reduce((obj, item) => ({
                                    ...obj,
                                    [item.data.name]: DropzoneInputFragment(this.element, item)
                                }), {})).childNodes);
                            }
                            break;
                    }
                });
            }
        }
        /*const view = new ExpressionDraggableView(fieldset);
        let extractButton = document.getElementById("extract-button");
        (window as any)["view"] = view;
        (window as any)["fieldset"] = fieldset;
        if (extractButton) {
            extractButton.after(view.element);
        }*/
        //let fieldsetView = new StatementFieldsetView(plusOperatorFieldset);
        //let draggable = HTML(/*html*/`<e-draggable>`, {children: [fieldsetView]});
        /*
            extractButton.after(fieldsetView);
        }
    
        (window as any)["fieldset"] = fieldset;*/
    }
    exports.temp = temp;
});
define("libs/commands/Command", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isUndoCommand = exports.isCommand = void 0;
    function isCommand(obj) {
        return (typeof obj.exec === 'function');
    }
    exports.isCommand = isCommand;
    function isUndoCommand(obj) {
        return (typeof obj.exec === 'function')
            && (typeof obj.undo === 'function');
    }
    exports.isUndoCommand = isUndoCommand;
});
define("editor/elements/lib/containers/status/StatusItem", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEStatusItemElementBase = void 0;
    let HTMLEStatusItemElementBase = class HTMLEStatusItemElementBase extends HTMLElement {
        // TODO: Add sync with Promise (icons, etc.)
        constructor() {
            super();
            HTMLElement_23.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    position: relative;
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 2px 6px;
                    background-color: white;
                }

                :host(:focus-visible) {
                    outline: none;
                }

                :host(:hover),
                :host([active]) {
                    background-color: rgb(180, 180, 180);
                }
                
                li {
                    display: flex;
                    height: 100%;
                    list-style-type: none;
                }
            </style>
            <li>
                <slot></slot>
            </li>
        `);
            this.command = null;
            this._stateMap = null;
        }
        get stateMap() {
            return this._stateMap;
        }
        set stateMap(stateMap) {
            this._stateMap = stateMap;
        }
        update(newValue) {
            const { content } = (typeof this.stateMap === "function") ? this.stateMap(newValue) : newValue;
            this.textContent = content;
        }
        activate() {
            this.dispatchEvent(new CustomEvent("activate"));
        }
        connectedCallback() {
            this.tabIndex = this.tabIndex;
            this.addEventListener("click", (event) => {
                this.activate();
                event.stopPropagation();
            });
        }
    };
    HTMLEStatusItemElementBase = __decorate([
        HTMLElement_23.RegisterCustomHTMLElement({
            name: "e-statusitem",
        }),
        HTMLElement_23.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "icon", type: "string" },
            { name: "type", type: "string" },
        ])
    ], HTMLEStatusItemElementBase);
    exports.HTMLEStatusItemElementBase = HTMLEStatusItemElementBase;
});
define("editor/elements/lib/containers/status/StatusBar", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEStatusBarElementBase = void 0;
    let HTMLEStatusBarElementBase = class HTMLEStatusBarElementBase extends HTMLElement {
        constructor() {
            super();
            HTMLElement_24.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: flex;
                    position: relative; 
                    user-select: none;

                    background-color: white;
                }

                :host(:focus) {
                    outline: 1px solid -webkit-focus-ring-color;
                }

                :host(:focus) ::slotted(:first-child),
                :host(:not(:focus-within)) ::slotted(:hover) {
                    color: black;
                    background-color: gainsboro;
                }

                [part~="ul"] {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);
            this.items = [];
            this._selectedItemIndex = -1;
        }
        connectedCallback() {
            var _a;
            this.tabIndex = this.tabIndex;
            const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("slot");
            if (slot) {
                slot.addEventListener("slotchange", (event) => {
                    const items = event.target.assignedElements()
                        .filter(item => HTMLElement_24.isTagElement("e-statusitem", item));
                    this.items = items;
                }, { once: true });
            }
        }
        get selectedItemIndex() {
            return this._selectedItemIndex;
        }
        get selectedItem() {
            return this.items[this.selectedItemIndex] || null;
        }
        insertItem(index, item) {
            index = Math.min(Math.max(index, -this.items.length), this.items.length);
            this.insertBefore(item, this.children[index >= 0 ? index : this.children.length + index]);
            this.items.splice(index, 0, item);
            item.addEventListener("mouseenter", () => {
                this.selectItem(this.items.indexOf(item));
            });
            item.addEventListener("mouseleave", () => {
            });
        }
        findItem(predicate) {
            const items = this.findItems(predicate);
            if (items.length > 0) {
                return items[0];
            }
            return null;
        }
        findItems(predicate) {
            const items = [];
            this.items.forEach((item) => {
                if (predicate(item)) {
                    items.push(item);
                }
            });
            return items;
        }
        selectItem(index) {
            if (index !== this.selectedItemIndex) {
                this.clearSelection();
                let item = this.items[index];
                if (item) {
                    this._selectedItemIndex = index;
                }
            }
        }
        clearSelection() {
            let item = this.selectedItem;
            if (item) {
                this._selectedItemIndex = -1;
            }
        }
    };
    HTMLEStatusBarElementBase = __decorate([
        HTMLElement_24.RegisterCustomHTMLElement({
            name: "e-statusbar"
        }),
        HTMLElement_24.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "active", type: "boolean" },
        ])
    ], HTMLEStatusBarElementBase);
    exports.HTMLEStatusBarElementBase = HTMLEStatusBarElementBase;
});
define("editor/templates/menus/MenuItemGroupTemplate", ["require", "exports", "editor/elements/HTMLElement", "editor/templates/menus/MenuItemTemplate"], function (require, exports, HTMLElement_25, MenuItemTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemGroupTemplate = void 0;
    const HTMLEMenuItemGroupTemplate = (desc) => {
        const items = desc.items.map((descArgs) => MenuItemTemplate_1.HTMLEMenuItemTemplate(descArgs));
        return HTMLElement_25.HTMLElementConstructor("e-menuitemgroup", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name
            },
            children: items
        });
    };
    exports.HTMLEMenuItemGroupTemplate = HTMLEMenuItemGroupTemplate;
});
define("editor/templates/menus/MenuTemplate", ["require", "exports", "editor/elements/HTMLElement", "editor/templates/menus/MenuItemGroupTemplate", "editor/templates/menus/MenuItemTemplate"], function (require, exports, HTMLElement_26, MenuItemGroupTemplate_1, MenuItemTemplate_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuTemplate = void 0;
    const HTMLEMenuTemplate = (desc) => {
        const items = desc.items.map((itemDesc) => {
            if ("isGroup" in itemDesc) {
                return MenuItemGroupTemplate_1.HTMLEMenuItemGroupTemplate(itemDesc);
            }
            else {
                return MenuItemTemplate_2.HTMLEMenuItemTemplate(itemDesc);
            }
        });
        return HTMLElement_26.HTMLElementConstructor("e-menu", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name,
            },
            children: items
        });
    };
    exports.HTMLEMenuTemplate = HTMLEMenuTemplate;
});
define("editor/templates/menus/MenuItemTemplate", ["require", "exports", "editor/elements/HTMLElement", "editor/Input", "editor/templates/menus/MenuTemplate"], function (require, exports, HTMLElement_27, Input_1, MenuTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemTemplate = void 0;
    const HTMLEMenuItemTemplate = (desc) => {
        let slotted = [];
        if (desc.menu) {
            let menu = MenuTemplate_1.HTMLEMenuTemplate(desc.menu);
            menu.slot = "menu";
            slotted.push(menu);
        }
        const menuItem = HTMLElement_27.HTMLElementConstructor("e-menuitem", {
            props: {
                id: desc.id,
                className: desc.className,
                name: desc.name,
                title: desc.title,
                type: desc.type,
                label: desc.label,
                disabled: desc.disabled,
                icon: desc.icon,
                value: desc.value,
                checked: desc.checked,
                command: desc.command,
                commandArgs: desc.commandArgs,
                hotkey: desc.hotkey ? new Input_1.HotKey(desc.hotkey.key, desc.hotkey.mod1, desc.hotkey.mod2) : void 0
            },
            children: [
                ...slotted
            ]
        });
        return menuItem;
    };
    exports.HTMLEMenuItemTemplate = HTMLEMenuItemTemplate;
});
define("editor/templates/menus/MenubarTemplate", ["require", "exports", "editor/elements/HTMLElement", "editor/templates/menus/MenuItemTemplate"], function (require, exports, HTMLElement_28, MenuItemTemplate_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenubarTemplate = void 0;
    const HTMLEMenubarTemplate = (desc) => {
        const items = desc.items.map((itemDesc) => {
            return MenuItemTemplate_3.HTMLEMenuItemTemplate(itemDesc);
        });
        return HTMLElement_28.HTMLElementConstructor("e-menubar", {
            props: {
                id: desc.id,
                className: desc.className,
                tabIndex: desc.tabIndex
            },
            children: items
        });
    };
    exports.HTMLEMenubarTemplate = HTMLEMenubarTemplate;
});
define("editor/Editor", ["require", "exports", "libs/commands/Command", "libs/events/EventDispatcher", "editor/elements/HTMLElement", "editor/elements/Snippets", "editor/templates/menus/MenubarTemplate"], function (require, exports, Command_1, EventDispatcher_2, HTMLElement_29, Snippets_5, MenubarTemplate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditorBase = void 0;
    /*
    
    
    createStatement(statementData)
    deleteStatement(statement)
    focusStatement(statement)
    
    executeRemoteStatement(statement);
    
    invalidateStatement(statement, reason)
    validateStatement(statement, result)
    
    fetchStatements()
    fetchExpressions()
    
    statments
    expressions
    
    */
    class EditorBase extends EventDispatcher_2.EventDispatcher {
        /*readonly toolbar: HTMLElement;
        readonly statusbar: HTMLElement;*/
        /*public readonly state: HTMLFormElement;
        */
        constructor() {
            super();
            this._commands = new Map();
            this._context = 'default';
            this._hotkeys = new Map();
            this._undoCommandsCallStack = [];
            this._redoCommandsCallStack = [];
            this.menubar = null;
            this.statusbar = null;
            this._state = {};
            this._stateListeners = new Map();
        }
        get context() {
            return this._context;
        }
        setup() {
            const menubarContainer = document.getElementById("menubar-container");
            this.statusbar = document.body.querySelector("e-statusbar");
            document.addEventListener("keydown", (event) => {
                Array.from(this._hotkeys.keys()).forEach((hotkey) => {
                    if (hotkey.test(event)) {
                        let execs = this._hotkeys.get(hotkey);
                        execs.forEach((exec) => {
                            exec();
                        });
                    }
                });
            });
            document.body.addEventListener("hotkeychange", (event) => {
                let target = event.target;
                if (HTMLElement_29.isTagElement("e-menuitem", target)) {
                    if (event.detail.oldHotKey) {
                        this.removeHotkeyExec(event.detail.oldHotKey, target.trigger.bind(target));
                    }
                    if (event.detail.newHotKey) {
                        this.addHotkeyExec(event.detail.newHotKey, target.trigger.bind(target));
                    }
                }
            });
            /*document.body.addEventListener("trigger", (event: Event) => {
                let target = event.target as any;
                if (isTagElement("e-menuitem", target)) {
                    if (target.command) {
                        this.executeCommand(target.command, target.commandArgs)
                    }
                }
            });*/
            return Promise.all([
                new Promise((resolve, reject) => {
                    if (menubarContainer) {
                        fetch("assets/editor/editor.json").then((response) => {
                            if (response.ok) {
                                response.json().then((json) => {
                                    const menubar = MenubarTemplate_1.HTMLEMenubarTemplate(json);
                                    this.menubar = menubar;
                                    menubarContainer.append(menubar);
                                    resolve();
                                });
                            }
                            reject();
                        });
                    }
                    else {
                        reject();
                    }
                })
            ]);
        }
        setContext(context) {
            if (context !== this._context) {
                //this.dispatchEvent(new CustomEvent("e-contextchange"));
                this._context = context;
                /*if (this.menubar) {
                    this.menubar.findItems((item) => {
                        return !!item.command && (item.command.context === this._context)
                    }).forEach((item) => {
                        item.disabled = true;
                    });
                }*/
            }
        }
        getState(key) {
            return Snippets_5.getPropertyFromPath(this._state, key);
        }
        //TODO: Create a listeners object with the same structure as the state object
        setState(key, value) {
            Snippets_5.setPropertyFromPath(this._state, key, value);
            const listenedStates = Array.from(this._stateListeners.keys());
            listenedStates.filter((state) => {
                return (state.startsWith(key) && (state.charAt(key.length) === "." || state.charAt(key.length) === "")) ||
                    (key.startsWith(state) && (key.charAt(state.length) === "." || key.charAt(state.length) === ""));
            }).forEach((state) => {
                let stateListeners = this._stateListeners.get(state);
                if (stateListeners) {
                    let newStateValue = (state.length === key.length) ? value :
                        (state.length >= key.length) ? Snippets_5.getPropertyFromPath(value, state.substring(key.length + 1)) :
                            Snippets_5.getPropertyFromPath(this._state, state);
                    stateListeners.forEach((stateListener) => {
                        stateListener(newStateValue);
                    });
                }
            });
        }
        addStateListener(statekey, listener) {
            let stateListeners = this._stateListeners.get(statekey);
            if (typeof stateListeners === "undefined") {
                this._stateListeners.set(statekey, [listener]);
                return 0;
            }
            else {
                return stateListeners.push(listener) - 1;
            }
        }
        removeStateListener(statekey, listener) {
            let stateListeners = this._stateListeners.get(statekey);
            if (typeof stateListeners !== "undefined") {
                let index = stateListeners.indexOf(listener);
                if (index >= 0) {
                    stateListeners.splice(index, 1);
                }
                if (stateListeners.length === 0) {
                    this._stateListeners.delete(statekey);
                }
            }
        }
        registerCommand(name, command) {
            this._commands.set(name, command);
        }
        executeCommand(name, args, opts) {
            const command = this._commands.get(name);
            if (command && command.context === this._context) {
                if (opts && opts.undo && Command_1.isUndoCommand(command)) {
                    command.undo(args);
                    this._redoCommandsCallStack.push({ ...command, args: args });
                }
                else {
                    command.exec(args);
                    if (Command_1.isUndoCommand(command)) {
                        this._undoCommandsCallStack.push({ ...command, args: args });
                    }
                }
            }
        }
        undoLastCommand() {
            const lastCommand = this._undoCommandsCallStack.pop();
            if (lastCommand) {
                if (Command_1.isUndoCommand(lastCommand) && lastCommand.context === this._context) {
                    lastCommand.undo();
                    this._redoCommandsCallStack.push(lastCommand);
                }
            }
        }
        redoLastCommand() {
            const lastCommand = this._redoCommandsCallStack.pop();
            if (lastCommand) {
                if (lastCommand.context === this._context) {
                    lastCommand.exec();
                    if (Command_1.isUndoCommand(lastCommand)) {
                        this._undoCommandsCallStack.push(lastCommand);
                    }
                }
            }
        }
        addHotkeyExec(hotkey, exec) {
            let hotkeys = this._hotkeys.get(hotkey);
            if (typeof hotkeys === "undefined") {
                this._hotkeys.set(hotkey, [exec]);
                return 0;
            }
            else {
                return hotkeys.push(exec) - 1;
            }
        }
        removeHotkeyExec(hotkey, exec) {
            let hotkeys = this._hotkeys.get(hotkey);
            if (typeof hotkeys !== "undefined") {
                let index = hotkeys.indexOf(exec);
                if (index >= 0) {
                    hotkeys.splice(index, 1);
                }
                if (hotkeys.length === 0) {
                    this._hotkeys.delete(hotkey);
                }
            }
        }
    }
    exports.EditorBase = EditorBase;
});
define("samples/Mockup", ["require", "exports", "editor/Editor", "editor/elements/HTMLElement", "editor/Input", "editor/elements/lib/containers/menus/Menu", "editor/elements/lib/containers/menus/MenuButton", "editor/elements/lib/containers/menus/MenuBar", "editor/elements/lib/containers/menus/MenuItem", "editor/elements/lib/containers/menus/MenuItemGroup", "editor/elements/lib/containers/tabs/Tab", "editor/elements/lib/containers/tabs/TabList", "editor/elements/lib/containers/tabs/TabPanel", "editor/elements/lib/controls/draggable/Draggable", "editor/elements/lib/controls/draggable/Dragzone", "editor/elements/lib/controls/draggable/Dropzone", "editor/elements/lib/controls/draggable/DropzoneInput", "editor/elements/lib/utils/Import", "editor/elements/lib/utils/Loader", "editor/elements/lib/utils/WidthSash", "editor/elements/lib/utils/HeightSash", "editor/elements/lib/containers/treeview/TreeViewList", "editor/elements/lib/containers/treeview/TreeViewItem", "editor/elements/lib/controls/breadcrumb/BreadcrumbItem", "editor/elements/lib/controls/breadcrumb/BreadcrumbTrail"], function (require, exports, Editor_1, HTMLElement_30, Input_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mockup = void 0;
    const body = /*template*/ `
    <link rel="stylesheet" href="../css/mockup.css"/>
    <div id="root" class="flex-rows">
        <!--<header id="header" class="flex-cols flex-none padded">
            <e-menubar tabindex="0">
                <e-menuitem name="file-menu" type="menu" label="File" tabindex="-1" aria-label="File">
                    <e-menu slot="menu" tabindex="-1">
                            <e-menuitem id="file-import-menu-button" name="file-import-menu-button" type="button" label="Import file"
                                tabindex="-1" aria-label="Import file"></e-menuitem>
                            <e-menuitem id="file-export-menu-button" name="file-export-menu-button" type="button" label="Export file"
                            tabindex="-1" aria-label="Export file"></e-menuitem>
                    </e-menu>
                </e-menuitem>
                <e-menuitem name="view-menu" type="menu" label="Preferences" tabindex="-1" aria-label="Preferences">
                    <e-menu slot="menu" tabindex="-1">
                        <e-menuitem name="view-boolean-menuitem" type="checkbox" label="Advanced User"
                        tabindex="-1" aria-label="Advanced User"></e-menuitem>
                        <e-menuitem name="view-layout-menuitem" type="submenu" label="Layout"
                        tabindex="-1" aria-label="Layout">
                            <e-menu slot="menu" name="view-layout-menu">
                                <e-menuitemgroup>
                                    <e-menuitem name="view-layout-standard-menuitem" type="radio" label="Standard"
                                    tabindex="-1" aria-label="Standard" checked></e-menuitem>
                                </e-menuitemgroup>
                            </e-menu>
                        </e-menuitem>
                    </e-menu>
                </e-menuitem>
            </e-menubar>
        </header>-->
        <main class="flex-cols flex-auto padded">
            <div id="tabs-col" class="flex-none">
                <e-tablist id="tablist">
                    <e-tab name="timeline" controls="timeline-panel" title="Timeline" tabindex="-1"><span class="tab__label">Timeline</span></e-tab>
                    <e-tab name="extract" controls="extract-panel" title="Extract" active tabindex="-1"><span class="tab__label">Extract</span></e-tab>
                    <e-tab name="transform" controls="transform-panel" title="Transform" tabindex="-1"><span class="tab__label">Transform</span></e-tab>
                    <e-tab name="export" controls="export-panel" title="Export" tabindex="-1"><span class="tab__label">Export</span></e-tab>
                </e-tablist>
            </div>
            <div id="data-col" class="flex-none">
                <e-tabpanel id="timeline-panel" class="padded-horizontal">
                    <span>Timeline</span>
                    <div id="timeline">
                        <details id="timeline-details" open>
                            <summary>Timeline</summary>
                            <e-treeviewlist tabindex="-1" id="treeviewlist">
                                <e-treeviewitem label="Extract" tabindex="-1">
                                    <e-treeviewitem label="[E.1] CSVExtractor" tabindex="-1" leaf></e-treeviewitem>
                                    <e-treeviewitem label="[E.2] NetezzaExtractor" tabindex="-1" leaf></e-treeviewitem>
                                </e-treeviewitem>
                                <e-treeviewitem label="Transform" tabindex="-1">
                                    <e-treeviewitem tabindex="-1">
                                        <span slot="label">[T.1] Loop</span>
                                        <e-treeviewitem tabindex="-1" leaf>
                                            <span slot="label">[T.1.1] Replace</span>
                                        </e-treeviewitem>
                                        <e-treeviewitem tabindex="-1" leaf>
                                            <span slot="label">[T.1.2] Merge</span>
                                        </e-treeviewitem>
                                    </e-treeviewitem>
                                </e-treeviewitem>
                                <e-treeviewitem tabindex="-1">
                                    <span slot="label">Load</span>
                                    <e-treeviewitem tabindex="-1" leaf>
                                        <span slot="label">[L.1] CSVExporter</span>
                                    </e-treeviewitem>
                                </e-treeviewitem>
                            </e-treeviewlist>
                        </details>
                    </div>
                </e-tabpanel>
                <e-tabpanel id="extract-panel" class="padded-horizontal">
                    <span>Extract</span>
                    <div id="datasets">
                        <details id="timeline-details" open>
                            <summary>Data</summary>
                            <e-dragzone id="constants-dragzone">
                                <e-draggable type="date"><input type="date" name="const"/></e-draggable>
                                <e-draggable type="datetime"><input type="datetime-local" name="const"/></e-draggable>
                                <e-draggable type="string"><input type="text" data-dynamic-input name="const" placeholder="string"/></e-draggable>
                                <e-draggable type="number"><input type="number" data-dynamic-input name="const" placeholder="number"/></e-draggable>
                                <e-draggable type="bool"><input type="text" name="const" value="True" readonly/></e-draggable>
                                <e-draggable type="bool"><input type="text" name="const" value="False" readonly/></e-draggable>
                            </e-dragzone>
                        </details>
                    </div>
                </e-tabpanel>
                <e-tabpanel id="transform-panel" class="padded-horizontal">
                    <span>Transform</span>
                    <div id="expressions">
                        <details>
                            <summary>Operators</summary>
                            <div class="details-content">
                                <e-dragzone id="constants-dragzone">
                                    <e-draggable type="date"><input type="date" name="const"/></e-draggable>
                                    <e-draggable type="datetime"><input type="datetime-local" name="const"/></e-draggable>
                                    <e-draggable type="string"><input type="text" data-dynamic-input name="const" placeholder="string"/></e-draggable>
                                    <e-draggable type="number"><input type="number" data-dynamic-input name="const" placeholder="number"/></e-draggable>
                                    <e-draggable type="bool"><input type="text" name="const" value="True" readonly/></e-draggable>
                                    <e-draggable type="bool"><input type="text" name="const" value="False" readonly/></e-draggable>
                                </e-dragzone>
                            </div>
                        </details>
                        <details>
                            <summary>Metrics</summary>
                            <e-dragzone id="metrics-dragzone">
                                <e-draggable tabindex="-1"><fieldset data-signature="max_function">max(<e-dropzone placeholder="col"></e-dropzone>)</fieldset></e-draggable>
                                <e-draggable tabindex="-1">notna(<e-dropzone placeholder="col"></e-dropzone>)</e-draggable>
                            </e-dragzone>
                        </details>
                        <details>
                            <summary>Expressions</summary>
                            <e-dragzone id="operators-dragzone">
                                <e-draggable tabindex="-1">(<e-dropzone placeholder="expr"></e-dropzone>)</e-draggable>
                            </e-dragzone>
                            <details class="indented">
                                <summary>boolean</summary>
                                <e-dragzone id="boolean-operators-dragzone">
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;and&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;or&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;<&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;>&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;==&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;!==&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                </e-dragzone>
                            </details>
                            <details class="indented">
                            <summary>numeric</summary>
                                <e-dragzone id="numeric-operators-dragzone">
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;+&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;-&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;/&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                    <e-draggable tabindex="-1"><e-dropzone placeholder="left"></e-dropzone>&nbsp;*&nbsp;<e-dropzone placeholder="right"></e-dropzone></e-draggable>
                                </e-dragzone>
                            </details>
                        </details>
                        <details>
                            <summary>Functions</summary>
                            <e-dragzone id="functions-dragzone">
                                <e-draggable tabindex="-1">(<e-dragzone id="lambda"><e-draggable tabindex="-1">x</e-draggable></e-dragzone>)&nbsp;=>&nbsp;<e-dropzone placeholder="expr"></e-dropzone></e-draggable>
                            </e-dragzone>
                            <details class="indented">
                                <summary>string</summary>
                                <e-dragzone id="string-functions-dragzone">
                                    <e-draggable tabindex="-1">concat(<e-dropzone placeholder="left"></e-dropzone>, <e-dropzone placeholder="right"></e-dropzone>)</e-draggable>
                                </e-dragzone>
                            </details>
                            <details class="indented">
                                <summary>generator</summary>
                                <e-dragzone id="generator-functions-dragzone">
                                    <e-draggable tabindex="-1">range(<e-dropzone placeholder="number"></e-dropzone>)</e-draggable>
                                </e-dragzone>
                            </details>
                        </details>
                    </div>
                </e-tabpanel>
            </div>
            <e-wsash class="flex-none" controls="data-col"></e-wsash>
            <div class="col flex-auto padded-horizontal">
                <e-breadcrumbtrail class="margin-bottom">
                    <e-breadcrumbitem>Item 0</e-breadcrumbitem>
                    <e-breadcrumbitem>Item 1</e-breadcrumbitem>
                </e-breadcrumbtrail>
                <form id="extract-form">
                    <fieldset>
                        <details open>
                            <summary>
                                [E.1] Extractor 
                                <select class="doc-select" name="signature" data-class="toggler-select">
                                    <option value="netezza" selected>Netezza</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </summary>
                            <fieldset name="netezza" class="grid-fieldset margin-top" hidden>
                                <label for="user">User</label>
                                <input type="text" name="userid" required ondrop="event.preventDefault()"/>
                                <label for="password">Password</label>
                                <input type="password" name="password" required ondrop="event.preventDefault()"/>
                                <label for="database">Database</label>
                                <input type="text" name="database" required ondrop="event.preventDefault()"/>
                                <label for="query">Query</label>
                                <textarea name="query" required></textarea>
                                <label for="as">As</label>
                                <input type="text" name="as" required ondrop="event.preventDefault()"/>
                                <label for="column">Temp</label>
                                <e-dropzone multiple></e-dropzone>
                            </fieldset>
                            <fieldset name="csv" class="grid-fieldset margin-top" hidden>
                                <label for="filepath">Filepath</label>
                                <input name="filepath" type="file"/>
                                <label for="as">As</label>
                                <input type="text" name="as" required ondrop="event.preventDefault()"/>
                            </fieldset>
                        </details>
                        <div class="toolbar">
                            <button type="button" class="toolbar-item" name="execute" title="Execute"><span class="toolbar-item-label">Execute</span></button>
                            <hr class="toolbar-separator"/>
                            <button type="button" class="toolbar-item" name="delete" title="Delete"><span class="toolbar-item-label">Delete</span></button>
                        </div>
                        <div>
                            <span>Last execution datetime: never</span><br/>
                            <span>Last execution status: none</span>
                        </div>
                        <!--<button id="extract-button" type="submit">Extract</button>-->
                    </fieldset>
                </form>
                <!--<form id="transform-form">
                    <fieldset>
                        <details open>
                            <summary>Transformer
                                <select class="doc-select" data-class="toggler-select">
                                    <option value="replace" selected>Replace</option>
                                    <option value="merge">Merge</option>
                                    <option value="median_imputer">Median imputer</option>
                                </select>
                            </summary>
                            <fieldset name="merge" class="grid-fieldset indented margin-top">
                                <label for="left">Left</label>
                                <e-dropzone placeholder="dataframe"></e-dropzone>
                                <label for="right">Right</label>
                                <e-dropzone placeholder="dataframe"></e-dropzone>
                                <label for="on">On</label>
                                <e-dropzone placeholder="column(s)" multiple></e-dropzone>
                                <label for="how">How</label>
                                <select>
                                    <option value="left" selected>left</option>
                                    <option value="right">right</option>
                                </select>
                                <label for="outputDataframe">Output dataframe</label>
                                <input type="text" name="outputdataframe" required ondrop="event.preventDefault()"></input>
                            </fieldset>
                            <fieldset name="replace" class="grid-fieldset indented margin-top">
                                <label for="column">Column</label>
                                <e-dropzone></e-dropzone>
                                <label for="value">Value</label>
                                <e-dropzone></e-dropzone>
                                <label for="expression">Where</label>
                                <e-dropzone placeholder="boolean"></e-dropzone>
                            </fieldset>
                            <fieldset name="median_imputer" class="grid-fieldset indented margin-top">
                                <label for="column">Column(s)</label>
                                <e-dropzone multiple></e-dropzone>
                            </fieldset>
                        </details>
                        <div class="indented"><button id="transform-button" type="button">Transform</button></div>
                    </fieldset>
                </form>-->
            </div>
            <!--<div id="panels-col" class="col flex-auto padded-horizontal">
                <e-breadcrumbtrail class="margin-bottom">
                    <e-breadcrumbitem>Item 0</e-breadcrumbitem>
                    <e-breadcrumbitem>Item 1</e-breadcrumbitem>
                </e-breadcrumbtrail>
                <e-tabpanel id="extract-panel">
                </e-tabpanel>
                <e-tabpanel id="transform-panel">
                    <form id="transform-form">
                        <fieldset>
                            <details open>
                                <summary>Transformer
                                    <select class="doc-select" data-class="toggler-select">
                                        <option value="replace" selected>Replace</option>
                                        <option value="merge">Merge</option>
                                        <option value="median_imputer">Median imputer</option>
                                    </select>
                                </summary>
                                <fieldset name="merge" class="grid-fieldset indented margin-top">
                                    <label for="left">Left</label>
                                    <e-dropzone placeholder="dataframe"></e-dropzone>
                                    <label for="right">Right</label>
                                    <e-dropzone placeholder="dataframe"></e-dropzone>
                                    <label for="on">On</label>
                                    <e-dropzone placeholder="column(s)" multiple></e-dropzone>
                                    <label for="how">How</label>
                                    <select>
                                        <option value="left" selected>left</option>
                                        <option value="right">right</option>
                                    </select>
                                    <label for="outputDataframe">Output dataframe</label>
                                    <input type="text" name="outputdataframe" required ondrop="event.preventDefault()"></input>
                                </fieldset>
                                <fieldset name="replace" class="grid-fieldset indented margin-top">
                                    <label for="column">Column</label>
                                    <e-dropzone></e-dropzone>
                                    <label for="value">Value</label>
                                    <e-dropzone></e-dropzone>
                                    <label for="expression">Where</label>
                                    <e-dropzone placeholder="boolean"></e-dropzone>
                                </fieldset>
                                <fieldset name="median_imputer" class="grid-fieldset indented margin-top">
                                    <label for="column">Column(s)</label>
                                    <e-dropzone multiple></e-dropzone>
                                </fieldset>
                            </details>
                            <div class="indented"><button id="transform-button" type="button">Transform</button></div>
                        </fieldset>
                    </form>
                </e-tabpanel>
                <e-tabpanel id="export-panel">
                    <form id="export-form">
                    <fieldset>
                        <details open>
                            <summary>Exporter 
                                <select class="doc-select" data-class="toggler-select">
                                    <option value="csv">CSV</option>
                                </select>
                            </summary>
                            <fieldset name="csv" class="grid-fieldset indented margin-top" hidden>
                                <label for="filename">Filename</label>
                                <input type="text" name="filename" ondrop="event.preventDefault()" required></input>
                                <label for="columns">Columns</label>
                                <e-dropzone multiple id="columns" name="columns"></e-dropzone>
                            </fieldset>
                        </details>
                        <div class="indented"><button id="export-button" type="button">Export</button></div>
                    </fieldset>
                </form>
                </e-tab-panel>
            </div>-->
            <e-wsash id="doc-col-sash" class="flex-none" controls="doc-col"></e-wsash>
            <div id="doc-col" class="col flex-none">
                <div id="doc-container" class="padded"></div>
            </div>
        </main>
        <!--<footer class="flex-cols flex-none padded"></footer>-->
    </div>
`;
    async function mockup() {
        const bodyTemplate = document.createElement("template");
        bodyTemplate.innerHTML = body;
        document.body.appendChild(bodyTemplate.content);
        const editor = new Editor_1.EditorBase();
        editor.registerCommand("import", {
            exec() {
                alert("Import");
            },
            context: 'default'
        });
        editor.registerCommand("export", {
            exec() {
                alert("Export");
            },
            context: 'default'
        });
        editor.setup();
        let importMenuItem = document.getElementById("file-import-menu-button");
        if (importMenuItem) {
            importMenuItem.command = "import";
            importMenuItem.hotkey = new Input_2.HotKey(Input_2.Key.I, Input_2.KeyModifier.Control, Input_2.KeyModifier.Alt);
        }
        let exportMenuItem = document.getElementById("file-export-menu-button");
        if (exportMenuItem) {
            exportMenuItem.command = "export";
            exportMenuItem.hotkey = new Input_2.HotKey(Input_2.Key.J, Input_2.KeyModifier.Control, Input_2.KeyModifier.Alt);
        }
        const extractForm = document.querySelector("form#extract-form");
        const extractTab = document.querySelector("e-tab[name='extract']");
        const transformTab = document.querySelector("e-tab[name='transform']");
        const exportTab = document.querySelector("e-tab[name='export']");
        const extractButton = document.querySelector("button#extract-button");
        const transformButton = document.querySelector("button#transform-button");
        const exportButton = document.querySelector("button#export-button");
        document.addEventListener("dragenter", (event) => {
            event.dataTransfer.dropEffect = "copy";
        }, { capture: true });
        const treeviewlist = document.querySelector("#treeviewlist");
        if (treeviewlist) {
            treeviewlist.addEventListener("contextmenu", (event) => {
                let target = event.target;
                console.log(target);
                if (HTMLElement_30.isTagElement("e-treeviewitem", target)) {
                    let menu = HTMLElement_30.Element("e-menu", {
                        props: {
                            name: "My menu"
                        },
                        children: [
                            HTMLElement_30.Element("e-menuitem", {
                                props: {
                                    label: "Remove me!"
                                },
                                children: [
                                    HTMLElement_30.Element("span", {
                                        props: {
                                            slot: "label",
                                            className: "menuitem__icon"
                                        }
                                    })
                                ]
                            })
                        ],
                        styles: {
                            "position": "absolute",
                            "top": `${event.clientY}px`,
                            "left": `${event.clientX}px`,
                        },
                        listeners: {
                            "focusout": (event) => {
                                let target = event.target;
                                let relatedTarget = event.relatedTarget;
                                if (!menu.contains(relatedTarget)) {
                                    target.remove();
                                }
                            },
                            "e-trigger": () => {
                                target.remove();
                                document.body.focus();
                            }
                        }
                    });
                    document.body.append(menu);
                }
                event.preventDefault();
            });
        }
        /*if (extractForm) {
            const jsonData = new JSONFormData(extractForm);
            console.log(jsonData.getData());
        }
    
        (window as any)["FormDataObject"] = FormDataObject;*/
        //(window as any)["StructuredFormData"] = StructuredFormData;
        function kebabize(str) {
            var _a;
            return str && ((_a = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)) === null || _a === void 0 ? void 0 : _a.map(x => x.toLowerCase()).join('-')) || "";
        }
        function camelize(str) {
            return str.toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        }
        function generateDataset(name, columns) {
            const datasetsDetails = document.querySelector("#datasets-details");
            if (datasetsDetails) {
                const dataset1Summary = document.createElement("summary");
                dataset1Summary.textContent = `${name}`;
                const dataset1Details = document.createElement("details");
                dataset1Details.classList.add("indented");
                dataset1Details.open = true;
                const dataset1Dragzone = document.createElement("e-dragzone");
                dataset1Dragzone.id = `dataset-${kebabize(name)}-dragzone`;
                const dataset1Draggable = document.createElement("e-draggable");
                dataset1Draggable.textContent = `${name}`;
                dataset1Dragzone.append(dataset1Draggable, ...columns.map((col) => {
                    let draggable = document.createElement("e-draggable");
                    draggable.textContent = `Col ${name}${col}`;
                    return draggable;
                }));
                dataset1Details.append(dataset1Summary, dataset1Dragzone);
                datasetsDetails.append(dataset1Details);
            }
        }
        const docs = new Map();
        docs.set("netezza", "<b>Netezza</b> Extractor<br/>\
        <p>Extract data from a Netezza database.</p>\
        <p class='params'><span class='param-name'>User:</span><span>database user</span>\
        <span class='param-name'>Password:</span><span>user password</span>\
        <span class='param-name'>Database:</span><span>database name</span></p>");
        docs.set("csv", "<b>CSV</b> Extractor<br/>\
        <p>Extract data from a .csv file.</p>\
        <p class='params'><span class='param-name'>Filepath:</span><span>filepath to the .csv file</span>");
        docs.set("replace", "<b>Replace</b> Transformer<br/>\
        <p>Replace by a given value where a condition is met.</p>\
        <p class='params'><span class='param-name'>Columns:</span><span>the columns where the transformer will be applied</span>\
        <p class='params'><span class='param-name'>Value:</span><span>the value to use as a replacement</span>\
        <p class='params'><span class='param-name'>Where:</span><span>the condition to meet</span>");
        function setDocstringText(name) {
            if (docContainer) {
                let docstring = docs.get(name);
                docContainer.innerHTML = docstring || "";
            }
        }
        const docContainer = document.getElementById("doc-container");
        const docsSelects = Array.from(document.querySelectorAll("select.doc-select"));
        if (docsSelects.length > 0) {
            setDocstringText(docsSelects[0].value);
            docsSelects.forEach((select) => {
                select.addEventListener("change", () => {
                    setDocstringText(select.value);
                });
            });
        }
        /*if (extractButton) {
            extractButton.addEventListener("click", () => {
                if (transformTab) {
                    transformTab.active = true;
                    generateDataset("[E.1] D1", [
                        "A", "B", "C", "D", "E", "F",
                    ]);
                    generateDataset("[E.2] D2", [
                        "A", "G", "H", "I", "J"
                    ]);
                }
            });
        }*/
        if (transformButton) {
            transformButton.addEventListener("click", () => {
                if (exportTab) {
                    exportTab.active = true;
                    generateDataset("Merged", [
                        "M1 (M)", "M2 (M)"
                    ]);
                }
            });
        }
        const info = {
            type: "df",
            name: "df"
        };
        const dropzone = document.querySelector("e-dropzone#columns");
        if (dropzone) {
            dropzone.addEventListener("datachange", () => {
                if (dropzone.multiple) {
                    dropzone.draggables.forEach((draggable, index) => {
                        draggable.dataset.scope = `${dropzone.name}[${index}]`;
                    });
                }
            });
        }
        if (exportButton) {
            exportButton.addEventListener("click", () => {
                alert("Tadam!");
                /*let form = document.querySelector("form");
                if (form) {
                    let structuredFormData = new StructuredFormData(form).getStructuredFormData();
                    let dataBlob = new Blob([JSON.stringify(structuredFormData, null, 4)], {type: "application/json"});
    
                    let donwloadAnchor = document.createElement("a");
                    donwloadAnchor.href = URL.createObjectURL(dataBlob);
                    donwloadAnchor.download = "config.json";
                    donwloadAnchor.click();
                }*/
            });
        }
    }
    exports.mockup = mockup;
});
define("samples/Sandbox", ["require", "exports", "editor/elements/HTMLElement", "samples/Mockup", "samples/temp"], function (require, exports, HTMLElement_31, Mockup_1, temp_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sandbox = void 0;
    class DataClassMixin extends HTMLElement_31.AttributeMutationMixinBase {
        constructor(attributeValue) {
            super("data-class", "listitem", attributeValue);
        }
    }
    class TestDataClassMixin extends DataClassMixin {
        constructor() {
            super("test");
        }
        attach(element) {
            element.addEventListener("click", TestDataClassMixin._clickEventListener);
        }
        detach(element) {
            element.removeEventListener("click", TestDataClassMixin._clickEventListener);
        }
    }
    TestDataClassMixin._clickEventListener = () => {
        alert("data-class test");
    };
    class InputDropzoneDataClassMixin extends DataClassMixin {
        constructor() {
            super("input-dropzone");
            this.datatransferEventListener = ((event) => {
                let target = event.target;
                if (HTMLElement_31.isTagElement("e-dropzone", target)) {
                    this.handlePostdatatransferInputNaming(target);
                }
            });
        }
        attach(element) {
            if (HTMLElement_31.isTagElement("e-dropzone", element)) {
                this.handlePostdatatransferInputNaming(element);
            }
            element.addEventListener("datachange", this.datatransferEventListener);
        }
        detach(element) {
            element.removeEventListener("datachange", this.datatransferEventListener);
        }
        handlePostdatatransferInputNaming(dropzone) {
            let name = dropzone.getAttribute("data-input-dropzone-name");
            if (name) {
                if (dropzone.multiple) {
                    let inputs = Array.from(dropzone.querySelectorAll("input"));
                    inputs.forEach((input, index) => {
                        input.name = `${name}[${index}]`;
                    });
                }
                else {
                    let input = dropzone.querySelector("input");
                    if (input) {
                        input.name = name;
                    }
                }
            }
        }
    }
    class TogglerSelectDataClassMixin extends DataClassMixin {
        constructor() {
            super("toggler-select");
            this.changeEventListener = (event) => {
                let target = event.target;
                if (HTMLElement_31.isTagElement("select", target)) {
                    this.handlePostchangeToggle(target);
                }
            };
        }
        attach(element) {
            element.addEventListener("change", this.changeEventListener);
            this.handlePostchangeToggle(element);
        }
        detach(element) {
            element.removeEventListener("change", this.changeEventListener);
        }
        handlePostchangeToggle(select) {
            const closestFieldset = select.closest("fieldset");
            let toToggleElement = null;
            if (closestFieldset) {
                Array.from(select.options).forEach((option, index) => {
                    toToggleElement = closestFieldset.querySelector(`[name=${option.value}]`);
                    if (toToggleElement) {
                        toToggleElement.hidden = (index !== select.selectedIndex);
                    }
                });
            }
        }
    }
    class DuplicaterInputDataClassMixin extends DataClassMixin {
        constructor() {
            super("duplicater-input");
            this.changeEventListener = (event) => {
                let target = event.target;
                if (HTMLElement_31.isTagElement("input", target)) {
                    this.handlePostchangeDuplicate(target);
                }
            };
        }
        attach(element) {
            element.addEventListener("change", this.changeEventListener);
            this.handlePostchangeDuplicate(element);
        }
        detach(element) {
            element.removeEventListener("change", this.changeEventListener);
        }
        handlePostchangeDuplicate(input) {
            const closestFieldset = input.closest("fieldset");
            const template = input.getAttribute("data-duplicater-template");
            const inputValue = parseInt(input.value);
            if (closestFieldset && template) {
                const duplicateElements = Array.from(closestFieldset.querySelectorAll(`[name=${template}]`));
                if (duplicateElements.length > 0) {
                    const lastElement = duplicateElements[duplicateElements.length - 1];
                    const templateElement = duplicateElements.splice(0, 1)[0];
                    templateElement.hidden = true;
                    while (duplicateElements.length > Math.max(inputValue, 0)) {
                        duplicateElements.pop().remove();
                    }
                    while (duplicateElements.length < inputValue) {
                        let newDuplicateElement = templateElement.cloneNode(true);
                        newDuplicateElement.hidden = false;
                        let duplicateIndex = newDuplicateElement.querySelector("[data-duplicater-index]");
                        if (duplicateIndex) {
                            duplicateIndex.textContent = (duplicateElements.length + 1).toString();
                        }
                        lastElement.insertAdjacentElement("afterend", newDuplicateElement);
                        duplicateElements.push(newDuplicateElement);
                    }
                }
            }
        }
    }
    class EnablerInputDataClassMixin extends DataClassMixin {
        constructor() {
            super("enabler-input");
            this.changeEventListener = (event) => {
                let target = event.target;
                if (HTMLElement_31.isTagElement("input", target)) {
                    this.handlePostchangeDuplicate(target);
                }
            };
        }
        attach(element) {
            element.addEventListener("change", this.changeEventListener);
            this.handlePostchangeDuplicate(element);
        }
        detach(element) {
            element.removeEventListener("change", this.changeEventListener);
        }
        handlePostchangeDuplicate(input) {
            const closestFieldset = input.closest("fieldset");
            const template = input.getAttribute("data-duplicater-template");
            const inputValue = parseInt(input.value);
            if (closestFieldset && template) {
                const duplicateElements = Array.from(closestFieldset.querySelectorAll(`[name=${template}]`));
                if (duplicateElements.length > 0) {
                    const lastDuplicateElement = duplicateElements[duplicateElements.length - 1];
                    const templateElement = duplicateElements.splice(0, 1)[0];
                    templateElement.hidden = true;
                    while (duplicateElements.length > Math.max(inputValue, 0)) {
                        duplicateElements.pop().remove();
                    }
                    while (duplicateElements.length < inputValue) {
                        let newDuplicateElement = templateElement.cloneNode(true);
                        newDuplicateElement.hidden = false;
                        let duplicateIndex = newDuplicateElement.querySelector("[data-duplicater-index]");
                        if (duplicateIndex) {
                            duplicateIndex.textContent = (duplicateElements.length + 1).toString();
                        }
                        lastDuplicateElement.insertAdjacentElement("afterend", newDuplicateElement);
                        duplicateElements.push(newDuplicateElement);
                    }
                }
            }
        }
    }
    class DynamicInputMixin extends HTMLElement_31.AttributeMutationMixinBase {
        constructor() {
            super("data-dynamic-input");
        }
        onInputEventCallback(event) {
            DynamicInputMixin.resizeInputElement(event.target);
        }
        static resizeInputElement(element) {
            let length = (element.value.length > 0) ? element.value.length : (element.placeholder.length > 0) ? element.placeholder.length : 0;
            length += (element.type === "number") ? 3 : (element.type === "text") ? 2 : 0;
            element.style.width = `${length * parseFloat(window.getComputedStyle(element).getPropertyValue("font-size")) * 0.60}px`;
        }
        attach(element) {
            if (HTMLElement_31.isTagElement("input", element)) {
                element.addEventListener("input", this.onInputEventCallback);
                DynamicInputMixin.resizeInputElement(element);
            }
        }
        detach(element) {
            if (HTMLElement_31.isTagElement("input", element)) {
                element.removeEventListener("input", this.onInputEventCallback);
            }
        }
    }
    const attributeMutationMixins = [
        new TestDataClassMixin(),
        new InputDropzoneDataClassMixin(),
        new TogglerSelectDataClassMixin(),
        new DuplicaterInputDataClassMixin(),
        new DynamicInputMixin()
    ];
    const mainObserver = new MutationObserver(HTMLElement_31.createMutationObserverCallback(attributeMutationMixins));
    mainObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributeFilter: attributeMutationMixins.map((mixin => mixin.attributeName))
    });
    async function sandbox() {
        // let tree = new TreeModel<MyNodeModel>({label: "lol", items: [{label: "hey"}]});
        // tree.addEventListener("modified", (event: ModelModifiedEvent) => {
        //   console.log(event);
        // });
        // console.log(tree);
        // tree.setItemProperty({row: 0}, "label", "lol");
        // console.log(tree.getItemProperty({row: 0}, "label"));
        await Mockup_1.mockup();
        //await start();
        temp_1.temp();
        /*editor.registerCommand("test", {
          exec: () => {
            alert("test");
          },
          context: "default"
        });*/
        /*window.addEventListener("blur", () => {
          document.body.focus();
        });*/
        /*const myWindow = window.open("http://localhost:8080/", "MsgWindow", "width=200,height=100");
        if (myWindow) {
        myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
        myWindow.addEventListener("message", (event) => {
            myWindow.document.body.innerHTML = event.data;
        }, false);
      
        setTimeout(() => {
            myWindow.postMessage("The user is 'bob' and the password is 'secret'", "http://localhost:8080/");
        }, 100);
      }*/
    }
    exports.sandbox = sandbox;
});
define("boot", ["require", "exports", "samples/Sandbox"], function (require, exports, Sandbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boot = void 0;
    async function boot() {
        await Sandbox_1.sandbox();
    }
    exports.boot = boot;
});
define("editor/Application", ["require", "exports", "editor/model/Model"], function (require, exports, Model_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ApplicationBase {
        constructor() {
            this.state = new Model_2.ObjectModelBase({});
        }
    }
});
/*
class WebComponent extends HTMLElement {
    
    constructor() {
        super();
    }

    public connectedCallback(): void {

    }

    public disconnectedCallback(): void {

    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {

    }

    public beforeUpdate() {
        
    }

    public update(): void  {

    }

    public afterUpdate() {

    }

    public requestUpdate(): void  {

    }

    public render(): void  {

    }
}

interface CustomHTMLElementDecorator {
    (args: {
        name: string;
        options?: ElementDefinitionOptions
    }): <C extends CustomElementConstructor>(elementCtor: C) => C;
}

const CustomHTMLElement: CustomHTMLElementDecorator = function(args: {
    name: string;
    options?: ElementDefinitionOptions
}) {
    return <C extends CustomElementConstructor>(
        elementCtor: C
    ) => {

        customElements.define(
            args.name,
            elementCtor,
            args.options
        );

        return elementCtor;
    }
}

class HTMLEELement extends HTMLElement {

    constructor() {
        super();
        let prototype = (Object.getPrototypeOf(this) as typeof HTMLEELement);
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.dispatchEvent(new CustomEvent("connected"));
    }

    disconnectedCallback() {
        this.dispatchEvent(new CustomEvent("disconnected"));
    }

    render(): Node {
        return this.shadowRoot!;
    }
}

interface ReactiveDecorator {
    (args?: {
        hasChanged?: (oldValue: any, newValue: any) => boolean;
        type?: "string" | "number" | "boolean" | "array" | "object";
        reflect?: boolean;
    }): <E extends HTMLEELement>(elementPrototype: E, propertyKey: string) => void;
}

const Reactive: ReactiveDecorator = function(args?: {
    hasChanged?: (oldValue: any, newValue: any) => boolean;
    type?: "string" | "number" | "boolean" | "array" | "object";
    reflect?: boolean;
}) {
    return <E extends HTMLEELement>(
        elementPrototype: E, propertyKey: string
    ) => {
        if (args) {
            Object.defineProperty(elementPrototype, propertyKey, {
                set: function(this: E, value) {
                    let propertyHasChanged = true;
                    if (typeof args !== "undefined" && typeof args.hasChanged === "function") {
                        propertyHasChanged = args.hasChanged((this as {[k: string]: any})[propertyKey], value)
                    }
                    else {
                        propertyHasChanged = ((this as {[k: string]: any})[propertyKey] !== value);
                    }
                    (this as {[k: string]: any})[propertyKey] = value;
                    if (args.reflect) {
                        switch (args.type) {
                            case "boolean":
                                if (value) {
                                    this.setAttribute(propertyKey, "");
                                }
                                else {
                                    this.removeAttribute(propertyKey);
                                }
                                break;
                            case "number":
                            case "string":
                                if (typeof value !== "undefined" && value !== null) {
                                    this.setAttribute(propertyKey, value);
                                }
                                else {
                                    this.removeAttribute(propertyKey);
                                }
                                break;
                            case "object":
                            case "array":
                                if (typeof value !== "undefined" && value !== null) {
                                    this.setAttribute(propertyKey, JSON.stringify(value));
                                }
                                else {
                                    this.removeAttribute(propertyKey);
                                }
                                break;
                        }
                    }
                    if (propertyHasChanged) {
                        this.update();
                    }
                }
            });
        }
    }
}

let html = function(parts: TemplateStringsArray, ...expr: any[]) {
    let events: [string, EventListener][] = [];
    let parsedParts = [];
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i];
      let eventAttribute = /@(.*)=/.exec(part);
      if (eventAttribute !== null) {
        if (typeof expr[i] === "function") {
          events.push([eventAttribute[1], expr[i]]);
          parsedParts.push(part.substr(0, part.indexOf("@")).trimRight());
        }
      }
      else {
        parsedParts.push(part);
      }
    }
    const template = document.createElement("template");
    template.innerHTML = parsedParts.join();
    const parsedHTML = new DOMParser().parseFromString(parsedParts.join(), "text/html").body.firstChild;
    if (!parsedHTML) {
      throw new Error();
    }
    if (parsedHTML.nodeType === parsedHTML.ELEMENT_NODE) {
      events.forEach((event) => {
        parsedHTML.addEventListener(event[0], event[1]);
      });
    }
    return parsedHTML;
  }
*/ 
define("editor/elements/forms/Snippets", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_32) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setFormState = exports.getFormState = void 0;
    ;
    const getFormState = (form) => {
        const elements = Array.from(form.elements);
        let state = {};
        elements.forEach((element) => {
            if (HTMLElement_32.isTagElement("input", element)) {
                if (element.type === "radio") {
                    if (!(element.name in state)) {
                        state[element.name] = {
                            type: "radio",
                            nodes: [{
                                    value: element.value,
                                    checked: element.checked
                                }]
                        };
                    }
                    else {
                        const elem = state[element.name];
                        if ("nodes" in elem) {
                            elem.nodes.push({
                                value: element.value,
                                checked: element.checked
                            });
                        }
                    }
                }
                else if (element.type === "checkbox") {
                    state[element.name] = {
                        type: "checkbox",
                        checked: element.checked
                    };
                }
                else {
                    state[element.name] = {
                        value: element.value,
                    };
                }
            }
            else if (HTMLElement_32.isTagElement("select", element)) {
                state[element.name] = {
                    value: element.value,
                };
            }
            else if (HTMLElement_32.isTagElement("textarea", element)) {
                state[element.name] = {
                    value: element.value,
                };
            }
        });
        return state;
    };
    exports.getFormState = getFormState;
    const setFormState = (form, state) => {
        const elements = Array.from(form.elements);
        const names = Object.keys(state);
        names.forEach((name) => {
            const elemState = state[name];
            if ("type" in elemState) {
                if (elemState.type === "checkbox") {
                    let element = elements.find((elem) => elem.name === name);
                    if (element && HTMLElement_32.isTagElement("input", element)) {
                        element.checked = elemState.checked;
                    }
                }
                else if (elemState.type === "radio") {
                    elemState.nodes.forEach((radioNode) => {
                        let element = elements.find((elem) => elem.name === name && elem.value === radioNode.value);
                        if (element && HTMLElement_32.isTagElement("input", element)) {
                            element.checked = radioNode.checked;
                        }
                    });
                }
            }
            else {
                let element = elements.find((elem) => elem.name === name);
                if (element && (HTMLElement_32.isTagElement("input", element) || HTMLElement_32.isTagElement("select", element) || HTMLElement_32.isTagElement("textarea", element))) {
                    element.value = elemState.value;
                }
            }
        });
    };
    exports.setFormState = setFormState;
});
define("editor/elements/forms/StructuredFormData", ["require", "exports", "editor/elements/HTMLElement", "editor/elements/Snippets"], function (require, exports, HTMLElement_33, Snippets_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StructuredFormData = void 0;
    class StructuredFormData {
        constructor(form) {
            this.form = form;
        }
        resolveElementScope(element) {
            let fullname = element.name;
            let parent = element.parentElement;
            while (parent && parent !== this.form) {
                let scope = parent.dataset.scope;
                if (typeof scope !== "undefined") {
                    fullname = `${scope}.${fullname}`;
                }
                parent = parent === null || parent === void 0 ? void 0 : parent.parentElement;
            }
            return fullname;
        }
        getScopedData() {
            let elements = Array.from(this.form.elements);
            let data = {};
            elements.forEach((element) => {
                if (HTMLElement_33.isTagElement("input", element) || HTMLElement_33.isTagElement("select", element) || HTMLElement_33.isTagElement("textarea", element)) {
                    if (element.name) {
                        let value = null;
                        if (HTMLElement_33.isTagElement("input", element)) {
                            if (element.value) {
                                switch (element.type) {
                                    case "text":
                                        value = element.value;
                                        break;
                                    case "date":
                                    case "datetime-local":
                                        value = element.value;
                                        break;
                                    case "checkbox":
                                    case "radio":
                                        value = (element.value == "on");
                                        break;
                                    default:
                                        value = element.value;
                                }
                            }
                        }
                        if (value !== null) {
                            let fullname = this.resolveElementScope(element);
                            Snippets_6.setPropertyFromPath(data, fullname, value);
                        }
                    }
                }
            });
            return data;
        }
    }
    exports.StructuredFormData = StructuredFormData;
});
define("editor/elements/lib/builtins/inputs/NumberInput", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_34) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberInputElement = void 0;
    let NumberInputElement = class NumberInputElement extends HTMLInputElement {
        constructor() {
            super();
            this.addEventListener('input', (event) => {
                if (this.value !== '') {
                    if (this.isValueValid(this.value)) {
                        this.cache = this.value;
                    }
                    else {
                        this.value = this.cache;
                    }
                }
            }, { capture: true });
            this.addEventListener('focusin', (event) => {
                this.select();
            }, { capture: true });
            this.addEventListener('focusout', (event) => {
                this.value = this.cache = this.parseValue(this.value);
            }, { capture: true });
        }
        isValueValid(value) {
            let match = value.match(/([+-]?[0-9]*([.][0-9]*)?)|([+-]?[.][0-9]*)/);
            return (match !== null && match[1] === value);
        }
        parseValue(value) {
            let parsedValue = parseFloat(value);
            return Number.isNaN(parsedValue) ? '0' : parsedValue.toString();
        }
        connectedCallback() {
            this.cache = this.value = this.parseValue(this.value);
        }
    };
    NumberInputElement = __decorate([
        HTMLElement_34.RegisterCustomHTMLElement({
            name: 'number-input',
            options: {
                extends: 'input'
            }
        }),
        HTMLElement_34.GenerateAttributeAccessors([
            { name: 'cache' }
        ])
    ], NumberInputElement);
    exports.NumberInputElement = NumberInputElement;
});
define("editor/elements/lib/containers/panels/Panel", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_35) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PanelElement = void 0;
    let PanelElement = class PanelElement extends HTMLElement {
        constructor() {
            super();
            HTMLElement_35.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                }

                :host([state='closed']) #label,
                :host([state='closed']) #content {
                    display: none;
                }

                :host([state='closed']) #header {
                    padding: 0;
                }

                :host([state='closed']) #arrow {
                    display: inherit;
                }
                
                :host([state='opened']) #label,
                :host([state='opened']) #content {
                    display: inherit;
                }

                :host([state='opened']) #arrow {
                    display: none;
                }

                #content {
                    padding: var(--content-padding, inherit);
                }

                #header {
                    color: var(--header-color, inherit);
                    text-align: center;
                    padding-top: 0;

                    user-select: none;
                }

                #header:hover {
                    --color: var(--header-hover-color, var(--header-color));
                    color: var(--header-hover-color, var(--header-color));
                    font-weight: var(--header-hover-font-weight);
                }
            </style>
            <div>
                <div id="header">
                    <span id="arrow"></span>
                    <span id="label"></span>
                </div>
                <div id="content">
                    <slot></slot>
                </div>
            </div>
        `);
            const header = this.shadowRoot.getElementById('header');
            header.addEventListener('click', () => {
                this.state = (this.state === 'opened') ? 'closed' : 'opened';
            });
        }
        async render() {
            const label = this.shadowRoot.getElementById('label');
            const arrow = this.shadowRoot.getElementById('arrow');
            let rect = this.getBoundingClientRect();
            const arr = (rect.left < window.innerWidth / 2) ? '>' : '<';
            arrow.innerHTML = arr;
            label.innerHTML = this.label || '';
        }
        connectedCallback() {
            this.label = this.label || 'label';
            this.state = this.state || 'opened';
            this.render();
        }
    };
    PanelElement = __decorate([
        HTMLElement_35.RegisterCustomHTMLElement({
            name: 'e-panel',
            observedAttributes: ['state']
        }),
        HTMLElement_35.GenerateAttributeAccessors([
            { name: 'label', type: 'string' },
            { name: 'state', type: 'string' },
        ])
    ], PanelElement);
    exports.PanelElement = PanelElement;
});
define("editor/elements/lib/containers/panels/PanelGroup", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_36) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PanelGroupElement = void 0;
    let PanelGroupElement = class PanelGroupElement extends HTMLElement {
        constructor() {
            super();
            HTMLElement_36.bindShadowRoot(this, /*template*/ `
            <link rel="stylesheet" href="css/theme.css"/>
            <style>
                :host {
                    display: block;
                }

                :host([state='closed']) #content {
                    display: none;
                }

                :host([state='closed']) #less {
                    display: none;
                }

                :host([state='opened']) #more {
                    display: none;
                }

                #toggler {
                    display: flex;
                }

                #toggler:hover {
                    font-weight: 500;
                    color: var(--label-on-hover-color);
                }

                #label {
                    flex: 1;
                }
            </style>
            <div>
                <div id="toggler">
                    <span id="arrow"><!--<icon #less><icon #more>--></span>
                    <span id="label"></span>
                </div>
                <div id="content">
                    <slot></slot>
                </div>
            </div>
        `);
            this.state = this.state || 'closed';
        }
        connectedCallback() {
            const toggler = this.shadowRoot.querySelector('#toggler');
            const arrow = this.shadowRoot.querySelector('#arrow');
            const label = this.shadowRoot.querySelector('#label');
            toggler.addEventListener('click', () => {
                if (this.state === 'opened') {
                    this.state = 'closed';
                }
                else if (this.state === 'closed') {
                    this.state = 'opened';
                }
            });
            label.innerHTML = this.label;
        }
    };
    PanelGroupElement.observedAttributes = ['state'];
    PanelGroupElement = __decorate([
        HTMLElement_36.RegisterCustomHTMLElement({
            name: 'e-panel-group'
        }),
        HTMLElement_36.GenerateAttributeAccessors([
            { name: 'label', type: 'string' },
            { name: 'state', type: 'string' },
        ])
    ], PanelGroupElement);
    exports.PanelGroupElement = PanelGroupElement;
});
define("editor/elements/lib/containers/toolbar/Toolbar", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_37) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHTMLEMenuBarElement = exports.HTMLEMenuBarElement = void 0;
    function isHTMLEMenuBarElement(elem) {
        return elem.tagName.toLowerCase() === "e-menubar";
    }
    exports.isHTMLEMenuBarElement = isHTMLEMenuBarElement;
    let HTMLEMenuBarElement = class HTMLEMenuBarElement extends HTMLElement {
    };
    HTMLEMenuBarElement = __decorate([
        HTMLElement_37.RegisterCustomHTMLElement({
            name: "e-menubar",
            observedAttributes: ["active"]
        }),
        HTMLElement_37.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "active", type: "boolean" },
        ])
    ], HTMLEMenuBarElement);
    exports.HTMLEMenuBarElement = HTMLEMenuBarElement;
});
define("editor/elements/lib/containers/toolbar/ToolbarItem", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_38) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHTMLEMenuItemElement = exports.HTMLEMenuItemElement = void 0;
    function isHTMLEMenuItemElement(elem) {
        return elem.tagName.toLowerCase() === "e-menuitem";
    }
    exports.isHTMLEMenuItemElement = isHTMLEMenuItemElement;
    let HTMLEMenuItemElement = class HTMLEMenuItemElement extends HTMLElement {
    };
    HTMLEMenuItemElement = __decorate([
        HTMLElement_38.RegisterCustomHTMLElement({
            name: "e-menuitem",
            observedAttributes: ["icon", "label", "checked"]
        }),
        HTMLElement_38.GenerateAttributeAccessors([
            { name: "name", type: "string" },
            { name: "label", type: "string" },
            { name: "icon", type: "string" },
            { name: "type", type: "string" },
            { name: "disabled", type: "boolean" },
            { name: "checked", type: "boolean" },
            { name: "value", type: "string" },
        ])
    ], HTMLEMenuItemElement);
    exports.HTMLEMenuItemElement = HTMLEMenuItemElement;
});
define("editor/elements/lib/containers/toolbar/ToolbarItemGroup", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_39) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEMenuItemGroupElement = exports.isHTMLEMenuItemGroupElement = void 0;
    function isHTMLEMenuItemGroupElement(elem) {
        return elem.tagName.toLowerCase() === "e-menuitemgroup";
    }
    exports.isHTMLEMenuItemGroupElement = isHTMLEMenuItemGroupElement;
    let HTMLEMenuItemGroupElement = class HTMLEMenuItemGroupElement extends HTMLElement {
    };
    HTMLEMenuItemGroupElement = __decorate([
        HTMLElement_39.RegisterCustomHTMLElement({
            name: "e-menuitemgroup",
            observedAttributes: ["label", "active"]
        }),
        HTMLElement_39.GenerateAttributeAccessors([
            { name: "active", type: "boolean" },
            { name: "label", type: "string" },
            { name: "type", type: "string" },
            { name: "name", type: "string" },
            { name: "rows", type: "number" },
            { name: "cells", type: "number" },
        ])
    ], HTMLEMenuItemGroupElement);
    exports.HTMLEMenuItemGroupElement = HTMLEMenuItemGroupElement;
});
define("editor/elements/lib/misc/Palette", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_40) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PaletteElement = void 0;
    let PaletteElement = class PaletteElement extends HTMLElement {
        constructor() {
            super();
            HTMLElement_40.bindShadowRoot(this, /*template*/ `
            <style>
                :host {
                    display: block;
                    content: contains;
                }

               :host #container {
                    display: grid;
                    grid-template-cols: repeat(5, 1fr);
                    grid-auto-rows: 16px;
                }
            </style>
            <div id="container">
            </div>
        `);
        }
        connectedCallback() {
            const colors = this.colors;
            if (colors.length > 0) {
                this.shadowRoot.querySelector('#container').append(...colors.map((color) => {
                    const div = document.createElement('div');
                    div.setAttribute('style', `background-color: ${color}`);
                    return div;
                }));
            }
        }
    };
    PaletteElement = __decorate([
        HTMLElement_40.RegisterCustomHTMLElement({
            name: 'e-palette'
        }),
        HTMLElement_40.GenerateAttributeAccessors([{ name: 'colors', type: 'json' }])
    ], PaletteElement);
    exports.PaletteElement = PaletteElement;
});
define("editor/objects/StructuredFormData", ["require", "exports", "editor/elements/Snippets"], function (require, exports, Snippets_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StructuredFormData = void 0;
    class StructuredFormData {
        constructor(form) {
            this.form = form;
        }
        getStructuredFormData() {
            let structuredData = {};
            let formData = new FormData(this.form);
            let keys = Array.from(formData.keys());
            keys.forEach((key) => {
                let value = formData.get(key);
                if (value) {
                    Snippets_7.setPropertyFromPath(structuredData, key, JSON.parse(value.toString()));
                }
            });
            return structuredData;
        }
    }
    exports.StructuredFormData = StructuredFormData;
});
define("editor/templates/other/DraggableInputTemplate", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_41) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLDraggableInputTemplate = void 0;
    const HTMLDraggableInputTemplate = (desc) => {
        return HTMLElement_41.HTMLElementConstructor("e-draggable", {
            props: {
                id: desc.id,
                className: desc.className
            },
            children: [
                HTMLElement_41.HTMLElementConstructor("input", {
                    props: {
                        name: desc.name,
                        hidden: true
                    }
                })
            ]
        });
    };
    exports.HTMLDraggableInputTemplate = HTMLDraggableInputTemplate;
});
define("editor/templates/table/TableTemplate", ["require", "exports", "editor/elements/HTMLElement"], function (require, exports, HTMLElement_42) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLTableTemplate = void 0;
    const HTMLTableTemplate = (desc) => {
        const thead = HTMLElement_42.HTMLElementConstructor("thead", {
            children: [
                HTMLElement_42.HTMLElementConstructor("tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.headerCells.map((cell) => {
                        return HTMLElement_42.HTMLElementConstructor("th", {
                            props: {
                                scope: "col"
                            },
                            children: [
                                cell
                            ]
                        });
                    })
                })
            ]
        });
        const tbody = HTMLElement_42.HTMLElementConstructor("tbody", {
            children: desc.bodyCells.map((row) => {
                return HTMLElement_42.HTMLElementConstructor("tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: row.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return HTMLElement_42.HTMLElementConstructor("td", {
                                        children: [
                                            cell.content
                                        ]
                                    });
                                case "header":
                                    return HTMLElement_42.HTMLElementConstructor("th", {
                                        props: {
                                            scope: "row"
                                        },
                                        children: [
                                            cell.content
                                        ]
                                    });
                            }
                        }
                        else {
                            return HTMLElement_42.HTMLElementConstructor("td", {
                                children: [
                                    cell
                                ]
                            });
                        }
                    })
                });
            })
        });
        const tfoot = HTMLElement_42.HTMLElementConstructor("tfoot", {
            children: [
                HTMLElement_42.HTMLElementConstructor("tr", {
                    props: {
                        id: desc.id,
                        className: desc.className,
                    },
                    children: desc.footerCells.map((cell) => {
                        if ((typeof cell === "object") && !(cell instanceof Node) && ("type" in cell)) {
                            switch (cell.type) {
                                case "data":
                                default:
                                    return HTMLElement_42.HTMLElementConstructor("td", {
                                        children: [
                                            cell.content
                                        ]
                                    });
                                case "header":
                                    return HTMLElement_42.HTMLElementConstructor("th", {
                                        props: {
                                            scope: "row"
                                        },
                                        children: [
                                            cell.content
                                        ]
                                    });
                            }
                        }
                        else {
                            return HTMLElement_42.HTMLElementConstructor("td", {
                                children: [
                                    cell
                                ]
                            });
                        }
                    })
                })
            ]
        });
        const table = HTMLElement_42.HTMLElementConstructor("table", {
            props: {
                id: desc.id,
                className: desc.className,
            },
            children: [
                thead,
                tbody,
                tfoot
            ]
        });
        return table;
    };
    exports.HTMLTableTemplate = HTMLTableTemplate;
});
//# sourceMappingURL=index.js.map