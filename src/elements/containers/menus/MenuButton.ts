import { CustomElement, AttributeProperty, element, QueryProperty } from "../../Element";
import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuItemElement } from "./MenuItem";

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
            element("slot", {
                attributes: {
                    name: "menu"
                }
            })
        );
        style = /*css*/`
            :host {
                display: inline-block;
                padding: 2px;
                line-height: 18px;
                user-select: none;
                white-space: nowrap;
                cursor: pointer;
            }
            
            :host(:focus) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }
            
            :host(:focus-within:not(:focus)) {
                background-color: var(--focused-item-color);
            }
            
            :host(:hover:not(:focus-within)) {
                background-color: var(--hovered-item-color);
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
            
            :host::after {
                display: inline-block;
                text-align: center;
                width: 18px;
                height: 18px;
                content: "▾";
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
            const {style: menuStyle} = menu;
            const {top: itemTop, bottom: itemBottom, left: itemLeft, right: itemRight} = this.getBoundingClientRect();
            const {width: menuWidth, height: menuHeight} = menu.getBoundingClientRect();
            const {scrollY, scrollX} = window;
            const {clientWidth, clientHeight} = document.body;
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