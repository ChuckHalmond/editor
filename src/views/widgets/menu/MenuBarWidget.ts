import { element, Widget } from "../../../elements/Element";
import { menuItemWidget } from "./MenuItemWidget";
import { WidgetFactory } from "../Widget";

export { menuBarWidget };

declare global {
    interface WidgetNameMap {
        "menubar": MenuBarWidgetFactory
    }
}

interface MenuBarWidgetFactory extends WidgetFactory {
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
}

var menuBarWidget = new (
Widget({
    name: "menubar"
})(class MenubarWidgetFactoryBase extends WidgetFactory {
    #template: HTMLElement;
    #walker: TreeWalker;

    constructor() {
        super();
        this.#template = element("div", {
            attributes: {
                class: "menubar",
                role: "menubar",
                tabindex: 0
            }
        });
        this.#walker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        )
    }

    create() {
        const menubar = <HTMLElement>this.#template.cloneNode(true);
        menubar.addEventListener("click", this.#handleClickEvent.bind(this));
        menubar.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        menubar.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        menubar.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        menubar.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        return menubar;
    }

    slot(menubar: HTMLElement) {
        return menubar;
    }

    setExpanded(menubar: HTMLElement, value: boolean): void {
        menubar.toggleAttribute("aria-expanded", value);
    }

    getExpanded(menubar: HTMLElement): boolean {
        return menubar.hasAttribute("aria-expanded");
    }

    #walkerNodeFilter(node: Node) {
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

    #getActiveItem(menubar: HTMLElement): HTMLElement | null {
        return menubar.querySelector<HTMLElement>(
            ":is(:scope, :scope > .menuitemgroup) > .menuitem:focus-within"
        );
    }

    #firstItem(menubar: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = menubar;
        return <HTMLElement | null>walker.firstChild();
    }

    #lastItem(menubar: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = menubar;
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

    #isClosestMenu(menubar: HTMLElement, target: HTMLElement): boolean {
        return target.closest(":is(.menubar, .menu)") == menubar;
    }

    #nearestItem(menubar: HTMLElement, target: HTMLElement): HTMLElement | null {
        return Array.from(menubar.querySelectorAll<HTMLElement>(
            ":is(:scope, :scope > .menuitemgroup) > .menuitem"
        )).find(item_i => item_i.contains(target)) ?? null;
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        const targetItem = <HTMLElement>(<HTMLElement>target).closest(".menuitem");
        if (targetItem) {
            const expanded = this.getExpanded(menubar);
            const isClosestMenu = this.#isClosestMenu(menubar, targetItem);
            if (isClosestMenu) {
                const isExpanded = !expanded;
                this.setExpanded(menubar, isExpanded);
                if (isExpanded) {
                    if (targetItem !== null && !menuItemWidget.getExpanded(targetItem)) {
                        menuItemWidget.expand(targetItem);
                    }
                    const menu = menuItemWidget.getMenu(targetItem);
                    menu?.focus({preventScroll: true});
                }
                else {
                    menubar.focus({preventScroll: true})
                }
            }
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target, currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && this.getExpanded(menubar)) {
            const nearestItem = this.#nearestItem(menubar, target);
            if (nearestItem) {
                menuItemWidget.expand(nearestItem);
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {target, currentTarget, relatedTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && !target.contains(<Element>relatedTarget)) {
            const nearestItem = this.#nearestItem(menubar, target);
            if (nearestItem) {
                menuItemWidget.collapse(nearestItem);
            }
        }
        const lostFocusWithin = !menubar.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.setExpanded(menubar, false);
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target, currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        if (target instanceof HTMLElement && target.classList.contains("menuitem")) {
            const activeItem = this.#getActiveItem(menubar);
            const expanded = this.getExpanded(menubar);
            const isClosestMenu = this.#isClosestMenu(menubar, target);
            if (isClosestMenu && target !== activeItem && expanded) {
                const menu = menuItemWidget.getMenu(target);
                if (menu) {
                    menu.focus({preventScroll: true});
                }
                else {
                    target.focus({preventScroll: true});
                }
            }
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {key, currentTarget} = event;
        const menubar = <HTMLElement>currentTarget;
        let activeItem = this.#getActiveItem(menubar);
        const expanded = this.getExpanded(menubar);
        switch (key) {
            case "ArrowLeft": {
                const previousItem = activeItem ?
                    this.#previousItem(activeItem) ?? this.#lastItem(menubar) :
                    this.#firstItem(menubar);
                previousItem?.focus({preventScroll: true});
                activeItem = this.#getActiveItem(menubar);
                if (expanded && activeItem) {
                    const firstChildItem = this.#firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
                }
                break;
            }
            case "ArrowRight": {
                const nextItem = activeItem ?
                    this.#nextItem(activeItem) ?? this.#firstItem(menubar) : 
                    this.#lastItem(menubar);
                nextItem?.focus({preventScroll: true});
                activeItem = this.#getActiveItem(menubar);
                if (expanded && activeItem) {
                    const firstChildItem = this.#firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
                }
                break;
            }
            case "Enter":
            case " ": {
                if (activeItem) {
                    this.setExpanded(menubar, !expanded);
                    const firstChildItem = this.#firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
                    event.preventDefault();
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
    }
}));