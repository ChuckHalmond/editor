export { Widget };

export { widgets };

declare global {
    interface WidgetNameMap {}
}

interface Widget {
    create(properties?: object): HTMLElement;
}

interface WidgetRegistry {
    define(name: string, widget: Widget): void;
    create<K extends keyof WidgetNameMap>(name: K, properties?: Parameters<WidgetNameMap[K]["create"]>[0]): ReturnType<WidgetNameMap[K]["create"]>;
}

class WidgetRegistryBase implements WidgetRegistry {
    #map: Map<string, Widget>;

    constructor() {
        this.#map = new Map();
    }

    define(name: string, widget: Widget): void {
        this.#map.set(name, widget);
    }

    create<K extends keyof WidgetNameMap>(name: K, properties?: Parameters<WidgetNameMap[K]["create"]>[0]): ReturnType<WidgetNameMap[K]["create"]> {
        const widget = this.#map.get(name);
        if (widget !== void 0) {
            return <ReturnType<WidgetNameMap[K]["create"]>>widget.create(properties);
        }
        else {
            throw new Error(`Unknown widget ${name}`);
        }
    }
}

var widgets: WidgetRegistry = new WidgetRegistryBase();