import { EventDispatcher } from "../events/EventDispatcher";
export { GenerateObjectModelAccessors };
export { ObjectModelChangeEvent };
export { ObjectModel };
export { ObjectModelBase };
export { ListModelChangeEvent };
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
interface ObjectModel extends EventDispatcher<ObjectModelChangeEvents> {
}
declare class ObjectModelBase extends EventDispatcher<ObjectModelChangeEvents> implements ObjectModel {
    constructor();
}
interface GenerateObjectModelAccessorsDecorator {
    (args: {
        props: string[];
    }): <O extends ObjectModelBase, C extends new (...args: any[]) => O>(ctor: C) => C;
}
declare const GenerateObjectModelAccessors: GenerateObjectModelAccessorsDecorator;
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
