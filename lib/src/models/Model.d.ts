export { ModelChangeRecord };
export { ModelEvent };
export { ModelNode };
export { ModelObject };
export { ModelProperty };
export { ModelList };
export { ModelChangeObserverOptions };
export { ModelChangeObserver };
interface ModelChangeRecordConstructor {
    prototype: ModelChangeRecord;
    new (init: {
        target: ModelNode | ModelList;
        changeType: number;
        propertyName?: string;
        oldValue?: any;
        newValue?: any;
        removedIndex?: number;
        removedItems?: ModelNode[];
        insertedIndex?: number;
        insertedItems?: ModelNode[];
        sortedIndices?: number[];
    }): ModelChangeRecord;
    readonly PROPERTY_CHANGE: number;
    readonly LIST_REMOVE: number;
    readonly LIST_INSERT: number;
    readonly LIST_SORT: number;
}
interface ModelChangeRecord {
    readonly target: ModelNode | ModelList;
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
declare var ModelChangeRecord: ModelChangeRecordConstructor;
interface ModelNodesListConstructor {
    prototype: ModelNodesList;
    new (items: any[]): ModelNodesList;
}
interface ModelNodesList {
    get length(): number;
    item(index: number): ModelNode | null;
    values(): IterableIterator<ModelNode>;
}
declare var ModelNodesList: ModelNodesListConstructor;
interface ModelEventConstructor {
    prototype: ModelEvent;
    new (type: string): ModelEvent;
}
interface ModelEvent {
    readonly type: string;
    readonly currentTarget: ModelEventTarget | null;
    readonly target: ModelEventTarget | null;
}
declare var ModelEvent: ModelEventConstructor;
interface ModelEventTargetConstructor {
    prototype: ModelEventTarget;
    new (): ModelEventTarget;
}
interface ModelEventTarget {
    addEventListener(type: string, callback: (event: ModelEvent) => void): void;
    removeEventListener(type: string, callback: (event: ModelEvent) => void): void;
    dispatchEvent(event: ModelEvent): void;
    receiveEvent(event: ModelEvent): void;
}
declare var ModelEventTarget: ModelEventTargetConstructor;
interface ModelNodeConstructor {
    prototype: ModelNode;
    new (): ModelNode;
}
interface ModelNode extends ModelEventTarget {
    readonly parentNode: ModelNode | null;
    setParent(parentNode: ModelNode | null): void;
    getRecords(): ModelChangeRecord[];
    beginChanges(): void;
    endChanges(): void;
}
declare var ModelNode: ModelNodeConstructor;
interface ModelPropertyDecorator {
    (init?: {
        type: typeof String | typeof Number | typeof Boolean | typeof Date | typeof Object;
    }): <Model extends ModelObject>(target: Model, property: string) => void;
}
declare const ModelProperty: ModelPropertyDecorator;
interface ModelObjectConstructor {
    prototype: ModelObject;
    new (): ModelObject;
}
interface ModelObject extends ModelNode {
}
declare var ModelObject: ModelObjectConstructor;
interface ModelListConstructor {
    prototype: ModelList;
    new <Model extends ModelNode>(): ModelList<Model>;
    new <Model extends ModelNode>(items: Model[]): ModelList<Model>;
}
interface ModelList<Model extends ModelNode = ModelNode> extends ModelNode {
    readonly parentNode: ModelNode | null;
    readonly length: number;
    index(items: Model): number;
    index(items: Model, fromIndex: number): number;
    get(index: number): Model | null;
    values(): IterableIterator<Model>;
    sort(compareFunction: (item_a: any, item_b: any) => number): void;
    insert(index: number, ...items: Model[]): void;
    prepend(...items: Model[]): void;
    append(...items: Model[]): void;
    remove(item: Model): void;
    clear(): void;
}
declare var ModelList: ModelListConstructor;
interface ModelChangeObserverConstructor {
    prototype: ModelChangeObserver;
    new (callback: (records: ModelChangeRecord[]) => void): ModelChangeObserver;
}
interface ModelChangeObserver {
    observe(node: ModelNode, options: ModelChangeObserverOptions): void;
    unobserve(node: ModelNode): void;
    disconnect(): void;
}
declare type ModelChangeObserverOptions = {
    properties?: boolean;
    propertiesFilter?: string[];
    childList?: boolean;
    subtree?: boolean;
};
declare var ModelChangeObserver: ModelChangeObserverConstructor;
