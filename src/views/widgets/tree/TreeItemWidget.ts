import { element, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";

export { treeitemWidget };

type TreeItemType = "parent" | "leaf";

interface TreeItemWidgetFactory extends WidgetFactory {
    create(init?: {
        type: TreeItemType;
        label?: string;
        disabled?: boolean;
    }): HTMLElement;
    getGroup(item: HTMLElement): HTMLElement | null;
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
    getType(item: HTMLElement): TreeItemType | null;
    setType(item: HTMLElement, value: TreeItemType): void;
    toggle(item: HTMLElement, force?: boolean): void;
}

declare global {
    interface WidgetNameMap {
        "treeitem": TreeItemWidgetFactory,
    }
}

var treeitemWidget = new (
Widget({
    name: "treeitem"
})(class TreeItemWidgetFactoryBase extends WidgetFactory implements TreeItemWidgetFactory {
    #arrowPartTemplate : HTMLElement;
    #template: HTMLElement;
    #types: TreeItemType[];
    #typesFeatures: {
        [key in TreeItemType]: {
            role: string,
            hasArrow: boolean
        }
    };

    constructor() {
        super();
        this.#arrowPartTemplate = element("span", {
            attributes: {
                class: "arrow"
            }
        });
        this.#template = element("li", {
            attributes: {
                class: "treeitem",
                role: "treeitem",
                type: "treeitem-leaf",
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
                        }),
                        element("slot")
                    ]
                }),
                element("slot", {
                    attributes: {
                        name: "group"
                    }
                })
            ]
        });
        this.#types = ["parent", "leaf"];
        this.#typesFeatures = {
            parent: {
                role: "treeitem",
                hasArrow: true
            },
            leaf: {
                role: "treeitem",
                hasArrow: false
            }
        };
    }

    getGroup(item: HTMLElement): HTMLElement | null {
        return item.querySelector<HTMLElement>(":scope > .treeitemgroup");
    }

    create(init?: {
        type: TreeItemType;
        label?: string;
        disabled?: boolean;
    }): HTMLElement {
        const item = <HTMLElement>this.#template.cloneNode(true);
        item.addEventListener("click", this.#handleClickEvent.bind(this));
        if (init !== void 0) {
            const {type, label, disabled} = init;
            if (type !== void 0) {
                this.setType(item, type);
            }
            if (label !== void 0) {
                this.setLabel(item, label);
            }
            if (disabled !== void 0) {
                this.setDisabled(item, disabled);
            }
        }
        return item;
    }

    #label(item: HTMLElement): HTMLElement {
        const label = item.querySelector<HTMLElement>(":scope > .content > .label");
        if (!label) {
            throw new Error(`No label found.`);
        }
        return label;
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

    getType(item: HTMLElement): TreeItemType | null {
        const types = this.#types;
        const {classList} = item;
        for (let type_i of types) {
            if (classList.contains(`treeitem-${type_i}`)) {
                return type_i;
            }
        }
        return null;
    }

    setType(item: HTMLElement, type: TreeItemType): void {
        const typesFeatures = this.#typesFeatures;
        const arrowPartTemplate = this.#arrowPartTemplate;
        const {role, hasArrow} = typesFeatures[type];
        const oldType = this.getType(item);
        const {classList} = item;
        if (oldType) {
            classList.remove(`treeitem-${oldType}`);
        }
        classList.add(`treeitem-${type}`);
        item.setAttribute("role", role);
        const labelPart = this.#label(item);
        const arrowPart = item.querySelector(":scope > .arrow");
        if (hasArrow) {
            if (!arrowPart && labelPart) {
                labelPart.before(arrowPartTemplate.cloneNode(true));
            }
        }
        else {
            if (arrowPart) {
                arrowPart.remove();
            }
        }
    }

    setExpanded(item: HTMLElement, value: boolean): void {
        item.toggleAttribute("aria-expanded", value);
        item.dispatchEvent(new Event("toggle", {bubbles: true}));
    }

    getExpanded(item: HTMLElement): boolean {
        return item.hasAttribute("aria-expanded");
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
            if (!classList.contains("droptarget")) {
                classList.add("droptarget");
            }
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
        item.toggleAttribute("aria-selected", value);
        item.dispatchEvent(new Event("select", {bubbles: true}));
    }

    getSelected(item: HTMLElement): boolean {
        return item.hasAttribute("aria-selected");
    }

    setLevel(item: HTMLElement, value: number): void {
        item.style.setProperty("--level", value.toString());
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