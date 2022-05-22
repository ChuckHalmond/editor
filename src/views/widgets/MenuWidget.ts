import { CustomWidget, element } from "../../elements/Element";
import { Collection } from "../../observers/Collection";
import { MenuItemWidget, menuItemWidgets } from "./MenuItemWidget";
import { Widget } from "./Widget";

export { MenuWidget };
export { menuWidgets };

interface MenuWidgetConstructor {
    readonly prototype: MenuWidget;
    new(items: MenuItemWidget[]): MenuWidget;
}

interface MenuWidget extends Widget {
    readonly items: MenuItemWidget[];
    readonly activeItem: MenuItemWidget | null;
    insertItems(index: number, ...items: MenuItemWidget[]): void;
}

declare global {
    interface WidgetNameMap {
        "menu": MenuWidget;
    }

    interface WidgetWritablePropertiesMap {
        "menu": Pick<MenuWidget, never>;
    }
}

var widgetTemplate: HTMLTemplateElement;
var menuWidgets: WeakMap<Element, MenuWidget>;
var toggleTimeouts: WeakMap<MenuItemWidget, {clear(): void;}>;

@CustomWidget({
    name: "menu"
})
class MenuWidgetBase extends Widget implements MenuWidget {

    get #itemElements() {
        return this.#items.values();
    }

    get items(): MenuItemWidget[] {
        return <MenuItemWidget[]>Array.from(this.#itemElements).map(
            element_i => menuItemWidgets.get(element_i)
        ).filter(item_i => item_i !== void 0);
    }

    get activeItem(): MenuItemWidget | null {
        return this.#activeItem;
    }

    #activeItem: MenuItemWidget | null;
    #walker: TreeWalker;

    static {
        widgetTemplate = element("template", {
            content: [
                element("menu", {
                    properties: {
                        className: "menu",
                        tabIndex: -1
                    },
                    attributes: {
                        role: "menu"
                    }
                })
            ]
        });
        menuWidgets = new WeakMap();
        toggleTimeouts = new WeakMap();
    }

    #items: Collection;

    constructor() {
        super(<HTMLElement>widgetTemplate.content.cloneNode(true).firstChild);
        const {element} = this;
        this.#items = new Collection(element, <NodeFilter>this.#walkerNodeFilter.bind(this));
        this.#activeItem = null;
        this.#walker = document.createTreeWalker(
            element, NodeFilter.SHOW_ELEMENT, <NodeFilter>this.#walkerNodeFilter.bind(this)
        );
        element.addEventListener("click", this.#handleClickEvent.bind(this));
        element.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        element.addEventListener("mouseout", this.#handleMouseOutEvent.bind(this));
        element.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        element.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        element.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        element.addEventListener("trigger", this.#handleTriggerEvent.bind(this));
        menuWidgets.set(element, this);
    }

    insertItems(index: number, ...items: MenuItemWidget[]) {
        const {items: _items, element} = this;
        if (_items.length > index) {
            _items[index].element.after(...items.map(item_i => item_i.element));
        }
        else {
            element.append(...items.map(item_i => item_i.element));
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
        this.items
            .forEach((item_i) => {
                item_i.collapse()
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
        walker.currentNode = item.element;
        return <HTMLElement | null>walker.previousNode();
    }

    #nextItem(item: MenuItemWidget): HTMLElement | null {
        const walker = this.#walker;
        walker.currentNode = item.element;
        return <HTMLElement | null>walker.nextNode();
    }

    #firstChildItem(item: MenuItemWidget): HTMLElement | null {
        const {menu} = item;
        if (menu == null) {
            return null;
        }
        const walker = this.#walker;
        walker.currentNode = menu.element;
        return <HTMLElement | null>walker.firstChild();
    }

    #setActiveItem(item: MenuItemWidget | null): void {
        const {activeItem} = this;
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
            const item = menuItemWidgets.get(target);
            if (item !== void 0) {
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
            const item = menuItemWidgets.get(target);
            if (item !== void 0) {
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
            toggleTimeouts.set(item, {
                clear: () => {
                    clearTimeout(timeout);
                    reject();
                }
            });
        }).then(() => {
            toggleTimeouts.delete(item);
        });
    }

    #clearItemTimeout(item: MenuItemWidget): void {
        const timeout = toggleTimeouts.get(item);
        if (typeof timeout !== "undefined") {
            toggleTimeouts.delete(item);
            timeout.clear();
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {key} = event;
        const {element, activeItem} = this;
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
                    ) == element;
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
                    ) == element;
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
        event.preventDefault();
    }

    #closestItem(target: Element): MenuItemWidget | null {
        const {element} = this;
        const targetElement = target.closest(".menuitem");
        if (targetElement !== null && element.contains(targetElement)) {
            const itemWidget = menuItemWidgets.get(targetElement);
            if (itemWidget !== void 0) {
                return itemWidget;
            }
        }
        return null;
    }

    #handleMouseOutEvent(event: MouseEvent): void {
        const {target, relatedTarget} = event;
        const {element} = this;
        const targetClosestItemWidget = target instanceof Element ? this.#closestItem(target) : null;
        if (targetClosestItemWidget?.hasPopup && !targetClosestItemWidget.expanded) {
            this.#clearItemTimeout(targetClosestItemWidget);
        }
        const isTargetClosestMenu = event.composedPath().find(
            target_i => target_i instanceof HTMLMenuElement
        ) == element;
        if (isTargetClosestMenu) {
            const {clientX, clientY} = event;
            const {left, right, top, bottom} = element.getBoundingClientRect();
            const intersectsWithMouse = !(
                left > clientX || right < clientX || top > clientY || bottom < clientY
            );
            const containsRelatedTarget = element.contains(<Node>relatedTarget);
            if (intersectsWithMouse && containsRelatedTarget) {
                if (relatedTarget instanceof HTMLMenuElement && relatedTarget !== element) {
                    relatedTarget.focus({preventScroll: true});
                }
                else {
                    /*const {activeItem} = this;
                    if (activeItem !== null) {
                        activeItem.active = false;
                    }*/
                    this.focus({preventScroll: true});
                    this.#setActiveItem(null);
                }
            }
            if (!intersectsWithMouse) {
                this.focus({preventScroll: true});
                this.#setActiveItem(null);
                /*const {activeItem} = this;
                if (activeItem !== null) {
                    activeItem.active = false;
                }*/
            }
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target} = event;
        const {element} = this;
        const targetClosestItemWidget = target instanceof Element ? this.#closestItem(target) : null; 
        if (targetClosestItemWidget?.hasPopup && targetClosestItemWidget.expanded) {
            this.#clearItemTimeout(targetClosestItemWidget);
        }
        const isTargetClosestMenu = event.composedPath().find(
            target_i => target_i instanceof HTMLMenuElement
        ) == element;
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