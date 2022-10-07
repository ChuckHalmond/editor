import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuBarElement };

interface HTMLEMenuBarElementConstructor {
    prototype: HTMLEMenuBarElement;
    new(): HTMLEMenuBarElement;
}

interface HTMLEMenuBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    items(): HTMLEMenuItemElement[];
    readonly activeItem: HTMLEMenuItemElement | null;
    readonly activeIndex: number;
    name: string;
    expanded: boolean;
    connectedCallback(): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menubar": HTMLEMenuBarElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-menubar"
})
class HTMLEMenuBarElementBase extends HTMLElement implements HTMLEMenuBarElement {

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Boolean})
    expanded!: boolean;
    
    readonly shadowRoot!: ShadowRoot;

    #activeIndex: number;
    #walker: TreeWalker;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
    }

    constructor() {
        super();
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#walkerNodeFilter.bind(this)
        );
        this.#activeIndex = -1;
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focus", this.#handleFocusEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
    }

    connectedCallback(): void {
        const tabindex = this.getAttribute("tabindex");
        this.tabIndex = tabindex !== null ? parseInt(tabindex) : -1;
    }

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

    #walkerNodeFilter(node: Node): number {
        if (node instanceof HTMLEMenuItemElement && !(node.disabled || node.hidden)) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEMenuItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    firstItem(): HTMLEMenuItemElement | null {
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
        return <HTMLEMenuItemElement | null>walker.previousSibling();
    }

    #nextItem(item: HTMLEMenuItemElement): HTMLEMenuItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLEMenuItemElement | null>walker.nextSibling();
    }

    #firstChildItem(item: HTMLEMenuItemElement): HTMLEMenuItemElement | null {
        const {menu} = item;
        if (menu) {
            const walker = this.#walker;
            walker.currentNode = menu;
            return <HTMLEMenuItemElement | null>walker.firstChild();
        }
        return null;
    }

    #setActiveItem(item: HTMLEMenuItemElement | null): void {
        const {activeItem, expanded} = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.collapse();
        }
        if (item !== null) {
            if (expanded) {
                item.expand();
            }
            this.#activeIndex = this.items().indexOf(item);
        }
        else {
            this.#activeIndex = -1;
        }
    }

    get #items(): HTMLEMenuItemElement[] {
        return Array.from(
            this.querySelectorAll(":is(:scope, :scope > e-menuitemgroup) > e-menuitem")
        );
    }

    #isClosestMenu(target: Element): boolean {
        return target.closest(":is(e-menubar, e-menu)") == this;
    }

    #nearestItem(target: Element): HTMLEMenuItemElement | null {
        return this.#items.find(item_i => item_i.contains(target)) ?? null;
    }
    
    #handleFocusEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const {activeItem} = this;
        if (!this.contains(<Node | null>relatedTarget)) {
            (activeItem ?? this.firstItem())?.focus();
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        if (target instanceof Element) {
            const nearestItem = this.#nearestItem(target);
            this.#setActiveItem(nearestItem);
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {target, relatedTarget} = event;
        if (target instanceof HTMLElement) {
            const nearestItem = this.#nearestItem(target);
            if (nearestItem) {
                nearestItem.collapse();
            }
        }
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.expanded = false;
        }
    }

    #handleMouseOverEvent(event: MouseEvent): void {
        const {target} = event;
        const {expanded, activeItem} = this;
        if (target instanceof HTMLEMenuItemElement) {
            const isClosestMenu = this.#isClosestMenu(target);
            if (isClosestMenu && target !== activeItem && expanded) {
                const {menu} = target;
                if (menu) {
                    target.expand();
                    menu.focus({preventScroll: true});
                }
            }
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        const {expanded, activeItem} = this;
        if (target instanceof HTMLEMenuItemElement) {
            const isClosestMenu = this.#isClosestMenu(target);
            if (isClosestMenu) {
                const isExpanded = !expanded;
                this.expanded = isExpanded;
                if (isExpanded) {
                    if (activeItem && !activeItem.expanded) {
                        activeItem.expand();
                    }
                    const {menu} = target;
                    menu?.focus({preventScroll: true});
                }
                else {
                    if (activeItem) {
                        activeItem.collapse();
                        activeItem.blur();
                    }
                }
            }
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {key} = event;
        const {expanded} = this;
        let {activeItem} = this;
        switch (key) {
            case "ArrowLeft": {
                const previousItem = activeItem ?
                    this.#previousItem(activeItem) ?? this.#lastItem() :
                    this.firstItem();
                previousItem?.focus({preventScroll: true});
                ({activeItem} = this);
                if (expanded && activeItem) {
                    const firstChildItem = this.#firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
                }
                break;
            }
            case "ArrowRight": {
                const nextItem = activeItem ?
                    this.#nextItem(activeItem) ?? this.firstItem() : 
                    this.#lastItem();
                nextItem?.focus({preventScroll: true});
                ({activeItem} = this);
                if (expanded && activeItem) {
                    const firstChildItem = this.#firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
                }
                break;
            }
            case "Enter":
            case " ": {
                if (activeItem) {
                    this.expanded = !expanded;
                    if (!expanded) {
                        const firstChildItem = this.#firstChildItem(activeItem);
                        firstChildItem?.focus({preventScroll: true});
                    }
                }
                break;
            }
            case "Escape": {
                if (expanded) {
                    this.expanded = false;
                    if (activeItem) {
                        activeItem.collapse();
                        activeItem.focus({preventScroll: true});
                    }
                }
                else {
                    this.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
        }
    }
}

var HTMLEMenuBarElement: HTMLEMenuBarElementConstructor = HTMLEMenuBarElementBase;