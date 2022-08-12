import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";

export { gridHeadWidget };

declare global {
    interface WidgetNameMap {
        "gridhead": GridHeadWidgetFactory
    }
}

interface GridHeadWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}

var gridHeadWidget = new (
Widget({
    name: "gridhead"
})(class GridHeadWidgetFactoryBase extends WidgetFactory implements GridHeadWidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("thead", {
            attributes: {
                class: "gridhead",
                role: "rowgroup"
            }
        });
    }

    create() {
        return <HTMLElement>this.#template.cloneNode(true);
    }

    slot(head: HTMLElement) {
        return head;
    }
}));