import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
import { HTMLEStatusItemElement } from "./StatusItem";

export { HTMLEStatusBarElement };
export { HTMLEStatusBarElementBase };

interface HTMLEStatusBarElement  extends HTMLElement {
    items: HTMLEStatusItemElement[];
}

@RegisterCustomHTMLElement({
    name: "e-statusbar"
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "active", type: "boolean"},
])
class HTMLEStatusBarElementBase extends HTMLElement implements HTMLEStatusBarElement {

    public name!: string;
    public active!: boolean;
    
    public items: HTMLEStatusItemElement[];

    public _selectedItemIndex: number;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: flex;
                    position: relative; 
                    user-select: none;

                    background-color: white;
                }

                :host(:focus) {
                    outline: 1px solid -webkit-focus-ring-color;
                }

                :host(:focus) ::slotted(:first-child),
                :host(:not(:focus-within)) ::slotted(:hover) {
                    color: black;
                    background-color: gainsboro;
                }

                [part~="ul"] {
                    display: block;
                    list-style-type: none;
                    padding: 0; margin: 0;
                }
            </style>
            <ul part="ul">
                <slot></slot>
            </ul>
        `);

        this.items = [];
        this._selectedItemIndex = -1;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", (event: Event) => {
                const items = (event.target as HTMLSlotElement).assignedElements()
                    .filter(item => isTagElement("e-statusitem", item)) as HTMLEStatusItemElement[];
                this.items = items;
            }, {once: true});
        }
    }

    public get selectedItemIndex(): number {
        return this._selectedItemIndex;
    }

    public get selectedItem(): HTMLEStatusItemElement | null {
        return this.items[this.selectedItemIndex] || null;
    }

    public insertItem(index: number, item: HTMLEStatusItemElement): void {
        index = Math.min(Math.max(index, -this.items.length), this.items.length);
        this.insertBefore(item, this.children[index >= 0 ? index : this.children.length + index]);
        this.items.splice(index, 0, item);
        item.addEventListener("mouseenter", () => {
            this.selectItem(this.items.indexOf(item));
        });
        item.addEventListener("mouseleave", () => {
        });
    }

    public findItem(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement | null {
        const items = this.findItems(predicate);
        if (items.length > 0) {
            return items[0];
        }
        return null;
    }

    public findItems(predicate: (item: HTMLEStatusItemElement) => boolean): HTMLEStatusItemElement[] {
        const items: HTMLEStatusItemElement[] = [];
        this.items.forEach((item) => {
            if (predicate(item)) {
                items.push(item);
            }
        });
        return items;
    }

    public selectItem(index: number): void {
        if (index !== this.selectedItemIndex) {
            this.clearSelection();
            let item = this.items[index];
            if (item) {
                this._selectedItemIndex = index;
            }
        }
    }

    public clearSelection() {
        let item = this.selectedItem;
        if (item) {
            this._selectedItemIndex = -1;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-statusbar": HTMLEStatusBarElement,
    }
}