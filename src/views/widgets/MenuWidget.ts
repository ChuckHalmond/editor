import { CustomWidget, element } from "../../elements/Element";
import { MenuItemWidget } from "./MenuItemWidget";
import { Widget } from "./Widget";

export { MenuWidget };

interface MenuWidgetConstructor {
    readonly prototype: MenuWidget;
    new(items: MenuItemWidget[]): MenuWidget;
}

interface MenuWidget extends Widget {
    readonly activeItem: MenuItemWidget | null;
    insertItem(index: number, ...items: MenuItemWidget[]): void;
}

declare global {
    interface WidgetNameMap {
        "menu": MenuWidget;
    }
}

@CustomWidget({
    name: "menu"
})
class MenuWidgetBase extends Widget implements MenuWidget {

    readonly #items: HTMLCollectionOf<Element>;

    get activeItem(): MenuItemWidget | null {
        return this.#activeItem;
    }

    #activeItem: MenuItemWidget | null;
    #toggleTimeouts: WeakMap<MenuItemWidget, {clear(): void;}>;
    #walker: TreeWalker;

    constructor() {
        super();
        const {rootElement} = this;
        this.#items = rootElement.getElementsByClassName("menuitem");
        this.#activeItem = null;
        this.#toggleTimeouts = new WeakMap();
        this.#walker = document.createTreeWalker(
            rootElement, NodeFilter.SHOW_ELEMENT, <NodeFilter>this.#walkerNodeFilter.bind(this)
        );
        rootElement.addEventListener("click", this.#handleClickEvent.bind(this));
        rootElement.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        rootElement.addEventListener("mouseout", this.#handleMouseOutEvent.bind(this));
        rootElement.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        rootElement.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        rootElement.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        rootElement.addEventListener("trigger", this.#handleTriggerEvent.bind(this));
    }

    render() {
        return element("menu", {
            properties: {
                className: "menu",
                tabIndex: -1
            },
            attributes: {
                role: "menu"
            }
        });
    }

    insertItem(index: number, ...items: MenuItemWidget[]): void {
        const {rootElement} = this;
        //this.items.splice(index, 0, ...items);
        if (rootElement.children.length === 0) {
            rootElement.append(...items.map(item => item.rootElement));
        }
        else {
            rootElement.children.item(Math.max(rootElement.children.length, index))!
                .before(...items.map(item => item.rootElement)
            );
        }
    }

    #walkerNodeFilter(element: Element): number {
        const {classList} = element;
        if (classList.contains("menuitem")) {
            return NodeFilter.FILTER_ACCEPT;
        }
        else if (classList.contains("menuitemgroup")) {
            return NodeFilter.FILTER_SKIP;
        }
        else {
            return NodeFilter.FILTER_REJECT;
        }
    }

    #collapseSubmenus(): void {
        Array.from(this.#items)
            .forEach((item_i) => {
                MenuItemWidget.fromRoot(item_i)?.collapse()
            });
    }

    #firstItem(): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLElement | null>walker.firstChild();
    }

    #lastItem(): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLElement | null>walker.lastChild();
    }
    
    #previousItem(item: MenuItemWidget): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item.rootElement;
        return <HTMLElement | null>walker.previousNode();
    }

    #nextItem(item: MenuItemWidget): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item.rootElement;
        return <HTMLElement | null>walker.nextNode();
    }

    #firstChildItem(item: MenuItemWidget): HTMLElement | null {
        const {menu} = item;
        if (menu == null) {
            return null;
        }
        const walker = this.#walker;
        walker.currentNode = menu.rootElement;
        return <HTMLElement | null>walker.firstChild();
    }

    #setActiveItem(item: MenuItemWidget | null): void {
        const {activeItem} = this;
        console.log(activeItem);
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
        }
        if (item !== null && activeItem !== item) {
            item.active = true;
        }
        this.#activeItem = item;
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        if (target instanceof HTMLButtonElement) {
            const item = MenuItemWidget.fromRoot(target);
            if (item) {
                item.trigger();
            }
            event.stopPropagation();
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        /*const {target} = event;
        const {items} = this;
        const targetClosestItem = Array.from(items).find(
            item_i => item_i.contains(<HTMLElement>target)
        ) ?? null;
        if (targetClosestItem) {
            this.#setActiveItem(targetClosestItem);
        }*/
        const {target} = event;
        if (target instanceof HTMLButtonElement) {
            const item = MenuItemWidget.fromRoot(target);
            if (item) {
                this.#setActiveItem(item);
            }
            event.stopPropagation();
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<HTMLElement>relatedTarget);
        if (lostFocusWithin) {
            /*const {contextual} = this;
            if (contextual) {
                this.remove();
            }
            else {*/
                const {activeItem} = this;
                activeItem?.collapse();
                this.#setActiveItem(null);
            //}
        }
    }

    async #setItemTimeout(item: MenuItemWidget, delay?: number): Promise<void> {
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

    #clearItemTimeout(item: MenuItemWidget): void {
        const timeout = this.#toggleTimeouts.get(item);
        if (typeof timeout !== "undefined") {
            this.#toggleTimeouts.delete(item);
            timeout.clear();
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {key} = event;
        const {rootElement, activeItem} = this;
        switch (key) {
            case "ArrowUp": {
                const previousItem = activeItem ?
                    this.#previousItem(activeItem) ?? this.#lastItem() :
                    this.#firstItem();
                previousItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                const nextItem = activeItem ?
                    this.#nextItem(activeItem) ?? this.#firstItem() :
                    this.#firstItem();
                nextItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "Home": {
                const firstItem = this.#firstItem();
                firstItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem();
                lastItem?.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
            case "Enter": {
                if (activeItem) {
                    const {hasPopup} = activeItem;
                    if (hasPopup) {
                        activeItem.expand();
                        if (activeItem.expanded) {
                            const firstChildItem = this.#firstChildItem(activeItem);
                            firstChildItem?.focus({preventScroll: true});
                        }
                    }
                    else {
                        activeItem.click();
                    }
                    event.stopPropagation();
                }
                break;
            }
            case "Escape": {
                if (activeItem) {
                    const isClosestTargetMenu = event.composedPath().find(
                        target_i => target_i instanceof HTMLMenuElement
                    ) == rootElement;
                    if (!isClosestTargetMenu) {
                        activeItem.collapse();
                        activeItem.focus({preventScroll: true});
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowLeft": {
                if (activeItem) {
                    const isClosestTargetMenu = event.composedPath().find(
                        target_i => target_i instanceof HTMLMenuElement
                    ) == rootElement;
                    if (!isClosestTargetMenu) {
                        activeItem.collapse();
                        activeItem.focus({preventScroll: true});
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "ArrowRight": {
                if (activeItem) {
                    const {hasPopup} = activeItem;
                    if (hasPopup) {
                        activeItem.expand();
                        const firstChildItem = this.#firstChildItem(activeItem);
                        firstChildItem?.focus({preventScroll: true});
                        event.stopPropagation();
                    }
                }
                break;
            }
        }
    }

    #closestItem(target: Element): MenuItemWidget | null {
        const {rootElement} = this;
        const targetElement = target.closest(".menuitem");
        if (targetElement !== null && rootElement.contains(targetElement)) {
            const item = MenuItemWidget.fromRoot(targetElement);
            if (item !== void 0) {
                return item;
            }
        }
        return null;
    }

    #handleMouseOutEvent(event: MouseEvent): void {
        const {target, relatedTarget} = event;
        const {rootElement} = this;
        const targetClosestItemWidget = target instanceof Element ? this.#closestItem(target) : null;
        if (targetClosestItemWidget?.hasPopup && !targetClosestItemWidget.expanded) {
            this.#clearItemTimeout(targetClosestItemWidget);
        }
        const isTargetClosestMenu = event.composedPath().find(
            target_i => target_i instanceof HTMLMenuElement
        ) == rootElement;
        if (isTargetClosestMenu) {
            const {clientX, clientY} = event;
            const {left, right, top, bottom} = rootElement.getBoundingClientRect();
            const intersectsWithMouse = !(
                left > clientX || right < clientX || top > clientY || bottom < clientY
            );
            const containsRelatedTarget = rootElement.contains(<Node>relatedTarget);
            if (intersectsWithMouse && containsRelatedTarget) {
                if (relatedTarget instanceof HTMLMenuElement && relatedTarget !== rootElement) {
                    relatedTarget.focus({preventScroll: true});
                }
                else {
                    rootElement.focus({preventScroll: true});
                    /*const {activeItem} = this;
                    if (activeItem !== null) {
                        activeItem.active = false;
                    }*/
                }
            }
            if (!intersectsWithMouse) {
                rootElement.focus({preventScroll: true});
                /*const {activeItem} = this;
                if (activeItem !== null) {
                    activeItem.active = false;
                }*/
            }
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target} = event;
        const {rootElement} = this;
        const targetClosestItemWidget = target instanceof Element ? this.#closestItem(target) : null; 
        if (targetClosestItemWidget?.hasPopup && targetClosestItemWidget.expanded) {
            this.#clearItemTimeout(targetClosestItemWidget);
        }
        const isTargetClosestMenu = event.composedPath().find(
            target_i => target_i instanceof HTMLMenuElement
        ) == rootElement;
        if (isTargetClosestMenu) {
            const {activeItem} = this;
            if (activeItem?.hasPopup && activeItem.expanded && 
                !activeItem.contains(<HTMLElement>target)) {
                this.#clearItemTimeout(activeItem);
                this.#setItemTimeout(activeItem, 400)
                    .then(() => {
                        activeItem.collapse();
                    })
                    .catch(() => void 0);
            }
            if (targetClosestItemWidget !== null) {
                this.#setActiveItem(targetClosestItemWidget);
                targetClosestItemWidget.focus({preventScroll: true});
                if (targetClosestItemWidget.hasPopup) {
                    if (!targetClosestItemWidget.expanded) {
                        this.#clearItemTimeout(targetClosestItemWidget);
                        this.#setItemTimeout(targetClosestItemWidget, 200)
                            .then(() => {
                                const {activeItem} = this;
                                this.#collapseSubmenus();
                                if (activeItem) {
                                    this.#clearItemTimeout(activeItem);
                                    activeItem.expand();
                                    activeItem.menu?.focus({preventScroll: true});
                                }
                            })
                            .catch(() => void 0);
                    }
                    else {
                        if (activeItem) {
                            activeItem.menu?.focus({preventScroll: true});
                        }
                    }
                }
            }
        }
    }

    #handleTriggerEvent(event: Event): void {
        const {target} = event;
        /*if (target instanceof HTMLButtonElement) {
            const item = MenuItemWidget.fromRoot(target);
            if (item !== void 0) {
                item
            }
        }*/
    }
}

var MenuWidget: MenuWidgetConstructor = MenuWidgetBase;