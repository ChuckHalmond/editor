import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
import { HTMLETreeItemElement } from "./TreeItem";

export { HTMLETreeElement };

interface HTMLETreeElement extends HTMLElement {
    name: string;
    items: HTMLETreeItemElement[];
    readonly activeItem: HTMLETreeItemElement | null;
    readonly selectedItem: HTMLETreeItemElement | null;
    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;
    reset(): void;
}

@RegisterCustomHTMLElement({
    name: "e-tree"
})
@GenerateAttributeAccessors([
    {name: "active", type: "boolean"},
    {name: "name", type: "string"}
])
class HTMLETreeElementBase extends HTMLElement implements HTMLETreeElement {

    public active!: boolean;
    public name!: string;
    
    public items: HTMLETreeItemElement[];

    private _activeItem: HTMLETreeItemElement | null;
    private _selectedItem: HTMLETreeItemElement | null;

    constructor() {
        super();
        
        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: block;
                    position: relative;
                    user-select: none;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                }
            </style>
            <div part="container">
                <slot></slot>
            </div>
        `);
        this.items = [];
        this._activeItem = null;
        this._selectedItem = null;
    }

    public get activeItem(): HTMLETreeItemElement | null {
        return this._activeItem;
    }

    public get selectedItem(): HTMLETreeItemElement | null {
        return this._selectedItem;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => item instanceof HTMLETreeItemElement) as HTMLETreeItemElement[];
                this.items = items;
                items.forEach((item) => {
                    item.parent = this;
                    item.indent = 1;
                });
            });
        }
        
        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    if (this.activeItem) {
                        if (this.activeItem.expanded) {
                            this.activeItem.toggle();
                        }
                        else {
                            if (this.activeItem.parent instanceof HTMLETreeItemElement) {
                                this.focusItem(this.activeItem.parent);
                            }
                        }
                    }
                    event.preventDefault();
                    break;
                case "ArrowRight":
                    if (this.activeItem) {
                        if (!this.activeItem.expanded) {
                            this.activeItem.toggle();
                        }
                        else {
                            if (this.activeItem.items.length > 0) {
                                this.focusItem(this.activeItem.items[0]);
                            }
                        }
                    }
                    event.preventDefault();
                    break;
                case "ArrowUp":
                    if (this.activeItem) {
                        this.focusItem(this.activeItem.previousVisibleItem());
                    }
                    else if (this.items.length > 0) {
                        this.focusItem(this.items[0]);
                    }
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    if (this.activeItem) {
                        this.focusItem(this.activeItem.nextVisibleItem());
                    }
                    else if (this.items.length > 0) {
                        this.focusItem(this.items[this.items.length - 1]);
                    }
                    event.preventDefault();
                    break;
                case "Home":
                    if (this.items.length > 0) {
                        this.focusItem(this.items[0]);
                    }
                    event.preventDefault();
                    break;
                case "End":
                    if (this.items.length > 0) {
                        this.focusItem(this.items[this.items.length - 1].deepestVisibleChildItem());
                    }
                    event.preventDefault();
                    break;
                case "Enter":
                    if (this.activeItem) {
                        this.selectItem(this.activeItem);
                        this.activeItem.trigger();
                    }
                    break;
                case "Escape":
                    this.active = false;
                    this.reset();
                    this.focus();
                    break;
            }
        });

        this.addEventListener("click", (event: MouseEvent) => {
            const target = event.target as Element;
            if (target instanceof HTMLETreeItemElement) {
                this.selectItem(target);
                target.trigger();
            }
        });

        this.addEventListener("focusin", (event: FocusEvent) => {
            const target = event.target as Element;
            if (!this.active) {
                this.active = true;
            }
            const closestItem = target.closest("e-treeitem");
            if (closestItem && this.contains(closestItem)) {
                this.focusItem(closestItem);
            }
        });

        this.addEventListener("focusout", (event: FocusEvent) => {
            const relatedTarget = event.relatedTarget as Element;
            if (!this.contains(relatedTarget)) {
                this.active = false;
                if (this.activeItem) {
                    this.activeItem.active = false;
                }
            }
        });
    }

    public focusItem(item: HTMLETreeItemElement) {
        if (this.activeItem) {
            this.activeItem.active = false;
        }
        this._activeItem = item;
        this._activeItem.active = true;
        item.focus();
    }

    public selectItem(item: HTMLETreeItemElement) {
        if (this._selectedItem) {
            this._selectedItem.selected = false;
        }
        this._selectedItem = item;
        this._selectedItem.selected = true;
    }

    public reset(): void {
        if (this.activeItem) {
            this.activeItem.active = false;
        }
        if (this._selectedItem) {
            this._selectedItem.selected = false;
        }
    }

    public findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null {
        let foundItem: HTMLETreeItemElement | null = null;
        for (let item of this.items) {
            if (predicate(item)) {
                return item;
            }
            if (subtree && item.items) {
                for (let subitem of item.items) {
                    foundItem = subitem.findItem(predicate, subtree);
                    if (foundItem) {
                        return foundItem;
                    }
                }
            }
        }
        return foundItem;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tree": HTMLETreeElement,
    }
}
