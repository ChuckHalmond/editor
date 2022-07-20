import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";

export { gridCellWidget };

interface GridCellWidgetFactory extends WidgetFactory {
    create(init: {
        label?: string;
        disabled?: boolean;
    }): HTMLElement;
    getHeaders(item: HTMLElement): string;
    setHeaders(item: HTMLElement, value: string): void;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    setPosInSet(item: HTMLElement, value: number): void;
    getPosInSet(item: HTMLElement): number;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
    setDropTarget(item: HTMLElement, value: boolean): void;
    getDropTarget(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setSelected(item: HTMLElement, value: boolean): void;
    getSelected(item: HTMLElement): boolean;
}

declare global {
    interface WidgetNameMap {
        "gridcell": GridCellWidgetFactory,
    }
}

var gridCellWidget = new (
Widget({
    name: "gridcell"
})(class GridCellWidgetFactoryBase extends WidgetFactory implements GridCellWidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("td", {
            attributes: {
                class: "gridcell",
                role: "gridcell",
                tabindex: -1
            },
            children: [
                element("span", {
                    attributes: {
                        class: "content"
                    },
                    children: [
                        element("span", {
                            attributes: {
                                class: "label"
                            }
                        })
                    ]
                })
            ]
        });
    }

    create(init?: {
        label?: string;
        disabled?: boolean;
    }): HTMLElement {
        const cell = <HTMLElement>this.#template.cloneNode(true);
        if (init !== undefined) {
            const {label, disabled} = init;
            if (label !== undefined) {
                this.setLabel(cell, label);
            }
            if (disabled !== undefined) {
                this.setDisabled(cell, disabled);
            }
            this.setSelected(cell, false);
        }
        return cell;
    }

    slot(cell: HTMLElement): HTMLElement | null {
        return cell;
    }

    getHeaders(item: HTMLElement): string {
        return item.getAttribute("headers") ?? "";
    }

    setHeaders(item: HTMLElement, value: string): void {
        item.setAttribute("headers", value);
    }

    getLabel(item: HTMLElement): string {
        return this.#label(item).textContent ?? "";
    }

    setLabel(item: HTMLElement, value: string): void {
        this.#label(item).textContent = value;
    }

    setPosInSet(item: HTMLElement, value: number): void {
        item.setAttribute("aria-posinset", value.toString());
    }

    getPosInSet(item: HTMLElement): number {
        const posInSet = item.getAttribute("aria-posinset");
        return posInSet ? parseInt(posInSet) : -1;
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

    setDropTarget(item: HTMLElement, value: boolean): void {
        const {classList} = item;
        if (value) {
            classList.add("droptarget");
        }
        else {
            classList.remove("droptarget");
        }
    }

    getDropTarget(item: HTMLElement): boolean {
        const {classList} = item;
        return classList.contains("droptarget");
    }

    setDisabled(item: HTMLElement, value: boolean): void {
        item.toggleAttribute("aria-disabled", value);
    }

    getDisabled(item: HTMLElement): boolean {
        return item.hasAttribute("aria-disabled");
    }

    setSelected(item: HTMLElement, value: boolean): void {
        item.setAttribute("aria-selected", value.toString());
        item.dispatchEvent(new Event("select", {bubbles: true}));
    }

    getSelected(item: HTMLElement): boolean {
        return JSON.parse(item.getAttribute("aria-selected") ?? false.toString());
    }

    #label(item: HTMLElement): HTMLElement {
        return item.querySelector<HTMLElement>(":scope > .content > .label")!;
    }
}));