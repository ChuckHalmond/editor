import { EventDispatcher } from "../events/EventDispatcher";
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
    new (): ObjectModel;
}
interface ObjectModel extends EventDispatcher {
}
declare class ObjectModelBase extends EventDispatcher implements ObjectModel {
    constructor();
}
interface GenerateObjectModelAccessorsDecorator {
    (props: string[]): <O extends ObjectModelBase, C extends new (...args: any[]) => O>(ctor: C) => C;
}
declare const GenerateObjectModelAccessors: GenerateObjectModelAccessorsDecorator;
declare var ObjectModel: ObjectModelConstructor;
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
    new (): ListModel;
    new <Item>(items: Item[]): ListModel;
}
interface ListModel<Item = {}> extends EventDispatcher {
    readonly items: ReadonlyArray<Item>;
    set(index: number, item: Item): void;
    insert(index: number, ...items: Item[]): void;
    push(...items: Item[]): number;
    pop(): Item | undefined;
    remove(item: Item): void;
    clear(): void;
}
declare var ListModel: ListModelConstructor;
