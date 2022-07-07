import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { optionWidget } from "./OptionWidget";

export { optionGroupWidget };

declare global {
    interface WidgetNameMap {
        "optiongroup": OptionGroupWidgetFactory
    }
}

interface OptionGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}

var optionGroupWidget = new (
Widget({
    name: "optiongroup"
})(class OptionGroupWidgetFactoryBase extends WidgetFactory implements OptionGroupWidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("ul", {
            attributes: {
                class: "optiongroup",
                role: "group"
            }
        });
    }

    create() {
        return <HTMLElement>this.#template.cloneNode(true);
    }

    slot(group: HTMLElement) {
        return group;
    }

    slottedCallback(group: HTMLElement, slot: HTMLElement) {
        const {childNodes} = slot;
        Array.from(childNodes).forEach((child_i, i) => {
            if (child_i instanceof HTMLElement && child_i.classList.contains("option")) {
                //optionWidget.setPosInSet(item_i, i);
            }
        });
    }
}));