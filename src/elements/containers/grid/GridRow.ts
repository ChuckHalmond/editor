import { AttributeProperty, CustomElement, element } from "../../Element";
import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridCellCollection } from "./GridCellCollection";

export { HTMLEGridRowElement };

interface HTMLEGridRowElementConstructor {
    prototype: HTMLEGridRowElement;
    new(): HTMLEGridRowElement;
}

interface HTMLEGridRowElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly cells: HTMLEGridCellCollection;
    readonly menu: HTMLEMenuElement | null;
    name: string;
    active: boolean;
    selected: boolean;
    posinset: number;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-gridrow": HTMLEGridRowElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-gridrow"
})
class HTMLEGridRowElementBase extends HTMLElement implements HTMLEGridRowElement {

    readonly shadowRoot!: ShadowRoot;
    readonly cells: HTMLEGridCellCollection;

    get menu(): HTMLEMenuElement | null {
        return this.#menu;
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean})
    selected!: boolean;

    @AttributeProperty({type: Number})
    posinset!: number;

    #menu: HTMLEMenuElement | null;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: table-row;
                        }

                        :host([droptarget]) {
                            background-color: gainsboro;
                        }
                        
                        :host(:hover) {
                            background-color: rgba(135, 206, 250, 0.2);
                        }

                        :host([active]) {
                            outline: 1px solid rgb(135, 206, 250);
                            outline-offset: -1px;
                        }

                        :host([selected]) {
                            background-color: rgba(135, 206, 250, 0.4);
                            outline: 1px solid rgb(135, 206, 250);
                            outline-offset: -1px;
                        }
                    `
                ]
            }),
            element("slot"),
            element("slot", {
                attributes: {
                    name: "menu"
                }
            })
        );
    }
    
    constructor() {
        super();
        this.#menu = null;
        this.cells = new HTMLEGridCellCollection(this);
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        shadowRoot.addEventListener(
            "slotchange", this.#handleSlotChangeEvent.bind(this)
        );
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "selected": {
                this.dispatchEvent(new Event("select", {bubbles: true}));
                break;
            }
        }
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const {name: slotName} = <HTMLSlotElement>target ;
        switch (slotName) {
            case "menu": {
                const element = (<HTMLSlotElement>target).assignedElements()[0];
                this.#menu = element instanceof HTMLEMenuElement ? element : null;
                break;
            }
            default: {
                const assignedCells = <HTMLEGridCellElement[]>(<HTMLSlotElement>target)
                    .assignedElements()
                    .filter(
                        element_i => element_i instanceof HTMLEGridCellElement
                    );
                assignedCells.forEach((cell_i, i) => {
                    cell_i.posinset = i;
                });
            }
        }
    }
}

var HTMLEGridRowElement: HTMLEGridRowElementConstructor = HTMLEGridRowElementBase;