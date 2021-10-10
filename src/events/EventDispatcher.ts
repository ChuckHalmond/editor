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
    new<D extends object>(type: string, data: D): Event<D>;
}

class EventBase<D extends object = object> implements Event<D> {
    readonly type: string;
    readonly data: D;

    constructor(type: string, data: D) {
        this.type = type;
        this.data = data;
    }
}

var Event: EventConstructor = EventBase;

type EventHandler<E extends Event> = (event: E) => void;

interface EventListener<E extends Event = Event> {
    handler: EventHandler<E>;
    once?: boolean;
}

declare global {
    interface EventsMap {}
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
    new(): EventDispatcher;
}

class EventDispatcherBase implements EventDispatcher {
    private _listeners: Map<string, EventListener<any>[]>;

    constructor() {
        this._listeners = new Map();
    }

    public addEventListener<K extends keyof EventsMap>(event: K, handler: (event: EventsMap[K]) => void, once?: boolean): (event: EventsMap[K]) => void;
    public addEventListener(event: string, handler: (event: Event) => void, once?: boolean): (event: Event) => void {
        let listeners = this._listeners.get(event);
        let newListener: EventListener<any> = {
            handler: handler,
            once: once
        };
        
        if (typeof listeners === "undefined") {
            this._listeners.set(event, [newListener]);
        }
        else if (!listeners.find(listener => listener.handler === handler && listener.once === once)) {
            listeners.push(newListener);
        }

        return handler;
    }

    public removeEventListener<K extends keyof EventsMap>(event: K, handler: (event: EventsMap[K]) => void, once?: boolean): number;
    public removeEventListener(event: string, handler: (event: Event) => void, once?: boolean): number {
        let listeners = this._listeners.get(event);
        if (typeof listeners !== "undefined") {
            const count = listeners.length;
            const idx = listeners.findIndex(listener => listener.handler === handler && listener.once === once);
            if (idx > -1) {
                if (count > 1) {
                    listeners[idx] = listeners.pop()!;
                    return count - 1;
                }
                else {
                    this._listeners.delete(event.toString());
                    return 0;
                }
            }
        }
        return -1;
    }

    public dispatchEvent<K extends keyof EventsMap>(event: EventsMap[K]): void;
    public dispatchEvent(event: Event): void {
        let listeners = this._listeners.get(event.type);
        if (typeof listeners !== "undefined") {
            listeners = listeners.filter((listener) => {
                listener.handler(event);
                return !listener.once
            });
            if (listeners.length === 0) {
                this._listeners.delete(event.type);
            }
        }
    }
}

const EventDispatcher: EventDispatcherConstructor = EventDispatcherBase;