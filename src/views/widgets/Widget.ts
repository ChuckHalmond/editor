export { Widget };
export { widgets };

declare global {
    interface WidgetNameMap {
        "unknown": Widget;
    }

    interface CustomWidgetConstructor {
        new(...args: any): Widget;
    }
}

interface WidgetConstructor {
    readonly prototype: Widget;
    new(): Widget;
}

interface Widget {
    readonly rootElement: HTMLElement;
    click(): void;
    focus(options?: FocusOptions | undefined): void;
    blur(): void;
    contains(node: Node): boolean;
    renderRoot(): HTMLElement;
}

interface WidgetRegistry {
    define(name: string, widget: WidgetConstructor): void;
    create<K extends keyof WidgetNameMap>(name: K): WidgetNameMap[K];
}

class WidgetRegistryBase implements WidgetRegistry {
    #map: Map<string, WidgetConstructor>;

    constructor() {
        this.#map = new Map();
    }

    define(name: string, widget: WidgetConstructor): void {
        this.#map.set(name, widget);
    }

    create<K extends keyof WidgetNameMap>(name: K): WidgetNameMap[K] {
        const ctor = <(new() => WidgetNameMap[K]) | undefined>this.#map.get(name);
        if (typeof ctor !== "undefined") {
            return new ctor();
        }
        else {
            throw new Error();
        }
    }
}

var widgets: WidgetRegistry = new WidgetRegistryBase();

class WidgetBase implements Widget {
    readonly rootElement: HTMLElement;

    constructor() {
        this.rootElement = this.renderRoot();
    }
    
    click(): void {
        this.rootElement.click();
    }

    focus(options?: FocusOptions | undefined): void {
        this.rootElement.focus(options);
    }

    blur(): void {
        this.rootElement.blur();
    }

    contains(node: Node): boolean {
        return this.rootElement.contains(node);
    }

    renderRoot(): HTMLElement {
        throw new Error();
    }
}

var Widget: WidgetConstructor = WidgetBase;