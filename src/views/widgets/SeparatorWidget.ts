import { Widget, element } from "../../elements/Element";
import { WidgetFactory } from "./Widget";

export { separatorWidget };

declare global {
    interface WidgetNameMap {
        "separator": SeparatorWidgetFactory
    }
}

interface SeparatorWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}

var separatorWidget = new (
Widget({
    name: "separator"
})(class SeparatorWidgetFactory extends WidgetFactory {
    #template: HTMLElement;
    
    constructor() {
        super();
        this.#template = element("div", {
            attributes: {
                class: "separator",
                role: "separator"
            }
        });
    }

    create() {
        return <HTMLElement>this.#template.cloneNode(true);
    }
}));