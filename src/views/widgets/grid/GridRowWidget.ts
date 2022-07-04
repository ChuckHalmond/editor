import { element, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { gridCellWidget } from "./GridCellWidget";

export { gridRowWidget };

interface GridRowWidgetFactory extends WidgetFactory {
    create(init?: {
        disabled?: boolean
    }): HTMLElement;
    cells(row: HTMLElement): HTMLElement[];
    setPosInSet(row: HTMLElement, value: number): void;
    getPosInSet(row: HTMLElement): number;
    setActive(row: HTMLElement, value: boolean): void;
    getActive(row: HTMLElement): boolean;
    setDropTarget(row: HTMLElement, value: boolean): void;
    getDropTarget(row: HTMLElement): boolean;
    setSelected(row: HTMLElement, value: boolean): void;
    getSelected(row: HTMLElement): boolean;
    setDisabled(row: HTMLElement, value: boolean): void;
    getDisabled(row: HTMLElement): boolean;
}

declare global {
    interface WidgetNameMap {
        "gridrow": GridRowWidgetFactory,
    }
}

var gridRowWidget = new (
Widget({
    name: "gridrow"
})(class GridRowWidgetFactoryBase extends WidgetFactory implements GridRowWidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("tr", {
            attributes: {
                class: "gridrow",
                role: "row",
                tabindex: -1,
                ariaSelected: "false"
            }
        });
    }

    create(init?: {
        disabled?: boolean;
    }): HTMLElement {
        const row = <HTMLElement>this.#template.cloneNode(true);
        if (init !== void 0) {
            const {disabled} = init;
            if (disabled !== void 0) {
                this.setDisabled(row, disabled);
            }
        }
        return row;
    }

    cells(row: HTMLElement): HTMLElement[] {
        return Array.from(row.querySelectorAll<HTMLElement>(
            ":scope > .gridcell"
        ));
    }
    
    setPosInSet(row: HTMLElement, value: number): void {
        row.setAttribute("aria-posinset", value.toString());
    }

    getPosInSet(row: HTMLElement): number {
        const posInSet = row.getAttribute("aria-posinset");
        return posInSet ? parseInt(posInSet) : -1;
    }

    setActive(row: HTMLElement, value: boolean): void {
        const {classList} = row;
        if (value) {
            if (!classList.contains("active")) {
                classList.add("active");
            }
        }
        else {
            classList.remove("active");
        }
    }

    getActive(row: HTMLElement): boolean {
        const {classList} = row;
        return classList.contains("active");
    }

    setDropTarget(row: HTMLElement, value: boolean): void {
        const {classList} = row;
        if (value) {
            classList.add("droptarget");
        }
        else {
            classList.remove("droptarget");
        }
    }

    getDropTarget(row: HTMLElement): boolean {
        const {classList} = row;
        return classList.contains("droptarget");
    }

    setDisabled(row: HTMLElement, value: boolean): void {
        row.toggleAttribute("aria-disabled", value);
    }

    getDisabled(row: HTMLElement): boolean {
        return row.hasAttribute("aria-disabled");
    }

    setSelected(row: HTMLElement, value: boolean): void {
        row.setAttribute("aria-selected", value.toString());
        row.dispatchEvent(new Event("select", {bubbles: true}));
    }

    getSelected(row: HTMLElement): boolean {
        return JSON.parse(row.getAttribute("aria-selected") ?? false.toString());
    }

    slottedCallback(item: HTMLElement, slot: HTMLElement) {
        const {childNodes} = slot;
        Array.from(childNodes).forEach((item_i, i) => {
            if (item_i instanceof HTMLElement) {
                gridCellWidget.setPosInSet(item_i, i);
            }
        });
    }
}));