
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemCollection, HTMLEMenuItemRadioList } from "./MenuItemCollection";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuElement };
export { EMenu };

interface HTMLEMenuElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly items: HTMLEMenuItemCollection;
    readonly activeItem: HTMLEMenuItemElement | null;
    readonly activeIndex: number;
    name: string;
    contextual: boolean;
    contextX: number;
    contextY: number;
}

interface HTMLEMenuElementConstructor {
    readonly prototype: HTMLEMenuElement;
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
    readonly items: HTMLEMenuItemCollection;

    get activeItem(): HTMLEMenuItemElement | null {
        return this.items.item(this.#activeIndex);
    }

    get activeIndex(): number {
        return this.#activeIndex;
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Boolean})
    contextual!: boolean;

    @AttributeProperty({type: Number, defaultValue: 0})
    contextX!: number;

    @AttributeProperty({type: Number, defaultValue: 0})
    contextY!: number;

    #activeIndex: number;
    #walker: TreeWalker;

    static {
        shadowTemplate = element("template", {
            content: [
                element("slot")
            ]
        });
        toggleTimeouts = new WeakMap();
    }

    constructor() {
        super();
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.#activeIndex = -1;
        this.items = new HTMLEMenuItemCollection(this);
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.addEventListener("mouseout", this.#handleMouseOutEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("trigger", this.#handleTriggerEvent.bind(this));
    }

    connectedCallback(): void {
        const {contextual} = this;
        if (contextual) {
            this.#position();
        }
    }

    #position(): void {
        const {contextX, contextY} = this;
        const {style} = this;
        const {width: menuWidth, height: menuHeight} = this.getBoundingClientRect();
        const {scrollX, scrollY} = window;
        const left = contextX + scrollX;
        const top = contextY + scrollY;
        const {clientWidth, clientHeight} = document.body;
        const overflowX = left + menuWidth - clientWidth;
        const overflowY = top + menuHeight - clientHeight;
        style.setProperty("left", `${overflowX > 0 ? left - menuWidth : left}px`);
        style.setProperty("top", `${overflowY > 0 ? top - menuHeight : top}px`);
    }

    #collapseSubmenus(): void {
        Array.from(this.items.values())
            .forEach((item_i) => {
                if (item_i.expanded) {
                    item_i.collapse();
                }
            });
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
        const {activeItem, items} = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
        }
        if (item !== null && activeItem !== item) {
            item.active = true;
            this.#activeIndex = Array.from(items.values()).indexOf(item);
        }
        if (item == null) {
            this.#activeIndex = -1;
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        const {items} = this;
        const targetClosestItem = Array.from(items.values()).find(
            item_i => item_i.contains(<Node>target)
        ) ?? null;
        if (targetClosestItem) {
            targetClosestItem.trigger();
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const {items} = this;
        const targetClosestItem = Array.from(items.values()).find(
            item_i => item_i.contains(<Node>target)
        ) ?? null;
        if (targetClosestItem) {
            this.#setActiveItem(targetClosestItem);
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

    async #setItemTimeout(item: HTMLEMenuItemElement, delay?: number): Promise<void> {
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

    #clearItemTimeout(item: HTMLEMenuItemElement): void {
        const timeout = toggleTimeouts.get(item);
        if (typeof timeout !== "undefined") {
            toggleTimeouts.delete(item);
            timeout.clear();
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
            case "Enter": {
                if (activeItem) {
                    const {type} = activeItem;
                    switch (type) {
                        case "submenu": {
                            activeItem.expand();
                            if (activeItem.expanded) {
                                const firstChildItem = this.#firstChildItem(activeItem);
                                firstChildItem?.focus({preventScroll: true});
                            }
                            break;
                        }
                        default: {
                            activeItem.trigger();
                            break;
                        }
                    }
                    event.stopPropagation();
                }
                break;
            }
            case "Escape": {
                if (activeItem) {
                    const composedPath = event.composedPath();
                    const isClosestTargetMenu = composedPath.find(
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
                    const composedPath = event.composedPath();
                    const isClosestTargetMenu = composedPath.find(
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
            default: {
                const {activeIndex, items} = this;
                const {length: keyLength} = key;
                if (keyLength == 1) {
                    const keyCode = key.charCodeAt(0);
                    const itemsArray = Array.from(items.values());
                    const firstMatchIndex = itemsArray.findIndex(
                        item_i => item_i.label.toLowerCase().charCodeAt(0) == keyCode
                    );
                    const nextMatchIndex = itemsArray.findIndex(
                        (item_i, i) => item_i.label.toLowerCase().charCodeAt(0) == keyCode && i > activeIndex
                    );
                    const matchIndex = nextMatchIndex > -1 ?
                        nextMatchIndex :
                        firstMatchIndex;
                    const item = items.item(matchIndex);
                    if (item !== null) {
                        item.focus({preventScroll: true});
                    }
                    event.stopPropagation();
                }
                break;
            }
        }
    }

    #handleMouseOutEvent(event: MouseEvent): void {
        const {target, relatedTarget} = event;
        const {items} = this;
        const targetClosestItem = Array.from(items.values()).find(
            item_i => item_i.contains(<Node>target)
        ) ?? null;
        if (targetClosestItem?.type == "submenu" &&
            !targetClosestItem.expanded) {
            this.#clearItemTimeout(targetClosestItem);
        }
        const isTargetClosestMenu = event.composedPath().find(
            target_i => target_i instanceof HTMLEMenuElement
        ) == this;
        if (isTargetClosestMenu) {
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
                    const activeIndex = this.#activeIndex;
                    this.focus({preventScroll: true});
                    this.#activeIndex = activeIndex;
                }
            }
            if (!intersectsWithMouse) {
                this.focus({preventScroll: true});
            }
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target} = event;
        const {items} = this;
        const targetClosestItem = Array.from(items.values()).find(
            item_i => item_i.contains(<Node>target)
        ) ?? null;
        if (targetClosestItem?.type == "submenu" &&
            targetClosestItem.expanded) {
            this.#clearItemTimeout(targetClosestItem);
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
                    .catch(() => void 0);
            }
            if (targetClosestItem !== null) {
                targetClosestItem.focus({preventScroll: true});
                if (targetClosestItem.type == "submenu") {
                    if (!targetClosestItem.expanded) {
                        this.#clearItemTimeout(targetClosestItem);
                        this.#setItemTimeout(targetClosestItem, 200)
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
                        targetClosestItem.menu?.focus({preventScroll: true});
                    }
                }
            }
        }
    }

    #handleTriggerEvent(event: Event): void {
        const {target} = event;
        const composedPath = event.composedPath();
        const {contextual} = this;
        if (target instanceof HTMLEMenuItemElement) {
            const isClosestTargetMenu = composedPath.find(
                target_i => target_i instanceof HTMLEMenuElement
            ) == this;
            if (isClosestTargetMenu) {
                const {type, name, value} = target;
                if (type == "radio") {
                    Array.from(new HTMLEMenuItemRadioList(this, name).values()).forEach((radio_i) => {
                        radio_i.checked = radio_i.value == value;
                    });
                }
            }
            if (contextual) {
                try {
                    this.remove();
                }
                catch (error) {};
            }
        }
    }
}

var HTMLEMenuElement: HTMLEMenuElementConstructor = HTMLEMenuElementBase;

interface EMenuConstructor {
    readonly prototype: HTMLEMenuElement;
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
            properties: {
                name: name,
                tabIndex: -1,
            },
            children: children
        });
    }, {
        prototype: HTMLEMenuElement.prototype,
    }
);