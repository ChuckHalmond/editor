export { EventBase };
export { Event };
export { EventDispatcher };
export { EventDispatcherBase };
interface Event<D extends object = object> {
    readonly type: string;
    readonly data: D;
}
interface EventConstructor {
    readonly prototype: Event;
    new <D extends object>(type: string, data: D): Event<D>;
}
declare class EventBase<D extends object = object> implements Event<D> {
    readonly type: string;
    readonly data: D;
    constructor(type: string, data: D);
}
declare var Event: EventConstructor;
declare global {
    interface EventsMap {
    }
}
interface EventDispatcher {
    addEventListener<K extends keyof EventsMap>(event: K, handler: (event: EventsMap[K]) => void, once?: boolean): (event: EventsMap[K]) => void;
    addEventListener(event: string, handler: (event: Event) => void, once?: boolean): (event: Event) => void;
    removeEventListener<K extends keyof EventsMap>(event: K, handler: (event: EventsMap[K]) => void, once?: boolean): number;
    removeEventListener(event: string, handler: (event: Event) => void, once?: boolean): number;
    dispatchEvent<K extends keyof EventsMap>(event: EventsMap[K]): void;
    dispatchEvent(event: Event): void;
}
interface EventDispatcherConstructor {
    readonly prototype: EventDispatcher;
    new (): EventDispatcher;
}
declare class EventDispatcherBase implements EventDispatcher {
    private _listeners;
    constructor();
    addEventListener<K extends keyof EventsMap>(event: K, handler: (event: EventsMap[K]) => void, once?: boolean): (event: EventsMap[K]) => void;
    removeEventListener<K extends keyof EventsMap>(event: K, handler: (event: EventsMap[K]) => void, once?: boolean): number;
    dispatchEvent<K extends keyof EventsMap>(event: EventsMap[K]): void;
}
declare const EventDispatcher: EventDispatcherConstructor;
