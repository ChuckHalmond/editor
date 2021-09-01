export { EventBase };
export { Event };
export { EventDispatcher };
export { EventDispatcherBase };
class EventBase {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
var Event = EventBase;
class EventDispatcherBase {
    constructor() {
        this._listeners = new Map();
    }
    addEventListener(event, handler, once) {
        let listeners = this._listeners.get(event.toString());
        let newListener = {
            handler: handler,
            once: once
        };
        if (typeof listeners === "undefined") {
            this._listeners.set(event.toString(), [newListener]);
        }
        else if (!listeners.find(listener => listener.handler === handler && listener.once === once)) {
            listeners.push(newListener);
        }
        return handler;
    }
    removeEventListener(event, handler, once) {
        let listeners = this._listeners.get(event);
        if (typeof listeners !== "undefined") {
            const count = listeners.length;
            const idx = listeners.findIndex(listener => listener.handler === handler && listener.once === once);
            if (idx > -1) {
                if (count > 1) {
                    listeners[idx] = listeners.pop();
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
    dispatchEvent(event) {
        let listeners = this._listeners.get(event.type);
        if (typeof listeners !== 'undefined') {
            listeners = listeners.filter((listener) => {
                listener.handler(event);
                return !listener.once;
            });
            if (listeners.length === 0) {
                this._listeners.delete(event.type);
            }
        }
    }
}
const EventDispatcher = EventDispatcherBase;
//# sourceMappingURL=EventDispatcher.js.map