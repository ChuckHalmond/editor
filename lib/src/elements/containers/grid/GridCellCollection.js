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
var _HTMLEGridCellCollectionBase_instances, _HTMLEGridCellCollectionBase_walker, _HTMLEGridCellCollectionBase_nodeFilter;
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridRowGroupElement } from "./GridRowGroup";
import { HTMLEGridRowElement } from "./GridRow";
import { HTMLEGridBodyElement } from "./GridBody";
export { HTMLEGridCellCollection };
class HTMLEGridCellCollectionBase {
    constructor(root) {
        _HTMLEGridCellCollectionBase_instances.add(this);
        _HTMLEGridCellCollectionBase_walker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEGridCellCollectionBase_walker, document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEGridCellCollectionBase_instances, "m", _HTMLEGridCellCollectionBase_nodeFilter).bind(this)), "f");
    }
    get length() {
        const walker = __classPrivateFieldGet(this, _HTMLEGridCellCollectionBase_walker, "f");
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
        const walker = __classPrivateFieldGet(this, _HTMLEGridCellCollectionBase_walker, "f");
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
        const walker = __classPrivateFieldGet(this, _HTMLEGridCellCollectionBase_walker, "f");
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = walker.nextNode();
        }
        return currentNode;
    }
    *values() {
        const walker = __classPrivateFieldGet(this, _HTMLEGridCellCollectionBase_walker, "f");
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield currentNode;
            currentNode = walker.nextNode();
        }
    }
}
_HTMLEGridCellCollectionBase_walker = new WeakMap(), _HTMLEGridCellCollectionBase_instances = new WeakSet(), _HTMLEGridCellCollectionBase_nodeFilter = function _HTMLEGridCellCollectionBase_nodeFilter(node) {
    if (node instanceof HTMLEGridCellElement) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEGridBodyElement) {
        return NodeFilter.FILTER_SKIP;
    }
    if (node instanceof HTMLEGridRowGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    if (node instanceof HTMLEGridRowElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
};
var HTMLEGridCellCollection = HTMLEGridCellCollectionBase;
//# sourceMappingURL=GridCellCollection.js.map