import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";

export { menuItemGroupWidget };

declare global {
    interface WidgetNameMap {
        "menuitemgroup": MenuItemGroupWidgetFactory
    }
}

interface MenuItemGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}

var menuItemGroupWidget = new (
Widget({
    name: "menuitemgroup"
})(class MenuItemGroupWidgetFactoryBase extends WidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("div", {
            attributes: {
                class: "menuitemgroup",
                role: "group"
            }
        });
    }

    create() {
        return <HTMLElement>this.#template.cloneNode(true);
    }
}));