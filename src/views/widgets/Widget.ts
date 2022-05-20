export { Widget };
export { widgets };

declare global {
    interface WidgetNameMap {
        "unknown": Widget;
    }

    interface WidgetConstructor {
        readonly prototype: Widget;
        new(): Widget;
        new<Element extends HTMLElement>(): Widget<Element>;
    }

    interface CustomWidgetConstructor {
        new(...args: any): Widget;
    }
}

interface Widget<Element extends HTMLElement = HTMLElement> {
    readonly element: Element;
    click(): void;
    focus(options?: FocusOptions | undefined): void;
    blur(): void;
    contains(node: Node): boolean;
    render(): Element;
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
        console.log(name);
        this.#map.set(name, widget);
    }

    create<K extends keyof WidgetNameMap>(name: K): WidgetNameMap[K] {
        const ctor = <(new() => WidgetNameMap[K]) | undefined>this.#map.get(name);
        console.log(ctor);
        if (typeof ctor !== "undefined") {
            return new ctor();
        }
        else {
            throw new Error();
        }
    }
}

var widgets: WidgetRegistry = new WidgetRegistryBase();

class WidgetBase<Element extends HTMLElement = HTMLElement> implements Widget<Element> {
    readonly element: Element;

    constructor() {
        this.element = this.render();
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

    render(): Element {
        throw new Error();
    }
}

var Widget: WidgetConstructor = WidgetBase;