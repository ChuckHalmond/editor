export { Widget };
export { widgets };
declare global {
    interface WidgetNameMap {
    }
}
interface Widget {
    create(properties?: object): HTMLElement;
}
interface WidgetRegistry {
    define(name: string, widget: Widget): void;
    create<K extends keyof WidgetNameMap>(name: K, properties?: Parameters<WidgetNameMap[K]["create"]>[0]): ReturnType<WidgetNameMap[K]["create"]>;
}
declare var widgets: WidgetRegistry;
