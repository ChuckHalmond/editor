export { WidgetFactoryConstructor };
export { WidgetFactory };
export { widgets };
declare global {
    interface WidgetNameMap {
    }
}
interface WidgetFactoryConstructor {
    readonly prototype: WidgetFactory;
    new (): WidgetFactory;
}
interface WidgetFactory {
    create(init?: object): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    get slots(): string[];
}
declare var WidgetFactory: WidgetFactoryConstructor;
declare var widgets: Map<string, WidgetFactory>;
