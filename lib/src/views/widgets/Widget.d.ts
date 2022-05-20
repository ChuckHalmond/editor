export { Widget };
interface WidgetConstructor {
    readonly prototype: Widget;
    new (): Widget;
    new <Element extends HTMLElement>(): Widget<Element>;
}
interface Widget<Element extends HTMLElement = HTMLElement> {
    readonly element: Element;
    click(): void;
    focus(options?: FocusOptions | undefined): void;
    blur(): void;
    contains(node: Node): boolean;
    render(): Element;
}
declare var Widget: WidgetConstructor;
