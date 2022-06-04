import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEMenuElement } from "./Menu";

export { HTMLEMenuButtonElement };
export { EMenuButton };

interface HTMLEMenuButtonElementConstructor {
    readonly prototype: HTMLEMenuButtonElement;
    new(): HTMLEMenuButtonElement;
}

interface HTMLEMenuButtonElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
    name: string;
    disabled: boolean;
    expanded: boolean;
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}

@CustomElement({
    name: "e-menubutton"
})
class HTMLEMenuButtonElementBase extends HTMLElement implements HTMLEMenuButtonElement {

    readonly shadowRoot!: ShadowRoot;
    
    get menu(): HTMLEMenuElement | null {
        return this.#menu;
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Boolean})
    disabled!: boolean;

    @AttributeProperty({type: Boolean})
    expanded!: boolean;

    #menu: HTMLEMenuElement | null;

    constructor() {
        super();
        this.#menu = null;
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            element("span", {
                attributes: {
                    part: "content"
                },
                children: [
                    element("span", {
                        attributes: {
                            part: "icon"
                        }
                    }),
                    element("span", {
                        attributes: {
                            part: "label"
                        }
                    })
                ]
            }),
            element("slot", {
                attributes: {
                    name: "menu"
                }
            })
        );
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("focusout", this.#handleFocusOutEvent.bind(this));
        this.addEventListener("trigger", this.#handleTriggerEvent.bind(this));
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }

    toggle(force?: boolean): void {
        const expand = force ?? !this.expanded;
        expand ? this.expand() : this.collapse();
    }

    expand(): void {
        if (!this.expanded) {
            this.expanded = true;
            this.#positionMenu();
        }
    }

    collapse(): void {
        if (this.expanded) {
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
        if (target == this) {
            this.toggle();
            const {expanded} = this;
            if (expanded) {
                this.menu?.focus({preventScroll: true});
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
                    this.menu?.items.item(0)?.focus({preventScroll: true});
                    event.stopPropagation();
                }
                break;
            case "Escape":
                if (expanded) {
                    this.collapse();
                    this.focus({preventScroll: true});
                    event.stopPropagation();
                }
                break;
        }
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const element = (<HTMLSlotElement>target).assignedElements()[0];
        this.#menu = (element instanceof HTMLEMenuElement) ? element : null;
    }

    #handleTriggerEvent(): void {
        this.collapse();
        this.focus({preventScroll: true});
    }
}

var HTMLEMenuButtonElement: HTMLEMenuButtonElementConstructor = HTMLEMenuButtonElementBase;

interface EMenuButtonConstructor {
    readonly prototype: HTMLEMenuButtonElement;
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