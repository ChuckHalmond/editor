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
    new(eventInitDict?: CustomEventInit<ObjectModelEventDetail>): ObjectModelChangeEvent;
}

interface ObjectModelChangeEvent extends CustomEvent<ObjectModelEventDetail> {
    type: "objectmodelchange";
}

class ObjectModelChangeEventBase extends CustomEvent<ObjectModelEventDetail> {
    type!: "objectmodelchange";

    constructor(eventInitDict?: CustomEventInit<ObjectModelEventDetail>) {
        super("objectmodelchange", eventInitDict);
    }
}

interface ObjectModelEventMap {
    "objectmodelchange": ObjectModelChangeEvent;
}

var ObjectModelChangeEvent: ObjectModelChangeEventConstructor = ObjectModelChangeEventBase;

interface ObjectModelConstructor {
    readonly prototype: ObjectModel;
    new(): ObjectModel;
}

interface ObjectModel extends EventTarget {
    dispatchEvent(event: Event): boolean;
    addEventListener<K extends keyof ObjectModelEventMap>(type: K, listener: (this: ObjectModel, ev: ObjectModelEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ObjectModelEventMap>(type: K, listener: (this: ObjectModel, ev: ObjectModelEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

class ObjectModelBase extends EventTarget implements ObjectModel {
    private _listmodelListeners: Map<string, EventListener>;

    constructor() {
        super();
        this._listmodelListeners = new Map();
        return new Proxy(this, {
            get: (target: this, property: string, receiver: any) => {
                const value = Reflect.get(target, property, receiver);
                return typeof value === "function" ? value.bind(target) : value;
            },
            set: (target: this, property: string, value: any, receiver: any) => {
                const oldValue = Reflect.get(target, property, receiver);
                if (oldValue instanceof ListModel) {
                    if (this._listmodelListeners.has(property)) {
                        const listmodelListener = this._listmodelListeners.get(property)!;
                        oldValue.removeEventListener("listmodelchange", listmodelListener);
                        this._listmodelListeners.delete(property);
                    }
                }
                if (value instanceof ListModel) {
                    const listmodelListener = () => {
                        target.dispatchEvent(new ObjectModelChangeEvent({detail: {property: property, oldValue: value, newValue: value}}));
                    };
                    this._listmodelListeners.set(property, listmodelListener);
                    value.addEventListener("listmodelchange", listmodelListener);
                }
                target.dispatchEvent(new ObjectModelChangeEvent({detail: {property: property, oldValue: oldValue, newValue: value}}));
                return Reflect.set(target, property, value, receiver);
            }
        });
    }
}

var ObjectModel: ObjectModelConstructor = ObjectModelBase;

interface ListModelEventDetail {
    addedItems: any[];
    removedItems: any[];
    index: number;
}

interface ListModelChangeEventConstructor {
    readonly prototype: ListModelChangeEvent;
    new(eventInitDict?: CustomEventInit<ListModelEventDetail>): ListModelChangeEvent;
}

interface ListModelChangeEvent extends Event {
    type: "listmodelchange";
    detail: ListModelEventDetail;
}

class ListModelChangeEventBase extends CustomEvent<ListModelEventDetail> {
    type!: "listmodelchange";

    constructor(eventInitDict?: CustomEventInit<ListModelEventDetail>) {
        super("listmodelchange", eventInitDict);
    }
}

var ListModelChangeEvent: ListModelChangeEventConstructor = ListModelChangeEventBase;

interface ListModelConstructor {
    readonly prototype: ListModel;
    new(): ListModel;
    new<Item>(items: Item[]): ListModel<Item>;
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

class ListModelBase<Item = any> extends EventTarget implements ListModel<Item> {
    private _items: Item[];
    
    constructor()
    constructor(items: Item[] = []) {
        super();
        this._items = items.slice();
    }

    public get(index: number): Item | undefined {
        return this._items[index];
    }

    public getAll(): Item[] {
        return this._items.slice();
    }

    public length(): number {
        return this._items.length;
    }

    public set(index: number, item: Item): void {
        if (index >= 0 && index < this._items.length) {
            this._items[index] = item;
            this.dispatchEvent(new ListModelChangeEvent({detail: {addedItems: [item], removedItems: [], index: index}}));
        }
    }

    public setAll(items: Item[]): void {
        this._items = items.slice();
    }

    public push(...items: Item[]): number {
        const newLength = this._items.push(...items);
        this.dispatchEvent(new ListModelChangeEvent({detail: {addedItems: items, removedItems: [], index: newLength - items.length}}));
        return newLength;
    }

    public pop(): Item | undefined {
        const item = this._items.pop();
        if (item) {
            this.dispatchEvent(new ListModelChangeEvent({detail: {addedItems: [], removedItems: [item], index: this._items.length}}));
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
        this.dispatchEvent(new ListModelChangeEvent({detail: {addedItems: items, removedItems: [], index: index}}));
    }

    public remove(item: Item): void {
        const itemIndex = this._items.indexOf(item);
        if (itemIndex > -1) {
            this._items.splice(itemIndex, 1);
            this.dispatchEvent(new ListModelChangeEvent({detail: {addedItems: [], removedItems: [item], index: itemIndex}}));
        }
    }

    public clear(): void {
        const removedItems = this._items.slice();
        this._items.splice(0, this._items.length);
        this.dispatchEvent(new ListModelChangeEvent({detail: {addedItems: [], removedItems: removedItems, index: 0}}));
    }
}

var ListModel: ListModelConstructor = ListModelBase;