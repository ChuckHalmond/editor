import { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR, DEFAULT_THEME_FOCUSED_ITEM_COLOR, DEFAULT_THEME_HOVERED_ITEM_COLOR, DEFAULT_THEME_ARROW_RIGHT_IMAGE } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element, QueryProperty } from "../../Element";
import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuItemElement } from "./MenuItem";

import "./Menu";
import "./MenuItem";
import "./MenuItemGroup";

export { HTMLEMenuButtonElement };
export { EMenuButton };

interface HTMLEMenuButtonElementConstructor {
    prototype: HTMLEMenuButtonElement;
    new(): HTMLEMenuButtonElement;
}

interface HTMLEMenuButtonElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
    readonly firstItem: HTMLEMenuItemElement | null;
    name: string;
    disabled: boolean;
    expanded: boolean;
    connectedCallback(): void;
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-menubutton"
})
class HTMLEMenuButtonElementBase extends HTMLElement implements HTMLEMenuButtonElement {

    readonly shadowRoot!: ShadowRoot;
    
    @QueryProperty({selector: ":scope > e-menu[slot=menu]"})
    readonly menu!: HTMLEMenuElement | null;
    
    @QueryProperty({selector: ":scope > e-menu[slot=menu] e-menuitem"})
    readonly firstItem!: HTMLEMenuItemElement | null;

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Boolean})
    disabled!: boolean;

    @AttributeProperty({type: Boolean})
    expanded!: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot"),
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
                position: relative;
                display: inline-block;
                padding: 2px;
                line-height: 18px;
                user-select: none;
                white-space: nowrap;
                cursor: pointer;
            }
            
            :host(:focus) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
            
            :host(:focus-within:not(:focus)) {
                background-color: var(--theme-focused-item-color, ${DEFAULT_THEME_FOCUSED_ITEM_COLOR});
            }
            
            :host(:hover:not(:focus-within)) {
                background-color: var(--theme-hovered-item-color, ${DEFAULT_THEME_HOVERED_ITEM_COLOR});
            }
            
            :host([disabled]) {
                color: lightgray;
            }
            
            ::slotted([slot="menu"]) {
                z-index: 1;
                position: absolute;
                color: initial;
            }
            
            :host(:not([expanded])) ::slotted([slot="menu"]) {
                opacity: 0;
                pointer-events: none;
            }
            
            [part="arrow"] {
                flex: none;
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px 4px 1px 1px;
                pointer-events: none;
            }
            
            [part="arrow"]::after {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;
                
                -webkit-mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
                mask-image: var(--theme-arrow-right-image, url(${DEFAULT_THEME_ARROW_RIGHT_IMAGE}));
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
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
    }

    connectedCallback(): void {
        const tabindex = this.getAttribute("tabindex");
        this.tabIndex = tabindex !== null ? parseInt(tabindex) : -1;
    }

    toggle(force?: boolean): void {
        const {expanded} = this;
        const expand = force ?? !expanded;
        expand ? this.expand() : this.collapse();
    }

    expand(): void {
        const {expanded} = this;
        if (!expanded) {
            this.expanded = true;
            this.#positionMenu();
        }
    }

    collapse(): void {
        const {expanded} = this;
        if (expanded) {
            this.expanded = false;
        }
    }

    #positionMenu(): void {
        const {menu} = this;
        if (menu !== null) {
            const {width, height} = this.getBoundingClientRect();
            const {style: menuStyle} = menu;
            const {width: menuWidth, height: menuHeight} = menu.getBoundingClientRect();
            const {clientWidth, clientHeight} = document.body;
            const {offsetLeft, offsetTop} = this;
            const overflowX = offsetLeft + width + menuWidth - clientWidth;
            const overflowY = offsetTop + menuHeight - clientHeight;
            menuStyle.setProperty("left", `${
                overflowX > 0 ?
                width - menuWidth :
                0
            }px`);
            menuStyle.setProperty("top", `${
                overflowY > 0 ?
                -menuHeight  :
                height
            }px`);
        }
    }

    #handleClickEvent(event: FocusEvent): void {
        const {target} = event;
        const {menu} = this;
        if (menu && !menu.contains(<Node>target)) {
            this.toggle();
            const {expanded} = this;
            if (expanded) {
                menu?.focus({preventScroll: true});
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const lostFocusWithin = !this.contains(<Node>relatedTarget);
        if (lostFocusWithin) {
            this.collapse();
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent): void {
        const {key} = event;
        const {expanded} = this;
        switch (key) {
            case "ArrowDown":
            case "Enter":
                if (!expanded) {
                    this.expand();
                    this.firstItem?.focus({preventScroll: true});
                    event.stopPropagation();
                }
                break;
            case "Escape":
                if (expanded) {
                    this.collapse();
                }
                this.focus({preventScroll: true});
                event.stopPropagation();
                break;
        }
    }
}

var HTMLEMenuButtonElement: HTMLEMenuButtonElementConstructor = HTMLEMenuButtonElementBase;

interface EMenuButtonConstructor {
    prototype: HTMLEMenuButtonElement;
    new(init: {
        menu: HTMLEMenuElement
    }): HTMLEMenuButtonElement;
}

var EMenuButton = <EMenuButtonConstructor>Object.assign(
    <Function>function(init: {
        menu: HTMLEMenuElement
    }) {
        const {menu} = init;
        menu.slot = "menu";
        return element("e-menubutton", {
            attributes: {
                tabindex: -1
            },
            children: [menu]
        });
    }, {
        prototype: HTMLEMenuButtonElement.prototype,
    }
);
