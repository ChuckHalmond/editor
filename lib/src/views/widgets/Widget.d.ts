export { Widget };
export { widgets };
declare global {
    interface WidgetNameMap {
        "unknown": Widget;
    }
    interface CustomWidgetConstructor {
        new (...args: any): Widget;
    }
}
interface WidgetConstructor {
    readonly prototype: Widget;
    new (): Widget;
}
interface Widget {
    readonly rootElement: HTMLElement;
    click(): void;
    focus(options?: FocusOptions | undefined): void;
    blur(): void;
    contains(node: Node): boolean;
    render(): HTMLElement;
}
interface WidgetRegistry {
    define(name: string, widget: WidgetConstructor): void;
    create<K extends keyof WidgetNameMap>(name: K): WidgetNameMap[K];
}
declare var widgets: WidgetRegistry;
declare var Widget: WidgetConstructor;
