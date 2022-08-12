import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { listItemWidget } from "./ListItemWidget";

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

    slot(group: HTMLElement) {
        return group;
    }

    slottedCallback(group: HTMLElement, slot: HTMLElement) {
        const {childNodes} = slot;
        Array.from(childNodes).forEach((child_i, i) => {
            if (child_i instanceof HTMLElement && child_i.classList.contains("listitem")) {
                listItemWidget.setPosInSet(child_i, i);
            }
        });
    }
}));