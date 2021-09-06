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
    active: boolean;

    items: HTMLETreeItemElement[];
    parent: HTMLETreeItemElement | HTMLETreeElement | null;

    deepestVisibleChildItem(): HTMLETreeItemElement;
    previousVisibleItem(): HTMLETreeItemElement;
    nextVisibleItem(): HTMLETreeItemElement;
    nearestParentItem(): HTMLETreeItemElement;

    toggle(): void;
    trigger(): void;
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
    public active!: boolean;
    public leaf!: boolean;

    public items: HTMLETreeItemElement[];
    public parent: HTMLETreeItemElement | HTMLETreeElement | null;
    private _toggleArrow: Element;

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
                
                :host([active]) [part~="content"],
                [part~="content"]:hover {
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

                [part~="toggle_arrow"]:hover {
                    background-color: whitesmoke;
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

        this._toggleArrow = this.shadowRoot!.querySelector("[part~=toggle_arrow]")!;
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

        this.shadowRoot!.addEventListener("mousedown", (event) => {
            let target = event.target as Element;
            if (target === this._toggleArrow) {
                this.toggle();
            }
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
        this.dispatchEvent(new CustomEvent("e-toggle", {bubbles: true}));
    }

    public trigger(): void {
        this.dispatchEvent(new CustomEvent("e-trigger", {bubbles: true}));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeitem": HTMLETreeItemElement,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e-toggle": Event,
    }
}

declare global {
    interface HTMLElementEventMap {
        "e-trigger": Event,
    }
}