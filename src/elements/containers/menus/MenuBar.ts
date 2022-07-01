import { NodeCollection } from "../../../observers/NodeCollection";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemCollection } from "./MenuItemCollection";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuBarElement };

interface HTMLEMenuBarElementConstructor {
    readonly prototype: HTMLEMenuBarElement;
    new(): HTMLEMenuBarElement;
}

interface HTMLEMenuBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly items: HTMLCollectionOf<HTMLEMenuItemElement>;
    readonly activeItem: HTMLEMenuItemElement | null;
    readonly activeIndex: number;
    name: string;
    expanded: boolean;
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
    readonly items: HTMLCollectionOf<HTMLEMenuItemElement>;

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
        //this.items = new NodeCollection<HTMLEMenuItemElement>(this, this.#walkerNodeFilter.bind(this));
        this.items = this.getElementsByTagName("e-menuitem");
        this.#activeIndex = -1;
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("mouseover", this.#handleMouseOverEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        //this.addEventListener("trigger", this.#handleTriggerEvent.bind(this));
    }

    get activeIndex(): number {
        return this.#activeIndex;
    }

    get activeItem(): HTMLEMenuItemElement | null {
        return this.items.item(this.#activeIndex) ?? null;
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
        const {activeItem, expanded, items} = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.collapse();
            activeItem.active = false;
        }
        if (item !== null) {
            if (expanded) {
                item.expand();
            }
            item.active = true;
            this.#activeIndex = Array.from(items).indexOf(item);
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
    
    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        if (target instanceof Element) {
            const nearestItem = this.#nearestItem(target);
            this.#setActiveItem(nearestItem);
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            const {activeItem} = this;
            if (activeItem?.expanded) {
                activeItem.collapse();
            }
            this.#setActiveItem(null);
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
                    this.focus({preventScroll: true})
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
                    this.#firstItem();
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
                    this.#nextItem(activeItem) ?? this.#firstItem() : 
                    this.#lastItem();
                nextItem?.focus({preventScroll: true});
                ({activeItem} = this);
                if (expanded && activeItem) {
                    const firstChildItem = this.#firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
                }
                break;
            }
            case "Enter": {
                if (activeItem) {
                    this.expanded = !expanded;
                    const firstChildItem = this.#firstChildItem(activeItem);
                    firstChildItem?.focus({preventScroll: true});
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
                break;
            }
        }
    }

    /*#handleTriggerEvent(): void {
        const {activeItem} = this;
        if (activeItem?.expanded) {
            activeItem.collapse();
        }
        this.expanded = false;
        this.focus({preventScroll: true});
    }*/
}

var HTMLEMenuBarElement: HTMLEMenuBarElementConstructor = HTMLEMenuBarElementBase;