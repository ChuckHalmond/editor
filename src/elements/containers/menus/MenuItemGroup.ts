
import { pointIntersectsWithDOMRect } from "../../Snippets";
import { bindShadowRoot, GenerateAttributeAccessors, isTagElement, RegisterCustomHTMLElement } from "../../HTMLElement";
import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuItemElement } from "./MenuItem";

export { HTMLEMenuItemGroupElement };
export { HTMLEMenuItemGroupElementBase };

interface HTMLEMenuItemGroupElement extends HTMLElement {
    name: string;
    label: string;
    type: "list" | "grid";
    rows: number;
    cells: number;

    parentMenu: HTMLEMenuElement | null;
    items: HTMLEMenuItemElement[];

    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | null;
    
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
}

@RegisterCustomHTMLElement({
    name: "e-menuitemgroup",
    observedAttributes: ["label"]
})
@GenerateAttributeAccessors([
    {name: "label", type: "string"},
    {name: "type", type: "string"},
    {name: "name", type: "string"},
    {name: "rows", type: "number"},
    {name: "cells", type: "number"},
])
class HTMLEMenuItemGroupElementBase extends HTMLElement implements HTMLEMenuItemGroupElement {
    public name!: string;
    public label!: string;
    public type!: "list" | "grid";
    public rows!: number;
    public cells!: number;
    
    public parentMenu: HTMLEMenuElement | null;
    public items: HTMLEMenuItemElement[];

    private _activeIndex: number;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;
                    user-select: none;
                }
                
                :host(:not([label])) [part~="label"] {
                    display: none;
                }

                [part~="label"] {
                    white-space: nowrap;
                    padding: 2px 6px 6px 6px;
                    font-weight: bold;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                }

                [part~="separator"] {
                    margin: 6px 0;
                }

                :host(:first-child) [part~="separator"] {
                    display: none;
                }
            </style>
            <hr part="separator"/>
            <span part="label"></span>
            <div part="container">
                <slot></slot> 
            </div>
        `);

        this._activeIndex = -1;
        this.parentMenu = null;
        this.items = [];
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
                    item.group = this;
                });
            });
        }

        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (this.items.includes(target)) {
                target.trigger();
            }
        });

        this.addEventListener("mouseover", (event: MouseEvent) => {
            let target = event.target as any;
            let targetIndex = this.items.indexOf(target);
            if (this === target) {
                this.reset();
                this.focus();
            }
            else if (targetIndex >= 0) {
                this.focusItemAt(this.items.indexOf(target), true);
            }
        });

        this.addEventListener("mouseout", (event: MouseEvent) => {
            let target = event.target as any;
            let thisIntersectsWithMouse = pointIntersectsWithDOMRect(
                event.clientX, event.clientY,
                this.getBoundingClientRect()
            );
            if ((this === target || this.items.includes(target)) && !thisIntersectsWithMouse) {
                this.reset();
                this.focus();
            }
        });

        this.addEventListener("focusin", (event: FocusEvent) => {
            let target = event.target as any;
            this._activeIndex = this.items.findIndex(
                (item) => item.contains(target)
            );
        });

        this.addEventListener("focusout", (event: FocusEvent) => {
            let newTarget = event.relatedTarget as any;
            if (!this.contains(newTarget)) {  
                this.reset();
            }
        });
        
        this.addEventListener("e_radiochangerequest", (event: Event) => {
            let target = event.target as any;
            if (isTagElement("e-menuitem", target)) {
                let item = target;
                if (item.type === "radio" && !item.checked) {
                    let checkedRadio = this.findItem(
                        (item: HTMLEMenuItemElement) => {
                            return item.type === "radio" && item.checked
                        }
                    );
                    if (checkedRadio) {
                        checkedRadio.checked = false;
                    }
                    item.checked = true;
                }
            }
        });
        
        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowUp":
                    if (this.activeIndex > 0) {
                        this.focusItemAt(this.activeIndex - 1);
                        event.stopPropagation();
                    }
                    break;
                case "ArrowDown":
                    if (this.activeIndex < this.items.length - 1) {
                        this.focusItemAt(this.activeIndex + 1);
                        event.stopPropagation();
                    }
                    break;
                case "Enter":
                    if (this.activeItem) {
                        this.activeItem.trigger();
                        event.stopPropagation();
                    }
                    break;
                case "ArrowRight":
                    if (this.items.includes(event.target as any)) {
                        if (this.activeItem?.childMenu) {
                            this.activeItem.childMenu.focusItemAt(0);
                            event.stopPropagation();
                        }
                    }
                    break;
                case "Home":
                    this.focusItemAt(0);
                    break;
                case "End":
                    this.focusItemAt(this.items.length - 1);
                    break;
                case "Escape":
                    this.reset();
                    break;
            }
        });
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue !== newValue) {
            switch (name) {
            case "label":
                if (oldValue !== newValue) {
                    const label = this.shadowRoot?.querySelector("[part~=label]");
                    if (label) {
                        label.textContent = newValue;
                    }
                }
            }
        }
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

    public findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null {
        let foundItem: HTMLEMenuItemElement | null = null;
        for (let idx = 0; idx < this.items.length; idx++) {
            let item = this.items[idx];
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
        return foundItem;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitemgroup": HTMLEMenuItemGroupElement,
    }
}