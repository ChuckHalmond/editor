import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";

export { toolbarItemGroupWidget };

declare global {
    interface WidgetNameMap {
        "toolbaritemgroup": MenuItemGroupWidgetFactory
    }
}

interface MenuItemGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}

var toolbarItemGroupWidget = new (
Widget({
    name: "toolbaritemgroup"
})(class MenuItemGroupWidgetFactoryBase extends WidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("div", {
            attributes: {
                class: "toolbaritemgroup",
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
}));