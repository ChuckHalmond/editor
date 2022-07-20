import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";

export { gridcellWidget };

interface GridHeaderWidgetFactory extends WidgetFactory {
    create(init: {
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

var gridcellWidget = new (
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
        label?: string;
    }): HTMLElement {
        const header = <HTMLElement>this.#template.cloneNode(true);
        if (init !== undefined) {
            const {label} = init;
            if (label !== undefined) {
                this.setLabel(header, label);
            }
        }
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