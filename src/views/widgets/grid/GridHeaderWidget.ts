import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";

export { gridHeaderWidget };

interface GridHeaderWidgetFactory extends WidgetFactory {
    create(init: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
}

declare global {
    interface WidgetNameMap {
        "gridheader": GridHeaderWidgetFactory,
    }
}

var gridHeaderWidget = new (
Widget({
    name: "gridheader"
})(class GridHeaderWidgetFactoryBase extends WidgetFactory implements GridHeaderWidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("th", {
            attributes: {
                class: "gridheader",
                scope: "column",
                role: "columnheader",
                tabindex: -1
            }
        });
    }

    create(init?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement {
        const header = <HTMLElement>this.#template.cloneNode(true);
        if (init !== undefined) {
            const {id, classList, tabIndex} = init;
            if (id !== undefined) {
                header.id = id;
            }
            if (classList !== undefined) {
                header.classList.add(...classList);
            }
            if (tabIndex !== undefined) {
                header.tabIndex = tabIndex;
            }
        }
        return header;
    }

    slot(header: HTMLElement): HTMLElement | null {
        return header;
    }

    setActive(item: HTMLElement, value: boolean): void {
        const {classList} = item;
        if (value) {
            classList.add("active");
        }
        else {
            classList.remove("active");
        }
    }

    getActive(item: HTMLElement): boolean {
        const {classList} = item;
        return classList.contains("active");
    }
}));