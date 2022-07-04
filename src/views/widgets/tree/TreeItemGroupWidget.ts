import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { treeitemWidget } from "./TreeItemWidget";

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
})(class TreeItemGroupWidgetFactoryBase extends WidgetFactory implements TreeItemGroupWidgetFactory {
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

    slot(root: HTMLElement) {
        return root;
    }

    slottedCallback(item: HTMLElement, slot: HTMLElement) {
        const {childNodes} = slot;
        Array.from(childNodes).forEach((item_i, i) => {
            if (item_i instanceof HTMLElement) {
                treeitemWidget.setPosInSet(item_i, i);
                treeitemWidget.setLevel(item_i, (() => {
                    let level = -1;
                    let closestItem: HTMLElement | null = item_i;
                    while (closestItem !== null && closestItem.matches(".tree :scope")) {
                        closestItem = closestItem.parentElement?.closest(".treeitem") ?? null;
                        level++;
                    }
                    return level;
                })());
            }
        });
    }
}));