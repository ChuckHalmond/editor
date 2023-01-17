import { DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";

export { HTMLEStatusItemElement };
export { EStatusItem };

interface HTMLEStatusItemElementConstructor {
    prototype: HTMLEStatusItemElement;
    new(): HTMLEStatusItemElement;
}

interface HTMLEStatusItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    active: boolean;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-statusitem": HTMLEStatusItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-statusitem"
})
class HTMLEStatusItemElementBase extends HTMLElement implements HTMLEStatusItemElement {
    
    declare readonly shadowRoot: ShadowRoot;

    @AttributeProperty({type: Boolean})
    declare active: boolean;

    @AttributeProperty({type: String})
    declare name: string;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("span", {
                attributes: {
                    part: "content"
                },
                children: element("slot")
            })
        );
        style = /*css*/`
            :host {
                display: flex;
                user-select: none;
                white-space: nowrap;
                cursor: pointer;
                line-height: 22px;
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(:hover) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host(:focus-within):host-context(e-statusbar:focus-within) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            [part="content"] {
                padding: 0 4px;
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
}

var HTMLEStatusItemElement: HTMLEStatusItemElementConstructor = HTMLEStatusItemElementBase;

interface EStatusItemConstructor {
    prototype: HTMLEStatusItemElement;
    new(init: {
        name: string;
        label: string;
        onclick?: () => void;
    }): HTMLEStatusItemElement;
}

var EStatusItem = <EStatusItemConstructor>Object.assign(
    <Function>function(init: {
        name: string;
        label: string;
        onclick?: () => void;
    }) {
        const {label, name, onclick} = init;
        return element("e-statusitem", {
            attributes: {
                title: label,
                name: name,
            },
            children: label,
            listeners: {
                click: onclick
            }
        });
    }, {
        prototype: HTMLEStatusItemElement.prototype
    }
);