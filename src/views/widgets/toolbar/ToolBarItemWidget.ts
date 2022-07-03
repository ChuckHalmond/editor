import { element, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";

export { toolbarItemWidget };

type ToolBarItemType = "button" | "checkbox" | "radio" | "menubutton";

declare global {
    interface WidgetNameMap {
        "toolbaritem": ToolBarItemWidgetFactory
    }
}

interface ToolBarItemWidgetFactory extends WidgetFactory {
    create(init?: {
        type: ToolBarItemType;
        pressed?: boolean;
        label?: string;
        name?: string;
        keyshortcut?: string;
        value?: string;
        disabled?: boolean;
    }): HTMLElement;
    getMenu(item: HTMLElement): HTMLElement | null;
    getName(item: HTMLElement): string;
    setName(item: HTMLElement, value: string): void;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    setPressed(item: HTMLElement, value: boolean): void;
    getPressed(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    getValue(item: HTMLElement): string;
    setValue(item: HTMLElement, value: string): void;
    getType(item: HTMLElement): ToolBarItemType | null;
    setType(item: HTMLElement, value: ToolBarItemType): void;
}

var toolbarItemWidget = new(
Widget({
    name: "toolbaritem"
})(
class ToolBarItemWidgetFactoryBase extends WidgetFactory implements ToolBarItemWidgetFactory {
    
    #template: HTMLElement;
    #types: ToolBarItemType[];

    getMenu(item: HTMLElement): HTMLElement | null {
        return item.querySelector<HTMLElement>(":scope > .menu");
    }

    constructor() {
        super();
        this.#types = ["button", "checkbox", "radio", "menubutton"];
        this.#template = element("button", {
            attributes: {
                class: "toolbaritem",
                role: "button",
                type: "button",
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
        type: ToolBarItemType;
        pressed?: boolean;
        label?: string;
        name?: string;
        keyshortcut?: string;
        value?: string;
        disabled?: boolean;
    }) {
        const item = <HTMLElement>this.#template.cloneNode(true);
        item.addEventListener("click", this.#handleClickEvent.bind(this));
        if (init !== void 0) {
            const {keyshortcut, pressed, type, label, name, value, disabled} = init;
            if (keyshortcut !== undefined) {
                this.setKeyShortcut(item, keyshortcut);
            }
            if (pressed !== undefined) {
                this.setPressed(item, pressed);
            }
            if (type !== undefined) {
                this.setType(item, type);
            }
            if (label !== undefined) {
                this.setLabel(item, label);
            }
            if (name !== undefined) {
                this.setName(item, name);
            }
            if (value !== undefined) {
                this.setValue(item, value);
            }
            if (disabled !== undefined) {
                this.setDisabled(item, disabled);
            }
        }
        return item;
    }

    #label(item: HTMLElement): HTMLElement {
        const label = item.querySelector<HTMLElement>(":scope > .label");
        if (!label) {
            throw new Error(`No label found.`);
        }
        return label;
    }

    slottedCallback(item: HTMLElement, slot: HTMLElement): void {
        const hasChildMenu = Array.from(slot.childNodes).some(
            childNode_i => childNode_i instanceof HTMLElement && childNode_i.classList.contains("menu")
        );
        item.setAttribute("aria-haspopup", hasChildMenu.toString());
    }

    setExpanded(item: HTMLElement, value: boolean): void {
        item.toggleAttribute("aria-expanded", value);
    }

    getExpanded(item: HTMLElement): boolean {
        return item.hasAttribute("aria-expanded");
    }

    getLabel(item: HTMLElement): string {
        return this.#label(item).textContent ?? "";
    }

    setLabel(item: HTMLElement, value: string): void {
        this.#label(item).textContent = value;
    }

    getKeyShortcut(item: HTMLElement): string | null {
        return item.getAttribute("aria-keyshortcuts");
    }

    setKeyShortcut(item: HTMLElement, value: string | null): void {
        if (value !== null) {
            item.setAttribute("aria-keyshortcuts", value);
        }
        else {
            item.removeAttribute("aria-keyshortcuts");
        }
    }

    toggle(item: HTMLElement, force?: boolean): void {
        const expand = force ?? !this.getExpanded(item);
        this.setExpanded(item, expand);
        if (expand) {
            this.#positionMenu(item);
        }
    }

    expand(item: HTMLElement): void {
        const expanded = this.getExpanded(item);
        if (!expanded) {
            this.setExpanded(item, true);
            this.#positionMenu(item);
        }
    }

    collapse(item: HTMLElement): void {
        const expanded = this.getExpanded(item);
        if (expanded) {
            this.setExpanded(item, false);
        }
    }

    getType(item: HTMLElement): ToolBarItemType | null {
        const types = this.#types;
        const {classList} = item;
        for (let type_i of types) {
            if (classList.contains(`toolbaritem-${type_i}`)) {
                return type_i;
            }
        }
        return null;
    }

    setType(item: HTMLElement, type: ToolBarItemType): void {
        const oldType = this.getType(item);
        const {classList} = item;
        if (oldType) {
            classList.remove(`toolbaritem-${oldType}`);
        }
        classList.add(`toolbaritem-${type}`);
    }

    getValue(item: HTMLElement): string {
        return item.getAttribute("value") ?? "";
    }

    setValue(item: HTMLElement, value: string): void {
        item.setAttribute("value", value);
    }

    getName(item: HTMLElement): string {
        return item.getAttribute("name") ?? "";
    }

    setName(item: HTMLElement, value: string): void {
        item.setAttribute("name", value);
    }

    getPressed(item: HTMLElement): boolean {
        return item.hasAttribute("aria-pressed");
    }

    setPressed(item: HTMLElement, value: boolean): void {
        item.toggleAttribute("aria-pressed", value);
    }

    getDisabled(item: HTMLElement): boolean {
        return item.hasAttribute("aria-disabled");
    }

    setDisabled(item: HTMLElement, value: boolean): void {
        item.toggleAttribute("aria-disabled", value);
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

    #handleClickEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const targetItem = <HTMLElement>(<HTMLElement>target).closest(".toolbaritem");
        if (targetItem == currentTarget) {
            const type = this.getType(targetItem);
            switch (type) {
                case "checkbox": {
                    this.setPressed(targetItem, !this.getPressed(targetItem));
                    break;
                }
                case "radio": {
                    this.setPressed(targetItem, true);
                    break;
                }
                case "menubutton": {
                    this.toggle(targetItem);
                    break;
                }
            }
        }
    }

    #positionMenu(item: HTMLElement): void {
        const type = this.getType(item);
        if (type == "menubutton") {
            const menu = this.getMenu(item);
            if (menu !== null) {
                const {style: menuStyle} = menu;
                const {top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight} = item.getBoundingClientRect();
                const {width: menuWidth, height: menuHeight} = menu.getBoundingClientRect();
                const {scrollY, scrollX} = window;
                const {clientWidth, clientHeight} = document.body;
                const overflowX = itemRight + menuWidth - clientWidth;
                const overflowY = itemTop + menuHeight - clientHeight;
                menuStyle.setProperty("left", `${
                    overflowX > 0 ?
                    scrollX + itemLeft - menuWidth :
                    scrollX + itemLeft
                }px`);
                menuStyle.setProperty("top", `${
                    overflowY > 0 ?
                    scrollY + itemTop - menuHeight :
                    scrollY + itemBottom
                }px`);
            }
        }
    }
}));
