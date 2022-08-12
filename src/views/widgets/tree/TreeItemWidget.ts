import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";

export { treeItemWidget };

type TreeItemType = "parent" | "leaf";

interface TreeItemWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        type?: TreeItemType;
        label?: string;
        disabled?: boolean;
        draggable?: boolean;
    }): HTMLElement;
    group(item: HTMLElement): HTMLElement | null;
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
    setExpanded(item: HTMLElement, value: boolean): void;
    getExpanded(item: HTMLElement): boolean;
    setDraggable(row: HTMLElement, value: boolean): void;
    getDraggable(item: HTMLElement): boolean;
    getType(item: HTMLElement): TreeItemType | null;
    setType(item: HTMLElement, value: TreeItemType): void;
    toggle(item: HTMLElement, force?: boolean): void;
}

declare global {
    interface WidgetNameMap {
        "treeitem": TreeItemWidgetFactory,
    }
}

var treeItemWidget = new (
Widget({
    name: "treeitem"
})(class TreeItemWidgetFactoryBase extends WidgetFactory implements TreeItemWidgetFactory {
    #template: HTMLElement;
    #types: TreeItemType[];

    constructor() {
        super();
        this.#types = ["parent", "leaf"];
        this.#template = element("li", {
            attributes: {
                class: "treeitem",
                role: "treeitem",
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
                                class: "arrow"
                            }
                        }),
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

    group(item: HTMLElement): HTMLElement | null {
        return item.querySelector<HTMLElement>(":scope > .treeitemgroup");
    }

    create(properties?: {
        id?: string;
        type?: TreeItemType;
        label?: string;
        disabled?: boolean;
        draggable?: boolean;
    }): HTMLElement {
        const item = <HTMLElement>this.#template.cloneNode(true);
        item.addEventListener("click", this.#handleClickEvent.bind(this));
        if (properties !== undefined) {
            const {id, label, disabled, draggable} = properties;
            let {type} = properties;
            type = type ?? "leaf";
            this.setType(item, type);
            if (type === "parent") {
                this.setExpanded(item, false);
            }
            if (id !== undefined) {
                item.id = id;
            }
            if (label !== undefined) {
                this.setLabel(item, label);
            }
            if (disabled !== undefined) {
                this.setDisabled(item, disabled);
            }
            if (draggable !== undefined) {
                this.setDraggable(item, draggable);
            }
            this.setSelected(item, false);
        }
        return item;
    }

    get observedSlots() {
        return ["content", "group"];
    }

    slot(item: HTMLElement, name: string | null) {
        switch (name) {
            case "content":
                return this.#content(item);
            case "group":
                return item;
        }
        return null;
    }

    #content(item: HTMLElement): HTMLElement {
        const content = item.querySelector<HTMLElement>(":scope > .content")!;
        if (!content) throw new Error("Missing content.");
        return content;
    }

    #label(item: HTMLElement): HTMLElement {
        const label = item.querySelector<HTMLElement>(":scope > .content > .label");
        if (!label) throw new Error("Missing label.");
        return label;
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
        return posInSet ? Number(posInSet) : -1;
    }

    getType(item: HTMLElement): TreeItemType {
        const types = this.#types;
        const {classList} = item;
        for (let type_i of types) {
            if (classList.contains(`treeitem-${type_i}`)) {
                return type_i;
            }
        }
        throw new Error("Missing type.");
    }

    setType(item: HTMLElement, type: TreeItemType): void {
        const {classList} = item;
        try {
            const oldType = this.getType(item);
            classList.remove(`treeitem-${oldType}`);
        }
        catch (e) {};
        classList.add(`treeitem-${type}`);
    }

    setExpanded(item: HTMLElement, value: boolean): void {
        item.setAttribute("aria-expanded", String(value));
    }

    getExpanded(item: HTMLElement): boolean {
        return JSON.parse(item.getAttribute("aria-expanded") ?? String(false));
    }

    setActive(item: HTMLElement, value: boolean): void {
        const {classList} = item;
        if (value) {
            if (!classList.contains("active")) {
                classList.add("active");
            }
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

    setDraggable(item: HTMLElement, value: boolean): void {
        item.setAttribute("draggable", String(value));
    }

    getDraggable(item: HTMLElement): boolean {
        return JSON.parse(item.getAttribute("draggable") ?? String(false));
    }

    setSelected(item: HTMLElement, value: boolean): void {
        item.setAttribute("aria-selected", String(value));
        item.dispatchEvent(new Event("select", {bubbles: true}));
    }

    getSelected(item: HTMLElement): boolean {
        return JSON.parse(item.getAttribute("aria-selected") ?? String(false));
    }

    setLevel(item: HTMLElement, value: number): void {
        item.style.setProperty("--level", String(value));
    }

    getLevel(item: HTMLElement): number {
        return parseInt(item.style.getPropertyValue("--level"));
    }

    toggle(item: HTMLElement, force?: boolean): void {
        this.setExpanded(item, force ?? !this.getExpanded(item));
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target, currentTarget, shiftKey, ctrlKey} = event;
        const targetItem = <HTMLElement>(<HTMLElement>target).closest(".treeitem");
        if (targetItem == currentTarget) {
            const type = this.getType(targetItem);
            if (type == "parent" && !(shiftKey || ctrlKey)) {
                this.toggle(targetItem);
            }
        }
    }
}));