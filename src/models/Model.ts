import { EventDispatcher, Event } from "../events/EventDispatcher";

export { GenerateObjectModelAccessors };
export { ObjectModelChangeEvent };
export { ObjectModel };
export { ListModelChangeEvent };
export { ListModel };

interface ObjectModelChangeEvent {
    type: "objectmodelchange";
    data: {
        property: string;
        oldValue: any;
        newValue: any;
    };
}

declare global {
    interface EventsMap {
        "objectmodelchange": ObjectModelChangeEvent;
    }
}

interface ObjectModelConstructor {
    readonly prototype: ObjectModel;
    new(): ObjectModel;
}

interface ObjectModel extends EventDispatcher {}

class ObjectModelBase extends EventDispatcher implements ObjectModel {
    constructor() {
        super();
    }
}

interface GenerateObjectModelAccessorsDecorator {
    (props: string[]): <O extends ObjectModelBase, C extends new(...args: any[]) => O>(ctor: C) => C
}

const GenerateObjectModelAccessors: GenerateObjectModelAccessorsDecorator = function(props: string[]) {
    return <O extends ObjectModelBase, C extends new(...args: any[]) => O>(ctor: C) => {
        const properties = props.reduce(
            (obj, prop) => {
                return {
                    ...obj,
                    [prop]: {
                        enumerable: true,
                        get: function(this: ObjectModelBase) {
                            return (this as {[key: string]: any})[`_${prop}`];
                        },
                        set: function(this: ObjectModelBase, value: any) {
                            const oldValue = (this as {[key: string]: any})[`_${prop}`];
                            (this as {[key: string]: any})[`_${prop}`] = value;
                            this.dispatchEvent(new Event("objectmodelchange", {property: prop, oldValue: oldValue, newValue: value}));
                        }
                    }
                }
            }, {}
        );
        Object.defineProperties(ctor.prototype, properties);
        return ctor;
    }
}

var ObjectModel: ObjectModelConstructor = ObjectModelBase;

interface ListModelChangeEvent {
    type: "listmodelchange";
    data: {
        addedItems: any[];
        removedItems: any[];
        index: number;
    };
}

declare global {
    interface EventsMap {
        "listmodelchange": ListModelChangeEvent;
    }
}

interface ListModelConstructor {
    readonly prototype: ListModel;
    new<Item>(): ListModel<Item>;
    new<Item>(items: Item[]): ListModel<Item>;
}

interface ListModel<Item = any> extends EventDispatcher {
    readonly items: ReadonlyArray<Item>;
    set(index: number, item: Item): void;
    insert(index: number, ...items: Item[]): void;
    push(...items: Item[]): number;
    pop(): Item | undefined;
    remove(item: Item): void;
    clear(): void;
}

class ListModelBase<Item = any> extends EventDispatcher implements ListModel<Item> {
    private _items: Item[];
    
    constructor()
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

var ListModel: ListModelConstructor = ListModelBase;