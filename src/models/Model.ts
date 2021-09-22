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
        oldItems: any[];
        newItems: any[];
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
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", {oldItems: oldItems, newItems: newItems}));
    }

    public push(...items: Item[]): number {
        const oldItems = this._items.slice();
        const result = this._items.push(...items);
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", {oldItems: oldItems, newItems: newItems}));
        return result;
    }

    public insert(index: number, ...items: Item[]): void {
        if (index >= 0 && index <= this._items.length) {
            const oldItems = this._items.slice();
            this._items.splice(index, 0, ...items);
            const newItems = this._items.slice();
            this.dispatchEvent(new Event("listmodelchange", {oldItems: oldItems, newItems: newItems}));
        }
    }

    public splice(start: number, deleteCount: number, ...items: Item[]): Item[] {
        const oldItems = this._items.slice();
        const result = this._items.splice(start, deleteCount, ...items);
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", {oldItems: oldItems, newItems: newItems}));
        return result;
    }

    public filter(predicate: (value: Item, index: number, array: Item[]) => boolean): void {
        const oldItems = this._items.slice();
        this._items = this._items.filter(predicate);
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", {oldItems: oldItems, newItems: newItems}));
    }

    public clear(): void {
        const oldItems = this._items.slice();
        this._items = [];
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", {oldItems: oldItems, newItems: newItems}));
    }
}