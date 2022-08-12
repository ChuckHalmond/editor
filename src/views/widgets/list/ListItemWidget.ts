import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";

export { listItemWidget };

interface ListItemWidgetFactory extends WidgetFactory {
    create(init?: {
        label?: string;
        disabled?: boolean;
    }): HTMLElement;
    setPosInSet(item: HTMLElement, value: number): void;
    getPosInSet(item: HTMLElement): number;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
    setDropTarget(item: HTMLElement, value: boolean): void;
    getDropTarget(item: HTMLElement): boolean;
    setSelected(item: HTMLElement, value: boolean): void;
    getSelected(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
}

declare global {
    interface WidgetNameMap {
        "listitem": ListItemWidgetFactory,
    }
}

var listItemWidget = new (
Widget({
    name: "listitem"
})(class ListItemWidgetFactoryBase extends WidgetFactory implements ListItemWidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("li", {
            attributes: {
                class: "listitem",
                role: "listitem",
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
        disabled?: boolean;
    }): HTMLElement {
        const item = <HTMLElement>this.#template.cloneNode(true);
        if (init !== undefined) {
            const {label, disabled} = init;
            if (label !== undefined) {
                this.setLabel(item, label);
            }
            if (disabled !== undefined) {
                this.setDisabled(item, disabled);
            }
            this.setSelected(item, false);
        }
        return item;
    }

    slot(root: HTMLElement): HTMLElement | null {
        return root;
    }

    group(item: HTMLElement): HTMLElement | null {
        return item.querySelector<HTMLElement>(":scope > .listitemgroup");
    }

    getLabel(item: HTMLElement): string {
        return this.#label(item).textContent ?? "";
    }

    setLabel(item: HTMLElement, value: string): void {
        this.#label(item).textContent = value;
    }

    setPosInSet(item: HTMLElement, value: number): void {
        item.setAttribute("aria-posinset", String(value));
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

    setSelected(row: HTMLElement, value: boolean): void {
        row.setAttribute("aria-selected", String(value));
        row.dispatchEvent(new Event("select", {bubbles: true}));
    }

    getSelected(row: HTMLElement): boolean {
        return JSON.parse(row.getAttribute("aria-selected") ?? String(false));
    }

    #label(item: HTMLElement): Node {
        return item.querySelector<HTMLElement>(":scope > .label")!;
    }
}));