import { HTMLESelectElement } from "../../controls/forms/Select";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEToolBarItemElement } from "./ToolBarItem";
import { HTMLEToolBarItemGroupElement } from "./ToolBarItemGroup";

export { HTMLEToolBarElement };

type ToolBarOrientation = "horizontal" | "vertical";

interface HTMLEToolBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly activeItem: HTMLEToolBarItemElement | null;
    items(): HTMLEToolBarItemElement[];
    firstItem(): HTMLEToolBarItemElement | null;
    name: string;
    orientation: ToolBarOrientation;
}

interface HTMLEToolbarElementConstructor {
    prototype: HTMLEToolBarElement;
    new(): HTMLEToolBarElement;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-toolbar": HTMLEToolBarElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var wasExpandedOnMouseDown: WeakMap<HTMLEToolBarItemElement, boolean>;

@CustomElement({
    name: "e-toolbar"
})
class HTMLEToolBarElementBase extends HTMLElement implements HTMLEToolBarElement {

    readonly shadowRoot!: ShadowRoot;

    get activeItem(): HTMLEToolBarItemElement | null {
        return this.querySelector<HTMLEToolBarItemElement>(
            "e-toolbaritem[active]"
        );
    }

    items(): HTMLEToolBarItemElement[] {
        return Array.from(this.querySelectorAll<HTMLEToolBarItemElement>(
            ":is(:scope, :scope > e-toolbaritemgroup) > e-toolbaritem"
        ));
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String})
    orientation!: ToolBarOrientation;

    #walker: TreeWalker;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        wasExpandedOnMouseDown = new WeakMap();
    }

    constructor() {
        super();
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this));
        this.addEventListener("dblclick", this.#handleDblClickEvent.bind(this));
        this.addEventListener("focus", this.#handleFocusEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("mousedown", this.#handleMouseDownEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
    }

    connectedCallback(): void {
        const {tabIndex} = this;
        this.tabIndex = tabIndex;
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLEToolBarItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEToolBarItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    firstItem(): HTMLEToolBarItemElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLEToolBarItemElement | null>walker.firstChild();
    }

    #lastItem(): HTMLEToolBarItemElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLEToolBarItemElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLEToolBarItemElement): HTMLEToolBarItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const previousItem = <HTMLEToolBarItemElement | null>walker.previousSibling();
        return previousItem;
    }

    #nextItem(item: HTMLEToolBarItemElement): HTMLEToolBarItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLEToolBarItemElement | null>walker.nextSibling();
    }

    #setActiveItem(item: HTMLEToolBarItemElement | null): void {
        const {activeItem} = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
        }
        if (item !== null) {
            item.active = true;
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        const targetItem = (<HTMLElement>target).closest("e-toolbaritem");
        if (targetItem) {
            const {type, pressed} = targetItem;
            switch (type) {
                case "checkbox": {
                    targetItem.pressed = !pressed;
                    break;
                }
                case "radio": {
                    targetItem.pressed = true;
                    break;
                }
                case "menubutton": {
                    const {menubutton} = targetItem;
                    if (menubutton && !menubutton.contains(<Node>target)) {
                        const force = !wasExpandedOnMouseDown.get(targetItem) ?? true;
                        menubutton.toggle(force);
                        if (force) {
                            menubutton.firstItem?.focus({preventScroll: true});
                        }
                    }
                    break;
                }
                case "select": {
                    const {select} = targetItem;
                    if (select && !select.contains(<Node>target)) {
                        const force = !wasExpandedOnMouseDown.get(targetItem) ?? true;
                        select.toggle(force);
                    }
                    break;
                }
            }
        }
        event.stopPropagation();
    }

    #handleContextMenuEvent(event: MouseEvent): void {
        event.stopPropagation();
    }

    #handleDblClickEvent(event: MouseEvent): void {
        event.stopPropagation();
    }

    #handleFocusEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const {activeItem} = this;
        if (!this.contains(<Node>relatedTarget)) {
            (activeItem ?? this.firstItem())?.focus();
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const targetItem = <HTMLEToolBarItemElement | null>(<HTMLElement>target).closest("e-toolbaritem");
        if (targetItem) {
            this.#setActiveItem(targetItem);
            this.tabIndex = -1;
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.tabIndex = 0;
        }
    }

    #handleMouseDownEvent(event: MouseEvent): void {
        const {target} = event;
        const targetItem = (<HTMLElement>target).closest("e-toolbaritem");
        if (targetItem) {
            const {type} = targetItem;
            switch (type) {
                case "menubutton": {
                    const {menubutton} = targetItem;
                    if (menubutton && !menubutton.contains(<Node>target)) {
                        wasExpandedOnMouseDown.set(targetItem, menubutton.expanded);
                    }
                    break;
                }
                case "select": {
                    const {select} = targetItem;
                    if (select && !select.contains(<Node>target)) {
                        wasExpandedOnMouseDown.set(targetItem, select.expanded);
                    }
                    break;
                }
            }
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {key} = event;
        const {activeItem} = this;
        switch (key) {
            case "Enter": {
                if (activeItem) {
                    const {type} = activeItem;
                    switch (type) {
                        case "menubutton": {
                            const {menubutton} = activeItem;
                            if (menubutton) {
                                menubutton.expand();
                                menubutton.firstItem?.focus({preventScroll: true});
                            }
                            break;
                        }
                        case "select": {
                            const {select} = activeItem;
                            if (select) {
                                select.expand();
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
            case "ArrowLeft": {
                if (activeItem) {
                    const previousItem = this.#previousItem(activeItem);
                    if (previousItem) {
                        previousItem.focus({preventScroll: true});
                    }
                }
                else {
                    const firstItem = this.firstItem();
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
                    const lastItem = this.#lastItem();
                    if (lastItem) {
                        lastItem.focus({preventScroll: true});
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                if (activeItem) {
                    const {type} = activeItem;
                    switch (type) {
                        case "select": {
                            activeItem.select?.expand();
                            event.stopPropagation();
                            break;
                        }
                    }
                }
                break;
            }
            case "Home": {
                const firstItem = this.firstItem();
                if (firstItem) {
                    firstItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                const lastItem = this.#lastItem();
                if (lastItem) {
                    lastItem.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
        }
    }
}

var HTMLEToolBarElement: HTMLEToolbarElementConstructor = HTMLEToolBarElementBase;