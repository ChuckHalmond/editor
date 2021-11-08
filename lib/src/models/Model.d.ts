export { ObjectModelChangeEvent };
export { ObjectModel };
export { ListModelChangeEvent };
export { ListModel };
interface ObjectModelEventDetail {
    property: string;
    oldValue: any;
    newValue: any;
}
interface ObjectModelChangeEventConstructor {
    readonly prototype: ObjectModelChangeEvent;
    new (eventInitDict?: CustomEventInit<ObjectModelEventDetail>): ObjectModelChangeEvent;
}
interface ObjectModelChangeEvent extends CustomEvent<ObjectModelEventDetail> {
    type: "objectmodelchange";
}
interface ObjectModelEventMap {
    "objectmodelchange": ObjectModelChangeEvent;
}
declare var ObjectModelChangeEvent: ObjectModelChangeEventConstructor;
interface ObjectModelConstructor {
    readonly prototype: ObjectModel;
    new (): ObjectModel;
}
interface ObjectModel extends EventTarget {
    dispatchEvent(event: Event): boolean;
    addEventListener<K extends keyof ObjectModelEventMap>(type: K, listener: (this: ObjectModel, ev: ObjectModelEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ObjectModelEventMap>(type: K, listener: (this: ObjectModel, ev: ObjectModelEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
declare var ObjectModel: ObjectModelConstructor;
interface ListModelEventDetail {
    addedItems: any[];
    removedItems: any[];
    index: number;
}
interface ListModelChangeEventConstructor {
    readonly prototype: ListModelChangeEvent;
    new (eventInitDict?: CustomEventInit<ListModelEventDetail>): ListModelChangeEvent;
}
interface ListModelChangeEvent extends Event {
    type: "listmodelchange";
    detail: ListModelEventDetail;
}
declare var ListModelChangeEvent: ListModelChangeEventConstructor;
interface ListModelConstructor {
    readonly prototype: ListModel;
    new (): ListModel;
    new <Item>(items: Item[]): ListModel<Item>;
}
interface ListModelEventMap {
    "listmodelchange": ListModelChangeEvent;
}
interface ListModel<Item = any> extends EventTarget {
    get(index: number): Item | undefined;
    getAll(): Item[];
    length(): number;
    set(index: number, item: Item): void;
    setAll(items: Item[]): void;
    insert(index: number, ...items: Item[]): void;
    push(...items: Item[]): number;
    pop(): Item | undefined;
    remove(item: Item): void;
    clear(): void;
    addEventListener<K extends keyof ListModelEventMap>(type: K, listener: (this: ListModel, ev: ListModelEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ListModelEventMap>(type: K, listener: (this: ListModel, ev: ListModelEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
declare var ListModel: ListModelConstructor;
