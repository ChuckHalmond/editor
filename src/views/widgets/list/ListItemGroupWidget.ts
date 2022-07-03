import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { listitemWidget } from "./ListItemWidget";

export { listItemGroupWidget };

declare global {
    interface WidgetNameMap {
        "listitemgroup": ListItemGroupWidgetFactory
    }
}

interface ListItemGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}

var listItemGroupWidget = new (
Widget({
    name: "listitemgroup"
})(class ListItemGroupWidgetFactoryBase extends WidgetFactory implements ListItemGroupWidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("ul", {
            attributes: {
                class: "listitemgroup",
                role: "group"
            }
        });
    }

    create() {
        return <HTMLElement>this.#template.cloneNode(true);
    }

    slot(root: HTMLElement) {
        return root;
    }

    slottedCallback(item: HTMLElement, slot: HTMLElement) {
        Array.from(slot.childNodes).forEach((item_i, i) => {
            if (item_i instanceof HTMLElement) {
                listitemWidget.setPosInSet(item_i, i);
            }
        });
    }
}));