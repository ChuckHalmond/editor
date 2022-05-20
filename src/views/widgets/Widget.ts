export { Widget };

interface WidgetConstructor {
    readonly prototype: Widget;
    new(): Widget;
    new<Element extends HTMLElement>(): Widget<Element>;
}

interface Widget<Element extends HTMLElement = HTMLElement> {
    readonly element: Element;
    click(): void;
    focus(options?: FocusOptions | undefined): void;
    blur(): void;
    contains(node: Node): boolean;
    render(): Element
}

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