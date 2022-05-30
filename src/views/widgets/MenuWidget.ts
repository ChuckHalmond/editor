import { CustomWidget, element } from "../../elements/Element";
import { menuItemWidget } from "./MenuItemWidget";

export { menuWidget };

var toggleTimeouts: WeakMap<HTMLElement, {clear(): void;}> = new WeakMap();

declare global {
    interface WidgetNameMap {
        "menu": typeof menuWidget
    }
}

var menuWidget = CustomWidget({
    name: "menu"
})(Object.freeze({
    template: element("menu", {
        properties: {
            className: "menu",
            tabIndex: -1
        },
        attributes: {
            role: "menu"
        }
    }),

    walker: document.createTreeWalker(
        document, NodeFilter.SHOW_ELEMENT, (node: Node) => {
            if (node instanceof Element) {
                const {classList} = node;
                if (classList.contains("menuitem")) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                else if (classList.contains("menuitemgroup")) {
                    return NodeFilter.FILTER_SKIP;
                }
            }
            return NodeFilter.FILTER_REJECT;
        }
    ),
    
    create(init?: {
        name?: string;
    }): HTMLMenuElement {
        const menu = <HTMLMenuElement>this.template.cloneNode(true);
        menu.addEventListener("click", this.handleClickEvent.bind(this));
        menu.addEventListener("mouseover", this.handleMouseOverEvent.bind(this));
        menu.addEventListener("mouseout", this.handleMouseOutEvent.bind(this));
        menu.addEventListener("focusin", this.handleFocusInEvent.bind(this));
        menu.addEventListener("focusout", this.handleFocusOutEvent.bind(this));
        menu.addEventListener("keydown", this.handleKeyDownEvent.bind(this));
        menu.addEventListener("trigger", this.handleTriggerEvent.bind(this));
        if (init !== void 0) {
            const {name} = init;
            if (name !== void 0) {
                this.setName(menu, name);
            }
        }
        return menu;
    },

    walkerNodeFilter(node: Node): number {
        if (node instanceof Element) {
            const {classList} = node;
            if (classList.contains("menuitem")) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("menuitemgroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    },

    getContextual(menu: HTMLElement): boolean {
        return menu.hasAttribute("data-contextual");
    },

    setContextual(menu: HTMLElement, value: boolean): void {
        menu.toggleAttribute("data-contextual", value);
    },

    getName(menu: HTMLElement): string {
        return menu.getAttribute("data-name") ?? "";
    },

    setName(menu: HTMLElement, value: string): void {
        menu.setAttribute("data-name", value);
    },

    collapseSubmenus(menu: HTMLElement): void {
        menu.querySelectorAll<HTMLElement>(":is(:scope, :scope > .menuitemgroup) > .menuitem[aria-expanded]")
            .forEach(menuitem_i => menuItemWidget.collapse(menuitem_i));
    },

    isClosestMenu(menu: HTMLElement, target: Element): boolean {
        return target.closest(":is(.menu)") == menu;
    },

    nearestItem(menu: HTMLElement, target: Element): HTMLElement | null {
        return Array.from(menu.querySelectorAll<HTMLElement>(
            ":is(:scope, :scope > .menuitemgroup) > .menuitem"
        )).find(item_i => item_i.contains(target)) ?? null;
    },

    firstItem(menu: HTMLElement): HTMLElement | null {
        const {walker} = this;
        walker.currentNode = menu;
        return <HTMLElement | null>walker.firstChild();
    },

    lastItem(menu: HTMLElement): HTMLElement | null {
        const {walker} = this;
        walker.currentNode = menu;
        return <HTMLElement | null>walker.lastChild();
    },

    previousItem(item: HTMLElement): HTMLElement | null {
        const {walker} = this;
        walker.currentNode = item;
        return <HTMLElement | null>walker.previousSibling();
    },

    nextItem(item: HTMLElement): HTMLElement | null {
        const {walker} = this;
        walker.currentNode = item;
        return <HTMLElement | null>walker.nextSibling();
    },

    firstChildItem(item: HTMLElement): HTMLElement | null {
        const menu = menuItemWidget.menu(item);
        if (menu) {
            const {walker} = this;
            walker.currentNode = menu;
            return <HTMLElement | null>walker.firstChild();
        }
        return null;
    },

    getActiveItem(menu: HTMLMenuElement): HTMLElement | null {
        return menu.querySelector<HTMLElement>(
            ":is(:scope, :scope > .menuitemgroup) > .menuitem[aria-active]"
        );
    },
    
    setActiveItem(menu: HTMLMenuElement, item: HTMLElement | null): void {
        const activeItem = this.getActiveItem(menu);
        if (activeItem !== null && activeItem !== item) {
            menuItemWidget.setActive(activeItem, false);
        }
        if (item !== null) {
            menuItemWidget.setActive(item, true);
        }
    },

    handleClickEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const menu = <HTMLMenuElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const isClosestMenu = this.isClosestMenu(menu, target);
            if (isClosestMenu) {
                menuItemWidget.trigger(target);
            }
        }
    },

    handleFocusInEvent(event: FocusEvent): void {
        const {currentTarget, target} = event;
        const menu = <HTMLMenuElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const nearestItem = this.nearestItem(menu, target);
            if (nearestItem !== null) {
                this.setActiveItem(menu, nearestItem);
            }
        }
    },

    handleFocusOutEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const menu = <HTMLMenuElement>currentTarget;
        const lostFocusWithin = !menu.contains(<HTMLElement>relatedTarget);
        if (lostFocusWithin) {
            const activeItem = this.getActiveItem(menu);
            if (activeItem !== null) {
                menuItemWidget.collapse(activeItem);
            }
            this.setActiveItem(menu, null);
        }
    },

    async setItemTimeout(item: HTMLElement, delay?: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                resolve(void 0);
            }, delay ?? 0);
            toggleTimeouts.set(item, {
                clear: () => {
                    clearTimeout(timeout);
                    reject();
                }
            });
        }).then(() => {
            toggleTimeouts.delete(item);
        });
    },

    clearItemTimeout(item: HTMLElement): void {
        const timeout = toggleTimeouts.get(item);
        if (typeof timeout !== "undefined") {
            toggleTimeouts.delete(item);
            timeout.clear();
        }
    },

    handleKeyDownEvent(event: KeyboardEvent) {
        const {currentTarget, key} = event;
        const menu = <HTMLMenuElement>currentTarget;
        const activeItem = this.getActiveItem(menu);
        switch (key) {
            case "ArrowUp": {
                const previousItem = activeItem ?
                    this.previousItem(activeItem) ?? this.lastItem(menu) :
                    this.firstItem(menu);
                previousItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                const nextItem = activeItem ?
                    this.nextItem(activeItem) ?? this.firstItem(menu) :
                    this.firstItem(menu);
                nextItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.firstItem(menu);
                firstItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.lastItem(menu);
                lastItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (activeItem) {
                    const type = menuItemWidget.getType(activeItem);
                    switch (type) {
                        case "submenu": {
                            menuItemWidget.expand(activeItem);
                            const firstChildItem = this.firstChildItem(activeItem);
                            firstChildItem?.focus({preventScroll: true});
                            break;
                        }
                        default: {
                            menuItemWidget.trigger(activeItem);
                            break;
                        }
                    }
                    event.stopPropagation();
                }
                break;
            }
            case "Escape": {
                if (activeItem) {
                    const isClosestTargetMenu = event.composedPath().find(
                        target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")
                    ) == menu;
                    if (!isClosestTargetMenu) {
                        menuItemWidget.collapse(activeItem);
                        activeItem.focus({preventScroll: true});
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowLeft": {
                if (activeItem) {
                    const isClosestTargetMenu = event.composedPath().find(
                        target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")
                    ) == menu;
                    if (!isClosestTargetMenu) {
                        menuItemWidget.collapse(activeItem);
                        activeItem.focus({preventScroll: true});
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowRight": {
                if (activeItem) {
                    const type = menuItemWidget.getType(activeItem);
                    switch (type) {
                        case "submenu": {
                            const expanded = menuItemWidget.getExpanded(activeItem);
                            if (!expanded) {
                                menuItemWidget.expand(activeItem);
                                const firstChildItem = this.firstChildItem(activeItem);
                                firstChildItem?.focus({preventScroll: true});
                                event.stopPropagation();
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }
        event.preventDefault();
    },

    handleMouseOutEvent(event: MouseEvent): void {
        const {target, currentTarget, relatedTarget} = event;
        const menu = <HTMLMenuElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const nearestItem = this.nearestItem(menu, target);
            if (nearestItem !== null) {
                if (menuItemWidget.getType(nearestItem) == "submenu" &&
                    !menuItemWidget.getExpanded(nearestItem)) {
                    this.clearItemTimeout(nearestItem);
                }
                const isTargetClosestMenu = event.composedPath().find(
                    target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")
                ) == menu;
                if (isTargetClosestMenu) {
                    const activeItem = this.getActiveItem(menu);
                    if (activeItem !== null &&
                        menuItemWidget.getType(activeItem) == "submenu" &&
                        menuItemWidget.getExpanded(activeItem)) {
                        this.clearItemTimeout(activeItem);
                        this.setItemTimeout(activeItem, 400)
                            .then(() => {
                                menuItemWidget.collapse(activeItem);
                            })
                            .catch(() => void 0);
                    }
                    const {clientX, clientY} = event;
                    const {left, right, top, bottom} = menu.getBoundingClientRect();
                    const intersectsWithMouse = !(
                        left > clientX || right < clientX || top > clientY || bottom < clientY
                    );
                    const containsRelatedTarget = menu.contains(<Node>relatedTarget);
                    if (intersectsWithMouse && containsRelatedTarget) {
                        if (relatedTarget instanceof HTMLElement && relatedTarget.classList.contains("menu") && relatedTarget !== menu) {
                            relatedTarget.focus({preventScroll: true});
                        }
                        else {
                            menu.focus({preventScroll: true});
                            this.setActiveItem(menu, null);
                        }
                    }
                    if (!intersectsWithMouse) {
                        menu.focus({preventScroll: true});
                        this.setActiveItem(menu, null);
                    }
                }
            }
        }
    },

    handleMouseOverEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const menu = <HTMLMenuElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const nearestItem = this.nearestItem(menu, target); 
            if (nearestItem !== null) {
                if (menuItemWidget.getType(nearestItem) == "submenu" &&
                    menuItemWidget.getExpanded(nearestItem)) {
                    this.clearItemTimeout(nearestItem);
                }
                const isTargetClosestMenu = event.composedPath().find(
                    target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")
                ) == menu;
                if (isTargetClosestMenu) {
                    const activeItem = this.getActiveItem(menu);
                    if (activeItem !== null) {
                        if (menuItemWidget.getType(activeItem) == "submenu" &&
                            menuItemWidget.getExpanded(activeItem) && 
                            !activeItem.contains(<HTMLElement>target)) {
                            this.clearItemTimeout(activeItem);
                            this.setItemTimeout(activeItem, 400)
                                .then(() => {
                                    menuItemWidget.collapse(activeItem);
                                })
                                .catch(() => void 0);
                        }
                    }
                    this.setActiveItem(menu, nearestItem);
                    nearestItem.focus({preventScroll: true});
                    if (menuItemWidget.getType(nearestItem) == "submenu") {
                        if (!menuItemWidget.getExpanded(nearestItem)) {
                            this.clearItemTimeout(nearestItem);
                            this.setItemTimeout(nearestItem, 200)
                                .then(() => {
                                    const activeItem = this.getActiveItem(menu);
                                    this.collapseSubmenus(menu);
                                    if (activeItem) {
                                        this.clearItemTimeout(activeItem);
                                        menuItemWidget.expand(activeItem);
                                        menuItemWidget.menu(activeItem)?.focus({preventScroll: true});
                                    }
                                })
                                .catch(() => void 0);
                        }
                        else {
                            menuItemWidget.menu(nearestItem)?.focus({preventScroll: true});
                        }
                    }
                }
            }
        }
    },

    handleTriggerEvent(event: Event): void {
        const {target, currentTarget} = event;
        const menu = <HTMLMenuElement>currentTarget;
        const contextual = this.getContextual(menu);
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const isClosestMenu = this.isClosestMenu(menu, target);
            /*if (isClosestMenu) {
                const {type, name, value} = target;
                if (type == "radio") {
                    this.querySelectorAll<HTMLEMenuItemElement>(
                        `:is(:scope, :scope > e-menuitemgroup) > e-menuitem[type=radio][name=${name}]`
                    )
                    .forEach((radio_i) => {
                        radio_i.checked = radio_i.value == value;
                    });
                }
            }
            if (contextual) {
                try {
                    this.remove();
                }
                catch (error) {};
            }*/
        }
    }
}));