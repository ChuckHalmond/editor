var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NodeCollectionBase_instances, _NodeCollectionBase_root, _NodeCollectionBase_filter, _NodeCollectionBase_observer, _NodeCollectionBase_observerTargets, _NodeCollectionBase_items, _NodeCollectionBase_update, _NodeCollectionBase_addObserverTargets, _NodeCollectionBase_removeObserverTargets, _NodeCollectionBase_handleAddedNodes, _NodeCollectionBase_handleRemovedNodes, _NodeCollectionBase_handleMutationRecords;
export { NodeCollection };
class NodeCollectionBase {
    constructor(root, filter) {
        _NodeCollectionBase_instances.add(this);
        _NodeCollectionBase_root.set(this, void 0);
        _NodeCollectionBase_filter.set(this, void 0);
        _NodeCollectionBase_observer.set(this, void 0);
        _NodeCollectionBase_observerTargets.set(this, void 0);
        _NodeCollectionBase_items.set(this, void 0);
        __classPrivateFieldSet(this, _NodeCollectionBase_root, root, "f");
        __classPrivateFieldSet(this, _NodeCollectionBase_filter, filter, "f");
        __classPrivateFieldSet(this, _NodeCollectionBase_items, [], "f");
        __classPrivateFieldSet(this, _NodeCollectionBase_observer, new MutationObserver(__classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_handleMutationRecords).bind(this)), "f");
        __classPrivateFieldSet(this, _NodeCollectionBase_observerTargets, [root], "f");
        __classPrivateFieldGet(this, _NodeCollectionBase_observer, "f").observe(root, {
            childList: true
        });
        __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_handleAddedNodes).call(this, root.childNodes);
    }
    get root() {
        return __classPrivateFieldGet(this, _NodeCollectionBase_root, "f");
    }
    get filter() {
        return __classPrivateFieldGet(this, _NodeCollectionBase_filter, "f");
    }
    get length() {
        return __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_update).call(this), __classPrivateFieldGet(this, _NodeCollectionBase_items, "f").length;
    }
    item(index) {
        return __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_update).call(this), __classPrivateFieldGet(this, _NodeCollectionBase_items, "f")[index];
    }
    values() {
        return __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_update).call(this), __classPrivateFieldGet(this, _NodeCollectionBase_items, "f").values();
    }
}
_NodeCollectionBase_root = new WeakMap(), _NodeCollectionBase_filter = new WeakMap(), _NodeCollectionBase_observer = new WeakMap(), _NodeCollectionBase_observerTargets = new WeakMap(), _NodeCollectionBase_items = new WeakMap(), _NodeCollectionBase_instances = new WeakSet(), _NodeCollectionBase_update = function _NodeCollectionBase_update() {
    const records = __classPrivateFieldGet(this, _NodeCollectionBase_observer, "f").takeRecords();
    if (records.length > 0) {
        __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_handleMutationRecords).call(this, records);
    }
}, _NodeCollectionBase_addObserverTargets = function _NodeCollectionBase_addObserverTargets(targets) {
    const observer = __classPrivateFieldGet(this, _NodeCollectionBase_observer, "f");
    observer.disconnect();
    __classPrivateFieldGet(this, _NodeCollectionBase_observerTargets, "f").push(...targets);
    __classPrivateFieldGet(this, _NodeCollectionBase_observerTargets, "f").forEach((group_i) => {
        observer.observe(group_i, {
            childList: true
        });
    });
}, _NodeCollectionBase_removeObserverTargets = function _NodeCollectionBase_removeObserverTargets(targets) {
    const observer = __classPrivateFieldGet(this, _NodeCollectionBase_observer, "f");
    observer.disconnect();
    __classPrivateFieldSet(this, _NodeCollectionBase_observerTargets, __classPrivateFieldGet(this, _NodeCollectionBase_observerTargets, "f").filter(target_i => !targets.includes(target_i)), "f");
    __classPrivateFieldGet(this, _NodeCollectionBase_observerTargets, "f").forEach((group_i) => {
        observer.observe(group_i, {
            childList: true
        });
    });
}, _NodeCollectionBase_handleAddedNodes = function _NodeCollectionBase_handleAddedNodes(nodes) {
    if (nodes.length > 0) {
        const filter = __classPrivateFieldGet(this, _NodeCollectionBase_filter, "f");
        const acceptNode = typeof filter === "function" ? filter : filter.acceptNode;
        const addedItems = [];
        const addedObserverTargets = [];
        nodes.forEach((node) => {
            const acceptNodeResult = acceptNode(node);
            switch (acceptNodeResult) {
                case NodeFilter.FILTER_ACCEPT: {
                    addedItems.push(node);
                    break;
                }
                case NodeFilter.FILTER_SKIP: {
                    addedObserverTargets.push(node);
                    break;
                }
            }
        });
        if (addedObserverTargets.length > 0) {
            __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_addObserverTargets).call(this, addedObserverTargets);
            addedObserverTargets.forEach((target_i) => {
                __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_handleAddedNodes).call(this, target_i.childNodes);
            });
        }
        if (addedItems.length > 0) {
            addedItems.forEach((item_i) => {
                const index = __classPrivateFieldGet(this, _NodeCollectionBase_items, "f").findIndex(item_i => item_i.compareDocumentPosition(item_i) & Node.DOCUMENT_POSITION_FOLLOWING);
                __classPrivateFieldGet(this, _NodeCollectionBase_items, "f").splice(index > -1 ? index : 0, 0, item_i);
            });
        }
    }
}, _NodeCollectionBase_handleRemovedNodes = function _NodeCollectionBase_handleRemovedNodes(nodes) {
    if (nodes.length > 0) {
        const filter = __classPrivateFieldGet(this, _NodeCollectionBase_filter, "f");
        const acceptNode = typeof filter === "function" ? filter : filter.acceptNode;
        const removedItems = [];
        const removedObserverTargets = [];
        nodes.forEach((node) => {
            const acceptNodeResult = acceptNode(node);
            switch (acceptNodeResult) {
                case NodeFilter.FILTER_ACCEPT: {
                    removedItems.push(node);
                    break;
                }
                case NodeFilter.FILTER_SKIP: {
                    removedObserverTargets.push(node);
                    break;
                }
            }
        });
        if (removedObserverTargets.length > 0) {
            __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_removeObserverTargets).call(this, removedObserverTargets);
            removedObserverTargets.forEach((target_i) => {
                __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_handleRemovedNodes).call(this, target_i.childNodes);
            });
        }
        if (removedItems.length > 0) {
            __classPrivateFieldSet(this, _NodeCollectionBase_items, __classPrivateFieldGet(this, _NodeCollectionBase_items, "f").filter(item_i => !removedItems.includes(item_i)), "f");
        }
    }
}, _NodeCollectionBase_handleMutationRecords = function _NodeCollectionBase_handleMutationRecords(mutationsList) {
    mutationsList.forEach((mutation) => {
        const { addedNodes, removedNodes } = mutation;
        __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_handleRemovedNodes).call(this, removedNodes);
        __classPrivateFieldGet(this, _NodeCollectionBase_instances, "m", _NodeCollectionBase_handleAddedNodes).call(this, addedNodes);
    });
};
var NodeCollection = NodeCollectionBase;
//# sourceMappingURL=NodeCollection.js.map