export { Widget };

interface WidgetConstructor {
    readonly prototype: Widget;
    new(element: HTMLElement): Widget;
    new<Element extends HTMLElement>(element: Element): Widget<Element>;
}

interface Widget<Element extends HTMLElement = HTMLElement> {
    element: Element;
}

class WidgetBase<Element extends HTMLElement = HTMLElement> extends EventTarget {
    readonly element: Element;

    constructor(element: Element) {
        super();
        this.element = element;
    }
}

var Widget: WidgetConstructor = WidgetBase;