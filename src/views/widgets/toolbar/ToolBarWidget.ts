import { element, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { toolbarItemWidget } from "./ToolBarItemWidget";

export { toolbarWidget };

declare global {
    interface WidgetNameMap {
        "toolbar": ToolBarWidgetFactory
    }
}

interface ToolBarWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }): HTMLElement;
    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void;
    getOrientation(toolbar: HTMLElement): ToolBarOrientation;
}

type ToolBarOrientation = "horizontal" | "vertical";

var toolbarWidget = new (
Widget({
    name: "toolbar"
})(class ToolBarWidgetFactoryBase extends WidgetFactory {
    #template: HTMLElement;
    #walker: TreeWalker;

    constructor() {
        super();
        this.#template = element("div", {
            attributes: {
                class: "toolbar",
                role: "toolbar",
                tabindex: -1
            }
        });
        this.#walker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        )
    }

    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
    }) {
        const toolbar = <HTMLElement>this.#template.cloneNode(true);
        toolbar.addEventListener("focus", this.#handleFocusEvent.bind(this));
        toolbar.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        toolbar.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        toolbar.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        toolbar.addEventListener("click", this.#handleClickEvent.bind(this));
        if (properties !== undefined) {
            const {id, classList, tabIndex} = properties;
            if (id !== undefined) {
                toolbar.id = id;
            }
            if (classList !== undefined) {
                toolbar.classList.add(...classList);
            }
            if (tabIndex !== undefined) {
                toolbar.tabIndex = tabIndex;
            }
        }
        return toolbar;
    }

    slot(toolbar: HTMLElement) {
        return toolbar;
    }

    #getActiveItem(toolbar: HTMLElement): HTMLElement | null {
        return toolbar.querySelector<HTMLElement>(
            ":is(:scope, :scope > .toolbaritemgroup) > .toolbaritem.active"
        );
    }

    items(toolbar: HTMLElement): HTMLElement[] {
        return Array.from(toolbar.querySelectorAll<HTMLElement>(
            ":is(:scope, :scope > .toolbaritemgroup) > .toolbaritem"
        ));
    }

    setOrientation(toolbar: HTMLElement, value: ToolBarOrientation): void {
        toolbar.setAttribute("aria-orientation", value);
    }

    getOrientation(toolbar: HTMLElement): ToolBarOrientation {
        return <ToolBarOrientation>toolbar.getAttribute("aria-orientation") ?? "horizontal";
    }

    #walkerNodeFilter(node: Node) {
        if (node instanceof HTMLElement) {
            const {classList} = node;
            if (classList.contains("toolbaritem") && !toolbarItemWidget.getDisabled(node)) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("toolbaritemgroup")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    }

    #firstItem(toolbar: Element): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = toolbar;
        return <HTMLElement | null>walker.firstChild();
    }

    #lastItem(toolbar: Element): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = toolbar;
        return <HTMLElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const previousItem = <HTMLElement | null>walker.previousSibling();
        return previousItem;
    }

    #nextItem(item: HTMLElement): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLElement | null>walker.nextSibling();
    }

    #firstChildItem(item: HTMLElement): HTMLElement | null {
        const menu = toolbarItemWidget.menu(item);
        if (menu) {
            const walker = this.#walker;
            walker.currentNode = menu;
            return <HTMLElement | null>walker.firstChild();
        }
        return null;
    }

    #setActiveItem(tree: HTMLElement, item: HTMLElement | null): void {
        const activeItem = this.#getActiveItem(tree);
        if (activeItem !== null && activeItem !== item) {
            toolbarItemWidget.setActive(activeItem, false);
            activeItem.tabIndex = -1;
        }
        if (item !== null) {
            toolbarItemWidget.setActive(item, true);
            item.tabIndex = 0;
        }
    }

    #handleClickEvent(event: Event): void {
        const {currentTarget, target} = event;
        const toolbar = <HTMLElement>currentTarget;
        const targetItem = <HTMLElement>(<HTMLElement>target).closest(".toolbaritem");
        if (targetItem) {
            const type = toolbarItemWidget.getType(targetItem);
            const name = toolbarItemWidget.getName(targetItem);
            const value = toolbarItemWidget.getType(targetItem);
            if (type == "radio") {
                toolbar.querySelectorAll<HTMLElement>(
                    `:is(:scope, :scope > .toolbaritemgroup) > .toolbaritem[type=radio][name=${name}]`
                ).forEach((radio_i) => {
                    toolbarItemWidget.setPressed(radio_i, toolbarItemWidget.getValue(radio_i) == value);
                });
            }
            event.stopPropagation();
        }
    }

    #handleFocusEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetToolbar = <HTMLElement>currentTarget;
        const focusWithin = targetToolbar.contains(<Node>relatedTarget);
        if (!focusWithin) {
            const activeItem = this.#getActiveItem(targetToolbar);
            if (activeItem) {
                activeItem.focus();
            }
            else {
                const firstItem = this.#firstItem(targetToolbar);
                firstItem?.focus();
            }
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {currentTarget, target} = event;
        const targetToolbar = <HTMLElement>currentTarget;
        const targetItem = <HTMLElement | null>(<HTMLElement>target).closest(".toolbaritem");
        if (targetItem) {
            this.#setActiveItem(targetToolbar, targetItem);
            targetToolbar.tabIndex = -1;
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetToolbar = <HTMLElement>currentTarget;
        const lostFocusWithin = !targetToolbar.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.#setActiveItem(targetToolbar, null);
            targetToolbar.tabIndex = 0;
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {currentTarget, key} = event;
        const targetToolbar = <HTMLElement>currentTarget;
        const activeItem = this.#getActiveItem(targetToolbar);
        switch (key) {
            case "Enter":
            case " ": {
                if (activeItem) {
                    const type = toolbarItemWidget.getType(activeItem);
                    switch (type) {
                        case "menubutton": {
                            toolbarItemWidget.expand(activeItem);
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
            case "ArrowLeft": {
                if (activeItem) {
                    const previousItem = this.#previousItem(activeItem);
                    if (previousItem) {
                        previousItem.focus({preventScroll: true});
                    }
                }
                else {
                    const firstItem = this.#firstItem(targetToolbar);
                    if (firstItem) {
                        firstItem.focus({preventScroll: true});
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowRight": {
                if (activeItem) {
                    const nextItem = this.#nextItem(activeItem);
                    if (nextItem) {
                        nextItem.focus({preventScroll: true});
                    }
                }
                else {
                    const lastItem = this.#lastItem(targetToolbar);
                    if (lastItem) {
                        lastItem.focus({preventScroll: true});
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.#firstItem(targetToolbar);
                if (firstItem) {
                    firstItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem(targetToolbar);
                if (lastItem) {
                    lastItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                if (activeItem) {
                    activeItem.focus({preventScroll: true});
                }
                else {
                    targetToolbar.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
        }
    }
}));