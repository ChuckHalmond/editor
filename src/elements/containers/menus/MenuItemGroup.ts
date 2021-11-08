
import { HTML, CustomElement, AttributeProperty } from "../../Element";
import { HTMLEMenuItemElement } from "./MenuItem";
import { HTMLEMenuElement } from "./Menu";

export { HTMLEMenuItemGroupElement };

interface HTMLEMenuItemGroupElementConstructor {
    readonly prototype: HTMLEMenuItemGroupElement;
    new(): HTMLEMenuItemGroupElement;
    readonly observedAttributes: string[];
}

interface HTMLEMenuItemGroupElement extends HTMLElement {
    name: string;
    label: string;

    parentMenu: HTMLEMenuElement | null;
    items: HTMLEMenuItemElement[];

    readonly activeIndex: number;
    readonly activeItem: HTMLEMenuItemElement | null;
    
    focusItemAt(index: number, childMenu?: boolean): void;
    reset(): void;
    findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitemgroup": HTMLEMenuItemGroupElement,
    }
}

@CustomElement({
    name: "e-menuitemgroup"
})
class HTMLEMenuItemGroupElementBase extends HTMLElement implements HTMLEMenuItemGroupElement {

    @AttributeProperty({type: "string"})
    public name!: string;

    @AttributeProperty({type: "string"})
    public label!: string;
    
    public parentMenu: HTMLEMenuElement | null;
    public items: HTMLEMenuItemElement[];
    public readonly shadowRoot!: ShadowRoot;

    private _activeIndex: number;

    public static get observedAttributes(): string[] {
        return ["label"];
    }

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    textContent: /*css*/`
                        :host {
                            position: relative;
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
                    `
                }
            }),
            HTML("hr", {
                part: ["separator"]
            }),
            HTML("span", {
                part: ["label"]
            }),
            HTML("div", {
                part: ["container"],
                children: [
                    HTML("slot"),
                ]
            })
        );

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
                
        this.shadowRoot.addEventListener("slotchange", this);

        this.addEventListener("mousedown", this);
        this.addEventListener("mouseover", this);
        this.addEventListener("mouseout", this);
        this.addEventListener("focusin", this);
        this.addEventListener("focusout", this);
        this.addEventListener("click", this);
        this.addEventListener("keydown", this);
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
            case "click":
                if (target instanceof HTMLEMenuItemElement) {
                    if (target.type === "radio" && !target.checked) {
                        const checkedRadio = this.findItem(
                            (item) => item.type === "radio" && item.checked
                        );
                        if (checkedRadio) {
                            checkedRadio.checked = false;
                        }
                        target.checked = true;
                    }
                }
                break;
            case "focusout":
                const newTarget = (event as FocusEvent).relatedTarget;
                if (newTarget instanceof Element && !this.contains(newTarget)) {
                    this.reset();
                }
                break;
            /*case "mousedown":
                if (target instanceof HTMLEMenuItemElement) {
                    if (this.items.includes(target)) {
                        target.click();
                    }
                }
                break;*/
            case "mouseover":
                const targetIndex = this.items.indexOf(target as HTMLEMenuItemElement);
                if (this === target) {
                    this.reset();
                    this.focus();
                }
                else if (targetIndex >= 0) {
                    this.focusItemAt(this.items.indexOf(target as HTMLEMenuItemElement), true);
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
                if ((this === target || this.items.includes(target as HTMLEMenuItemElement)) && !thisIntersectsWithMouse) {
                    this.reset();
                    this.focus();
                }
                break;
            case "focusin":
                if (target instanceof Element) {
                    this._activeIndex = this.items.findIndex(
                        (item) => item.contains(target)
                    );
                }
                break;
            case "keydown":
                switch ((event as KeyboardEvent).key) {
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
                            this.activeItem.click();
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
                break;
        }
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

    public findItem(predicate: (item: HTMLEMenuItemElement) => boolean, subitems?: boolean): HTMLEMenuItemElement | null {
        let foundItem: HTMLEMenuItemElement | null = null;
        for (let item of this.items) {
            if (predicate(item)) {
                return item;
            }
            if (subitems && item.childMenu) {
                foundItem = item.childMenu.findItem(predicate, subitems);
                if (foundItem && foundItem) {
                    return foundItem;
                }
            }
        }
        return foundItem;
    }
}

var HTMLEMenuItemGroupElement: HTMLEMenuItemGroupElementConstructor = HTMLEMenuItemGroupElementBase;