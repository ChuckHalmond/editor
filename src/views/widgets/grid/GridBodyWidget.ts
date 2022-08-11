import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { gridRowWidget } from "./GridRowWidget";

export { gridBodyWidget };

declare global {
    interface WidgetNameMap {
        "gridbody": GridBodyWidgetFactory
    }
}

interface GridBodyWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}

var gridBodyWidget = new (
Widget({
    name: "gridbody"
})(class GridBodyWidgetFactoryBase extends WidgetFactory implements GridBodyWidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("tbody", {
            attributes: {
                class: "gridbody",
                role: "rowgroup"
            }
        });
    }

    create() {
        return <HTMLElement>this.#template.cloneNode(true);
    }

    slot(body: HTMLElement) {
        return body;
    }

    slottedCallback(body: HTMLElement, slot: HTMLElement) {
        const {childNodes} = slot;
        Array.from(childNodes).forEach((child_i, i) => {
            if (child_i instanceof HTMLElement && child_i.classList.contains("gridrow")) {
                gridRowWidget.setPosInSet(child_i, i);
            }
        });
    }
}));