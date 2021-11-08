import { CustomElement, AttributeProperty, HTML } from "../../Element";
import { HTMLETreeItemElement } from "./TreeItem";

export { HTMLETreeElement };

interface HTMLETreeElementConstructor {
    readonly prototype: HTMLETreeElement;
    new(): HTMLETreeElement;
}

interface HTMLETreeElement extends HTMLElement {
    name: string;
    items: HTMLETreeItemElement[];
    readonly activeItem: HTMLETreeItemElement | null;
    readonly selectedItem: HTMLETreeItemElement | null;
    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;
    reset(): void;
}

@CustomElement({
    name: "e-tree"
})
class HTMLETreeElementBase extends HTMLElement implements HTMLETreeElement {

    @AttributeProperty({type: "boolean"})
    public active!: boolean;

    @AttributeProperty({type: "string"})
    public name!: string;
    
    public items: HTMLETreeItemElement[];

    private _activeItem: HTMLETreeItemElement | null;
    private _selectedItem: HTMLETreeItemElement | null;

    public readonly shadowRoot!: ShadowRoot;

    constructor() {
        super();
        
        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: block;
                            position: relative;
                            user-select: none;
                        }
        
                        [part~="container"] {
                            display: flex;
                            flex-direction: column;
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
        
        this.shadowRoot.addEventListener("slotchange", this);
        
        this.addEventListener("click", this);
        this.addEventListener("focusin", this);
        this.addEventListener("focusout", this);
        this.addEventListener("keydown", this);
    }

    public handleEvent(event: Event) {
        const target = event.target;
        switch (event.type) {
            case "slotchange":
                if (target instanceof Element && target.matches("slot:not([name])")) {
                    this.items = (event.target as HTMLSlotElement)
                        .assignedElements()
                        .filter(item => item instanceof HTMLETreeItemElement) as HTMLETreeItemElement[];
                }
                break;
            case "click":
                if (target instanceof HTMLETreeItemElement) {
                    this.selectItem(target);
                }
                break;
            case "focusin":
                if (!this.active) {
                    this.active = true;
                }
                if (target instanceof Element) {
                    const closestItem = target.closest("e-treeitem");
                    if (closestItem && this.contains(closestItem)) {
                        this.focusItem(closestItem);
                    }
                }
                break;
            case "focusout":
                const relatedTarget = (event as FocusEvent).relatedTarget;
                if (relatedTarget instanceof Element && !this.contains(relatedTarget)) {
                    this.active = false;
                    if (this.activeItem) {
                        this.activeItem.active = false;
                    }
                }
            case "keydown":
                switch ((event as KeyboardEvent).key) {
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
                            this.activeItem.click();
                        }
                        break;
                    case "Escape":
                        this.active = false;
                        this.reset();
                        this.focus();
                        break;
                }
                break;
        }
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

var HTMLETreeElement: HTMLETreeElementConstructor = HTMLETreeElementBase;

declare global {
    interface HTMLElementTagNameMap {
        "e-tree": HTMLETreeElement,
    }
}