import { CustomElement, element, AttributeProperty } from "../../Element";
import { HTMLETreeElement } from "./Tree";
import { HTMLETreeItemGroupElement } from "./TreeItemGroup";

export { HTMLETreeItemElement };

interface HTMLETreeItemElementConstructor {
    readonly prototype: HTMLETreeItemElement;
    new(): HTMLETreeItemElement;
}

interface HTMLETreeItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly group: HTMLETreeItemGroupElement | null;
    name: string;
    posinset: number;
    label: string;
    droptarget: boolean;
    expanded: boolean;
    selected: boolean;
    active: boolean;
    level: number;
    type: "leaf" | "parent";
    toggle(force?: boolean): void;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeitem": HTMLETreeItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-treeitem"
})
class HTMLETreeItemElementBase extends HTMLElement implements HTMLETreeItemElement {

    readonly shadowRoot!: ShadowRoot;

    get group(): HTMLETreeItemGroupElement | null {
        return this.#group;
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Number})
    posinset!: number;

    @AttributeProperty({type: String, observed: true})
    label!: string;

    @AttributeProperty({type: Boolean, observed: true})
    expanded!: boolean;
    
    @AttributeProperty({type: Boolean})
    droptarget!: boolean;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    selected!: boolean;

    @AttributeProperty({type: Number, observed: true})
    level!: number;

    @AttributeProperty({type: String, defaultValue: "leaf"})
    type!: "leaf" | "parent";

    #group: HTMLETreeItemGroupElement | null;
    
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                properties: {
                    textContent: /*css*/`
                        :host {
                            display: block;
                            user-select: none;
                        }
                        
                        :host([droptarget]) {
                            background-color: gainsboro;
                        }

                        :host([active]) [part="content"] {
                            background-color: whitesmoke;
                            outline: 1px solid black;
                            outline-offset: -1px;
                        }

                        :host([selected]) [part="content"] {
                            background-color: gainsboro;
                        }

                        [part="content"] {
                            display: flex;
                            line-height: 22px;
                            padding-left: calc(var(--level) * var(--indent-width, 12px));
                        }

                        [part="content"]:hover {
                            background-color: whitesmoke;
                        }
                        
                        :host(:not([type="parent"])) ::slotted([slot="group"]),
                        :host(:not([expanded])) ::slotted([slot="group"]) {
                            display: none;
                        }

                        :host(:not([type="parent"])) [part="arrow"]::before {
                            visibility: hidden;
                        }

                        [part="arrow"] {
                            display: inline-block;
                            width: 18px;
                            height: 18px;
                            margin: 1px 4px 1px 1px;
                        }

                        [part="arrow"]::before {
                            display: inline-block;
                            width: 18px;
                            height: 18px;
                            margin: 1px;
                            content: "";
                            mask-size: 18px 18px;
                            -webkit-mask-size: 18px 18px;
                            background-color: var(--arrow-color, none);
                            filter: var(--arrow-filter, none);
                        }
                        
                        :host(:not([expanded])) [part="arrow"]::before {
                            -webkit-mask-image: var(--arrow-image-collapsed, none);
                            mask-image: var(--arrow-image-collapsed, none);
                        }
                        
                        :host([expanded]) [part="arrow"]::before {
                            -webkit-mask-image: var(--arrow-image-expanded, none);
                            mask-image: var(--arrow-image-expanded, none);
                        }
                    `
                }
            }),
            element("div", {
                part: ["content"],
                children: [
                    element("span", {
                        part: ["arrow"]
                    }),
                    element("slot")
                ]
            }),
            element("slot", {
                properties: {
                    name: "group"
                }
            })
        );
    }
    
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.#group = null;
    }

    connectedCallback(): void {
        this.level = (() => {
            let level = 0;
            let {parentElement} = this;
            while (parentElement instanceof HTMLETreeItemGroupElement) {
                level++;
                ({parentElement} = parentElement);
                if (!(parentElement instanceof HTMLETreeItemElement)) {
                    return level;
                }
                ({parentElement} = parentElement);
            }
            if (parentElement instanceof HTMLETreeElement) {
                level++;
            }
            return level;
        })();
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "expanded": {
                this.dispatchEvent(new Event("toggle", {bubbles: true}));
                break;
            }
            case "selected": {
                this.dispatchEvent(new Event("select", {bubbles: true}));
                break;
            }
            case "label": {
                const labelPart = this.shadowRoot.querySelector("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
            case "level": {
                this.style.setProperty("--level", `${this.level}`);
                break;
            }
        }
    }

    toggle(force?: boolean): void {
        this.expanded = force ?? !this.expanded;
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target, shiftKey, ctrlKey} = event;
        const {type} = this;
        if (this == target && type == "parent" && !(shiftKey || ctrlKey)) {
            this.toggle();
        }
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const {name: slotName} = <HTMLSlotElement>target ;
        switch (slotName) {
            case "group": {
                const element = (<HTMLSlotElement>target).assignedElements()[0];
                this.#group = element instanceof HTMLETreeItemGroupElement ? element : null;
                break;
            }
        }
    }
}

var HTMLETreeItemElement: HTMLETreeItemElementConstructor = HTMLETreeItemElementBase;