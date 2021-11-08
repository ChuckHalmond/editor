import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuElement };

interface HTMLEMenuElement extends HTMLElement {
    name: string;
    expanded: boolean;
    overflowing: boolean;
    parentItem: HTMLEMenuItemElement | null;
    items: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
    readonly shadowRoot: ShadowRoot;
    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null;
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}

interface HTMLEMenuElementConstructor {
    readonly prototype: HTMLEMenuElement;
    new(): HTMLEMenuElement;
    readonly observedAttributes: string[];
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menu": HTMLEMenuElement,
    }
}

@CustomElement({
    name: "e-menu"
})
class HTMLEMenuElementBase extends HTMLElement implements HTMLEMenuElement {

    @AttributeProperty({type: "string"})
    public name!: string;

    @AttributeProperty({type: "boolean"})
    public expanded!: boolean;

    @AttributeProperty({type: "boolean"})
    public overflowing!: boolean;

    public parentItem: HTMLEMenuItemElement | null;
    public items: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
    public readonly shadowRoot!: ShadowRoot;

    private _activeIndex: number;

    public static get observedAttributes(): string[] {
        return ["expanded"];
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: inline-block;
                            user-select: none;
        
                            padding: 6px 0;
                            background-color: white;
                            cursor: initial;
                            width: max-content;
        
                            -webkit-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                            -moz-box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 6px;
                        }
        
                        [part="container"] {
                            display: flex;
                            flex-direction: column;
                        }
        
                        ::slotted(hr) {
                            margin: 6px 0;
                        }
                    `
                }
            }),
            HTML("div", {
                part: ["container"],
                children: [
                    HTML("slot")
                ]
            })
        );

        this.parentItem = null;
        this.items = [];
        this._activeIndex = -1;
    }

    public get activeIndex(): number {
        return this._activeIndex;
    }

    public get activeItem(): HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null {
        return this.items[this.activeIndex] || null;
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this.parentItem = (
            this.parentElement instanceof HTMLEMenuItemElement
        ) ? this.parentElement : null;
        
        this.shadowRoot.addEventListener("slotchange", this);

        this.addEventListener("mousedown", this);
        this.addEventListener("mouseover", this);
        this.addEventListener("mouseout", this);
        this.addEventListener("focusin", this);
        this.addEventListener("focusout", this);
        this.addEventListener("keydown", this);
    }

    public handleEvent(event: Event) {
        const target = event.target;
        switch (event.type) {
            case "slotchange":
                this.items = (target as HTMLSlotElement)
                    .assignedElements()
                    .filter(
                        elem => elem instanceof HTMLEMenuItemElement || elem instanceof HTMLEMenuItemGroupElement
                    ) as (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
                break;
            case "mousedown":
                if (target instanceof HTMLEMenuItemElement) {
                    if (this.items.includes(target)) {
                        target.click();
                    }
                }
                break;
            case "mouseover":
                const targetIndex = this.items.indexOf(target as (HTMLEMenuItemElement | HTMLEMenuItemGroupElement));
                if (this === target) {
                    this.reset();
                    this.focus();
                } 
                else if (targetIndex >= 0) {
                    if (target instanceof HTMLEMenuItemElement) {
                        this.focusItemAt(targetIndex, true);
                    }
                    else {
                        this._activeIndex = targetIndex;
                    }
                }
                break;
            case "mouseout":
                const thisRect = this.getBoundingClientRect();
                const thisIntersectsWithMouse = !(
                    thisRect.left > (event as MouseEvent).clientX || 
                    thisRect.right < (event as MouseEvent).clientX || 
                    thisRect.top > (event as MouseEvent).clientY ||
                    thisRect.bottom < (event as MouseEvent).clientY
                );
                if ((this === target || this.items.includes(target as (HTMLEMenuItemElement | HTMLEMenuItemGroupElement))) && !thisIntersectsWithMouse) {
                    this.reset();
                    this.focus();
                }
                break;
            case "focusin":
                this._activeIndex = this.items.findIndex(
                    (item) => item.contains(target as (HTMLEMenuItemElement | HTMLEMenuItemGroupElement))
                );
                this.expanded = true;
                break;
            case "focusout":
                const newTarget = (event as FocusEvent).relatedTarget;
                if (newTarget instanceof Element && !this.contains(newTarget)) {
                    this.reset();
                    this.expanded = false;
                }
                break;
            case "keydown":
                switch ((event as KeyboardEvent).key) {
                    case "ArrowUp":
                        this.focusItemAt((this.activeIndex <= 0) ? this.items.length - 1 : this.activeIndex - 1);
                        if (this.activeItem instanceof HTMLEMenuItemGroupElement) {
                            this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                        }
                        event.stopPropagation();
                        break;
                    case "ArrowDown":
                        this.focusItemAt((this.activeIndex >= this.items.length - 1) ? 0 : this.activeIndex + 1);
                        if (this.activeItem instanceof HTMLEMenuItemGroupElement) {
                            this.activeItem.focusItemAt(0);
                        }
                        event.stopPropagation();
                        break;
                    case "Home":
                        this.focusItemAt(0);
                        if (this.activeItem instanceof HTMLEMenuItemGroupElement) {
                            this.activeItem.focusItemAt(0);
                        }
                        event.stopPropagation();
                        break;
                    case "End":
                        this.focusItemAt(this.items.length - 1);
                        if (this.activeItem instanceof HTMLEMenuItemGroupElement) {
                            this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                        }
                        event.stopPropagation();
                        break;
                    case "Enter":
                        if (this.activeItem instanceof HTMLEMenuItemElement) {
                            this.activeItem.click();
                            event.stopPropagation();
                        }
                        break;
                    case "Escape":
                        if (this.parentItem) {
                            const parentGroup = this.parentItem.group;
                            const parentMenu = parentGroup ? parentGroup.parentMenu : this.parentItem.parentMenu;
                            if (parentMenu instanceof HTMLEMenuElement) {
                                if (parentGroup) {
                                    parentGroup.focusItemAt(parentGroup.activeIndex);
                                }
                                else {
                                    parentMenu.focusItemAt(parentMenu.activeIndex);
                                }
                                this.reset();
                                event.stopPropagation();
                            }
                        }
                        else {
                            document.body.focus();
                        }
                        break;
                    case "ArrowLeft":
                        if (this.parentItem) {
                            const parentGroup = this.parentItem.group;
                            const parentMenu = parentGroup ? parentGroup.parentMenu : this.parentItem.parentMenu;
                            if (parentMenu instanceof HTMLEMenuElement) {
                                if (parentGroup) {
                                    parentGroup.focusItemAt(parentGroup.activeIndex);
                                }
                                else {
                                    parentMenu.focusItemAt(parentMenu.activeIndex);
                                }
                                this.reset();
                                event.stopPropagation();
                            }
                        }
                        break;
                    case "ArrowRight":
                        if (this.items.includes(event.target as any)) {
                            if (this.activeItem instanceof HTMLEMenuItemElement && this.activeItem.childMenu) {
                                this.activeItem.childMenu.focusItemAt(0);
                                event.stopPropagation();
                            }
                        }
                        break;
                }
                break;
        }
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "expanded":
                    if (newValue !== null) {
                        const thisRect = this.getBoundingClientRect();
                        const thisIsOverflowing = thisRect.right > document.body.clientWidth;
                        if (thisIsOverflowing) {
                            this.overflowing = true;
                        }
                    }
                    else {
                        this.overflowing = false;
                    }
                    break;
            }
        }
    }

    public focusItemAt(index: number, childMenu?: boolean): void {
        const item = this.items[index];
        if (item) {
            this._activeIndex = index;
            item.focus();
            if (item instanceof HTMLEMenuItemElement) {
                if (childMenu && item.childMenu) {
                    item.childMenu.focus();
                }
            }
            else {
                item.focusItemAt(0);
            } 
        }
    }

    public reset(): void {
        const item = this.activeItem;
        this._activeIndex = -1;
        if (item instanceof HTMLEMenuItemElement && item.childMenu) {
            item.childMenu.reset();
        }
    }

    public findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null {
        let foundItem: HTMLEMenuItemElement | null = null;
        for (let item of this.items) {
            if (item instanceof HTMLEMenuItemElement) {
                if (predicate(item)) {
                    return item;
                }
                if (subitems && item.childMenu) {
                    foundItem = item.childMenu.findItem(predicate, subitems);
                    if (foundItem) {
                        return foundItem;
                    }
                }
            }
            else if (item instanceof HTMLEMenuItemGroupElement) {
                foundItem = item.findItem(predicate, subitems);
                if (foundItem) {
                    return foundItem;
                }
            }
        }
        return foundItem;
    }
}

var HTMLEMenuElement: HTMLEMenuElementConstructor = HTMLEMenuElementBase;