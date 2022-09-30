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
var _HTMLEListItemCollectionBase_instances, _HTMLEListItemCollectionBase_walker, _HTMLEListItemCollectionBase_nodeFilter;
import { HTMLEListItemElement } from "./ListItem";
import { HTMLEListItemGroupElement } from "./ListItemGroup";
export { HTMLEListItemCollection };
class HTMLEListItemCollectionBase {
    constructor(root) {
        _HTMLEListItemCollectionBase_instances.add(this);
        _HTMLEListItemCollectionBase_walker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEListItemCollectionBase_walker, document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEListItemCollectionBase_instances, "m", _HTMLEListItemCollectionBase_nodeFilter).bind(this)), "f");
    }
    get length() {
        const walker = __classPrivateFieldGet(this, _HTMLEListItemCollectionBase_walker, "f");
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
        const walker = __classPrivateFieldGet(this, _HTMLEListItemCollectionBase_walker, "f");
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
        const walker = __classPrivateFieldGet(this, _HTMLEListItemCollectionBase_walker, "f");
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null && !(currentNode.name == name)) {
            currentNode = walker.nextNode();
        }
        return currentNode;
    }
    *values() {
        const walker = __classPrivateFieldGet(this, _HTMLEListItemCollectionBase_walker, "f");
        walker.currentNode = walker.root;
        let currentNode = walker.nextNode();
        while (currentNode !== null) {
            yield currentNode;
            currentNode = walker.nextNode();
        }
    }
}
_HTMLEListItemCollectionBase_walker = new WeakMap(), _HTMLEListItemCollectionBase_instances = new WeakSet(), _HTMLEListItemCollectionBase_nodeFilter = function _HTMLEListItemCollectionBase_nodeFilter(node) {
    if (node instanceof HTMLEListItemElement) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEListItemGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
};
var HTMLEListItemCollection = HTMLEListItemCollectionBase;
//# sourceMappingURL=ListItemCollection.js.map