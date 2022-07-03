import { HTMLESelectElement } from "../../controls/forms/Select";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEToolBarItemElement } from "./ToolBarItem";
import { HTMLEToolBarItemGroupElement } from "./ToolBarItemGroup";

export { HTMLEToolBarElement };

type ToolBarOrientation = "horizontal" | "vertical";

interface HTMLEToolBarElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    items(): HTMLEToolBarItemElement[];
    readonly activeItem: HTMLEToolBarItemElement | null;
    readonly activeIndex: number;
    name: string;
}

interface HTMLEToolbarElementConstructor {
    readonly prototype: HTMLEToolBarElement;
    new(): HTMLEToolBarElement;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-toolbar": HTMLEToolBarElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

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

    get activeIndex(): number {
        return this.#activeIndex;
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String})
    orientation!: ToolBarOrientation;

    #walker: TreeWalker;
    #activeIndex: number;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: flex;
                            flex-direction: row;
                        }
                    `
                ]
            }),
            element("slot")
        );
    }

    constructor() {
        super();
        this.#activeIndex = -1;
        this.#walker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#nodeFilter.bind(this)
        );
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("change", this.#handleChangeEvent.bind(this));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("trigger", this.#handleTriggerEvent.bind(this));
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

    #firstItem(): HTMLEToolBarItemElement | null {
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
            this.#activeIndex = this.items().indexOf(item);
        }
        else {
            this.#activeIndex = -1;
        }
    }

    #handleChangeEvent(event: Event): void {
        const {target} = event;
        if (target instanceof HTMLESelectElement) {
            const item = target.closest("e-toolbaritem");
            if (item !== null) {
                const {select, type} = item;
                if (target == select && select && type == "select") {
                    const {value} = item;
                    const {value: selectValue} = select;
                    if (value !== selectValue) {
                        item.value = selectValue;
                        item.trigger();
                    }
                }
            }
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        if (target instanceof HTMLEToolBarItemElement) {
            const {type} = target;
            switch (type) {
                /*case "menubutton": {
                    const {menubutton} = target;
                    if (menubutton) {
                        const {expanded} = menubutton;
                        if (!expanded) {
                            menubutton.expand();
                            menubutton.menu?.focus({preventScroll: true});
                        }
                    }
                    break;
                }
                case "select": {
                    const {select} = target;
                    if (select) {
                        select.toggle();
                    }
                    break;
                }*/
                default: {
                    target.trigger();
                    break;
                }
            }
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const activeItem = this.items().find(
            item_i => item_i.contains(<Node>target)
        ) ?? null;
        this.#setActiveItem(activeItem);
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.#setActiveItem(null);
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
                                const {expanded} = menubutton;
                                if (!expanded) {
                                    menubutton.expand();
                                    menubutton.firstItem?.focus({preventScroll: true});
                                }
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
                            activeItem.trigger();
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
                    const firstItem = this.#firstItem();
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
                const firstItem = this.#firstItem();
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
                if (activeItem) {
                    activeItem.focus({preventScroll: true});
                }
                else {
                    this.focus({preventScroll: true});
                }
                event.stopPropagation();
                break;
            }
        }
    }

    #handleTriggerEvent(event: Event): void {
        const {target} = event;
        if (target instanceof HTMLEToolBarItemElement) {
            const {type, name, value} = target;
            if (type == "radio") {
                this.querySelectorAll<HTMLEToolBarItemElement>(
                    `:is(:scope, :scope > e-toolbaritemgroup) > e-toolbaritem[type=radio][name=${name}]`
                ).forEach((radio_i) => {
                    radio_i.checked = radio_i.value == value;
                });
            }
        }
    }
}

var HTMLEToolBarElement: HTMLEToolbarElementConstructor = HTMLEToolBarElementBase;