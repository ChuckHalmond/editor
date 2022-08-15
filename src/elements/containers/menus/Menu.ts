import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuElement };
export { EMenu };

interface HTMLEMenuElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly activeItem: HTMLEMenuItemElement | null;
    items(): HTMLEMenuItemElement[];
    name: string;
    contextual: boolean;
    positionContextual(x: number, y: number): void;
}

interface HTMLEMenuElementConstructor {
    prototype: HTMLEMenuElement;
    new(): HTMLEMenuElement;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menu": HTMLEMenuElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var toggleTimeouts: WeakMap<HTMLEMenuItemElement, {clear(): void;}>;

@CustomElement({
    name: "e-menu"
})
class HTMLEMenuElementBase extends HTMLElement implements HTMLEMenuElement {

    readonly shadowRoot!: ShadowRoot;

    items(): HTMLEMenuItemElement[] {
        return Array.from(this.querySelectorAll<HTMLEMenuItemElement>(
            ":is(:scope, :scope > e-menuitemgroup) > e-menuitem"
        ));
    }

    get activeIndex(): number {
        return this.#activeIndex;
    }

    get activeItem(): HTMLEMenuItemElement | null {
        const {activeIndex} = this;
        return this.querySelector<HTMLEMenuItemElement>(
            ":is(:scope, :scope > e-menuitemgroup) > e-menuitem:focus-within"
        ) ?? activeIndex > -1 ? this.items()[activeIndex] ?? null : null;
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Boolean})
    contextual!: boolean;

    #walker: TreeWalker;
    #activeIndex: number;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        toggleTimeouts = new WeakMap();
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        this.#activeIndex = -1;
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.addEventListener("mouseout", this.#handleMouseOutEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
    }

    positionContextual(x: number, y: number): void {
        const {style} = this;
        const {width: menuWidth, height: menuHeight} = this.getBoundingClientRect();
        const {scrollX, scrollY} = window;
        const left = x + scrollX;
        const top = y + scrollY;
        const {clientWidth, clientHeight} = document.body;
        const overflowX = left + menuWidth - clientWidth;
        const overflowY = top + menuHeight - clientHeight;
        style.setProperty("left", `${overflowX > 0 ? left - menuWidth : left}px`);
        style.setProperty("top", `${overflowY > 0 ? top - menuHeight : top}px`);
    }

    #collapseSubmenus(): void {
        this.querySelectorAll<HTMLEMenuItemElement>(
            ":is(:scope, :scope > e-menuitemgroup) > e-menuitem[expanded]"
        )
        .forEach((item_i) => {
            item_i.collapse();
        });
    }

    #isClosestMenu(target: Element): boolean {
        return target.closest(":is(e-menu)") == this;
    }

    #nearestItem(target: Element): HTMLEMenuItemElement | null {
        return Array.from(this.querySelectorAll<HTMLEMenuItemElement>(
            ":is(:scope, :scope > e-menuitemgroup) > e-menuitem"
        )).find(item_i => item_i.contains(target)) ?? null;
    }

    #walkerNodeFilter(node: Node): number {
        if (node instanceof HTMLEMenuItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEMenuItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    #firstItem(): HTMLEMenuItemElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLEMenuItemElement | null>walker.firstChild();
    }

    #lastItem(): HTMLEMenuItemElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLEMenuItemElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLEMenuItemElement): HTMLEMenuItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLEMenuItemElement | null>walker.previousNode();
    }

    #nextItem(item: HTMLEMenuItemElement): HTMLEMenuItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLEMenuItemElement | null>walker.nextNode();
    }

    #firstChildItem(item: HTMLEMenuItemElement): HTMLEMenuItemElement | null {
        const {menu} = item;
        return menu instanceof HTMLEMenuElementBase ?
            menu.#firstItem() :
            null;
    }

    #setActiveItem(item: HTMLEMenuItemElement | null): void {
        if (item !== null) {
            this.#activeIndex = this.items().indexOf(item);
        }
    }

    async #setItemTimeout(item: HTMLEMenuItemElement, delay?: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                resolve(undefined);
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

    #clearItemTimeout(item: HTMLEMenuItemElement): void {
        const timeout = toggleTimeouts.get(item);
        if (typeof timeout !== "undefined") {
            toggleTimeouts.delete(item);
            timeout.clear();
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        if (target instanceof HTMLEMenuItemElement) {
            const {contextual} = this;
            if (contextual) {
                try {
                    this.remove();
                }
                catch (error) {};
            }
            else {
                const isClosestMenu = this.#isClosestMenu(target);
                if (isClosestMenu) {
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
            }
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        if (target instanceof HTMLEMenuItemElement) {
            const nearestItem = this.#nearestItem(target);
            if (nearestItem) {
                this.#setActiveItem(nearestItem);
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            const {contextual} = this;
            if (contextual) {
                try {
                    this.remove();
                }
                catch (error) {};
            }
            else {
                const {activeItem} = this;
                if (activeItem?.expanded) {
                    activeItem.collapse();
                }
                this.#setActiveItem(null);
            }
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {key} = event;
        const {activeItem} = this;
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
            case "Enter":
            case " ": {
                if (activeItem) {
                    const {type} = activeItem;
                    switch (type) {
                        case "menu":
                        case "submenu": {
                            activeItem.expand();
                            if (activeItem.expanded) {
                                const firstChildItem = this.#firstChildItem(activeItem);
                                firstChildItem?.focus({preventScroll: true});
                            }
                            break;
                        }
                        default: {
                            activeItem.click();
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
                        target_i => target_i instanceof HTMLEMenuElement
                    ) == this;
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
                        target_i => target_i instanceof HTMLEMenuElement
                    ) == this;
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
                    const {type} = activeItem;
                    switch (type) {
                        case "submenu": {
                            if (!activeItem.expanded) {
                                activeItem.expand();
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
        const {target, relatedTarget} = event;
        if (target instanceof HTMLEMenuItemElement) {
            const nearestItem = this.#nearestItem(target);
            if (nearestItem !== null) {
                if (nearestItem.type == "submenu" &&
                    !nearestItem.expanded) {
                    this.#clearItemTimeout(nearestItem);
                }
                const isTargetClosestMenu = event.composedPath().find(
                    target_i => target_i instanceof HTMLEMenuElement
                ) == this;
                if (isTargetClosestMenu) {
                    const {activeItem} = this;
                    if (activeItem?.type == "submenu" &&
                        activeItem.expanded) {
                        this.#clearItemTimeout(activeItem);
                        this.#setItemTimeout(activeItem, 400)
                            .then(() => {
                                activeItem.collapse();
                            })
                            .catch(() => undefined);
                    }
                    const {clientX, clientY} = event;
                    const {left, right, top, bottom} = this.getBoundingClientRect();
                    const intersectsWithMouse = !(
                        left > clientX || right < clientX || top > clientY || bottom < clientY
                    );
                    const containsRelatedTarget = this.contains(<Node>relatedTarget);
                    if (intersectsWithMouse && containsRelatedTarget) {
                        if (relatedTarget instanceof HTMLEMenuElement && relatedTarget !== this) {
                            relatedTarget.focus({preventScroll: true});
                        }
                        else {
                            this.focus({preventScroll: true});
                            this.#setActiveItem(null);
                        }
                    }
                    if (!intersectsWithMouse) {
                        this.focus({preventScroll: true});
                        this.#setActiveItem(null);
                    }
                }
            }
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target} = event;
        if (target instanceof HTMLEMenuItemElement) {
            const nearestItem = this.#nearestItem(target);
            if (nearestItem !== null) {
                if (nearestItem.type == "submenu" && nearestItem.expanded) {
                    this.#clearItemTimeout(nearestItem);
                }
                const isTargetClosestMenu = event.composedPath().find(
                    target_i => target_i instanceof HTMLEMenuElement
                ) == this;
                if (isTargetClosestMenu) {
                    const {activeItem} = this;
                    if (activeItem?.type == "submenu" &&
                        activeItem.expanded && 
                        !activeItem.contains(<Node>target)) {
                        this.#clearItemTimeout(activeItem);
                        this.#setItemTimeout(activeItem, 400)
                            .then(() => {
                                activeItem.collapse();
                            })
                            .catch(() => undefined);
                    }
                    this.#setActiveItem(nearestItem);
                    nearestItem.focus({preventScroll: true});
                    if (nearestItem.type == "submenu") {
                        if (!nearestItem.expanded) {
                            this.#clearItemTimeout(nearestItem);
                            this.#setItemTimeout(nearestItem, 200)
                                .then(() => {
                                    const {activeItem} = this;
                                    this.#collapseSubmenus();
                                    if (activeItem) {
                                        this.#clearItemTimeout(activeItem);
                                        activeItem.expand();
                                        activeItem.menu?.focus({preventScroll: true});
                                    }
                                })
                                .catch(() => undefined);
                        }
                        else {
                            nearestItem.menu?.focus({preventScroll: true});
                        }
                    }
                }
            }
        }
    }
}

var HTMLEMenuElement: HTMLEMenuElementConstructor = HTMLEMenuElementBase;

interface EMenuConstructor {
    prototype: HTMLEMenuElement;
    new(init: {
        name?: string;
        children?: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement | HTMLHRElement)[];
    }): HTMLEMenuElement;
}

var EMenu = <EMenuConstructor>Object.assign(
    <Function>function(init: {
        name?: string;
        children?: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement | HTMLHRElement)[];
    }) {
        const {name, children} = init;
        return element("e-menu", {
            attributes: {
                name: name,
                tabindex: -1,
            },
            children: children
        });
    }, {
        prototype: HTMLEMenuElement.prototype,
    }
);