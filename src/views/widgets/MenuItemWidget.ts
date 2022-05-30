import { CustomWidget, element } from "../../elements/Element";

export { menuItemWidget };

type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";

declare global {
    interface WidgetNameMap {
        "menuitem": typeof menuItemWidget
    }
}

var iconPartTemplate = element("span", {
    properties: {
        className: "icon"
    }
});

var arrowPartTemplate = element("span", {
    properties: {
        className: "arrow"
    }
});

var menuItemWidget = CustomWidget({
    name: "menuitem"
})(Object.freeze({
    
    template: element("button", {
        properties: {
            className: "menuitem menuitem-button",
            tabIndex: -1,
        },
        attributes: {
            role: "menuitem"
        },
        children: [
            element("span", {
                properties: {
                    className: "content"
                },
                children: [
                    iconPartTemplate.cloneNode(true),
                    element("span", {
                        properties: {
                            className: "label"
                        }
                    })
                ]
            })
        ]
    }),

    observer: new MutationObserver(
        (mutationsList: MutationRecord[]) => {
            mutationsList.forEach((mutation: MutationRecord) => {
                const {target, type} = mutation;
                if (target instanceof HTMLElement) {
                    switch (type) {
                        case "attributes": {
                            const {attributeName, oldValue} = mutation;
                            const newValue = target.getAttribute(attributeName!);
                            menuItemWidget.attributeChangedCallback(target, attributeName!, oldValue, newValue);
                            break;
                        }
                        case "childList": {
                            const {addedNodes, removedNodes} = mutation;
                            if (addedNodes.length > 0) {
                                menuItemWidget.childNodesAddedCallback(target, addedNodes);
                            }
                            if (removedNodes.length > 0) {
                                menuItemWidget.childNodesRemovedCallback(target, addedNodes);
                            }
                            break;
                        }
                    }

                }
            });
        }
    ),

    create(init?: {
        checked?: boolean;
        type?: MenuItemType;
        label?: string;
        name?: string;
        keyshortcut?: string;
    }): HTMLButtonElement {
        const item = <typeof this.template>this.template.cloneNode(true);
        this.observer.observe(item, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ["aria-checked"],
            childList: true
        });
        item.addEventListener("keydown", this.handleKeyDownEvent.bind(this));
        if (init !== void 0) {
            const {keyshortcut, checked, type, label, name} = init;
            if (keyshortcut !== void 0) {
                this.setKeyShortcut(item, keyshortcut);
            }
            if (checked !== void 0) {
                this.setChecked(item, checked);
            }
            if (type !== void 0) {
                this.setType(item, type);
            }
            if (label !== void 0) {
                this.setLabel(item, label);
            }
            if (name !== void 0) {
                this.setName(item, name);
            }
        }
        return item;
    },

    handleKeyDownEvent(event: KeyboardEvent) {
        event.preventDefault();
    },

    attributeChangedCallback(item: HTMLElement, name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "aria-checked": {
                item.dispatchEvent(new Event("toggle", {bubbles: true}));
                break;
            }
        }
    },

    childNodesAddedCallback(item: HTMLElement, childNodes: NodeList): void {
        childNodes.forEach(node_i => {
            if (node_i instanceof HTMLElement && node_i.classList.contains("menu")) {
                this.setHasPopup(item, true);
            }
        });
    },

    childNodesRemovedCallback(item: HTMLElement, childNodes: NodeList): void {
        childNodes.forEach(node_i => {
            if (node_i instanceof HTMLElement && node_i.classList.contains("menu")) {
                this.setHasPopup(item, false);
            }
        });
    },

    label(item: HTMLElement): HTMLElement {
        return item.querySelector<HTMLElement>(":scope > .content > .label")!;
    },

    menu(item: HTMLElement) {
        return item.querySelector<HTMLElement>(":scope > .menu")!;
    },

    getKeyShortcut(item: HTMLElement): string | null {
        return item.getAttribute("aria-keyshortcuts");
    },

    setKeyShortcut(item: HTMLElement, value: string | null): void {
        if (value !== null) {
            item.setAttribute("aria-keyshortcuts", value);
        }
        else {
            item.removeAttribute("aria-keyshortcuts");
        }
    },

    getLabel(item: HTMLElement): string {
        return this.label(item).textContent ?? "";
    },

    setLabel(item: HTMLElement, value: string): void {
        this.label(item).textContent = value;
    },

    getType(item: HTMLElement): MenuItemType {
        const typeClass = Array.from(item.classList).find(
            class_i => class_i.startsWith("menuitem-")
        )!;
        return <MenuItemType>typeClass.substring(typeClass.indexOf("-") + 1);
    },

    setType(item: HTMLElement, value: MenuItemType) {
        const type = this.getType(item);
        item.classList.replace(`menuitem-${type}`, `menuitem-${value}`);
        switch (value) {
            case "checkbox": {
                item.setAttribute("aria-role", "menuitemcheckbox");
                break;
            }
            case "radio": {
                item.setAttribute("aria-role", "menuitemradio");
                break;
            }
            default: {
                item.setAttribute("aria-role", "menuitem");
                break;
            }
        }
        switch (value) {
            case "menu": {
                const iconPart = item.querySelector(".icon");
                if (iconPart) {
                    iconPart.remove();
                }
                break;
            }
            default: {
                const iconPart = item.querySelector(".icon");
                if (!iconPart) {
                    const contentPart = item.querySelector(".content");
                    if (contentPart) {
                        contentPart.prepend(iconPartTemplate.cloneNode(true));
                    }
                }
                break;
            }
        }
        switch (value) {
            case "submenu": {
                const arrowPart = item.querySelector(".arrow");
                if (!arrowPart) {
                    const contentPart = item.querySelector(".content");
                    if (contentPart) {
                        contentPart.append(arrowPartTemplate.cloneNode(true));
                    }
                }
                break;
            }
            default: {
                const arrowPart = item.querySelector(".arrow");
                if (arrowPart) {
                    arrowPart.remove();
                }
                break;
            }
        }
    },

    getActive(item: HTMLElement): boolean {
        return item.hasAttribute("aria-active");
    },

    setActive(item: HTMLElement, value: boolean) {
        item.toggleAttribute("aria-active", value);
    },

    getName(item: HTMLElement): string {
        return item.getAttribute("name") ?? "";
    },

    setName(item: HTMLElement, value: string) {
        item.setAttribute("name", value);
    },

    getHasPopup(item: HTMLElement): boolean {
        return item.hasAttribute("aria-haspopup");
    },

    setHasPopup(item: HTMLElement, value: boolean) {
        value ?
            item.setAttribute("aria-haspopup", "menu") :
            item.removeAttribute("aria-haspopup");
    },

    setChecked(item: HTMLElement, value: boolean): void {
        item.toggleAttribute("aria-checked", value);
    },

    getChecked(item: HTMLElement): boolean {
        return item.hasAttribute("aria-checked");
    },

    setExpanded(item: HTMLElement, value: boolean): void {
        item.toggleAttribute("aria-expanded", value);
    },

    getExpanded(item: HTMLElement): boolean {
        return item.hasAttribute("aria-expanded");
    },

    trigger(item: HTMLElement): void {
        const type = this.getType(item);
        switch (type) {
            case "checkbox": {
                this.setChecked(item, !this.getChecked(item));
                break;
            }
            case "radio": {
                this.setChecked(item, true);
                break;
            }
            case "menu":
            case "submenu": {
                this.toggle(item);
                break;
            }
        }
        item.dispatchEvent(new Event("trigger", {
            bubbles: true
        }));
    },

    toggle(item: HTMLElement, force?: boolean): void {
        const expand = force ?? !this.getExpanded(item);
        this.setExpanded(item, expand);
        if (expand) {
            this.positionMenu(item);
        }
    },

    expand(item: HTMLElement): void {
        const expanded = this.getExpanded(item);
        if (!expanded) {
            this.setExpanded(item, true);
            this.positionMenu(item);
        }
    },

    collapse(item: HTMLElement): void {
        const expanded = this.getExpanded(item);
        if (expanded) {
            this.setExpanded(item, false);
        }
    },

    positionMenu(item: HTMLElement): void {
        const menu = this.menu(item);
        if (menu !== null) {
            const {style: menuStyle} = menu;
            const {top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight} = item.getBoundingClientRect();
            const {width: menuWidth, height: menuHeight} = menu.getBoundingClientRect();
            const {scrollY, scrollX} = window;
            const {clientWidth, clientHeight} = document.body;
            const type = this.getType(item);
            if (type == "menu") {
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
            else {
                const closestMenu = item.closest(".menu");
                if (closestMenu !== null) {
                    const {top: closestMenuTop, left: closestMenuLeft} = closestMenu.getBoundingClientRect();
                    const overflowX = itemRight + menuWidth - clientWidth;
                    const overflowY = itemTop + menuHeight - clientHeight;
                    menuStyle.setProperty("left", `${
                        overflowX > 0 ?
                        itemLeft - menuWidth - closestMenuLeft :
                        itemRight - closestMenuLeft
                    }px`);
                    const menuComputedStyle = window.getComputedStyle(menu);
                    const {paddingTop, paddingBottom} = menuComputedStyle;
                    const menuPaddingTop = parseFloat(paddingTop);
                    const menuPaddingBottom = parseFloat(paddingBottom);
                    menuStyle.setProperty("top", `${
                        overflowY > 0 ?
                        itemBottom - menuHeight - closestMenuTop + menuPaddingBottom :
                        itemTop - closestMenuTop - menuPaddingTop
                    }px`);
                }
            }
        }
    }
}));