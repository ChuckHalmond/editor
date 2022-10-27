import { CustomElement, element, AttributeProperty, QueryProperty } from "../../Element";
import { HTMLETreeItemGroupElement } from "./TreeItemGroup";
import { themeStylesheet } from "../../../stylesheets/Theme";

export { HTMLETreeItemElement };

interface HTMLETreeItemElementConstructor {
    prototype: HTMLETreeItemElement;
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
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeitem": HTMLETreeItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-treeitem"
})
class HTMLETreeItemElementBase extends HTMLElement implements HTMLETreeItemElement {

    readonly shadowRoot!: ShadowRoot;

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

    @QueryProperty({selector: ":scope > e-treeitemgroup[slot=group]"})
    group!: HTMLETreeItemGroupElement | null;
    
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("div", {
                attributes: {
                    part: "content"
                },
                children: [
                    element("span", {
                        attributes: {
                            part: "arrow"
                        }
                    }),
                    element("slot")
                ]
            }),
            element("slot", {
                attributes: {
                    name: "group"
                }
            })
        );
        style = /*css*/`
            :host {
                display: block;
                user-select: none;
            }
            
            :host([droptarget]) {
                background-color: var(--droptarget-item-color);
            }
            
            :host([active]:focus-visible) {
                outline: none;
            }
            
            :host([active]:is(:focus, :not(:focus-within))):host-context(e-tree:focus-within) [part="content"] {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }
            
            [part="content"]:hover {
                background-color: var(--hovered-item-color);
            }
            
            :host([selected]) [part="content"] {
                background-color: var(--selected-item-color);
            }
            
            [part="content"] {
                display: flex;
                line-height: 22px;
                padding-left: calc(var(--level) * var(--indent-width, 12px));
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
                -webkit-mask-image: var(--arrow-icon-collapsed, none);
                mask-image: var(--arrow-icon-collapsed, none);
            }
            
            :host([expanded]) [part="arrow"]::before {
                -webkit-mask-image: var(--arrow-icon-expanded, none);
                mask-image: var(--arrow-icon-expanded, none);
            }
        `;
    }
    
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet, themeStylesheet];
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
    }
    
    connectedCallback(): void {
        const {tabIndex} = this;
        this.tabIndex = tabIndex;
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
        const {expanded} = this;
        this.expanded = force ?? !expanded;
    }
}

var HTMLETreeItemElement: HTMLETreeItemElementConstructor = HTMLETreeItemElementBase;