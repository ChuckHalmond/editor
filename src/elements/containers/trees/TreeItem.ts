import { DEFAULT_THEME_ARROW_DROPDOWN_IMAGE, DEFAULT_THEME_ARROW_RIGHT_IMAGE, DEFAULT_THEME_DROPTARGET_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, element, AttributeProperty, QueryProperty } from "../../Element";
import { HTMLETreeItemGroupElement } from "./TreeItemGroup";

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

    declare readonly shadowRoot: ShadowRoot;

    @AttributeProperty({type: String})
    declare name: string;

    @AttributeProperty({type: Number})
    declare posinset: number;

    @AttributeProperty({type: String, observed: true})
    declare label: string;

    @AttributeProperty({type: Boolean, observed: true})
    declare expanded: boolean;
    
    @AttributeProperty({type: Boolean})
    declare droptarget: boolean;

    @AttributeProperty({type: Boolean})
    declare active: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    declare selected: boolean;

    @AttributeProperty({type: Number, observed: true})
    declare level: number;

    @AttributeProperty({type: String, defaultValue: "leaf"})
    declare type: "leaf" | "parent";

    @QueryProperty({selector: ":scope > e-treeitemgroup[slot=group]"})
    declare group: HTMLETreeItemGroupElement | null;
    
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
                background-color: var(--theme-droptarget-item-color, ${DEFAULT_THEME_DROPTARGET_ITEM_COLOR});
            }

            :host(:focus-visible) {
                outline: none;
            }
            
            :host([active]):host-context(e-tree:focus-within) [part="content"] {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            [part="content"]:hover {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([selected]) [part="content"] {
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
            }
            
            [part="content"] {
                display: flex;
                line-height: 22px;
                padding-left: 12px;
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
                background-color: none;
            }
            
            :host(:not([expanded])) [part="arrow"]::before {
                -webkit-mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
                mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
                background-color: black;
            }
            
            :host([expanded]) [part="arrow"]::before {
                -webkit-mask-image: var(--theme-arrow-dropdown-image, url(${DEFAULT_THEME_ARROW_DROPDOWN_IMAGE}));
                mask-image: var(--theme-arrow-dropdown-image, url(${DEFAULT_THEME_ARROW_DROPDOWN_IMAGE}));
                background-color: black;
            }
        `;
    }
    
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
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
                (<CSSStyleRule>this.shadowRoot.adoptedStyleSheets[0].cssRules[6]).styleMap.set("padding-left", `${12 * Number(newValue)}px`);
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