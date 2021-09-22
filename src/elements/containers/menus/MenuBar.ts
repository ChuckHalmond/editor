import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
import { HTMLEMenuItemElement } from "./MenuItem";

export { HTMLEMenuBarElement };
export { HTMLEMenuBarElementBase };

interface HTMLEMenuBarElement extends HTMLElement {
    name: string;
    active: boolean;
    items: HTMLEMenuItemElement[];
    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | null;
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null;
}

@RegisterCustomHTMLElement({
    name: "e-menubar"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
])
class HTMLEMenuBarElementBase extends HTMLElement implements HTMLEMenuBarElement {

    public name!: string;
    public active!: boolean;
    
    public items: HTMLEMenuItemElement[];

    private _activeIndex: number;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    position: relative;
                    display: block;
                    user-select: none;
                }

                :host(:not(:focus-within)) ::slotted(:hover) {
                    color: black;
                    background-color: gainsboro;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: row;
                }
            </style>
            <div part="container">
                <slot></slot>
            </div>
        `);

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
        
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => isTagElement("e-menuitem", item)) as HTMLEMenuItemElement[];
                this.items = items;
                items.forEach((item) => {
                    item.parentMenu = this;
                });
            });
        }

        this.addEventListener("mouseover", (event) => {
            let targetIndex = this.items.indexOf(event.target as any);
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
        });
        
        this.addEventListener("keydown", (event) => {
            switch (event.key) {
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
                        this.activeItem.trigger();
                    }
                    break;
                case "Escape":
                    this.focusItemAt(this.activeIndex);
                    this.active = false;
                    break;
            }
        });

        this.addEventListener("mousedown", (event) => {
            let targetIndex = this.items.indexOf(event.target as any);
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
        });

        this.addEventListener("focus", () => {
            this._activeIndex = 0;
        });
    }

    public focusItemAt(index: number, childMenu?: boolean): void {
        let item = this.items[index];
        if (item) {
            this._activeIndex = index;
            item.focus();
            if (childMenu && item.childMenu) {
                item.childMenu.focus();
            }
        }
    }

    public reset(): void {
        let item = this.activeItem;
        this._activeIndex = -1;
        if (item?.childMenu) {
            item.childMenu.reset();
        }
    }

    public findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subtree?: boolean): HTMLEMenuItemElement | null {
        let foundItem: HTMLEMenuItemElement | null = null;
        for (let idx = 0; idx < this.items.length; idx++) {
            let item = this.items[idx];
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

declare global {
    interface HTMLElementTagNameMap {
        "e-menubar": HTMLEMenuBarElement,
    }
}