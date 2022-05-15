export { Widget };
interface WidgetConstructor {
    readonly prototype: Widget;
    new (element: HTMLElement): Widget;
    new <Element extends HTMLElement>(element: Element): Widget<Element>;
}
interface Widget<Element extends HTMLElement = HTMLElement> {
    element: Element;
}
declare var Widget: WidgetConstructor;
