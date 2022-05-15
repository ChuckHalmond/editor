import { CustomElement, AttributeProperty, element } from "../../Element";

export { HTMLEDraggableElement };

interface HTMLEDraggableElementConstructor {
    readonly prototype: HTMLEDraggableElement;
    new(): HTMLEDraggableElement;
}

interface HTMLEDraggableElement extends HTMLElement {
    readonly referee: this | null;
    readonly references: this[];
    selected: boolean;
    dragged: boolean;
    dragovered: boolean;

    connectedCallback(): void;
    disconnectedCallback(): void;
    getReference(): this;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-draggable": HTMLEDraggableElement,
    }
}

@CustomElement({
    name: "e-draggable"
})
class HTMLEDraggableElementBase extends HTMLElement implements HTMLEDraggableElement {
    
    @AttributeProperty({type: Boolean})
    selected!: boolean;

    @AttributeProperty({type: Boolean})
    dragovered!: boolean;

    @AttributeProperty({type: Boolean})
    dragged!: boolean;

    @AttributeProperty({type: Boolean})
    disabled!: boolean;

    #referee: this | null;
    readonly references: this[];

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            element("style", {
                properties: {
                    innerText: /*css*/`
                        :host {
                            display: inline-block;
                            padding: 3px 4px;
                            cursor: pointer;
                            white-space: nowrap;
                            border-radius: 4px;
                            border: 1px solid black;
                            user-select: none;
                        }
        
                        :host([disabled]) {
                            pointer-events: none;
                            color: lightgray;
                            border-color: lightgray;
                        }
        
                        :host([selected]:active) {
                            cursor: grabbing;
                        }
                        
                        :host([selected]) {
                            cursor: grab;
                            font-weight: bold;
                            outline: 1px auto black;
                        }
        
                        :host([dragovered]) {
                            border-style: dotted;
                        }
                        
                        [part="container"] {
                            display: flex;
                            align-items: center;
                        }
                    `
                }
            }),
            element("div", {
                part: ["container"],
                children: [
                    element("slot", {
                        properties: {
                            textContent: "&nbsp;"
                        }
                    })
                ]
            })
        );

        this.references = [];
        this.#referee = null;
    }

    get referee(): this | null {
        return this.#referee;
    }
    
    connectedCallback(): void {
        this.tabIndex = this.tabIndex;
        this.draggable = true;
    }

    disconnectedCallback(): void {
        if (this.referee) {
            const thisRefIndex = this.referee.references.indexOf(this);
            if (thisRefIndex > -1) {
                this.referee.references.splice(thisRefIndex, 1);
            }
        }
    }

    getReference(): this {
        const reference = <this>this.cloneNode(true);
        reference.#referee = this;
        return reference;
    }
}

var HTMLEDraggableElement: HTMLEDraggableElementConstructor = HTMLEDraggableElementBase