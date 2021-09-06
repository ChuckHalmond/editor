import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
import { pointIntersectsWithDOMRect } from "../../Snippets";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuItemGroupElement } from "./MenuItemGroup";

export { HTMLEMenuElement };
export { HTMLEMenuElementBase };

interface HTMLEMenuElement extends HTMLElement {
    name: string;
    expanded: boolean;
    overflowing: boolean;
    parentItem: HTMLEMenuItemElement | null;
    items: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null;
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
}

@RegisterCustomHTMLElement({
    name: "e-menu",
    observedAttributes: ["expanded"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "expanded", type: "boolean"},
    {name: "overflowing", type: "boolean"}
])
class HTMLEMenuElementBase extends HTMLElement implements HTMLEMenuElement {

    public name!: string;
    public expanded!: boolean;
    public overflowing!: boolean;

    public parentItem: HTMLEMenuItemElement | null;
    public items: (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];

    private _activeIndex: number;
    private _style: CSSStyleDeclaration | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
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

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                }

                ::slotted(hr) {
                    margin: 6px 0;
                }
            </style>
            <div part="container">
                <slot></slot>
            </div>
        `);

        this.parentItem = null;
        this.items = [];
        this._activeIndex = -1;
        this._style = null;
    }

    public get activeIndex(): number {
        return this._activeIndex;
    }

    public get activeItem(): HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null {
        return this.items[this.activeIndex] || null;
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        this._style = window.getComputedStyle(this);
        
        const slot = this.shadowRoot?.querySelector("slot");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements().filter(
                    elem => isTagElement("e-menuitem", elem) || isTagElement("e-menuitemgroup", elem)
                ) as (HTMLEMenuItemElement | HTMLEMenuItemGroupElement)[];
                this.items = items;
                items.forEach((item) => {
                    item.parentMenu = this;
                });
            });
        }

        this.addEventListener("mousedown", (event: MouseEvent) => {
            let target = event.target as any;
            if (isTagElement("e-menuitem", target)) {
                let thisIncludesTarget = this.items.includes(target);
                if (thisIncludesTarget) {
                    target.trigger();
                }
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
                if (isTagElement("e-menuitem", target)) {
                    this.focusItemAt(targetIndex, true);
                }
                else {
                    this._activeIndex = targetIndex;
                }
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
            this.expanded = true;
        });

        this.addEventListener("focusout", (event: FocusEvent) => {
            let newTarget = event.relatedTarget as any;
            if (!this.contains(newTarget)) {  
                this.reset();
                this.expanded = false;
            }
        });

        this.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowUp":
                    this.focusItemAt((this.activeIndex <= 0) ? this.items.length - 1 : this.activeIndex - 1);
                    if (isTagElement("e-menuitemgroup", this.activeItem)) {
                        this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                    }
                    event.stopPropagation();
                    break;
                case "ArrowDown":
                    this.focusItemAt((this.activeIndex >= this.items.length - 1) ? 0 : this.activeIndex + 1);
                    if (isTagElement("e-menuitemgroup", this.activeItem)) {
                        this.activeItem.focusItemAt(0);
                    }
                    event.stopPropagation();
                    break;
                case "Home":
                    this.focusItemAt(0);
                    if (isTagElement("e-menuitemgroup", this.activeItem)) {
                        this.activeItem.focusItemAt(0);
                    }
                    event.stopPropagation();
                    break;
                case "End":
                    this.focusItemAt(this.items.length - 1);
                    if (isTagElement("e-menuitemgroup", this.activeItem)) {
                        this.activeItem.focusItemAt(this.activeItem.items.length - 1);
                    }
                    event.stopPropagation();
                    break;
                case "Enter":
                    if (isTagElement("e-menuitem", this.activeItem)) {
                        this.activeItem.trigger();
                        event.stopPropagation();
                    }
                    break;
                case "Escape":
                    if (this.parentItem) {
                        let parentGroup = this.parentItem.group;
                        let parentMenu = parentGroup ? parentGroup.parentMenu : this.parentItem.parentMenu;
                        if (isTagElement("e-menu", parentMenu)) {
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
                        let parentGroup = this.parentItem.group;
                        let parentMenu = parentGroup ? parentGroup.parentMenu : this.parentItem.parentMenu;
                        if (isTagElement("e-menu", parentMenu)) {
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
                        if (isTagElement("e-menuitem", this.activeItem) && this.activeItem.childMenu) {
                            this.activeItem.childMenu.focusItemAt(0);
                            event.stopPropagation();
                        }
                    }
                    break;
            }
        });
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "expanded":
                    if (newValue != null) {
                        let thisRect = this.getBoundingClientRect();
                        let thisIsOverflowing = thisRect.right > document.body.clientWidth;
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

    /*public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "expanded":
                    if (newValue != null) {
                        if (this.parentItem) {
                            let thisParentRect = this.parentItem.getBoundingClientRect();
                            let thisRect = this.getBoundingClientRect();
                            let thisPaddingTop = parseFloat(this._style!.paddingTop);
                            let thisIsOverflowing = false;
                            switch (this.parentItem.type) {
                                case "menu":
                                    this.style.top = `${thisParentRect.bottom}px`;
                                    this.style.left = `${thisParentRect.left}px`;
                                    thisIsOverflowing = (thisParentRect.left + thisRect.width) > document.body.clientWidth;
                                    break;
                                case "submenu":
                                    this.style.top = `${thisParentRect.top - thisPaddingTop}px`;
                                    this.style.left = `${thisParentRect.right}px`;
                                    thisIsOverflowing = (thisParentRect.right + thisRect.width) > document.body.clientWidth;
                                    break;
                            }
                            if (thisIsOverflowing) {
                                this.overflowing = true;
                                switch (this.parentItem.type) {
                                    case "menu":
                                        this.style.left = `${thisParentRect.right - thisRect.width}px`;
                                        break;
                                    case "submenu":
                                        this.style.left = `${thisParentRect.left - thisRect.width}px`;
                                        break;
                                }
                            }
                            else {
                                this.overflowing = false;
                            }
                        }
                    }
                    else {
                        this.style.left = "";
                        this.style.top = "";
                    }
                    break;
            }
        }
    }*/

    public focusItemAt(index: number, childMenu?: boolean): void {
        let item = this.items[index];
        if (item) {
            this._activeIndex = index;
            item.focus();
            if (isTagElement("e-menuitem", item)) {
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
        let item = this.activeItem;
        this._activeIndex = -1;
        if (isTagElement("e-menuitem", item) && item.childMenu) {
            item.childMenu.reset();
        }
    }

    public findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null {
        let foundItem: HTMLEMenuItemElement | HTMLEMenuItemGroupElement | null = null;
        for (let idx = 0; idx < this.items.length; idx++) {
            let item = this.items[idx];
            if (isTagElement("e-menuitem", item)) {
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
            else if (isTagElement("e-menuitemgroup", item)) {
                foundItem = item.findItem(predicate, subitems);
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
        "e-menu": HTMLEMenuElement,
    }
}