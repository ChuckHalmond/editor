import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
import { HTMLETreeItemElement } from "./TreeItem";

export { HTMLETreeElement };
export { HTMLETreeElementBase };

interface HTMLETreeElement extends HTMLElement {
    name: string;
    items: HTMLETreeItemElement[];
    readonly activeItem: HTMLETreeItemElement | null;
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
    }

    public get activeItem(): HTMLETreeItemElement | null {
        return this._activeItem;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => isTagElement("e-treeitem", item)) as HTMLETreeItemElement[];
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
                            if (isTagElement("e-treeitem", this.activeItem.parent)) {
                                this.activeItem.parent.focus();
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
                                this.activeItem.items[0].focus();
                            }
                        }
                    }
                    event.preventDefault();
                    break;
                case "ArrowUp":
                    if (this.activeItem) {
                        this.activeItem.previousVisibleItem().focus();
                    }
                    else if (this.items.length > 0) {
                        this.items[0].focus();
                    }
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    if (this.activeItem) {
                        this.activeItem.nextVisibleItem().focus();
                    }
                    else if (this.items.length > 0) {
                        this.items[this.items.length - 1].focus();
                    }
                    event.preventDefault();
                    break;
                case "Home":
                    if (this.items.length > 0) {
                        this.items[0].focus({preventScroll: true});
                    }
                    event.preventDefault();
                    break;
                case "End":
                    if (this.items.length > 0) {
                        this.items[this.items.length - 1].deepestVisibleChildItem().focus();
                    }
                    event.preventDefault();
                    break;
                case "Enter":
                    if (this.activeItem) {
                        this.activeItem.trigger();
                    }
                    break;
                case "Escape":
                    this.active = false;
                    if (this.activeItem) {
                        this.activeItem.active = false;
                    }
                    this.focus();
                    break;
            }
        });

        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (isTagElement("e-treeitem", target)) {
                target.trigger();
            }
        });

        this.addEventListener("focusin", (event: FocusEvent) => {
            let target = event.target as Element;
            if (!this.active) {
                this.active = true;
            }
            let closestItem = target.closest("e-treeitem");
            if (closestItem && this.contains(closestItem)) {
                if (this._activeItem) {
                    this._activeItem.active = false;
                }
                this._activeItem = closestItem;
                this._activeItem.active = true;
            }
        });

        this.addEventListener("focusout", (event: FocusEvent) => {
            let relatedTarget = event.relatedTarget as any;
            if (!this.contains(relatedTarget)) {
                this.active = false;
            }
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tree": HTMLETreeElement,
    }
}
