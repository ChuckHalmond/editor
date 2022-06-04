import { HTMLESelectElement } from "../../controls/forms/Select";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEActionElement } from "../actions/Action";
import { HTMLEMenuButtonElement } from "../menus/MenuButton";

export { HTMLEToolBarItemElement };
export { EToolBarItem };

interface HTMLEToolBarItemElementConstructor {
    readonly prototype: HTMLEToolBarItemElement;
    new(): HTMLEToolBarItemElement;
}

interface HTMLEToolBarItemElement extends HTMLEActionElement {
    readonly shadowRoot: ShadowRoot;
    readonly menubutton: HTMLEMenuButtonElement | null;
    readonly select: HTMLESelectElement | null;
    name: string;
    label: string;
    active: boolean;
    type: "button" | "checkbox" | "radio" | "menubutton" | "select";
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
class HTMLEToolBarItemElementBase extends HTMLEActionElement implements HTMLEToolBarItemElement {
    
    readonly shadowRoot!: ShadowRoot;

    get menubutton(): HTMLEMenuButtonElement | null {
        return this.#menubutton;
    }
    
    get select(): HTMLESelectElement | null {
        return this.#select;
    }

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: String, observed: true})
    value!: string;

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, observed: true})
    label!: string;

    @AttributeProperty({type: String})
    type!: "button" | "checkbox" | "radio" | "menubutton" | "select";
    
    #menubutton: HTMLEMenuButtonElement | null;
    #select: HTMLESelectElement | null;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
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
            })
        )
        slottedKeyboardListeners = new WeakMap();
        slottedTriggerListeners = new WeakMap();
    }

    constructor() {
        super();
        this.#menubutton = null;
        this.#select = null;
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }

    toggle(): void {
        const {type} = this;
        switch (type) {
            case "menubutton": {
                const {menubutton} = this;
                if (menubutton) {
                    menubutton.toggle();
                    if (menubutton.expanded) {
                        menubutton.menu?.items.item(0)?.focus({preventScroll: true});
                    }
                }
                break;
            }
            case "select": {
                const {select} = this;
                if (select) {
                    select.toggle();
                }
                break;
            }
        }
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

    #addSlottedKeyboardHandler(element: HTMLElement): void {
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
    }
}

var HTMLEToolBarItemElement: HTMLEToolBarItemElementConstructor = HTMLEToolBarItemElementBase;

interface EToolBarItemConstructor {
    readonly prototype: HTMLEToolBarItemElement;
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
            children: menubutton ? [menubutton] : select ? [select] : void 0,
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