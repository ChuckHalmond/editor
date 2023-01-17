export { ModelChangeRecord };
export { ModelEvent };
export { ModelNode };
export { ModelObject };
export { ReactiveProperty };
export { ModelList };
export { ModelChangeObserver };
class ModelChangeRecordBase {
    target;
    changeType;
    propertyName;
    oldValue;
    newValue;
    removedIndex;
    removedItems;
    insertedIndex;
    insertedItems;
    sortedIndices;
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
    #items;
    constructor(items) {
        this.#items = items.slice();
    }
    get length() {
        return this.#items.length;
    }
    item(index) {
        return this.#items[index] ?? null;
    }
    values() {
        return this.#items.values();
    }
}
var ModelNodesList = ModelNodesListBase;
class ModelEventBase {
    type;
    #currentTarget;
    #target;
    constructor(type) {
        this.type = type;
        this.#currentTarget = null;
        this.#target = null;
    }
    get currentTarget() {
        return this.#currentTarget;
    }
    get target() {
        return this.#target;
    }
    static ModelEventTargetAccessor = new class ModelEventTargetAccessor {
        setCurrentTarget(event, currentTarget) {
            if (event instanceof ModelEventBase) {
                event.#currentTarget = currentTarget;
            }
        }
        setTarget(event, target) {
            if (event instanceof ModelEventBase) {
                event.#target = target;
            }
        }
    };
}
var ModelEventTargetAccessor = ModelEventBase.ModelEventTargetAccessor;
delete ModelEventBase.ModelEventTargetAccessor;
var ModelEvent = ModelEventBase;
class ModelEventTargetBase {
    #callbacks;
    constructor() {
        this.#callbacks = new Map();
    }
    receiveEvent(event) {
        const { type } = event;
        const callbacks = this.#callbacks.get(type);
        ModelEventTargetAccessor.setCurrentTarget(event, this);
        if (callbacks) {
            callbacks.forEach((callback_i) => {
                callback_i(event);
            });
        }
    }
    addEventListener(type, callback) {
        const callbacks = this.#callbacks.get(type);
        if (callbacks) {
            callbacks.push(callback);
        }
        else {
            this.#callbacks.set(type, [callback]);
        }
    }
    removeEventListener(type, callback) {
        const callbacks = this.#callbacks.get(type);
        if (callbacks) {
            const callbackIndex = callbacks.findIndex(callback_i => callback_i == callback);
            if (callbackIndex > -1) {
                callbacks.splice(callbackIndex, 1);
            }
            if (callbacks.length == 0) {
                this.#callbacks.delete(type);
            }
        }
    }
    dispatchEvent(event) {
        ModelEventTargetAccessor.setTarget(event, this);
        this.receiveEvent(event);
    }
}
var ModelEventTarget = ModelEventTargetBase;
class ModelNodeBase extends ModelEventTargetBase {
    #parentNode;
    #records;
    #isRecording;
    constructor() {
        super();
        this.#parentNode = null;
        this.#records = [];
        this.#isRecording = false;
    }
    get parentNode() {
        return this.#parentNode;
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
                this.#parentNode = parentNode;
            }
            else {
                throw new TypeError("Failed to set parent on ModelNode: circular reference detected in the hierarchy.");
            }
        }
        else {
            this.#parentNode = null;
        }
    }
    beginChanges() {
        this.#isRecording = true;
    }
    endChanges() {
        this.dispatchEvent(new ModelEvent("modelchange"));
        this.#records.splice(0);
        this.#isRecording = false;
    }
    getRecords() {
        return this.#records.slice();
    }
    receiveEvent(event) {
        super.receiveEvent(event);
        const { parentNode } = this;
        if (parentNode) {
            parentNode.receiveEvent(event);
        }
    }
    #triggerChange(property, oldValue, newValue) {
        const records = this.#records;
        const record = new ModelChangeRecord({
            target: this,
            changeType: ModelChangeRecord.PROPERTY_CHANGE,
            propertyName: property,
            oldValue, newValue
        });
        records.push(record);
        if (!this.#isRecording) {
            this.dispatchEvent(new ModelEvent("modelchange"));
            records.splice(0);
        }
    }
    #handleRecord(record) {
        this.#records.push(record);
        if (!this.#isRecording) {
            this.dispatchEvent(new ModelEvent("modelchange"));
            this.#records.splice(0);
        }
    }
    static ModelNodeRecordsAccessor = new class ModelNodeRecordsAccessor {
        triggerChange(node, property, oldValue, newValue) {
            if (node instanceof ModelNodeBase) {
                node.#triggerChange(property, oldValue, newValue);
            }
        }
        handleRecord(node, record) {
            if (node instanceof ModelNodeBase) {
                node.#handleRecord(record);
            }
        }
    };
}
var ModelNodeRecordsAccessor = ModelNodeBase.ModelNodeRecordsAccessor;
delete ModelNodeBase.ModelNodeRecordsAccessor;
var ModelNode = ModelNodeBase;
const ReactiveProperty = function () {
    return (target, property) => {
        const { constructor } = target;
        const { prototype } = constructor;
        const setter = function (value) {
            const oldValue = ModelReactivePropertiesAccessor.getProperty(this, property);
            ModelReactivePropertiesAccessor.setProperty(this, property, value);
            if (value !== oldValue) {
                ModelNodeRecordsAccessor.triggerChange(this, property, oldValue, value);
            }
            return true;
        };
        const getter = function () {
            return ModelReactivePropertiesAccessor.getProperty(this, property);
        };
        Object.defineProperty(prototype, property, {
            set: setter,
            get: getter,
            enumerable: true
        });
    };
};
class ModelObjectBase extends ModelNodeBase {
    #properties;
    constructor() {
        super();
        this.#properties = new Map();
    }
    static ModelReactivePropertiesAccessor = new class ModelReactivePropertiesAccessor {
        setProperty(node, property, value) {
            if (node instanceof ModelObjectBase) {
                node.#properties.set(property, value);
            }
        }
        getProperty(node, property) {
            if (node instanceof ModelObjectBase) {
                return node.#properties.get(property);
            }
        }
    };
}
var ModelReactivePropertiesAccessor = ModelObjectBase.ModelReactivePropertiesAccessor;
delete ModelObjectBase.ModelReactivePropertiesAccessor;
var ModelObject = ModelObjectBase;
class ModelListBase extends ModelNodeBase {
    #items;
    constructor(items) {
        super();
        this.#items = items?.slice() ?? [];
    }
    setParent(parentNode) {
        super.setParent(parentNode);
        this.#items.forEach((item_i) => {
            item_i.setParent(parentNode);
        });
    }
    get length() {
        return this.#items.length;
    }
    get(index) {
        return this.#items[index] ?? null;
    }
    index(item) {
        return this.#items.indexOf(item);
    }
    values() {
        return this.#items.values();
    }
    sort(compareFunction) {
        const items = this.#items;
        const indexedItems = items.map((item_i, i) => {
            return {
                item: item_i,
                index: i
            };
        });
        indexedItems.sort((indexedItem_a, indexedItem_b) => {
            return compareFunction(indexedItem_a.item, indexedItem_b.item);
        });
        this.#items = indexedItems.map(indexedItem_i => indexedItem_i.item);
        const record = new ModelChangeRecord({
            target: this,
            changeType: ModelChangeRecord.LIST_SORT,
            sortedIndices: indexedItems.map(indexedItem_i => indexedItem_i.index)
        });
        ModelNodeRecordsAccessor.handleRecord(this, record);
    }
    prepend(...items) {
        const _items = this.#items;
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
        const _items = this.#items;
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
        const _items = this.#items;
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
        const _items = this.#items;
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
        const items = this.#items;
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
;
var ModelList = ModelListBase;
class ModelChangeObserverBase {
    #callback;
    #records;
    #disconnected;
    #references;
    constructor(callback) {
        this.#callback = callback;
        this.#records = [];
        this.#disconnected = false;
        this.#references = new WeakMap();
    }
    observe(node, options) {
        this.#disconnected = false;
        const references = this.#references;
        let reference = references.get(node);
        if (!reference) {
            const listener = this.#handleModelEvent.bind(this);
            node.addEventListener("modelchange", listener);
            reference = { listener, options };
            references.set(node, reference);
        }
        else {
            references.set(node, reference);
        }
    }
    unobserve(node) {
        const references = this.#references;
        let reference = references.get(node);
        if (reference) {
            const { listener } = reference;
            node.removeEventListener("modelchange", listener);
        }
    }
    disconnect() {
        this.#records.splice(0);
        this.#disconnected = true;
    }
    #trigger() {
        const records = this.#records.splice(0);
        if (records.length > 0) {
            this.#callback(records);
        }
    }
    #handleModelEvent(event) {
        if (!this.#disconnected) {
            const { target, currentTarget } = event;
            const reference = this.#references.get(currentTarget);
            if (reference) {
                const { options } = reference;
                const { properties, propertiesFilter, childList, subtree } = options;
                if (subtree) {
                    if (properties && target instanceof ModelNode) {
                        if (propertiesFilter) {
                            this.#records.push(...target.getRecords()
                                .filter(record_i => {
                                const { propertyName } = record_i;
                                return propertiesFilter.includes(propertyName);
                            }));
                        }
                        else {
                            this.#records.push(...target.getRecords());
                        }
                        this.#trigger();
                    }
                    else if (childList && target instanceof ModelList) {
                        this.#records.push(...target.getRecords());
                        this.#trigger();
                    }
                }
                else if (target == currentTarget) {
                    if (properties && target instanceof ModelNode) {
                        if (propertiesFilter) {
                            this.#records.push(...target.getRecords()
                                .filter(record_i => {
                                const { propertyName } = record_i;
                                return propertiesFilter.includes(propertyName);
                            }));
                        }
                        else {
                            this.#records.push(...target.getRecords());
                        }
                        this.#trigger();
                    }
                    else if (childList && target instanceof ModelList) {
                        this.#records.push(...target.getRecords());
                        this.#trigger();
                    }
                }
            }
        }
    }
}
var ModelChangeObserver = ModelChangeObserverBase;
//# sourceMappingURL=Model.js.map