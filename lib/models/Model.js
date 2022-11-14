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
var _ModelNodesListBase_items, _ModelEventBase_currentTarget, _ModelEventBase_target, _ModelEventTargetBase_callbacks, _ModelNodeBase_instances, _ModelNodeBase_parentNode, _ModelNodeBase_records, _ModelNodeBase_isRecording, _ModelNodeBase_triggerChange, _ModelNodeBase_handleRecord, _ModelObjectBase_properties, _ModelListBase_items, _ModelChangeObserverBase_instances, _ModelChangeObserverBase_callback, _ModelChangeObserverBase_records, _ModelChangeObserverBase_disconnected, _ModelChangeObserverBase_references, _ModelChangeObserverBase_trigger, _ModelChangeObserverBase_handleModelEvent;
export { ModelChangeRecord };
export { ModelEvent };
export { ModelNode };
export { ModelObject };
export { ReactiveProperty };
export { ModelList };
export { ModelChangeObserver };
class ModelChangeRecordBase {
    constructor(init) {
        this.target = init.target;
        this.changeType = init.changeType;
        this.propertyName = init.propertyName ?? null;
        this.oldValue = init.oldValue ?? undefined;
        this.newValue = init.newValue ?? undefined;
        this.removedIndex = init.removedIndex ?? 0;
        this.removedItems = new ModelNodesList(init.removedItems ?? []);
        this.insertedIndex = init.insertedIndex ?? 0;
        this.insertedItems = new ModelNodesList(init.insertedItems ?? []);
        this.sortedIndices = init.sortedIndices ?? [];
    }
    static get PROPERTY_CHANGE() {
        return 1;
    }
    static get LIST_REMOVE() {
        return 2;
    }
    static get LIST_INSERT() {
        return 3;
    }
    static get LIST_SORT() {
        return 4;
    }
    get PROPERTY_CHANGE() {
        return ModelChangeRecordBase.PROPERTY_CHANGE;
    }
    get LIST_REMOVE() {
        return ModelChangeRecordBase.LIST_REMOVE;
    }
    get LIST_INSERT() {
        return ModelChangeRecordBase.LIST_INSERT;
    }
    get LIST_SORT() {
        return ModelChangeRecordBase.LIST_SORT;
    }
}
var ModelChangeRecord = ModelChangeRecordBase;
class ModelNodesListBase {
    constructor(items) {
        _ModelNodesListBase_items.set(this, void 0);
        __classPrivateFieldSet(this, _ModelNodesListBase_items, items.slice(), "f");
    }
    get length() {
        return __classPrivateFieldGet(this, _ModelNodesListBase_items, "f").length;
    }
    item(index) {
        return __classPrivateFieldGet(this, _ModelNodesListBase_items, "f")[index] ?? null;
    }
    values() {
        return __classPrivateFieldGet(this, _ModelNodesListBase_items, "f").values();
    }
}
_ModelNodesListBase_items = new WeakMap();
var ModelNodesList = ModelNodesListBase;
class ModelEventBase {
    constructor(type) {
        _ModelEventBase_currentTarget.set(this, void 0);
        _ModelEventBase_target.set(this, void 0);
        this.type = type;
        __classPrivateFieldSet(this, _ModelEventBase_currentTarget, null, "f");
        __classPrivateFieldSet(this, _ModelEventBase_target, null, "f");
    }
    get currentTarget() {
        return __classPrivateFieldGet(this, _ModelEventBase_currentTarget, "f");
    }
    get target() {
        return __classPrivateFieldGet(this, _ModelEventBase_target, "f");
    }
}
_ModelEventBase_currentTarget = new WeakMap(), _ModelEventBase_target = new WeakMap();
ModelEventBase.ModelEventTargetAccessor = new class ModelEventTargetAccessor {
    setCurrentTarget(event, currentTarget) {
        if (event instanceof ModelEventBase) {
            __classPrivateFieldSet(event, _ModelEventBase_currentTarget, currentTarget, "f");
        }
    }
    setTarget(event, target) {
        if (event instanceof ModelEventBase) {
            __classPrivateFieldSet(event, _ModelEventBase_target, target, "f");
        }
    }
};
var ModelEventTargetAccessor = ModelEventBase.ModelEventTargetAccessor;
delete ModelEventBase.ModelEventTargetAccessor;
var ModelEvent = ModelEventBase;
class ModelEventTargetBase {
    constructor() {
        _ModelEventTargetBase_callbacks.set(this, void 0);
        __classPrivateFieldSet(this, _ModelEventTargetBase_callbacks, new Map(), "f");
    }
    receiveEvent(event) {
        const { type } = event;
        const callbacks = __classPrivateFieldGet(this, _ModelEventTargetBase_callbacks, "f").get(type);
        ModelEventTargetAccessor.setCurrentTarget(event, this);
        if (callbacks) {
            callbacks.forEach((callback_i) => {
                callback_i(event);
            });
        }
    }
    addEventListener(type, callback) {
        const callbacks = __classPrivateFieldGet(this, _ModelEventTargetBase_callbacks, "f").get(type);
        if (callbacks) {
            callbacks.push(callback);
        }
        else {
            __classPrivateFieldGet(this, _ModelEventTargetBase_callbacks, "f").set(type, [callback]);
        }
    }
    removeEventListener(type, callback) {
        const callbacks = __classPrivateFieldGet(this, _ModelEventTargetBase_callbacks, "f").get(type);
        if (callbacks) {
            const callbackIndex = callbacks.findIndex(callback_i => callback_i == callback);
            if (callbackIndex > -1) {
                callbacks.splice(callbackIndex, 1);
            }
            if (callbacks.length == 0) {
                __classPrivateFieldGet(this, _ModelEventTargetBase_callbacks, "f").delete(type);
            }
        }
    }
    dispatchEvent(event) {
        ModelEventTargetAccessor.setTarget(event, this);
        this.receiveEvent(event);
    }
}
_ModelEventTargetBase_callbacks = new WeakMap();
var ModelEventTarget = ModelEventTargetBase;
class ModelNodeBase extends ModelEventTargetBase {
    constructor() {
        super();
        _ModelNodeBase_instances.add(this);
        _ModelNodeBase_parentNode.set(this, void 0);
        _ModelNodeBase_records.set(this, void 0);
        _ModelNodeBase_isRecording.set(this, void 0);
        __classPrivateFieldSet(this, _ModelNodeBase_parentNode, null, "f");
        __classPrivateFieldSet(this, _ModelNodeBase_records, [], "f");
        __classPrivateFieldSet(this, _ModelNodeBase_isRecording, false, "f");
    }
    get parentNode() {
        return __classPrivateFieldGet(this, _ModelNodeBase_parentNode, "f");
    }
    setParent(parentNode) {
        if (parentNode !== null) {
            let isCyclicReference = parentNode == this;
            let { parentNode: ancestorNode } = parentNode;
            while (!isCyclicReference && ancestorNode !== null) {
                ({ parentNode: ancestorNode } = ancestorNode);
                isCyclicReference = ancestorNode == this;
            }
            if (!isCyclicReference) {
                __classPrivateFieldSet(this, _ModelNodeBase_parentNode, parentNode, "f");
            }
            else {
                throw new TypeError("Failed to set parent on ModelNode: circular reference detected in the hierarchy.");
            }
        }
        else {
            __classPrivateFieldSet(this, _ModelNodeBase_parentNode, null, "f");
        }
    }
    beginChanges() {
        __classPrivateFieldSet(this, _ModelNodeBase_isRecording, true, "f");
    }
    endChanges() {
        this.dispatchEvent(new ModelEvent("modelchange"));
        __classPrivateFieldGet(this, _ModelNodeBase_records, "f").splice(0);
        __classPrivateFieldSet(this, _ModelNodeBase_isRecording, false, "f");
    }
    getRecords() {
        return __classPrivateFieldGet(this, _ModelNodeBase_records, "f").slice();
    }
    receiveEvent(event) {
        super.receiveEvent(event);
        const { parentNode } = this;
        if (parentNode) {
            parentNode.receiveEvent(event);
        }
    }
}
_ModelNodeBase_parentNode = new WeakMap(), _ModelNodeBase_records = new WeakMap(), _ModelNodeBase_isRecording = new WeakMap(), _ModelNodeBase_instances = new WeakSet(), _ModelNodeBase_triggerChange = function _ModelNodeBase_triggerChange(property, oldValue, newValue) {
    const records = __classPrivateFieldGet(this, _ModelNodeBase_records, "f");
    const record = new ModelChangeRecord({
        target: this,
        changeType: ModelChangeRecord.PROPERTY_CHANGE,
        propertyName: property,
        oldValue, newValue
    });
    records.push(record);
    if (!__classPrivateFieldGet(this, _ModelNodeBase_isRecording, "f")) {
        this.dispatchEvent(new ModelEvent("modelchange"));
        records.splice(0);
    }
}, _ModelNodeBase_handleRecord = function _ModelNodeBase_handleRecord(record) {
    __classPrivateFieldGet(this, _ModelNodeBase_records, "f").push(record);
    if (!__classPrivateFieldGet(this, _ModelNodeBase_isRecording, "f")) {
        this.dispatchEvent(new ModelEvent("modelchange"));
        __classPrivateFieldGet(this, _ModelNodeBase_records, "f").splice(0);
    }
};
ModelNodeBase.ModelNodeRecordsAccessor = new class ModelNodeRecordsAccessor {
    triggerChange(node, property, oldValue, newValue) {
        if (node instanceof ModelNodeBase) {
            __classPrivateFieldGet(node, _ModelNodeBase_instances, "m", _ModelNodeBase_triggerChange).call(node, property, oldValue, newValue);
        }
    }
    handleRecord(node, record) {
        if (node instanceof ModelNodeBase) {
            __classPrivateFieldGet(node, _ModelNodeBase_instances, "m", _ModelNodeBase_handleRecord).call(node, record);
        }
    }
};
var ModelNodeRecordsAccessor = ModelNodeBase.ModelNodeRecordsAccessor;
delete ModelNodeBase.ModelNodeRecordsAccessor;
var ModelNode = ModelNodeBase;
const ReactiveProperty = function () {
    return (target, property) => {
        const { constructor } = target;
        const { prototype } = constructor;
        const setter = function (value) {
            const oldValue = ModelObjectPropertiesAccessor.getProperty(this, property);
            ModelObjectPropertiesAccessor.setProperty(this, property, value);
            if (value !== oldValue) {
                ModelNodeRecordsAccessor.triggerChange(this, property, oldValue, value);
            }
            return true;
        };
        const getter = function () {
            return ModelObjectPropertiesAccessor.getProperty(this, property);
        };
        Object.defineProperty(prototype, property, {
            set: setter,
            get: getter,
            enumerable: true
        });
    };
};
class ModelObjectBase extends ModelNodeBase {
    constructor() {
        super();
        _ModelObjectBase_properties.set(this, void 0);
        __classPrivateFieldSet(this, _ModelObjectBase_properties, new Map(), "f");
    }
}
_ModelObjectBase_properties = new WeakMap();
ModelObjectBase.ModelObjectPropertiesAccessor = new class ModelPropertiesAccessor {
    setProperty(node, property, value) {
        if (node instanceof ModelObjectBase) {
            __classPrivateFieldGet(node, _ModelObjectBase_properties, "f").set(property, value);
        }
    }
    getProperty(node, property) {
        if (node instanceof ModelObjectBase) {
            return __classPrivateFieldGet(node, _ModelObjectBase_properties, "f").get(property);
        }
    }
};
var ModelObjectPropertiesAccessor = ModelObjectBase.ModelObjectPropertiesAccessor;
delete ModelObjectBase.ModelObjectPropertiesAccessor;
var ModelObject = ModelObjectBase;
class ModelListBase extends ModelNodeBase {
    constructor(items) {
        super();
        _ModelListBase_items.set(this, void 0);
        __classPrivateFieldSet(this, _ModelListBase_items, items?.slice() ?? [], "f");
    }
    setParent(parentNode) {
        super.setParent(parentNode);
        __classPrivateFieldGet(this, _ModelListBase_items, "f").forEach((item_i) => {
            item_i.setParent(parentNode);
        });
    }
    get length() {
        return __classPrivateFieldGet(this, _ModelListBase_items, "f").length;
    }
    get(index) {
        return __classPrivateFieldGet(this, _ModelListBase_items, "f")[index] ?? null;
    }
    index(item) {
        return __classPrivateFieldGet(this, _ModelListBase_items, "f").indexOf(item);
    }
    values() {
        return __classPrivateFieldGet(this, _ModelListBase_items, "f").values();
    }
    sort(compareFunction) {
        const items = __classPrivateFieldGet(this, _ModelListBase_items, "f");
        const indexedItems = items.map((item_i, i) => {
            return {
                item: item_i,
                index: i
            };
        });
        indexedItems.sort((indexedItem_a, indexedItem_b) => {
            return compareFunction(indexedItem_a.item, indexedItem_b.item);
        });
        __classPrivateFieldSet(this, _ModelListBase_items, indexedItems.map(indexedItem_i => indexedItem_i.item), "f");
        const record = new ModelChangeRecord({
            target: this,
            changeType: ModelChangeRecord.LIST_SORT,
            sortedIndices: indexedItems.map(indexedItem_i => indexedItem_i.index)
        });
        ModelNodeRecordsAccessor.handleRecord(this, record);
    }
    prepend(...items) {
        const _items = __classPrivateFieldGet(this, _ModelListBase_items, "f");
        const { parentNode } = this;
        if (parentNode) {
            items.forEach(item_i => {
                item_i.setParent(parentNode);
            });
        }
        _items.splice(0, 0, ...items);
        const record = new ModelChangeRecord({
            target: this,
            changeType: ModelChangeRecord.LIST_INSERT,
            insertedIndex: 0,
            insertedItems: items
        });
        ModelNodeRecordsAccessor.handleRecord(this, record);
    }
    append(...items) {
        const _items = __classPrivateFieldGet(this, _ModelListBase_items, "f");
        const { length } = _items;
        const { parentNode } = this;
        if (parentNode) {
            items.forEach(item_i => {
                item_i.setParent(parentNode);
            });
        }
        _items.push(...items);
        const record = new ModelChangeRecord({
            target: this,
            changeType: ModelChangeRecord.LIST_INSERT,
            insertedIndex: length,
            insertedItems: items
        });
        ModelNodeRecordsAccessor.handleRecord(this, record);
    }
    insert(index, ...items) {
        const _items = __classPrivateFieldGet(this, _ModelListBase_items, "f");
        const { length } = _items;
        const positiveIndex = Math.abs(index);
        if (positiveIndex <= length) {
            if (index >= 0) {
                const { parentNode } = this;
                items.forEach(item_i => {
                    item_i.setParent(parentNode);
                });
                if (index < length) {
                    _items.splice(index, 0, ...items);
                }
                else {
                    _items.push(...items);
                }
            }
            else if (index < 0) {
                index = length - index;
                const { parentNode } = this;
                if (parentNode) {
                    items.forEach(item_i => {
                        item_i.setParent(parentNode);
                    });
                }
                _items.splice(index, 0, ...items);
            }
            const record = new ModelChangeRecord({
                target: this,
                changeType: ModelChangeRecord.LIST_INSERT,
                insertedIndex: index,
                insertedItems: items.slice()
            });
            ModelNodeRecordsAccessor.handleRecord(this, record);
        }
    }
    remove(item) {
        const _items = __classPrivateFieldGet(this, _ModelListBase_items, "f");
        const index = _items.indexOf(item);
        if (index > -1) {
            const item = _items.splice(index, 1)[0];
            const { parentNode } = this;
            if (parentNode) {
                item.setParent(null);
            }
            const record = new ModelChangeRecord({
                target: this,
                changeType: ModelChangeRecord.LIST_REMOVE,
                removedIndex: index,
                removedItems: [item]
            });
            ModelNodeRecordsAccessor.handleRecord(this, record);
        }
    }
    clear() {
        const items = __classPrivateFieldGet(this, _ModelListBase_items, "f");
        const { length } = items;
        if (length > 0) {
            const removedItems = items.splice(0);
            const { parentNode } = this;
            if (parentNode) {
                removedItems.forEach((removedItem_i) => {
                    removedItem_i.setParent(null);
                });
            }
            const record = new ModelChangeRecord({
                target: this,
                changeType: ModelChangeRecord.LIST_REMOVE,
                removedIndex: 0,
                removedItems: removedItems
            });
            ModelNodeRecordsAccessor.handleRecord(this, record);
        }
    }
}
_ModelListBase_items = new WeakMap();
;
var ModelList = ModelListBase;
class ModelChangeObserverBase {
    constructor(callback) {
        _ModelChangeObserverBase_instances.add(this);
        _ModelChangeObserverBase_callback.set(this, void 0);
        _ModelChangeObserverBase_records.set(this, void 0);
        _ModelChangeObserverBase_disconnected.set(this, void 0);
        _ModelChangeObserverBase_references.set(this, void 0);
        __classPrivateFieldSet(this, _ModelChangeObserverBase_callback, callback, "f");
        __classPrivateFieldSet(this, _ModelChangeObserverBase_records, [], "f");
        __classPrivateFieldSet(this, _ModelChangeObserverBase_disconnected, false, "f");
        __classPrivateFieldSet(this, _ModelChangeObserverBase_references, new WeakMap(), "f");
    }
    observe(node, options) {
        __classPrivateFieldSet(this, _ModelChangeObserverBase_disconnected, false, "f");
        const references = __classPrivateFieldGet(this, _ModelChangeObserverBase_references, "f");
        let reference = references.get(node);
        if (!reference) {
            const listener = __classPrivateFieldGet(this, _ModelChangeObserverBase_instances, "m", _ModelChangeObserverBase_handleModelEvent).bind(this);
            node.addEventListener("modelchange", listener);
            reference = { listener, options };
            references.set(node, reference);
        }
        else {
            references.set(node, reference);
        }
    }
    unobserve(node) {
        const references = __classPrivateFieldGet(this, _ModelChangeObserverBase_references, "f");
        let reference = references.get(node);
        if (reference) {
            const { listener } = reference;
            node.removeEventListener("modelchange", listener);
        }
    }
    disconnect() {
        __classPrivateFieldGet(this, _ModelChangeObserverBase_records, "f").splice(0);
        __classPrivateFieldSet(this, _ModelChangeObserverBase_disconnected, true, "f");
    }
}
_ModelChangeObserverBase_callback = new WeakMap(), _ModelChangeObserverBase_records = new WeakMap(), _ModelChangeObserverBase_disconnected = new WeakMap(), _ModelChangeObserverBase_references = new WeakMap(), _ModelChangeObserverBase_instances = new WeakSet(), _ModelChangeObserverBase_trigger = function _ModelChangeObserverBase_trigger() {
    const records = __classPrivateFieldGet(this, _ModelChangeObserverBase_records, "f").splice(0);
    if (records.length > 0) {
        __classPrivateFieldGet(this, _ModelChangeObserverBase_callback, "f").call(this, records);
    }
}, _ModelChangeObserverBase_handleModelEvent = function _ModelChangeObserverBase_handleModelEvent(event) {
    if (!__classPrivateFieldGet(this, _ModelChangeObserverBase_disconnected, "f")) {
        const { target, currentTarget } = event;
        const reference = __classPrivateFieldGet(this, _ModelChangeObserverBase_references, "f").get(currentTarget);
        if (reference) {
            const { options } = reference;
            const { properties, propertiesFilter, childList, subtree } = options;
            if (subtree) {
                if (properties && target instanceof ModelNode) {
                    if (propertiesFilter) {
                        __classPrivateFieldGet(this, _ModelChangeObserverBase_records, "f").push(...target.getRecords()
                            .filter(record_i => {
                            const { propertyName } = record_i;
                            return propertiesFilter.includes(propertyName);
                        }));
                    }
                    else {
                        __classPrivateFieldGet(this, _ModelChangeObserverBase_records, "f").push(...target.getRecords());
                    }
                    __classPrivateFieldGet(this, _ModelChangeObserverBase_instances, "m", _ModelChangeObserverBase_trigger).call(this);
                }
                else if (childList && target instanceof ModelList) {
                    __classPrivateFieldGet(this, _ModelChangeObserverBase_records, "f").push(...target.getRecords());
                    __classPrivateFieldGet(this, _ModelChangeObserverBase_instances, "m", _ModelChangeObserverBase_trigger).call(this);
                }
            }
            else if (target == currentTarget) {
                if (properties && target instanceof ModelNode) {
                    if (propertiesFilter) {
                        __classPrivateFieldGet(this, _ModelChangeObserverBase_records, "f").push(...target.getRecords()
                            .filter(record_i => {
                            const { propertyName } = record_i;
                            return propertiesFilter.includes(propertyName);
                        }));
                    }
                    else {
                        __classPrivateFieldGet(this, _ModelChangeObserverBase_records, "f").push(...target.getRecords());
                    }
                    __classPrivateFieldGet(this, _ModelChangeObserverBase_instances, "m", _ModelChangeObserverBase_trigger).call(this);
                }
                else if (childList && target instanceof ModelList) {
                    __classPrivateFieldGet(this, _ModelChangeObserverBase_records, "f").push(...target.getRecords());
                    __classPrivateFieldGet(this, _ModelChangeObserverBase_instances, "m", _ModelChangeObserverBase_trigger).call(this);
                }
            }
        }
    }
};
var ModelChangeObserver = ModelChangeObserverBase;
//# sourceMappingURL=Model.js.map