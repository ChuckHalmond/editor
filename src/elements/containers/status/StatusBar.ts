import { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, element } from "../../Element";
import { HTMLEStatusItemElement } from "./StatusItem";
import { HTMLEStatusItemGroupElement } from "./StatusItemGroup";

import "./StatusItem";
import "./StatusItemGroup";

export { HTMLEStatusBarElement };

interface HTMLEStatusBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly activeItem: HTMLEStatusItemElement | null;
    items(): HTMLEStatusItemElement[];
    firstItem(): HTMLEStatusItemElement | null;
}

interface HTMLEToolbarElementConstructor {
    prototype: HTMLEStatusBarElement;
    new(): HTMLEStatusBarElement;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-statusbar": HTMLEStatusBarElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-statusbar"
})
class HTMLEStatusBarElementBase extends HTMLElement implements HTMLEStatusBarElement {

    declare readonly shadowRoot: ShadowRoot;

    get activeItem(): HTMLEStatusItemElement | null {
        return this.querySelector<HTMLEStatusItemElement>(
            "e-statusitem[active]"
        );
    }

    items(): HTMLEStatusItemElement[] {
        return Array.from(this.querySelectorAll<HTMLEStatusItemElement>(
            ":is(:scope, :scope > e-statusitemgroup) > e-statusitem"
        ));
    }

    #walker: TreeWalker;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: flex;
                flex-direction: row;
            }

            :host(:focus) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }

            ::slotted(e-statusitem:not(:first-child)) {
                margin-left: 4px;
            }
        `;
    }

    constructor() {
        super();
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this));
        this.addEventListener("dblclick", this.#handleDblClickEvent.bind(this));
        this.addEventListener("focus", this.#handleFocusEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
    }

    connectedCallback(): void {
        const {tabIndex} = this;
        this.tabIndex = tabIndex;
    }

    #nodeFilter(node: Node): number {
        if (node instanceof HTMLEStatusItemElement) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEStatusItemGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    firstItem(): HTMLEStatusItemElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLEStatusItemElement | null>walker.firstChild();
    }

    #lastItem(): HTMLEStatusItemElement | null {
        const walker = this.#walker;
        walker.currentNode = walker.root;
        return <HTMLEStatusItemElement | null>walker.lastChild();
    }
    
    #previousItem(item: HTMLEStatusItemElement): HTMLEStatusItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        const previousItem = <HTMLEStatusItemElement | null>walker.previousSibling();
        return previousItem;
    }

    #nextItem(item: HTMLEStatusItemElement): HTMLEStatusItemElement | null {
        const walker = this.#walker;
        walker.currentNode = item;
        return <HTMLEStatusItemElement | null>walker.nextSibling();
    }

    #setActiveItem(item: HTMLEStatusItemElement | null): void {
        const {activeItem} = this;
        if (activeItem !== null && activeItem !== item) {
            activeItem.active = false;
        }
        if (item !== null) {
            item.active = true;
        }
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
        const targetItem = <HTMLEStatusItemElement | null>(<HTMLElement>target).closest("e-statusitem");
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

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {key} = event;
        const {activeItem} = this;
        switch (key) {
            case "Enter": {
                if (activeItem) {
                    activeItem.click();
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
            case "Escape": {
                this.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
        }
    }
}

var HTMLEStatusBarElement: HTMLEToolbarElementConstructor = HTMLEStatusBarElementBase;