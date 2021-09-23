import { EventDispatcher } from "../events/EventDispatcher";
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
declare class ObjectModelBase<Data extends object> extends EventDispatcher<ObjectModelChangeEvents> implements ObjectModel<Data> {
    private _data;
    constructor(data?: Data);
    get data(): Readonly<Data>;
    set<K extends keyof Data>(key: K, value: Data[K]): void;
}
declare type ListModelChangeType = "insert" | "remove" | "clear";
interface ListModelChangeEvent {
    type: "listmodelchange";
    data: {
        index: number;
        removedItems: any[];
        addedItems: any[];
    };
}
interface ListModelEvents {
    "listmodelchange": ListModelChangeEvent;
}
interface ListModel<Item> extends EventDispatcher<ListModelEvents> {
    readonly items: ReadonlyArray<Item>;
    set(index: number, item: Item): void;
    insert(index: number, ...items: Item[]): void;
    push(...items: Item[]): number;
    pop(): Item | undefined;
    remove(item: Item): void;
    clear(): void;
}
declare class ListModelBase<Item> extends EventDispatcher<ListModelEvents> implements ListModel<Item> {
    private _items;
    constructor(items?: Item[]);
    get items(): ReadonlyArray<Item>;
    set(index: number, item: Item): void;
    push(...items: Item[]): number;
    pop(): Item | undefined;
    insert(index: number, ...items: Item[]): void;
    remove(item: Item): void;
    clear(): void;
}
