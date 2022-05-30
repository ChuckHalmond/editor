import { CustomWidget, element } from "../../elements/Element";
import { menuItemWidget } from "./MenuItemWidget";

declare global {
    interface WidgetNameMap {
        "menubar": typeof menubarWidget
    }
}

var menubarWidget = CustomWidget({
    name: "menubar"
})(Object.freeze({
    template: element("menu", {
        properties: {
            className: "menubar",
            tabIndex: -1
        },
        attributes: {
            role: "menubar"
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

    create() {
        const menubar = <typeof this.template>this.template.cloneNode(true);
        menubar.addEventListener("click", this.handleClickEvent.bind(this));
        menubar.addEventListener("focusin", this.handleFocusInEvent.bind(this));
        menubar.addEventListener("focusout", this.handleFocusOutEvent.bind(this));
        menubar.addEventListener("mouseover", this.handleMouseOverEvent.bind(this));
        menubar.addEventListener("keydown", this.handleKeyDownEvent.bind(this));
        menubar.addEventListener("trigger", this.handleTriggerEvent.bind(this));
        return menubar;
    },

    setExpanded(menubar: HTMLElement, value: boolean): void {
        menubar.toggleAttribute("aria-expanded", value);
    },

    getExpanded(menubar: HTMLElement): boolean {
        return menubar.hasAttribute("aria-expanded");
    },

    getActiveItem(menubar: HTMLElement): HTMLElement | null {
        return menubar.querySelector<HTMLElement>(
            ":is(:scope, :scope > .menuitemgroup) > .menuitem[aria-active]"
        );
    },

    firstItem(menubar: HTMLElement): HTMLElement | null {
        const {walker} = this;
        walker.currentNode = menubar;
        return <HTMLElement | null>walker.firstChild();
    },

    lastItem(menubar: HTMLElement): HTMLElement | null {
        const {walker} = this;
        walker.currentNode = menubar;
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

    setActiveItem(menubar: HTMLElement, item: HTMLElement | null): void {
        const activeItem = this.getActiveItem(menubar);
        const expanded = this.getExpanded(menubar);
        if (activeItem !== null && activeItem !== item) {
            menuItemWidget.collapse(activeItem);
            menuItemWidget.setActive(activeItem, false);
        }
        if (item !== null) {
            if (expanded) {
                menuItemWidget.expand(item);
            }
            menuItemWidget.setActive(item, true);
        }
    },

    isClosestMenu(menubar: HTMLElement, target: Element): boolean {
        return target.closest(":is(.menubar, .menu)") == menubar;
    },

    nearestItem(menubar: HTMLElement, target: Element): HTMLElement | null {
        return Array.from(menubar.querySelectorAll<HTMLElement>(
            ":is(:scope, :scope > .menuitemgroup) > .menuitem"
        )).find(item_i => item_i.contains(target)) ?? null;
    },

    handleFocusInEvent(event: FocusEvent): void {
        const {target, currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        if (target instanceof Element) {
            const nearestItem = this.nearestItem(menubar, target);
            this.setActiveItem(menubar, nearestItem);
        }
    },

    handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget, currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        const lostFocusWithin = !menubar.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            const activeItem = this.getActiveItem(menubar);
            if (activeItem && this.getExpanded(activeItem)) {
                menuItemWidget.collapse(activeItem);
            }
            this.setActiveItem(menubar, null);
            this.setExpanded(menubar, false);
        }
    },

    handleMouseOverEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const activeItem = this.getActiveItem(menubar);
            const expanded = this.getExpanded(menubar);
            const isClosestMenu = this.isClosestMenu(menubar, target);
            if (isClosestMenu && target !== activeItem && expanded) {
                const menu = menuItemWidget.menu(target);
                if (menu) {
                    menuItemWidget.expand(target);
                    menu.focus({preventScroll: true});
                }
            }
        }
    },

    handleClickEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        const activeItem = this.getActiveItem(menubar);
        const expanded = this.getExpanded(menubar);
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const isClosestMenu = this.isClosestMenu(menubar, target);
            if (isClosestMenu) {
                const isExpanded = !expanded;
                this.setExpanded(menubar, isExpanded);
                if (isExpanded) {
                    if (activeItem !== null && !menuItemWidget.getExpanded(activeItem)) {
                        menuItemWidget.expand(activeItem);
                    }
                    const menu = menuItemWidget.menu(target);
                    menu?.focus({preventScroll: true});
                }
                else {
                    menubar.focus({preventScroll: true})
                }
            }
        }
    },

    handleKeyDownEvent(event: KeyboardEvent): void {
        const {key, currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        let activeItem = this.getActiveItem(menubar);
        const expanded = this.getExpanded(menubar);
        switch (key) {
            case "ArrowLeft": {
                const previousItem = activeItem ?
                    this.previousItem(activeItem) ?? this.lastItem(menubar) :
                    this.firstItem(menubar);
                previousItem?.focus({preventScroll: true});
                activeItem = this.getActiveItem(menubar);
                if (expanded && activeItem) {
                    const firstChildItem = this.firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
                }
                break;
            }
            case "ArrowRight": {
                const nextItem = activeItem ?
                    this.nextItem(activeItem) ?? this.firstItem(menubar) : 
                    this.lastItem(menubar);
                nextItem?.focus({preventScroll: true});
                activeItem = this.getActiveItem(menubar);
                if (expanded && activeItem) {
                    const firstChildItem = this.firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
                }
                break;
            }
            case "Enter": {
                if (activeItem) {
                    this.setExpanded(menubar, !expanded);
                    const firstChildItem = this.firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
                }
                break;
            }
            case "Escape": {
                if (expanded) {
                    this.setExpanded(menubar, false);
                    if (activeItem) {
                        menuItemWidget.collapse(activeItem);
                        activeItem.focus({preventScroll: true});
                    }
                }
                else {
                    menubar.focus({preventScroll: true});
                }
                break;
            }
        }
    },

    handleTriggerEvent(event: Event): void {
        const {currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        const activeItem = this.getActiveItem(menubar);
        if (activeItem !== null && menuItemWidget.getExpanded(activeItem)) {
            menuItemWidget.collapse(activeItem);
        }
        this.setExpanded(menubar, false);
        menubar.focus({preventScroll: true});
    }
}));