import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot, isTagElement } from "../../HTMLElement";
import { HTMLETreeElement } from "./Tree";

export { HTMLETreeItemElement };
export { HTMLETreeItemElementBase };

interface HTMLETreeItemElement extends HTMLElement {
    name: string;
    label: string;
    expanded: boolean;
    indent: number;
    icon: string;
    selected: boolean;
    active: boolean;
    leaf: boolean;

    items: HTMLETreeItemElement[];
    parent: HTMLETreeItemElement | HTMLETreeElement | null;

    deepestVisibleChildItem(): HTMLETreeItemElement;
    previousVisibleItem(): HTMLETreeItemElement;
    nextVisibleItem(): HTMLETreeItemElement;
    nearestParentItem(): HTMLETreeItemElement;

    toggle(): void;
    trigger(): void;

    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;
}

@RegisterCustomHTMLElement({
    name: "e-treeitem",
    observedAttributes: ["icon", "label", "expanded", "indent"]
})
@GenerateAttributeAccessors([
    {name: "name", type: "string"},
    {name: "label", type: "string"},
    {name: "icon", type: "string"},
    {name: "indent", type: "number"},
    {name: "active", type: "boolean"},
    {name: "selected", type: "boolean"},
    {name: "expanded", type: "boolean"},
    {name: "leaf", type: "boolean"}
])
class HTMLETreeItemElementBase extends HTMLElement implements HTMLETreeItemElement {

    public name!: string;
    public label!: string;
    public indent!: number;
    public expanded!: boolean;
    public value!: string;
    public icon!: string;
    public selected!: boolean;
    public active!: boolean;
    public leaf!: boolean;

    public items: HTMLETreeItemElement[];
    public parent: HTMLETreeItemElement | HTMLETreeElement | null;

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
                :host {
                    display: inline-block;

                    user-select: none;
                    white-space: nowrap;

                    padding: 0;
                    cursor: pointer;

                    --indent-width: 6px;
                }
                
                [part~="content"]:hover,
                :host([active]:not([selected])) [part~="content"] {
                    background-color: whitesmoke;
                }

                :host([selected]) [part~="content"] {
                    background-color: gainsboro;
                }

                :host(:not([expanded])) [part~="container"] {
                    display: none;
                }

                [part~="content"] {
                    font-size: 1em;
                    display: flex;
                    padding-left: calc(var(--tree-indent) * var(--indent-width));
                }

                [part~="label"],
                ::slotted([slot="label"]) {
                    display: block;
                    width: 100%;
                    pointer-events: none;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                :host([leaf]) [part~="container"],
                [part~="container"]:empty {
                    display: none;
                }

                [part~="toggle_arrow"] {
                    flex: none;
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    margin: 2px;
                    margin-right: 6px;
                    border-radius: 2px;
                }

                :host([leaf]) [part~="toggle_arrow"] {
                    visibility: hidden;
                }

                [part~="toggle_arrow"]::after {
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    position: absolute;
                    color: dimgray;
                    text-align: center;
                }

                :host(:not([expanded])) [part~="toggle_arrow"]::after {
                    content: "►";
                }

                :host([expanded]) [part~="toggle_arrow"]::after {
                    content: "▼";
                }

                [part~="state"] {
                    flex: none;
                }

                [part~="container"] {
                    display: flex;
                    flex-direction: column;
                }
            </style>
            <span part="content">
                <span part="toggle_arrow"></span>
                <slot name="label"><span part="label"></span></slot>
            </span>
            <div part="container">
                <slot></slot>
            </div>
        `);
        this.items = [];
        this.parent = null;
        this.indent = 0;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;

        const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot:not([name])");
        if (slot) {
            slot.addEventListener("slotchange", () => {
                const items = slot.assignedElements()
                    .filter(item => isTagElement("e-treeitem", item)) as HTMLETreeItemElement[];
                this.items = items;
                this.items.forEach((item) => {
                    item.parent = this;
                    item.indent = this.indent + 1;
                });
            });
        }

        const content = this.shadowRoot!.querySelector("[part=content]")!;
        content.addEventListener("click", () => {
            this.toggle();
        });
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    if (oldValue !== newValue) {
                        const labelPart = this.shadowRoot?.querySelector("[part~=label]");
                        if (labelPart) {
                            labelPart.textContent = newValue;
                        }
                    }
                    break;
                case "icon":
                    if (oldValue !== newValue) {
                        const iconPart = this.shadowRoot?.querySelector<HTMLElement>("[part~=icon]");
                        if (iconPart) {
                            iconPart.dataset.value = newValue;
                        }
                    }
                    break;
                case "indent":
                    if (oldValue !== newValue) {
                        this.style.setProperty("--tree-indent", newValue);
                    }
                    break;
            }
        }
    }

    public deepestVisibleChildItem(): HTMLETreeItemElement {
        if (this.expanded && this.items.length > 0) {
            let lastChildItem = this.items[this.items.length - 1];
            return lastChildItem.deepestVisibleChildItem();
        }
        return this;
    }

    public previousVisibleItem(): HTMLETreeItemElement {
        if (this.parent) {
            let indexOfThis = this.parent.items.indexOf(this);
            if (indexOfThis > 0) {
                let previousItem = this.parent.items[indexOfThis - 1];
                return previousItem.deepestVisibleChildItem();
            }
            return isTagElement("e-treeitem", this.parent) ? this.parent : this;
        }
        return this;
    }

    public nextVisibleItem(): HTMLETreeItemElement {
        if (this.expanded && this.items.length > 0) {
            return this.items[0];
        }
        let nearestItem = this.nearestParentItem();
        if (nearestItem.parent) {
            let indexOfNearest = nearestItem.parent.items.indexOf(nearestItem);
            if (indexOfNearest < nearestItem.parent.items.length - 1) {
                return nearestItem.parent.items[indexOfNearest + 1];
            }
        }
        return this;
    }

    public nearestParentItem(): HTMLETreeItemElement {
        if (isTagElement("e-treeitem", this.parent)) {
            let indexOfThis = this.parent.items.indexOf(this);
            if (indexOfThis === this.parent.items.length - 1) {
                return this.parent.nearestParentItem();
            }
        }
        return this;
    }

    public toggle(): void {
        this.expanded = !this.expanded;
        this.dispatchEvent(new CustomEvent("e_toggle", {bubbles: true}));
    }

    public trigger(): void {
        this.dispatchEvent(new CustomEvent("e_trigger", {bubbles: true}));
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
        "e-treeitem": HTMLETreeItemElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e_toggle": Event,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e_trigger": Event,
    }
}