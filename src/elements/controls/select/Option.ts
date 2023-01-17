import { DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";

export { HTMLEOptionElement };

interface HTMLEOptionElementConstructor {
    prototype: HTMLEOptionElement;
    new(): HTMLEOptionElement;
}

interface HTMLEOptionElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly internals: ElementInternals;
    name: string;
    value: string;
    label: string;
    disabled: boolean;
    selected: boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-option": HTMLEOptionElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-option"
})
class HTMLEOptionElementBase extends HTMLElement implements HTMLEOptionElement {
    declare readonly shadowRoot: ShadowRoot;
    declare readonly internals: ElementInternals;

    @AttributeProperty({type: String})
    declare name: string;

    @AttributeProperty({type: String})
    declare value: string;
    
    @AttributeProperty({type: String, observed: true})
    declare label: string;

    @AttributeProperty({type: Boolean})
    declare disabled: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    declare selected: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("span", {
                attributes: {
                    part: "label"
                }
            })
        );
        style = /*css*/`
            :host {
                display: flex;
                user-select: none;
                white-space: nowrap;
                line-height: 22px;
                padding: 0 12px;
            }
            
            :host(:hover) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host(:focus-within) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host([selected]) {
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(::before) {
                display: flex;
                content: "";
                width: 18px;
                height: 18px;
                margin-right: 6px;
            
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;

                mask-image: none;
                background-color: none;
                -webkit-mask-image: none;
            }
        `;
    }

    constructor() {
        super();
        const internals = this.attachInternals();
        internals.role = "option";
        this.internals = internals;
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
            case "label": {
                const {shadowRoot} = this;
                const labelPart = shadowRoot.querySelector<HTMLElement>("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
            case "selected": {
                const {internals, selected} = this;
                internals.ariaSelected = String(selected);
                this.dispatchEvent(new Event("select", {bubbles: true}));
                break;
            }
        }
    }
}

var HTMLEOptionElement: HTMLEOptionElementConstructor = HTMLEOptionElementBase;