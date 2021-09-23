import { EventDispatcher, Event } from "../events/EventDispatcher";

export { ObjectModelChangeEvent };
export { ObjectModel };
export { ObjectModelBase };
export { ListModelChangeEvent };
export { ListModelChangeType };
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

interface ObjectModel<Data extends object> extends EventDispatcher<ObjectModelChangeEvents> {
    readonly data: Readonly<Data>;
    set<K extends keyof Data>(key: K, value: Data[K]): void;
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
        removedItems: [index: number, items: any[]][];
        addedItems: [index: number, items: any[]][];
    };
}

interface ListModelEvents {
    "listmodelchange": ListModelChangeEvent;
}

interface ListModel<Item> extends EventDispatcher<ListModelEvents> {
    readonly items: ReadonlyArray<Item>;
    set(items: Item[]): void;
    push(...items: Item[]): number;
    insert(index: number, ...items: Item[]): void;
    splice(start: number, deleteCount: number, ...items: Item[]): Item[];
    filter(predicate: (value: Item, index: number, array: Item[]) => boolean): void;
    clear(): void;
}

class ListModelBase<Item> extends EventDispatcher<ListModelEvents> implements ListModel<Item> {
    private _items: Item[];
    
    constructor(items: Item[]) {
        super();
        this._items = items;
    }

    public get items(): ReadonlyArray<Item> {
        return this._items;
    }

    public set(items: Item[]): void {
        const oldItems = this._items.slice();
        this._items = items.slice();
        const removedItems = [[0, oldItems]];
        const addedItems = [[0, items.slice()]];
        this.dispatchEvent(new Event("listmodelchange", {removedItems: removedItems, addedItems: addedItems}));
    }

    public push(...items: Item[]): number {
        const oldItemsLength = this._items.length;
        const newLength = this._items.push(...items);
        const addedItems = [[oldItemsLength, items.slice()]];
        this.dispatchEvent(new Event("listmodelchange", {removedItems: [[]], addedItems: addedItems}));
        return newLength;
    }

    public insert(index: number, ...items: Item[]): void {
        if (index >= 0 && index <= this._items.length) {
            this._items.splice(index, 0, ...items);
            const addedItems = [[index, items.slice()]];
            this.dispatchEvent(new Event("listmodelchange", {removedItems: [[]], addedItems: addedItems}));
        }
    }

    public splice(start: number, deleteCount: number, ...items: Item[]): Item[] {
        const length = this._items.length;
        start = (start < 0) ? (start > -length) ? length - start : 0 : start;
        start = Math.min(start, length);
        
        const spliceResult = this._items.splice(start, deleteCount, ...items);
        const removedItems = [[start, spliceResult]];
        const addedItems = [[start, items.slice()]];
        
        this.dispatchEvent(new Event("listmodelchange", {removedItems: removedItems, addedItems: addedItems}));
        return spliceResult;
    }

    public filter(predicate: (value: Item, index: number, array: Item[]) => boolean): void {
        const oldItems = this._items.slice();
        this._items = this._items.filter(predicate);
        const removedItems = oldItems
            .map((item, index, array) => !predicate(item, index, array) ? [index, item] : null)
            .filter(item => item !== null);
        
        this.dispatchEvent(new Event("listmodelchange", {removedItems: removedItems, addedItems: [[]]}));
    }

    public clear(): void {
        const oldItems = this._items.slice();
        this._items = [];
        const removedItems = [[0, oldItems]];
        this.dispatchEvent(new Event("listmodelchange", {removedItems: removedItems, addedItems: [[]]}));
    }
}