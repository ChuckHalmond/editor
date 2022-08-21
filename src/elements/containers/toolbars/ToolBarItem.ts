import { HTMLESelectElement } from "../../controls/forms/Select";
import { CustomElement, AttributeProperty, element, QueryProperty } from "../../Element";
import { HTMLEMenuButtonElement } from "../menus/MenuButton";

export { HTMLEToolBarItemElement };
export { EToolBarItem };

interface HTMLEToolBarItemElementConstructor {
    prototype: HTMLEToolBarItemElement;
    new(): HTMLEToolBarItemElement;
}

interface HTMLEToolBarItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menubutton: HTMLEMenuButtonElement | null;
    readonly select: HTMLESelectElement | null;
    value: string;
    name: string;
    label: string;
    active: boolean;
    pressed: boolean;
    type: "button" | "checkbox" | "radio" | "menubutton" | "select";
}

declare global {
    interface HTMLElementTagNameMap {
        "e-toolbaritem": HTMLEToolBarItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-toolbaritem"
})
class HTMLEToolBarItemElementBase extends HTMLElement implements HTMLEToolBarItemElement {
    
    readonly shadowRoot!: ShadowRoot;

    @QueryProperty({selector: ":scope > e-menubutton[slot=menubutton]"})
    readonly menubutton!: HTMLEMenuButtonElement | null;
    
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

    #wasExpandedOnMouseDown?: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("span", {
                attributes: {
                    part: "icon"
                }
            }),
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
        );
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("mousedown", this.#handleMouseDownEvent.bind(this));
    }

    connectedCallback(): void {
        const {tabIndex} = this;
        this.tabIndex = tabIndex;
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

    #handleClickEvent(event: MouseEvent): void {
        const {target} = event;
        const targetToolbarItem = (<HTMLElement>target).closest("e-toolbaritem");
        if (targetToolbarItem === this) {
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
                    const {menubutton} = this;
                    if (menubutton && !menubutton.contains(<Node>target)) {
                        const force = !this.#wasExpandedOnMouseDown ?? true;
                        menubutton.toggle(force);
                        if (force) {
                            menubutton.firstItem?.focus({preventScroll: true});
                        }
                    }
                    break;
                }
                case "select": {
                    const {select} = this;
                    if (select && !select.contains(<Node>target)) {
                        const force = !this.#wasExpandedOnMouseDown ?? true;
                        select.toggle(force);
                    }
                    break;
                }
            }
        }
    }

    #handleMouseDownEvent(event: MouseEvent): void {
        const {target} = event;
        const targetToolbarItem = (<HTMLElement>target).closest("e-toolbaritem");
        if (targetToolbarItem === this) {
            const {type} = this;
            switch (type) {
                case "menubutton": {
                    const {menubutton} = this;
                    if (menubutton && !menubutton.contains(<Node>target)) {
                        this.#wasExpandedOnMouseDown = menubutton.expanded;
                    }
                    break;
                }
                case "select": {
                    const {select} = this;
                    if (select && !select.contains(<Node>target)) {
                        this.#wasExpandedOnMouseDown = select.expanded;
                    }
                    break;
                }
            }
        }
    }
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