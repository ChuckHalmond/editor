var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _HTMLEGridRowCollectionBase_instances, _HTMLEGridRowCollectionBase_walker, _HTMLEGridRowCollectionBase_nodeFilter;
import { HTMLEGridRowGroupElement } from "./GridRowGroup";
import { HTMLEGridRowElement } from "./GridRow";
import { HTMLEGridBodyElement } from "./GridBody";
export { HTMLEGridRowCollection };
class HTMLEGridRowCollectionBase {
    constructor(root) {
        _HTMLEGridRowCollectionBase_instances.add(this);
        _HTMLEGridRowCollectionBase_walker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEGridRowCollectionBase_walker, document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEGridRowCollectionBase_instances, "m", _HTMLEGridRowCollectionBase_nodeFilter).bind(this)), "f");
    }
    get length() {
        const walker = __classPrivateFieldGet(this, _HTMLEGridRowCollectionBase_walker, "f");
        walker.currentNode = walker.root;
        let length = 0;
        while (walker.nextNode() !== null)
            length++;
        return length;
    }
    item(index) {
        if (index < 0) {
            return null;
        }
        const walker = __classPrivateFieldGet(this, _HTMLEGridRowCollectionBase_walker, "f");
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        let i = 0;
        while (i < index && currentNode !== null) {
            currentNode = walker.nextNode();
            i++;
        }
        return currentNode;
    }
    namedItem(name) {
        if (!name) {
            return null;
        }
        const walker = __classPrivateFieldGet(this, _HTMLEGridRowCollectionBase_walker, "f");
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = walker.nextNode();
        }
        return currentNode;
    }
    *values() {
        const walker = __classPrivateFieldGet(this, _HTMLEGridRowCollectionBase_walker, "f");
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield currentNode;
            currentNode = walker.nextNode();
        }
    }
}
_HTMLEGridRowCollectionBase_walker = new WeakMap(), _HTMLEGridRowCollectionBase_instances = new WeakSet(), _HTMLEGridRowCollectionBase_nodeFilter = function _HTMLEGridRowCollectionBase_nodeFilter(node) {
    if (node instanceof HTMLEGridRowElement) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEGridBodyElement || node instanceof HTMLEGridRowGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
};
var HTMLEGridRowCollection = HTMLEGridRowCollectionBase;
//# sourceMappingURL=GridRowCollection.js.map