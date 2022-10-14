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
                background-color: var(--focused-item-color);
            }

            :host(:focus-visible) {
                outline: none;
            }
            
            :host(:is([type="menu"], [type="submenu"])) ::slotted([slot="menu"]) {
                z-index: 1;
                position: absolute;
            }
            
            :host(:is([type="menu"], [type="submenu"]):not([expanded])) ::slotted([slot="menu"]) {
                opacity: 0;
                pointer-events: none;
            }
            
            :host([type="submenu"]) [part="icon"] {
                visibility: hidden;
            }
            
            :host([type="menu"]) [part="icon"],
            :host(:not([type="submenu"])) [part="arrow"] {
                display: none;
            }
            
            :host(:is([type="checkbox"], [type="radio"])[checked]) {
                --icon-color: black;
                --icon-image: url("/assets/done_FILL0_wght400_GRAD0_opsz48.svg");
            }
            
            :host([type="submenu"]) {
                --arrow-color: black;
                --arrow-image: url("/assets/arrow_right_FILL0_wght400_GRAD0_opsz48.svg");
            }
            
            [part="icon"],
            [part="label"],
            [part="arrow"] {
                pointer-events: none;
            }
            
            [part="icon"],
            [part="label"] {
                padding: 2px;
            }
            
            [part="icon"] {
                flex: none;
                display: inline-block;
                width: 18px;
                height: 18px;
                overflow: hidden;
                margin-right: 4px;
            }
            
            [part="label"] {
                flex: auto;
                line-height: 18px;
                margin-left: 8px;
                margin-right: 8px;
            }
            
            :host(:is(:not([type]), [type="button"], [type="radio"], [type="checkbox"])[checked]) [part="icon"] {
                background-color: var(--activated-item-color);
            }
            
            :host(:is(:not([type]), [type="button"], [type="radio"], [type="checkbox"])) [part="icon"]::before {
                display: inline-block;
                width: 18px;
                height: 18px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;
                background-color: var(--icon-color, none);
                -webkit-mask-image: var(--icon-image, none);
                mask-image: var(--icon-image, none);
                filter: var(--icon-filter, none);
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
                background-color: var(--arrow-color, none);
                -webkit-mask-image: var(--arrow-image, none);
                mask-image: var(--arrow-image, none);
                filter: var(--arrow-filter, none);
            }

            :host(:hover):host-context(e-menubar:focus),
            :host(:hover):host-context(e-menubar:not(:focus-within)) {
                background-color: var(--hovered-item-color);
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
        console.log(shadowRoot.adoptedStyleSheets[0]);
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
            const {style: menuStyle} = menu;
            const {top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight} = this.getBoundingClientRect();
            const {width: menuWidth, height: menuHeight} = menu.getBoundingClientRect();
            const {scrollY, scrollX} = window;
            const {clientWidth, clientHeight} = document.body;
            const {type} = this;
            if (type == "menu") {
                const overflowX = itemRight + menuWidth - clientWidth;
                const overflowY = itemTop + menuHeight - clientHeight;
                menuStyle.setProperty("left", `${
                    overflowX > 0 ?
                    scrollX + itemRight - menuWidth :
                    scrollX + itemLeft
                }px`);
                menuStyle.setProperty("top", `${
                    overflowY > 0 ?
                    scrollY + itemTop - menuHeight :
                    scrollY + itemBottom
                }px`);
            }
            else {
                const closestMenu = this.closest("e-menu");
                if (closestMenu !== null) {
                    const {top: closestMenuTop, left: closestMenuLeft} = closestMenu.getBoundingClientRect();
                    const overflowX = itemRight + menuWidth - clientWidth;
                    const overflowY = itemTop + menuHeight - clientHeight;
                    menuStyle.setProperty("left", `${
                        overflowX > 0 ?
                        itemLeft - menuWidth - closestMenuLeft :
                        itemRight - closestMenuLeft
                    }px`);
                    menuStyle.setProperty("top", `${
                        overflowY > 0 ?
                        itemBottom  - menuHeight - closestMenuTop :
                        itemTop - closestMenuTop
                    }px`);
                }
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