import { CustomElement, AttributeProperty, HTML } from "../../Element";

export { HTMLEDraggableElement };

interface HTMLEDraggableElementConstructor {
    readonly prototype: HTMLEDraggableElement;
    new(): HTMLEDraggableElement;
}

interface HTMLEDraggableElement extends HTMLElement {
    selected: boolean;
    dragged: boolean;
    dragovered: boolean;

    connectedCallback(): void;
    disconnectedCallback(): void;

    getReference(): this;
    readonly referee: this | null;
    readonly references: this[];
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
    
    @AttributeProperty({type: "boolean"})
    public selected!: boolean;

    @AttributeProperty({type: "boolean"})
    public dragovered!: boolean;

    @AttributeProperty({type: "boolean"})
    public dragged!: boolean;

    @AttributeProperty({type: "boolean"})
    public disabled!: boolean;

    private _referee: this | null;
    public readonly references: this[];

    constructor() {
        super();

        this.attachShadow({mode: "open"}).append(
            HTML("style", {
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
                            color: gray;
                            border-color: gray;
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
            HTML("div", {
                part: ["container"],
                children: [
                    HTML("slot", {
                        properties: {
                            textContent: "&nbsp;"
                        }
                    })
                ]
            })
        );

        this.references = [];
        this._referee = null;
    }

    public get referee(): this | null {
        return this._referee;
    }
    
    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;
        this.draggable = true;
    }

    public disconnectedCallback(): void {
        if (this.referee) {
            const thisRefIndex = this.referee.references.indexOf(this);
            if (thisRefIndex > -1) {
                this.referee.references.splice(thisRefIndex, 1);
            }
        }
    }

    public getReference(): this {
        const reference = this.cloneNode(true) as this;
        reference._referee = this;
        return reference;
    }
}

var HTMLEDraggableElement: HTMLEDraggableElementConstructor = HTMLEDraggableElementBase