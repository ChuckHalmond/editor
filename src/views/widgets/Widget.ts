export { Widget };
export { widgets };

declare global {
    interface WidgetNameMap {}

    interface CustomWidgetConstructor {
        new(...args: any): Widget;
    }

    interface WidgetWritablePropertiesMap {}
}

interface WidgetConstructor {
    readonly prototype: Widget;
    new(element: HTMLElement): Widget;
}

interface Widget {
    readonly element: HTMLElement;
    click(): void;
    focus(options?: FocusOptions | undefined): void;
    blur(): void;
    contains(node: Node): boolean;
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
    readonly element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }
    
    click(): void {
        this.element.click();
    }

    focus(options?: FocusOptions | undefined): void {
        this.element.focus(options);
    }

    blur(): void {
        this.element.blur();
    }

    contains(node: Node): boolean {
        return this.element.contains(node);
    }
}

var Widget: WidgetConstructor = WidgetBase;