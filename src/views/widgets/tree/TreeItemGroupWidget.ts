import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";

export { treeItemGroupWidget };

declare global {
    interface WidgetNameMap {
        "treeitemgroup": TreeItemGroupWidgetFactory
    }
}

interface TreeItemGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}

var treeItemGroupWidget = new (
Widget({
    name: "treeitemgroup"
})(class TreeItemGroupWidgetFactoryBase extends WidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("ul", {
            attributes: {
                class: "treeitemgroup",
                role: "group"
            }
        });
    }

    create() {
        return <HTMLElement>this.#template.cloneNode(true);
    }
}));