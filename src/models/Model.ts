import { EventDispatcher, Event } from "../events/EventDispatcher";

export { ObjectModelChangeEvent };
export { ObjectModel };
export { isObjectModel };
export { ObjectModelBase };
export { ListModelChangeEvent };
export { ListModelChangeType };
export { isListModel };
export { ListModel };
export { ListModelBase };

interface ObjectModelChangeEvent {
    type: "objectmodelchange";
    data: {
        property: string;
        oldValue: any;
        newValue: any;
    };
}

interface ObjectModelChangeEvents {
    "objectmodelchange": ObjectModelChangeEvent;
}

interface ObjectModel<Data extends object = object> extends EventDispatcher<ObjectModelChangeEvents> {
    readonly data: Readonly<Data>;
    set<K extends keyof Data>(key: K, value: Data[K]): void;
}

function isObjectModel(obj: any): obj is ObjectModel {
    return typeof (obj as ObjectModel) === "object" && 
        typeof (obj as ObjectModel).data === "object" &&
        typeof (obj as ObjectModel).set === "function";
}

class ObjectModelBase<Data extends object> extends EventDispatcher<ObjectModelChangeEvents> implements ObjectModel<Data> {
    private _data: Data;
    
    constructor(data: Data) {
        super();
        this._data = data;
    }

    public get data(): Readonly<Data> {
        return this._data;
    }

    public set<K extends keyof Data>(key: K, value: Data[K]): void {
        const oldValue = this._data[key];
        this._data[key] = value;
        this.dispatchEvent(new Event("objectmodelchange", {property: key, oldValue: oldValue, newValue: value}));
    }
}

type ListModelChangeType = "insert" | "remove" | "clear";

interface ListModelChangeEvent {
    type: "listmodelchange";
    data: {
        addedItems: any[];
        removedItems: any[];
        index: number;
    };
}

interface ListModelEvents {
    "listmodelchange": ListModelChangeEvent;
}

interface ListModel<Item = {}> extends EventDispatcher<ListModelEvents> {
    readonly items: ReadonlyArray<Item>;
    set(index: number, item: Item): void;
    insert(index: number, ...items: Item[]): void;
    push(...items: Item[]): number;
    pop(): Item | undefined;
    remove(item: Item): void;
    clear(): void;
}

function isListModel(obj: any): obj is ListModel {
    return typeof (obj as ListModel) === "object" && 
        Array.isArray((obj as ListModel).items) &&
        typeof (obj as ListModel).set === "function" &&
        typeof (obj as ListModel).insert === "function" &&
        typeof (obj as ListModel).push === "function" &&
        typeof (obj as ListModel).pop === "function" &&
        typeof (obj as ListModel).remove === "function" &&
        typeof (obj as ListModel).clear === "function";
}

class ListModelBase<Item> extends EventDispatcher<ListModelEvents> implements ListModel<Item> {
    private _items: Item[];
    
    constructor(items: Item[] = []) {
        super();
        this._items = items;
    }

    public get items(): ReadonlyArray<Item> {
        return this._items;
    }

    public set(index: number, item: Item): void {
        if (index >= 0 && index < this._items.length) {
            this._items[index] = item;
            this.dispatchEvent(new Event("listmodelchange", {addedItems: [item], removedItems: [], index: index}));
        }
    }

    public push(...items: Item[]): number {
        const newLength = this._items.push(...items);
        this.dispatchEvent(new Event("listmodelchange", {addedItems: items, removedItems: [], index: newLength - items.length}));
        return newLength;
    }

    public pop(): Item | undefined {
        const item = this._items.pop();
        if (item) {
            this.dispatchEvent(new Event("listmodelchange", {addedItems: [], removedItems: [item], index: this._items.length}));
        }
        return item;
    }

    public insert(index: number, ...items: Item[]): void {
        if (index > this._items.length) {
            index = this._items.length;
        }
        else if (index < 0) {
            if (index < -this._items.length) {
                index = 0;
            }
            else {
                index = this._items.length + index;
            }
        }
        this._items.splice(index, 0, ...items);
        this.dispatchEvent(new Event("listmodelchange", {addedItems: items, removedItems: [], index: index}));
    }

    public remove(item: Item): void {
        const itemIndex = this._items.indexOf(item);
        if (itemIndex > -1) {
            this._items.splice(itemIndex, 1);
            this.dispatchEvent(new Event("listmodelchange", {addedItems: [], removedItems: [item], index: itemIndex}));
        }
    }

    public clear(): void {
        const removedItems = this._items.slice();
        this._items.splice(0, this._items.length);
        this.dispatchEvent(new Event("listmodelchange", {addedItems: [], removedItems: removedItems, index: 0}));
    }
}