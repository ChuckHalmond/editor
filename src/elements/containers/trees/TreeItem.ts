import { CustomElement, HTML, AttributeProperty } from "../../Element";
import { HTMLETreeElement } from "./Tree";

export { HTMLETreeItemElement };

interface HTMLETreeItemElementConstructor {
    readonly prototype: HTMLETreeItemElement;
    new(): HTMLETreeItemElement;
    readonly observedAttributes: string[];
}

interface HTMLETreeItemElement extends HTMLElement {
    name: string;
    label: string;
    expanded: boolean;
    indent: number;
    selected: boolean;
    active: boolean;
    leaf: boolean;

    shadowRoot: ShadowRoot;
    items: HTMLETreeItemElement[];
    parent: HTMLETreeItemElement | HTMLETreeElement | null;

    deepestVisibleChildItem(): HTMLETreeItemElement;
    previousVisibleItem(): HTMLETreeItemElement;
    nextVisibleItem(): HTMLETreeItemElement;
    nearestParentItem(): HTMLETreeItemElement;

    toggle(): void;

    findItem(predicate: (item: HTMLETreeItemElement) => boolean, subtree?: boolean): HTMLETreeItemElement | null;

    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeitem": HTMLETreeItemElement,
    }
    
    interface HTMLElementEventMap {
        "e_toggle": Event,
    }
}

@CustomElement({
    name: "e-treeitem"
})
class HTMLETreeItemElementBase extends HTMLElement implements HTMLETreeItemElement {

    @AttributeProperty({type: "string"})
    public name!: string;

    @AttributeProperty({type: "string"})
    public label!: string;

    @AttributeProperty({type: "number"})
    public indent!: number;

    @AttributeProperty({type: "boolean"})
    public expanded!: boolean;

    @AttributeProperty({type: "string"})
    public value!: string;

    @AttributeProperty({type: "boolean"})
    public selected!: boolean;

    @AttributeProperty({type: "boolean"})
    public active!: boolean;

    @AttributeProperty({type: "boolean"})
    public leaf!: boolean;

    public items: HTMLETreeItemElement[];
    public parent: HTMLETreeItemElement | HTMLETreeElement | null;

    public static get observedAttributes(): string[] {
        return ["label", "expanded", "indent"];
    }

    public readonly shadowRoot!: ShadowRoot;

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            HTML("style", {
                properties: {
                    textContent: /*css*/`
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
                            pointer-events: auto;
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
                        
                        [part~="toggle-arrow"] {
                            flex: none;
                            display: inline-block;
                            width: 18px;
                            height: 18px;
                            margin: 2px;
                            margin-right: 6px;
                            border-radius: 2px;
                        }
                        
                        :host([leaf]) [part~="toggle-arrow"] {
                            visibility: hidden;
                        }
                        
                        [part~="toggle-arrow"]::after {
                            display: inline-block;
                            width: 18px;
                            height: 18px;
                            position: absolute;
                            color: dimgray;
                            text-align: center;
                        }
                        
                        :host(:not([expanded])) [part~="toggle-arrow"]::after {
                            content: "►";
                        }
                        
                        :host([expanded]) [part~="toggle-arrow"]::after {
                            content: "▼";
                        }
                        
                        [part~="state"] {
                            flex: none;
                        }
                        
                        [part~="container"] {
                            display: flex;
                            flex-direction: column;
                            pointer-events: none;
                        }
                    `
                }
            }),
            HTML("span", {
                part: ["content"],
                children: [
                    HTML("span", {
                        part: ["toggle-arrow"]
                    }),
                    HTML("slot", {
                        properties: {
                            name: "label",
                        },
                        children: [
                            HTML("span", {
                                part: ["label"]
                            }),
                        ]
                    })
                ]
            }),
            HTML("div", {
                part: ["container"],
                children: [
                    HTML("slot")
                ]
            })
        );
        
        this.items = [];
        this.parent = null;
    }

    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        
        this.indent = (() => {
            let indent = 0;
            let item: Element = this;
            while (item.parentElement instanceof HTMLETreeItemElement) {
                indent++;
                item = item.parentElement;
            }
            if (item.parentElement instanceof HTMLETreeElement) {
                indent++;
            }
            return indent;
        })();

        this.parent = (
            this.parentElement instanceof HTMLETreeItemElement ||
            this.parentElement instanceof HTMLETreeElement
        ) ? this.parentElement : null;

        this.shadowRoot.addEventListener("click", this);
        this.shadowRoot.addEventListener("slotchange", this);
    }

    public handleEvent(event: Event) {
        if (!(event.target instanceof Element)) {
            throw new Error("Target must be of type Element.");
        }
        switch (event.type) {
            case "click":
                if (event.target.matches("[part~=content]")) {
                    if (!this.leaf) {
                        this.toggle();
                    }
                }
                break;
            case "slotchange":
                if (event.target.matches("slot:not([name])")) {
                    this.items = (event.target as HTMLSlotElement)
                        .assignedElements()
                        .filter(item => item instanceof HTMLETreeItemElement) as HTMLETreeItemElement[];
                }
                break;
        }
    }

    public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (newValue !== oldValue) {
            switch (name) {
                case "label":
                    const labelPart = this.shadowRoot.querySelector("[part~=label]");
                    if (labelPart) {
                        labelPart.textContent = newValue;
                    }
                    break;
                case "expanded":
                    this.dispatchEvent(new CustomEvent("e_toggle", {bubbles: true}));
                    break;
                case "indent":
                    this.style.setProperty("--tree-indent", newValue);
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
            return this.parent instanceof HTMLETreeItemElement ? this.parent : this;
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
        if (this.parent instanceof HTMLETreeItemElement) {
            let indexOfThis = this.parent.items.indexOf(this);
            if (indexOfThis === this.parent.items.length - 1) {
                return this.parent.nearestParentItem();
            }
        }
        return this;
    }

    public toggle(): void {
        this.expanded = !this.expanded;
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

var HTMLETreeItemElement: HTMLETreeItemElementConstructor = HTMLETreeItemElementBase;