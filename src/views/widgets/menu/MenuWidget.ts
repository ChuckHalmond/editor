import { Widget, element } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { menuItemWidget } from "./MenuItemWidget";

export { menuWidget };

declare global {
    interface WidgetNameMap {
        "menu": MenuWidgetFactory
    }
}

interface MenuWidgetFactory extends WidgetFactory {
    create(properties?: {
        contextual?: boolean;
    }): HTMLElement;
    positionContextual(menu: HTMLElement, x: number, y: number): void;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    items(menu: HTMLElement): HTMLElement[];
}

var mouseOverExpandDelay = 0_200;
var mouseOutCollapseDelay = 0_400;

var menuWidget = new (
Widget({
    name: "menu"
})(class MenuWidgetFactoryBase extends WidgetFactory implements MenuWidgetFactory {

    #template: HTMLElement;
    #walker: TreeWalker;
    #toggleTimeouts: WeakMap<HTMLElement, {clear(): void;}>;

    constructor() {
        super();
        this.#template = element("div", {
            attributes: {
                class: "menu",
                role: "menu",
                tabindex: -1
            }
        });
        this.#walker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.#toggleTimeouts = new WeakMap();
    }

    create(init?: {
        contextual?: boolean;
    }): HTMLElement {
        const menu = <HTMLElement>this.#template.cloneNode(true);
        menu.addEventListener("click", this.#handleClickEvent.bind(this));
        menu.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        menu.addEventListener("mouseout", this.#handleMouseOutEvent.bind(this));
        menu.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        menu.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        if (init !== void 0) {
            const {contextual} = init;
            if (contextual !== void 0) {
                this.setContextual(menu, contextual);
            }
        }
        return menu;
    }

    slot(menu: HTMLElement): HTMLElement | null {
        return menu;
    }

    positionContextual(menu: HTMLElement, x: number, y: number): void {
        const {style} = menu;
        const {width: menuWidth, height: menuHeight} = menu.getBoundingClientRect();
        const {scrollX, scrollY} = window;
        const left = x + scrollX;
        const top = y + scrollY;
        const {clientWidth, clientHeight} = document.body;
        const overflowX = left + menuWidth - clientWidth;
        const overflowY = top + menuHeight - clientHeight;
        style.setProperty("left", `${overflowX > 0 ? left - menuWidth : left}px`);
        style.setProperty("top", `${overflowY > 0 ? top - menuHeight : top}px`);
    }

    getContextual(menu: HTMLElement): boolean {
        const {classList} = menu;
        return classList.contains("menu-contextual");
    }

    setContextual(menu: HTMLElement, value: boolean): void {
        const {classList} = menu;
        if (value) {
            classList.add("menu-contextual");
        }
        else {
            classList.remove("menu-contextual");
        }
    }

    items(menu: HTMLElement): HTMLElement[] {
        return Array.from(menu.querySelectorAll<HTMLElement>(
            ":is(:scope, :scope > .menuitemgroup) > .menuitem"
        ));
    }

    #walkerNodeFilter(node: Node): number {
        if (node instanceof HTMLElement) {
            const {classList} = node;
            if (classList.contains("menuitem") && !menuItemWidget.getDisabled(node)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("menuitemgroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    }

    #collapseSubmenus(menu: HTMLElement): void {
        menu.querySelectorAll<HTMLElement>(":is(:scope, :scope > .menuitemgroup) > .menuitem[aria-expanded]")
            .forEach(menuitem_i => menuItemWidget.collapse(menuitem_i));
    }

    #isClosestMenu(menu: HTMLElement, target: HTMLElement): boolean {
        return target.closest(".menu") == menu;
    }

    #nearestItem(menu: HTMLElement, target: HTMLElement): HTMLElement | null {
        return Array.from(menu.querySelectorAll<HTMLElement>(
            ":is(:scope, :scope > .menuitemgroup) > .menuitem"
        )).find(item_i => item_i.contains(target)) ?? null;
    }

    #firstItem(menu: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = menu;
        return <HTMLElement | null>walker.firstChild();
    }

    #lastItem(menu: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = menu;
        return <HTMLElement | null>walker.lastChild();
    }

    #previousItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLElement | null>walker.previousSibling();
    }

    #nextItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLElement | null>walker.nextSibling();
    }

    #firstChildItem(item: HTMLElement): HTMLElement | null {
        const menu = menuItemWidget.getMenu(item);
        if (menu) {
            const walker = this.#walker;
            walker.currentNode = menu;
            return <HTMLElement | null>walker.firstChild();
        }
        return null;
    }

    #getActiveItem(menu: HTMLElement): HTMLElement | null {
        return menu.querySelector<HTMLElement>(
            ":is(:scope, :scope > .menuitemgroup) > .menuitem:focus-within"
        );
    }

    async #setItemTimeout(item: HTMLElement, delay?: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                resolve(void 0);
            }, delay ?? 0);
            this.#toggleTimeouts.set(item, {
                clear: () => {
                    clearTimeout(timeout);
                    reject();
                }
            });
        }).then(() => {
            this.#toggleTimeouts.delete(item);
        });
    }

    #clearItemTimeout(item: HTMLElement): void {
        const timeout = this.#toggleTimeouts.get(item);
        if (typeof timeout !== "undefined") {
            this.#toggleTimeouts.delete(item);
            timeout.clear();
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const targetMenu = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const contextual = this.getContextual(targetMenu);
            if (contextual) {
                try {
                    targetMenu.remove();
                }
                catch (error) {};
            }
            else {
                const isClosestMenu = this.#isClosestMenu(targetMenu, target);
                if (isClosestMenu) {
                    const type = menuItemWidget.getType(target);
                    const name = menuItemWidget.getName(target);
                    const value = menuItemWidget.getValue(target);
                    if (type == "radio") {
                        targetMenu.querySelectorAll<HTMLElement>(
                            `:is(:scope, :scope > .menuitemgroup) > .menuitem-radio[name=${name}]`
                        )
                        .forEach((radio_i) => {
                            menuItemWidget.setChecked(radio_i, menuItemWidget.getValue(radio_i) == value);
                        });
                    }
                }
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {target, currentTarget, relatedTarget} = event;
        const targetMenu = <HTMLElement>currentTarget;
        const lostFocusWithin = !targetMenu.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            const contextual = this.getContextual(targetMenu);
            if (contextual) {
                try {
                    targetMenu.remove();
                } catch (error) {
                    void 0;
                }
            }
            else {
                const nearestItem = this.#nearestItem(targetMenu, <HTMLElement>target);
                if (nearestItem) {
                    menuItemWidget.collapse(nearestItem);
                }
            }
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {currentTarget, key} = event;
        const targetMenu = <HTMLElement>currentTarget;
        const activeItem = this.#getActiveItem(targetMenu);
        switch (key) {
            case "ArrowUp": {
                const previousItem = activeItem ?
                    this.#previousItem(activeItem) ?? this.#lastItem(targetMenu) :
                    this.#firstItem(targetMenu);
                previousItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                const nextItem = activeItem ?
                    this.#nextItem(activeItem) ?? this.#firstItem(targetMenu) :
                    this.#firstItem(targetMenu);
                nextItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.#firstItem(targetMenu);
                firstItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem(targetMenu);
                lastItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "Enter":
            case " ": {
                if (activeItem) {
                    const type = menuItemWidget.getType(activeItem);
                    switch (type) {
                        case "submenu": {
                            menuItemWidget.expand(activeItem);
                            const firstChildItem = this.#firstChildItem(activeItem);
                            firstChildItem?.focus({preventScroll: true});
                            event.preventDefault();
                            break;
                        }
                    }
                    event.stopPropagation();
                }
                break;
            }
            case "Escape": {
                if (activeItem) {
                    const isTargetClosestMenu = event.composedPath().find(
                        target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")
                    ) == targetMenu;
                    if (!isTargetClosestMenu) {
                        menuItemWidget.collapse(activeItem);
                        activeItem.focus({preventScroll: true});
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowLeft": {
                if (activeItem) {
                    const isTargetClosestMenu = event.composedPath().find(
                        target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")
                    ) == targetMenu;
                    if (!isTargetClosestMenu) {
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
                                const firstChildItem = this.#firstChildItem(activeItem);
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
    }

    #handleMouseOutEvent(event: MouseEvent): void {
        const {target, currentTarget, relatedTarget} = event;
        const targetMenu = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const nearestItem = this.#nearestItem(targetMenu, target);
            if (nearestItem !== null) {
                if (menuItemWidget.getType(nearestItem) == "submenu" &&
                    !menuItemWidget.getExpanded(nearestItem)) {
                    this.#clearItemTimeout(nearestItem);
                }
                const isTargetClosestMenu = event.composedPath().find(
                    target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")
                ) == targetMenu;
                if (isTargetClosestMenu) {
                    const activeItem = this.#getActiveItem(targetMenu);
                    if (activeItem !== null &&
                        menuItemWidget.getType(activeItem) == "submenu" &&
                        menuItemWidget.getExpanded(activeItem)) {
                        this.#clearItemTimeout(activeItem);
                        this.#setItemTimeout(activeItem, mouseOutCollapseDelay)
                            .then(() => {
                                menuItemWidget.collapse(activeItem);
                            })
                            .catch(() => void 0);
                    }
                    const {clientX, clientY} = event;
                    const {left, right, top, bottom} = targetMenu.getBoundingClientRect();
                    const intersectsWithMouse = !(
                        left > clientX || right < clientX || top > clientY || bottom < clientY
                    );
                    const containsRelatedTarget = targetMenu.contains(<Node>relatedTarget);
                    if (intersectsWithMouse && containsRelatedTarget) {
                        if (relatedTarget instanceof HTMLElement && relatedTarget.classList.contains("menu") && relatedTarget !== targetMenu) {
                            relatedTarget.focus({preventScroll: true});
                        }
                        else {
                            targetMenu.focus({preventScroll: true});
                        }
                    }
                    if (!intersectsWithMouse) {
                        targetMenu.focus({preventScroll: true});
                    }
                }
            }
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const targetMenu = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const nearestItem = this.#nearestItem(targetMenu, target); 
            if (nearestItem !== null) {
                if (menuItemWidget.getType(nearestItem) == "submenu" &&
                    menuItemWidget.getExpanded(nearestItem)) {
                    this.#clearItemTimeout(nearestItem);
                }
                const isTargetClosestMenu = event.composedPath().find(
                    target_i => target_i instanceof HTMLElement && target_i.classList.contains("menu")
                ) == targetMenu;
                if (isTargetClosestMenu) {
                    const activeItem = this.#getActiveItem(targetMenu);
                    if (activeItem !== null) {
                        if (menuItemWidget.getType(activeItem) == "submenu" &&
                            menuItemWidget.getExpanded(activeItem) && 
                            !activeItem.contains(<HTMLElement>target)) {
                            this.#clearItemTimeout(activeItem);
                            this.#setItemTimeout(activeItem, mouseOutCollapseDelay)
                                .then(() => {
                                    menuItemWidget.collapse(activeItem);
                                })
                                .catch(() => void 0);
                        }
                    }
                    nearestItem.focus({preventScroll: true});
                    if (menuItemWidget.getType(nearestItem) == "submenu") {
                        if (!menuItemWidget.getExpanded(nearestItem)) {
                            this.#clearItemTimeout(nearestItem);
                            this.#setItemTimeout(nearestItem, mouseOverExpandDelay)
                                .then(() => {
                                    const activeItem = this.#getActiveItem(targetMenu);
                                    this.#collapseSubmenus(targetMenu);
                                    if (activeItem) {
                                        this.#clearItemTimeout(activeItem);
                                        menuItemWidget.expand(activeItem);
                                        menuItemWidget.getMenu(activeItem)?.focus({preventScroll: true});
                                    }
                                })
                                .catch(() => void 0);
                        }
                        else {
                            menuItemWidget.getMenu(nearestItem)?.focus({preventScroll: true});
                        }
                    }
                }
            }
        }
    }
}));