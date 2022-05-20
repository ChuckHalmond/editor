export { Widget };
export { widgets };
declare global {
    interface WidgetNameMap {
        "unknown": Widget;
    }
    interface WidgetConstructor {
        readonly prototype: Widget;
        new (): Widget;
        new <Element extends HTMLElement>(): Widget<Element>;
    }
    interface CustomWidgetConstructor {
        new (...args: any): Widget;
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
declare var widgets: WidgetRegistry;
declare var Widget: WidgetConstructor;
