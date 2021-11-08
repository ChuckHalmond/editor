import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";

export { HTMLEMenuBarElement };

interface HTMLEMenuBarElementConstructor {
    readonly prototype: HTMLEMenuBarElement;
    new(): HTMLEMenuBarElement;
}

interface HTMLEMenuBarElement extends HTMLElement {
    name: string;
    active: boolean;
    items: HTMLEMenuItemElement[];
    readonly shadowRoot: ShadowRoot;
    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | null;
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menubar": HTMLEMenuBarElement,
    }
}

@CustomElement({
    name: "e-menubar"
})
class HTMLEMenuBarElementBase extends HTMLElement implements HTMLEMenuBarElement {

    @AttributeProperty({type: "string"})
    public name!: string;

    @AttributeProperty({type: "boolean"})
    public active!: boolean;
    
    public items: HTMLEMenuItemElement[];
    public readonly shadowRoot!: ShadowRoot;

    private _activeIndex: number;

    constructor() {
        super();
        
        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            position: relative;
                            display: block;
                            user-select: none;
                        }
        
                        :host(:not(:focus-within)) ::slotted(:hover) {
                            color: black;
                            background-color: gainsboro;
                        }
        
                        [part="container"] {
                            display: flex;
                            flex-direction: row;
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

        this.items = [];
        this._activeIndex = -1;
    }

    public get activeIndex(): number {
        return this._activeIndex;
    }

    public get activeItem(): HTMLEMenuItemElement | null {
        return this.items[this.activeIndex] || null;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        this.shadowRoot.addEventListener("slotchange", this);

        this.addEventListener("mouseover", this);
        this.addEventListener("keydown", this);
        this.addEventListener("mousedown", this);
        this.addEventListener("focus", this);
    }

    public handleEvent(event: Event) {
        const target = event.target;
        switch (event.type) {
            case "slotchange":
                this.items = (target as HTMLSlotElement)
                    .assignedElements()
                    .filter(
                        elem => elem instanceof HTMLEMenuItemElement
                    ) as HTMLEMenuItemElement[];
                break;
            case "focus":
                this._activeIndex = 0;
                break;
            case "mousedown":
                if (target instanceof HTMLEMenuItemElement) {
                    const targetIndex = this.items.indexOf(target);
                    if (targetIndex >= 0) {
                        if (!this.contains(document.activeElement)) {
                            this.active = true;
                            this.focusItemAt(targetIndex, true);
                        }
                        else {
                            this.active = false;
                            document.body.focus();
                        }
                        event.preventDefault();
                    }
                }
                break;
            case "mouseover":
                if (target instanceof HTMLEMenuItemElement) {
                    const targetIndex = this.items.indexOf(target);
                    if (targetIndex >= 0) {
                        if (this.contains(document.activeElement)) {
                            if (this.active) {
                                this.focusItemAt(targetIndex, true);
                            }
                            else {
                                this._activeIndex = targetIndex;
                            }
                        }
                    }
                }
                break;
            case "keydown":
                switch ((event as KeyboardEvent).key) {
                    case "ArrowLeft":
                        this.focusItemAt((this.activeIndex <= 0) ? this.items.length - 1 : this.activeIndex - 1);
                        if (this.active && this.activeItem?.childMenu) {
                            this.activeItem.childMenu.focusItemAt(0);
                        }
                        break;
                    case "ArrowRight":
                        this.focusItemAt((this.activeIndex >= this.items.length - 1) ? 0 : this.activeIndex + 1);
                        if (this.active && this.activeItem?.childMenu) {
                            this.activeItem.childMenu.focusItemAt(0);
                        }
                        break;
                    case "ArrowDown":
                        this.focusItemAt(this.activeIndex);
                        if (this.active && this.activeItem?.childMenu) {
                            this.activeItem.childMenu.focusItemAt(0);
                        }
                        break;
                    case "Enter":
                        this.active = true;
                        if (this.activeItem) {
                            this.activeItem.click();
                        }
                        break;
                    case "Escape":
                        this.focusItemAt(this.activeIndex);
                        this.active = false;
                        break;
                }
        }
    }

    public focusItemAt(index: number, childMenu?: boolean): void {
        const item = this.items[index];
        if (item) {
            this._activeIndex = index;
            item.focus();
            if (childMenu && item.childMenu) {
                item.childMenu.focus();
            }
        }
    }

    public reset(): void {
        const item = this.activeItem;
        this._activeIndex = -1;
        if (item?.childMenu) {
            item.childMenu.reset();
        }
    }

    public findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null {
        let foundItem: HTMLEMenuItemElement | null = null;
        for (let item of this.items) {
            if (predicate(item)) {
                return item;
            }
            if (subtree && item.childMenu) {
                foundItem = item.childMenu.findItem(predicate, subtree);
                if (foundItem) {
                    return foundItem;
                }
            }
        }
        return foundItem;
    }
}

var HTMLEMenuBarElement: HTMLEMenuBarElementConstructor = HTMLEMenuBarElementBase;