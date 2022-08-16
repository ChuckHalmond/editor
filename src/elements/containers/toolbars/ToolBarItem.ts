import { HTMLESelectElement } from "../../controls/forms/Select";
import { CustomElement, AttributeProperty, element, QueryProperty } from "../../Element";
import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEMenuButtonElement } from "../menus/MenuButton";

export { HTMLEToolBarItemElement };
export { EToolBarItem };

interface HTMLEToolBarItemElementConstructor {
    prototype: HTMLEToolBarItemElement;
    new(): HTMLEToolBarItemElement;
}

interface HTMLEToolBarItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
    readonly select: HTMLESelectElement | null;
    value: string;
    name: string;
    label: string;
    active: boolean;
    pressed: boolean;
    expanded: boolean;
    type: "button" | "checkbox" | "radio" | "menubutton" | "select";
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-toolbaritem": HTMLEToolBarItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var slottedKeyboardListeners: WeakMap<HTMLElement, EventListener>;
var slottedTriggerListeners: WeakMap<HTMLElement, EventListener>;

@CustomElement({
    name: "e-toolbaritem"
})
class HTMLEToolBarItemElementBase extends HTMLElement implements HTMLEToolBarItemElement {
    
    readonly shadowRoot!: ShadowRoot;

    @QueryProperty({selector: ":scope > e-menu[slot=menu]"})
    readonly menu!: HTMLEMenuElement | null;
    
    @QueryProperty({selector: ":scope > e-select[slot=select]"})
    readonly select!: HTMLESelectElement | null;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean})
    pressed!: boolean;

    @AttributeProperty({type: Boolean})
    expanded!: boolean;

    @AttributeProperty({type: String, observed: true})
    value!: string;

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    label!: string;

    @AttributeProperty({type: String})
    type!: "button" | "checkbox" | "radio" | "menubutton" | "select";

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            /*element("span", {
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
                    }),
                    element("slot", {
                        attributes: {
                            name: "select"
                        }
                    }),
                    element("slot", {
                        attributes: {
                            name: "menubutton"
                        }
                    })
                ]
            })*/
            element("slot"),
            element("slot", {
                attributes: {
                    name: "select"
                }
            }),
            element("slot", {
                attributes: {
                    name: "menubutton"
                }
            })
        )
        slottedKeyboardListeners = new WeakMap();
        slottedTriggerListeners = new WeakMap();
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "label": {
                const {shadowRoot} = this;
                const labelPart = shadowRoot.querySelector<HTMLSpanElement>("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
            case "value": {
                const {type} = this;
                if (type == "select") {
                    this.#updateSelectValue();
                }
                break;
            }
        }
    }

    toggle(force?: boolean): void {
        const expand = force ?? !this.expanded;
        this.expanded = expand;
        if (expand) {
            this.#positionMenu();
        }
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

    #updateSelectValue(): void {
        const {select} = this;
        if (select) {
            const {value} = this;
            const {value: selectValue} = select;
            if (selectValue !== value) {
                select.value = value;
            }
        }
    }

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        if (target == this) {
            const {type} = this;
            switch (type) {
                case "checkbox": {
                    this.pressed = !this.pressed;
                    break;
                }
                case "radio": {
                    this.pressed = true;
                    break;
                }
                case "menubutton": {
                    const {menu} = this;
                    if (menu && !menu.contains(<Node>target)) {
                        this.toggle();
                        const {expanded} = this;
                        if (expanded) {
                            menu?.focus({preventScroll: true});
                        }
                    }
                    break;
                }
            }
        }
    }

    #positionMenu(): void {
        const {type} = this;
        if (type == "menubutton") {
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
                    scrollX + itemLeft - menuWidth :
                    scrollX + itemLeft
                }px`);
                menuStyle.setProperty("top", `${
                    overflowY > 0 ?
                    scrollY + itemTop - menuHeight :
                    scrollY + itemBottom
                }px`);
            }
        }
    }

    /*#addSlottedKeyboardHandler(element: HTMLElement): void {
        const listener = <EventListener>this.#handleSlottedKeyboardEvent.bind(this);
        slottedKeyboardListeners.set(element, listener);
        element.addEventListener("keydown", listener);
    }

    #removeSlottedKeyboardHandler(element: HTMLElement): void {
        const listener = slottedKeyboardListeners.get(element);
        if (listener) {
            element.removeEventListener("keydown", listener);
        }
    }

    #addSlottedTriggerHandler(element: HTMLElement): void {
        const listener = <EventListener>this.#handleSlottedTriggerEvent.bind(this);
        slottedTriggerListeners.set(element, listener);
        element.addEventListener("trigger", listener);
    }

    #removeSlottedTriggerHandler(element: HTMLElement): void {
        const listener = slottedTriggerListeners.get(element);
        if (listener) {
            element.removeEventListener("trigger", listener);
        }
    }

    #handleSlottedKeyboardEvent(event: KeyboardEvent): void {
        const {key} = event;
        switch (key) {
            case "Enter":
            case "Escape": {
                this.focus({preventScroll: true});
                event.stopPropagation();
                break;
            }
        }
    }

    #handleSlottedTriggerEvent(event: KeyboardEvent): void {
        this.focus({preventScroll: true});
        event.stopPropagation();
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const {name: slotName} = <HTMLSlotElement>target;
        switch (slotName) {
            case "menubutton": {
                let menubutton = this.#menubutton;
                if (menubutton !== null) {
                    this.#removeSlottedTriggerHandler(menubutton);
                    this.#removeSlottedKeyboardHandler(menubutton);
                }
                const element = (<HTMLSlotElement>target).assignedElements()[0];
                menubutton = element instanceof HTMLEMenuButtonElement ? element : null;
                if (menubutton !== null) {
                    this.#addSlottedTriggerHandler(menubutton);
                    this.#addSlottedKeyboardHandler(menubutton);
                }
                this.#menubutton = menubutton;
                break;
            }
            case "select": {
                let select = this.#select;
                if (select !== null) {
                    this.#removeSlottedKeyboardHandler(select);
                }
                const element = (<HTMLSlotElement>target).assignedElements()[0];
                select = element instanceof HTMLESelectElement ? element : null;
                if (select !== null) {
                    this.#addSlottedKeyboardHandler(select);
                }
                this.#select = select;
                break;
            }
        }
    }*/
}

var HTMLEToolBarItemElement: HTMLEToolBarItemElementConstructor = HTMLEToolBarItemElementBase;

interface EToolBarItemConstructor {
    prototype: HTMLEToolBarItemElement;
    new(init: {
        name: string;
        label: string;
        type: "button" | "checkbox" | "radio" | "menubutton" | "select";
        value?: string;
        trigger?: () => void;
        menubutton?: HTMLEMenuButtonElement;
        select?: HTMLESelectElement;
    }): HTMLEToolBarItemElement;
    button(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEToolBarItemElement;
    checkbox(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEToolBarItemElement;
    radio(init: {
        name: string;
        label: string;
        value?: string;
        trigger?: () => void;
    }): HTMLEToolBarItemElement;
    menubutton(init: {
        name: string;
        label: string;
        menubutton: HTMLEMenuButtonElement;
    }): HTMLEToolBarItemElement;
    select(init: {
        name: string;
        label: string;
        select: HTMLESelectElement;
    }): HTMLEToolBarItemElement;
}

var EToolBarItem = <EToolBarItemConstructor>Object.assign(
    <Function>function(init: {
        name: string;
        label: string;
        type: "button" | "checkbox" | "radio" | "menubutton" | "select";
        value?: string;
        trigger?: () => void;
        menubutton?: HTMLEMenuButtonElement;
        select?: HTMLESelectElement;
    }) {
        const {label, name, type, value, trigger, menubutton, select} = init;
        if (menubutton) {
            menubutton.slot = "menubutton";
        }
        if (select) {
            select.slot = "select";
        }
        return element("e-toolbaritem", {
            attributes: {
                tabindex: -1,
                title: label,
                name: name,
                value: value,
                type: type
            },
            children: menubutton ? [menubutton] : select ? [select] : undefined,
            listeners: {
                trigger: trigger
            }
        });
    }, {
        prototype: HTMLEToolBarItemElement.prototype,
        button(init: {
            name: string,
            label: string,
            value?: string,
            trigger?: () => void;
        }) {
            return new EToolBarItem({
                ...init, type: "button"
            });
        },
        checkbox(init: {
            name: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EToolBarItem({
                ...init, type: "checkbox"
            });
        },
        radio(init: {
            name: string;
            label: string;
            value?: string;
            trigger?: () => void;
        }) {
            return new EToolBarItem({
                ...init, type: "radio"
            });
        },
        menubutton(init: {
            name: string;
            label: string;
            menubutton: HTMLEMenuButtonElement;
        }) {
            return new EToolBarItem({
                ...init, type: "menubutton"
            });
        },
        select(init: {
            name: string;
            label: string;
            select: HTMLESelectElement;
        }) {
            return new EToolBarItem({
                ...init, type: "select"
            });
        },
    }
);