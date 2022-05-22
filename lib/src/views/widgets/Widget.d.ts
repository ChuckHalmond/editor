export { Widget };
export { widgets };
declare global {
    interface WidgetNameMap {
    }
    interface CustomWidgetConstructor {
        new (...args: any): Widget;
    }
    interface WidgetWritablePropertiesMap {
    }
}
interface WidgetConstructor {
    readonly prototype: Widget;
    new (element: HTMLElement): Widget;
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
declare var widgets: WidgetRegistry;
declare var Widget: WidgetConstructor;
