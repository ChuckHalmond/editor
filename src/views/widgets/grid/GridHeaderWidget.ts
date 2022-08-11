import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";

export { gridHeaderWidget };

interface GridHeaderWidgetFactory extends WidgetFactory {
    create(init: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        label?: string;
    }): HTMLElement;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
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
            },
            children: [
                element("span", {
                    attributes: {
                        class: "label"
                    }
                })
            ]
        });
    }

    create(init?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        label?: string;
    }): HTMLElement {
        const header = <HTMLElement>this.#template.cloneNode(true);
        if (init !== undefined) {
            const {id, classList, tabIndex, label} = init;
            if (id !== undefined) {
                header.id = id;
            }
            if (classList !== undefined) {
                header.classList.add(...classList);
            }
            if (tabIndex !== undefined) {
                header.tabIndex = tabIndex;
            }
            if (label !== undefined) {
                this.setLabel(header, label);
            }
        }
        return header;
    }

    slot(header: HTMLElement): HTMLElement | null {
        return header;
    }

    getLabel(header: HTMLElement): string {
        return this.#label(header).textContent ?? "";
    }

    setLabel(header: HTMLElement, value: string): void {
        this.#label(header).textContent = value;
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

    #label(header: HTMLElement): HTMLElement {
        return header.querySelector<HTMLElement>(":scope > .label")!;
    }
}));