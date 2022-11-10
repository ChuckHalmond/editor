import { DEFAULT_THEME_CHECKED_IMAGE, DEFAULT_THEME_ACTIVATED_ITEM_COLOR, DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_ARROW_RIGHT_IMAGE } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, QueryProperty, element } from "../../Element";
import { HTMLEMenuElement } from "./Menu";

export { HTMLEMenuItemElement };
export { EMenuItem };

interface HTMLEMenuItemElementConstructor {
    prototype: HTMLEMenuItemElement;
    new(): HTMLEMenuItemElement;
}

interface HTMLEMenuItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly internals: ElementInternals;
    get menu(): HTMLEMenuElement | null;
    name: string;
    label: string | null;
    value: string;
    hotkey: string;
    disabled: boolean;
    checked: boolean;
    expanded: boolean;
    type: "button" | "checkbox" | "radio" | "menu" | "submenu";
    connectedCallback(): void;
    attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void;
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-menuitem": HTMLEMenuItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-menuitem"
})
class HTMLEMenuItemElementBase extends HTMLElement implements HTMLEMenuItemElement {

    readonly shadowRoot!: ShadowRoot;
    readonly internals: ElementInternals;
    
    @QueryProperty({selector: ":scope > e-menu[slot=menu]"})
    menu!: HTMLEMenuElement | null;

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    label!: string | null;

    @AttributeProperty({type: String})
    value!: string;

    @AttributeProperty({type: String})
    hotkey!: string;

    @AttributeProperty({type: Boolean, observed: true})
    disabled!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    checked!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    expanded!: boolean;

    @AttributeProperty({type: Boolean})
    overflown!: boolean;

    @AttributeProperty({type: String, defaultValue: "button", observed: true})
    type!: "button" | "checkbox" | "radio" | "menu" | "submenu";

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("span", {
                attributes: {
                    part: "icon"
                }
            }),
            element("span", {
                attributes: {
                    part: "label"
                },
                children: [
                    element("slot")
                ]
            }),
            element("span", {
                attributes: {
                    part: "arrow"
                }
            }),
            element("slot", {
                attributes: {
                    name: "menu"
                }
            })
        );
        style = /*css*/`
            :host {
                display: flex;
                user-select: none;
                white-space: nowrap;
                box-sizing: border-box;
            }
            
            :host([disabled]) {
                opacity: 0.38;
                pointer-events: none;
            }
            
            :host(:focus-within) {
                background-color: ${DEFAULT_THEME_FOCUSED_ITEM_COLOR};
            }
            
            :host(:is([type="menu"], [type="submenu"])) ::slotted([slot="menu"]) {
                z-index: 1;
                position: absolute;
            }
            
            :host(:is([type="menu"], [type="submenu"]):not([expanded])) ::slotted([slot="menu"]) {
                width: 0;
                height: 0;
                padding: 0;
                opacity: 0;
                pointer-events: none;
                overflow: hidden;
            }
            
            :host([type="submenu"]) [part="icon"] {
                visibility: hidden;
            }
            
            :host([type="menu"]) [part="icon"],
            :host(:not([type="submenu"])) [part="arrow"] {
                display: none;
            }
            
            :host(:is([type="checkbox"], [type="radio"])[checked]) [part="icon"]::before {
                -webkit-mask-image: var(--theme-arrow-done-image, url(${DEFAULT_THEME_CHECKED_IMAGE}));
                mask-image: var(--theme-arrow-done-image, url(${DEFAULT_THEME_CHECKED_IMAGE}));
                background-color: black;
            }
            
            :host([type="submenu"]) [part="arrow"]::after {
                -webkit-mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
                mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
                background-color: black;
            }
            
            [part="icon"],
            [part="label"],
            [part="arrow"] {
                pointer-events: none;
            }
            
            [part="icon"] {
                flex: none;
                display: inline-block;
                width: 18px;
                height: 18px;
                padding: 2px;
                overflow: hidden;
                margin-right: 4px;
            }
            
            [part="label"] {
                flex: auto;
                line-height: 18px;
                padding: 2px;
                margin-left: 8px;
                margin-right: 8px;
            }
            
            :host(:is(:not([type]), [type="button"], [type="radio"], [type="checkbox"])[checked]) [part="icon"] {
                background-color: var(--theme-activated-item-color, ${DEFAULT_THEME_ACTIVATED_ITEM_COLOR});
            }
            
            :host(:is(:not([type]), [type="button"], [type="radio"], [type="checkbox"])) [part="icon"]::before {
                display: inline-block;
                width: 18px;
                height: 18px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;

                mask-image: none;
                -webkit-mask-image: none;
                background-color: none;
            }
            
            [part="arrow"] {
                flex: none;
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px 4px 1px 1px;
            }
            
            [part="arrow"]::after {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;

                mask-image: none;
                -webkit-mask-image: none;
                background-color: none;
            }

            :host(:hover):host-context(e-menubar:focus),
            :host(:hover):host-context(e-menubar:not(:focus-within)) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
        `;
    }

    constructor() {
        super();
        const internals = this.attachInternals();
        this.internals = internals;
        internals.role = "menuitem";
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

    attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void {
        const {internals} = this;
        switch (attributeName) {
            case "type": {
                switch (newValue) {
                    case "checkbox":
                    case "radio": {
                        internals.role = `menuitem${newValue}`;
                        break;
                    }
                    default: {
                        internals.role = "menuitem";
                        break;
                    }
                }
                break;
            }
            case "checked": {
                internals.ariaChecked = String(newValue !== null);
                break;
            }
            case "disabled": {
                internals.ariaDisabled = String(newValue !== null);
                break;
            }
            case "expanded": {
                internals.ariaExpanded = String(newValue !== null);
                break;
            }
            case "label": {
                internals.ariaLabel = newValue;
                break;
            }
        }
    }

    toggle(force?: boolean): void {
        const {type, expanded} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                const expand = force ?? !expanded;
                this.expanded = expand;
                if (expand) {
                    this.#positionMenu();
                }
                this.dispatchEvent(new Event("toggle", {bubbles: true}));
                break;
            }
        }
    }

    expand(): void {
        const {type, expanded} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                if (!expanded) {
                    this.expanded = true;
                    this.#positionMenu();
                }
                break;
            }
        }
    }

    collapse(): void {
        const {type, expanded} = this;
        switch (type) {
            case "menu":
            case "submenu": {
                if (expanded) {
                    this.expanded = false;
                }
                break;
            }
        }
    }

    #positionMenu(): void {
        const {menu} = this;
        if (menu !== null) {
            const {width, height} = this.getBoundingClientRect();
            const {style: menuStyle} = menu;
            const {width: menuWidth, height: menuHeight} = menu.getBoundingClientRect();
            const {clientWidth, clientHeight} = document.body;
            const {type, offsetLeft, offsetTop} = this;
            const overflowX = offsetLeft + width + menuWidth - clientWidth;
            const overflowY = offsetTop + menuHeight - clientHeight;
            if (type === "menu") {
                menuStyle.setProperty("left", `${
                    overflowX > 0 ?
                    offsetLeft + width - menuWidth :
                    offsetLeft
                }px`);
                menuStyle.setProperty("top", `${
                    overflowY > 0 ?
                    offsetTop - menuHeight  :
                    offsetTop + height
                }px`);
            }
            else {
                menuStyle.setProperty("left", `${
                    overflowX > 0 ?
                    offsetLeft - menuWidth :
                    offsetLeft + width
                }px`);
                menuStyle.setProperty("top", `${
                    overflowY > 0 ?
                    offsetTop + height - menuHeight :
                    offsetTop
                }px`);
            }
        }
    }
}

var HTMLEMenuItemElement: HTMLEMenuItemElementConstructor = HTMLEMenuItemElementBase;

interface EMenuItemConstructor {
    prototype: HTMLEMenuItemElement;
    new(init: {
        name?: string;
        label: string;
        type?: "button" | "checkbox" | "radio" | "menu" | "submenu";
        value?: string;
        trigger?: () => void;
        menu?: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    button(init: {
        name?: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    checkbox(init: {
        name?: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    radio(init: {
        name?: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEMenuItemElement;
    menu(init: {
        name?: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
    submenu(init: {
        name?: string;
        label: string;
        menu: HTMLEMenuElement;
    }): HTMLEMenuItemElement;
}

var EMenuItem = <EMenuItemConstructor>Object.assign(
    <Function>function(init: {
        name?: string;
        label: string;
        type?: "button" | "checkbox" | "radio" | "menu" | "submenu";
        value?: string;
        trigger?: () => void;
        menu?: HTMLEMenuElement;
    }) {
        const {label, name, type, value, trigger, menu} = init;
        if (menu) {
            menu.slot = "menu";
        }
        return element("e-menuitem", {
            attributes: {
                tabindex: -1,
                title: label,
                name: name,
                value: value,
                type: type
            },
            children: menu ? [
                label,
                menu
            ] : [
                label
            ],
            listeners: {
                click: trigger
            }
        });
    }, {
        prototype: HTMLEMenuItemElement.prototype,
        button(init: {
            name?: string,
            label: string,
            value?: string,
            trigger?: () => void;
        }) {
            return new EMenuItem({
                ...init, type: "button"
            });
        },
        checkbox(init: {
            name?: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EMenuItem({
                ...init, type: "checkbox"
            });
        },
        radio(init: {
            name?: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EMenuItem({
                ...init, type: "radio"
            });
        },
        menu(init: {
            name?: string;
            label: string;
            menu: HTMLEMenuElement;
        }) {
            return new EMenuItem({
                ...init, type: "menu"
            });
        },
        submenu(init: {
            name?: string;
            label: string;
            menu: HTMLEMenuElement;
        }) {
            return new EMenuItem({
                ...init, type: "submenu"
            });
        }
    }
);