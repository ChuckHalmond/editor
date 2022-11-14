export { ModelChangeRecord };
export { ModelEvent };
export { ModelNode };
export { ModelObject };
export { ReactiveProperty };
export { ModelList };
export { ModelChangeObserverOptions };
export { ModelChangeObserver };

interface ModelChangeRecordConstructor {
    prototype: ModelChangeRecord;
    new(
        init: {
            target: ModelNode | ModelList;
            changeType: number;
            propertyName?: string;
            oldValue?: any;
            newValue?: any;
            removedIndex?: number,
            removedItems?: ModelNode[],
            insertedIndex?: number,
            insertedItems?: ModelNode[],
            sortedIndices?: number[]
        }
    ): ModelChangeRecord;
    readonly PROPERTY_CHANGE: number;
    readonly LIST_REMOVE: number;
    readonly LIST_INSERT: number;
    readonly LIST_SORT: number;
}

interface ModelChangeRecord {
    readonly target: ModelNode | ModelList
    readonly propertyName: string | null;
    readonly oldValue: any;
    readonly newValue: any;
    readonly changeType: number;
    readonly removedIndex: number;
    readonly removedItems: ModelNodesList;
    readonly insertedIndex: number;
    readonly insertedItems: ModelNodesList;
    readonly sortedIndices: number[];
    readonly PROPERTY_CHANGE: number;
    readonly LIST_REMOVE: number;
    readonly LIST_INSERT: number;
    readonly LIST_SORT: number;
}

class ModelChangeRecordBase implements ModelChangeRecord {
    readonly target: ModelNode | ModelList;
    readonly changeType: number;
    readonly propertyName: string | null;
    readonly oldValue: any;
    readonly newValue: any;
    readonly removedIndex: number;
    readonly removedItems: ModelNodesList;
    readonly insertedIndex: number;
    readonly insertedItems: ModelNodesList;
    readonly sortedIndices: number[];

    constructor(
        init: {
            target: ModelNode | ModelList;
            changeType: number;
            propertyName?: string;
            oldValue?: any;
            newValue?: any;
            removedIndex?: number,
            removedItems?: ModelNode[],
            insertedIndex?: number,
            insertedItems?: ModelNode[],
            sortedIndices?: number[]
        }
    ) {
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

    static get PROPERTY_CHANGE(): number {
        return 1;
    }

    static get LIST_REMOVE(): number {
        return 2;
    }

    static get LIST_INSERT(): number {
        return 3;
    }

    static get LIST_SORT(): number {
        return 4;
    }

    get PROPERTY_CHANGE(): number {
        return ModelChangeRecordBase.PROPERTY_CHANGE;
    }

    get LIST_REMOVE(): number {
        return ModelChangeRecordBase.LIST_REMOVE;
    }

    get LIST_INSERT(): number {
        return ModelChangeRecordBase.LIST_INSERT;
    }

    get LIST_SORT(): number {
        return ModelChangeRecordBase.LIST_SORT;
    }
}

var ModelChangeRecord: ModelChangeRecordConstructor = ModelChangeRecordBase;

interface ModelNodesListConstructor {
    prototype: ModelNodesList;
    new(items: any[]): ModelNodesList;
}

interface ModelNodesList {
    get length(): number;
    item(index: number): ModelNode | null;
    values(): IterableIterator<ModelNode>;
}

class ModelNodesListBase implements ModelNodesList {
    #items: ModelNode[];

    constructor(items: ModelNode[]) {
        this.#items = items.slice();
    }

    get length(): number {
        return this.#items.length;
    }

    item(index: number): ModelNode | null {
        return this.#items[index] ?? null;
    }

    values(): IterableIterator<ModelNode> {
        return this.#items.values();
    }
}

var ModelNodesList: ModelNodesListConstructor = ModelNodesListBase;

interface ModelEventConstructor {
    prototype: ModelEvent;
    new(type: string): ModelEvent;
}

interface ModelEvent {
    readonly type: string;
    readonly currentTarget: ModelEventTarget | null;
    readonly target: ModelEventTarget | null;
}

class ModelEventBase implements ModelEvent {
    readonly type: string;

    #currentTarget: ModelEventTarget | null;
    #target: ModelEventTarget | null;

    constructor(type: string) {
        this.type = type;
        this.#currentTarget = null;
        this.#target = null;
    }

    get currentTarget(): ModelEventTarget | null {
        return this.#currentTarget;
    }

    get target(): ModelEventTarget | null {
        return this.#target;
    }

    static ModelEventTargetAccessor? = new class ModelEventTargetAccessor {
        setCurrentTarget(event: ModelEvent, currentTarget: ModelEventTarget): void {
            if (event instanceof ModelEventBase) {
                event.#currentTarget = currentTarget;
            }
        }

        setTarget(event: ModelEvent, target: ModelEventTarget): void {
            if (event instanceof ModelEventBase) {
                event.#target = target;
            }
        }
    }
}

interface ModelEventTargetAccessor {
    setCurrentTarget(event: ModelEvent, currentTarget: ModelEventTarget): void;
    setTarget(event: ModelEvent, target: ModelEventTarget): void;
}

var ModelEventTargetAccessor: ModelEventTargetAccessor = ModelEventBase.ModelEventTargetAccessor!;
delete ModelEventBase.ModelEventTargetAccessor;

var ModelEvent: ModelEventConstructor = ModelEventBase;

interface ModelEventTargetConstructor {
    prototype: ModelEventTarget;
    new(): ModelEventTarget;
}

interface ModelEventTarget {
    addEventListener(type: string, callback: (event: ModelEvent) => void): void;
    removeEventListener(type: string, callback: (event: ModelEvent) => void): void;
    dispatchEvent(event: ModelEvent): void;
    receiveEvent(event: ModelEvent): void;
}

class ModelEventTargetBase implements ModelEventTarget {
    #callbacks: Map<string, ((event: ModelEvent) => void)[]>;

    constructor() {
        this.#callbacks = new Map();
    }

    receiveEvent(event: ModelEvent): void {
        const {type} = event;
        const callbacks = this.#callbacks.get(type);
        ModelEventTargetAccessor.setCurrentTarget(event, this);
        if (callbacks) {
            callbacks.forEach((callback_i) => {
                callback_i(event);
            });
        }
    }

    addEventListener(type: string, callback: (event: ModelEvent) => void): void {
        const callbacks = this.#callbacks.get(type);
        if (callbacks) {
            callbacks.push(callback);
        }
        else {
            this.#callbacks.set(type, [callback]);
        }
    }

    removeEventListener(type: string, callback: (event: ModelEvent) => void): void {
        const callbacks = this.#callbacks.get(type);
        if (callbacks) {
            const callbackIndex = callbacks.findIndex(
                callback_i => callback_i == callback
            );
            if (callbackIndex > -1) {
                callbacks.splice(callbackIndex, 1);
            }
            if (callbacks.length == 0) {
                this.#callbacks.delete(type);
            }
        }
    }

    dispatchEvent(event: ModelEvent): void {
        ModelEventTargetAccessor.setTarget(event, this);
        this.receiveEvent(event);
    }
}

var ModelEventTarget: ModelEventTargetConstructor = ModelEventTargetBase;

interface ModelNodeConstructor {
    prototype: ModelNode;
    new(): ModelNode;
}

interface ModelNode extends ModelEventTarget {
    readonly parentNode: ModelNode | null;
    setParent(parentNode: ModelNode | null): void;
    getRecords(): ModelChangeRecord[];
    beginChanges(): void;
    endChanges(): void;
}

interface ModelNodeRecordsAccessor {
    triggerChange(node: ModelNode, property: string, oldValue: any, newValue: any): void;
    handleRecord(node: ModelNode, record: ModelChangeRecord): void;
}

class ModelNodeBase extends ModelEventTargetBase implements ModelNode {
    #parentNode: ModelNode | null;
    #records: ModelChangeRecord[];
    #isRecording: boolean;

    constructor() {
        super();
        this.#parentNode = null;
        this.#records = [];
        this.#isRecording = false;
    }

    get parentNode(): ModelNode | null {
        return this.#parentNode;
    }

    setParent(parentNode: ModelNode | null): void {
        if (parentNode !== null) {
            let isCyclicReference = parentNode == this;
            let {parentNode: ancestorNode} = parentNode;
            while (!isCyclicReference && ancestorNode !== null) {
                ({parentNode: ancestorNode} = ancestorNode);
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
    
    beginChanges(): void {
        this.#isRecording = true;
    }

    endChanges(): void {
        this.dispatchEvent(new ModelEvent("modelchange"));
        this.#records.splice(0);
        this.#isRecording = false;
    }

    getRecords(): ModelChangeRecord[] {
        return this.#records.slice();
    }

    receiveEvent(event: ModelEvent): void {
        super.receiveEvent(event);
        const {parentNode} = this;
        if (parentNode) {
            parentNode.receiveEvent(event);
        }
    }

    #triggerChange(property: string, oldValue: any, newValue: any): void {
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

    #handleRecord(record: ModelChangeRecord): void {
        this.#records.push(record);
        if (!this.#isRecording) {
            this.dispatchEvent(new ModelEvent("modelchange"));
            this.#records.splice(0);
        }
    }

    static ModelNodeRecordsAccessor? = new class ModelNodeRecordsAccessor {
        triggerChange(node: ModelNode, property: string, oldValue: any, newValue: any): void {
            if (node instanceof ModelNodeBase) {
                node.#triggerChange(property, oldValue, newValue);
            }
        }

        handleRecord(node: ModelNode, record: ModelChangeRecord): void {
            if (node instanceof ModelNodeBase) {
                node.#handleRecord(record);
            }
        }
    }
}

var ModelNodeRecordsAccessor: ModelNodeRecordsAccessor = ModelNodeBase.ModelNodeRecordsAccessor!;
delete ModelNodeBase.ModelNodeRecordsAccessor;

var ModelNode: ModelNodeConstructor = ModelNodeBase;

interface ReactivePropertyDecorator {
    (): <Model extends ModelObject>(target: Model, property: string) => void;
}

const ReactiveProperty: ReactivePropertyDecorator = function() {
    return (
        target: ModelObject, property: string
    ) => {
        const {constructor} = target;
        const {prototype} = constructor;
        const setter = function(this: ModelObject, value: any) {
            const oldValue = ModelReactivePropertiesAccessor.getProperty(this, property);
            ModelReactivePropertiesAccessor.setProperty(this, property, value);
            if (value !== oldValue) {
                ModelNodeRecordsAccessor.triggerChange(this, property, oldValue, value);
            }
            return true;
        };
        const getter = function(this: ModelObject) {
            return ModelReactivePropertiesAccessor.getProperty(this, property);
        };
        Object.defineProperty(prototype, property, {
            set: setter,
            get: getter,
            enumerable: true
        });
    }
}

interface ModelObjectConstructor {
    prototype: ModelObject;
    new(): ModelObject;
}

interface ModelObject extends ModelNode {}

interface ModelReactivePropertiesAccessor {
    setProperty(node: ModelNode, property: string, value: any): void;
    getProperty(node: ModelNode, property: string,): any;
}

class ModelObjectBase extends ModelNodeBase implements ModelObject {
    #properties: Map<string, any>;

    constructor() {
        super();
        this.#properties = new Map();
    }

    static ModelReactivePropertiesAccessor? = new class ModelReactivePropertiesAccessor {
        setProperty(node: ModelObject, property: string, value: any): void {
            if (node instanceof ModelObjectBase) {
                node.#properties.set(property, value);
            }
        }

        getProperty(node: ModelObject, property: string): any {
            if (node instanceof ModelObjectBase) {
                return node.#properties.get(property);
            }
        }
    }
}

var ModelReactivePropertiesAccessor: ModelReactivePropertiesAccessor = ModelObjectBase.ModelReactivePropertiesAccessor!;
delete ModelObjectBase.ModelReactivePropertiesAccessor;

var ModelObject: ModelObjectConstructor = ModelObjectBase;

interface ModelListConstructor {
    prototype: ModelList;
    new<Model extends ModelNode>(): ModelList<Model>;
    new<Model extends ModelNode>(items: Model[]): ModelList<Model>;
}

interface ModelList<Model extends ModelNode = ModelNode> extends ModelNode {
    readonly parentNode: ModelNode | null;
    readonly length: number;
    index(item: Model): number;
    get(index: number): Model | null;
    values(): IterableIterator<Model>;
    sort(compareFunction: (item_a: any, item_b: any) => number): void;
    insert(index: number, ...items: Model[]): void;
    prepend(...items: Model[]): void;
    append(...items: Model[]): void;
    remove(item: Model): void;
    clear(): void;
}

class ModelListBase<Model extends ModelNode = ModelNode> extends ModelNodeBase implements ModelList<Model> {
    #items: Model[];

    constructor()
    constructor(items: Model[])
    constructor(items?: Model[]) {
        super();
        this.#items = items?.slice() ?? [];
    }

    setParent(parentNode: ModelNode | null): void {
        super.setParent(parentNode);
        this.#items.forEach((item_i) => {
            item_i.setParent(parentNode);
        });
    }

    get length(): number {
        return this.#items.length;
    }

    get(index: number): Model | null {
        return this.#items[index] ?? null;
    }

    index(item: Model): number {
        return this.#items.indexOf(item);
    }

    values(): IterableIterator<Model> {
        return this.#items.values();
    }

    sort(compareFunction: (item_a: any, item_b: any) => number): void {
        const items = this.#items;
        const indexedItems = items.map(
            (item_i, i) => {
                return {
                    item: item_i,
                    index: i
                };
            }
        );
        indexedItems.sort(
            (indexedItem_a, indexedItem_b) => {
                return compareFunction(
                    indexedItem_a.item, indexedItem_b.item
                )
            }
        );
        this.#items = indexedItems.map(indexedItem_i => indexedItem_i.item);
        const record = new ModelChangeRecord({
            target: this,
            changeType: ModelChangeRecord.LIST_SORT,
            sortedIndices: indexedItems.map(indexedItem_i => indexedItem_i.index)
        });
        ModelNodeRecordsAccessor.handleRecord(this, record);
    }

    prepend(...items: Model[]): void {
        const _items = this.#items;
        const {parentNode} = this;
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

    append(...items: Model[]): void {
        const _items = this.#items;
        const {length} = _items;
        const {parentNode} = this;
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

    insert(index: number, ...items: Model[]): void {
        const _items = this.#items;
        const {length} = _items;
        const positiveIndex = Math.abs(index);
        if (positiveIndex <= length) {
            if (index >= 0) {
                const {parentNode} = this;
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
                const {parentNode} = this;
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

    remove(item: Model): void {
        const _items = this.#items;
        const index = _items.indexOf(item);
        if (index > -1) {
            const item = _items.splice(index, 1)[0];
            const {parentNode} = this;
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

    clear(): void {
        const items = this.#items;
        const {length} = items;
        if (length > 0) {
            const removedItems = items.splice(0);
            const {parentNode} = this;
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
};

var ModelList: ModelListConstructor = ModelListBase!;

interface ModelChangeObserverConstructor {
    prototype: ModelChangeObserver;
    new(callback: (records: ModelChangeRecord[]) => void): ModelChangeObserver;
}

interface ModelChangeObserver {
    observe(node: ModelNode, options: ModelChangeObserverOptions): void;
    unobserve(node: ModelNode): void;
    disconnect(): void;
}

type ModelChangeObserverOptions = {
    properties?: boolean;
    propertiesFilter?: string[];
    childList?: boolean;
    subtree?: boolean;
}

class ModelChangeObserverBase implements ModelChangeObserver {
    #callback: (records: ModelChangeRecord[]) => void;
    #records: ModelChangeRecord[];
    #disconnected: boolean;

    #references: WeakMap<ModelNode, {
        listener: (event: ModelEvent) => void,
        options: ModelChangeObserverOptions
    }>;

    constructor(callback: (records: ModelChangeRecord[]) => void) {
        this.#callback = callback;
        this.#records = [];
        this.#disconnected = false;
        this.#references = new WeakMap();
    }

    observe(node: ModelNode, options: ModelChangeObserverOptions): void {
        this.#disconnected = false;
        const references = this.#references;
        let reference = references.get(node);
        if (!reference) {
            const listener = this.#handleModelEvent.bind(this);
            node.addEventListener("modelchange", listener);
            reference = {listener, options};
            references.set(node, reference);
        }
        else {
            references.set(node, reference);
        }
    }

    unobserve(node: ModelNode): void {
        const references = this.#references;
        let reference = references.get(node);
        if (reference) {
            const {listener} = reference;
            node.removeEventListener("modelchange", listener);
        }
    }

    disconnect(): void {
        this.#records.splice(0);
        this.#disconnected = true;
    }

    #trigger(): void {
        const records = this.#records.splice(0);
        if (records.length > 0) {
            this.#callback(records);
        }
    }

    #handleModelEvent(event: ModelEvent): void {
        if (!this.#disconnected) {
            const {target, currentTarget} = event;
            const reference = this.#references.get(<ModelNode>currentTarget);
            if (reference) {
                const {options} = reference;
                const {properties, propertiesFilter, childList, subtree} = options;
                if (subtree) {
                    if (properties && target instanceof ModelNode) {
                        if (propertiesFilter) {
                            this.#records.push(
                                ...target.getRecords()
                                    .filter(record_i => {
                                        const {propertyName} = record_i;
                                        return propertiesFilter.includes(
                                            propertyName!
                                        )
                                    })
                            );
                        }
                        else {
                            this.#records.push(
                                ...target.getRecords()
                            );
                        }
                        this.#trigger();
                    }
                    else if (childList && target instanceof ModelList) {
                        this.#records.push(
                            ...target.getRecords()
                        );
                        this.#trigger();
                    }
                }
                else if (target == currentTarget) {
                    if (properties && target instanceof ModelNode) {
                        if (propertiesFilter) {
                            this.#records.push(
                                ...target.getRecords()
                                    .filter(record_i => {
                                        const {propertyName} = record_i;
                                        return propertiesFilter.includes(
                                            propertyName!
                                        )
                                    })
                            );
                        }
                        else {
                            this.#records.push(
                                ...target.getRecords()
                            );
                        }
                        this.#trigger();
                    }
                    else if (childList && target instanceof ModelList) {
                        this.#records.push(
                            ...target.getRecords()
                        );
                        this.#trigger();
                    }
                }
            }
        }
    }
}

var ModelChangeObserver: ModelChangeObserverConstructor = ModelChangeObserverBase;