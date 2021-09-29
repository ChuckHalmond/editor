import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";

export { HTMLEDraggableElement };
export { HTMLEDraggableElementBase };

interface HTMLEDraggableElement extends HTMLElement {
    selected: boolean;
    dragged: boolean;
    type: string;
    dragovered: boolean;
    data: object | null;

    getReference(): HTMLEDraggableElement;
    readonly referee: HTMLEDraggableElement | null;
    readonly references: HTMLEDraggableElement[];
}

@RegisterCustomHTMLElement({
    name: "e-draggable"
})
@GenerateAttributeAccessors([
    {name: "selected", type: "boolean"},
    {name: "dragged", type: "boolean"},
    {name: "dragovered", type: "boolean"},
    {name: "disabled", type: "boolean"},
    {name: "type", type: "string"},
    {name: "data", type: "json"}
])
class HTMLEDraggableElementBase extends HTMLElement implements HTMLEDraggableElement {
    
    public selected!: boolean;
    public dragovered!: boolean;
    public dragged!: boolean;
    public disabled!: boolean;

    public type!: string;
    public data!: object | null;

    private _referee: HTMLEDraggableElementBase | null;
    public readonly references: HTMLEDraggableElementBase[];

    constructor() {
        super();

        bindShadowRoot(this, /*template*/`
            <style>
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
            </style>
            <div part="container">
                <slot>&nbsp;</slot>
            </div>
        `);
        this.references = [];
        this._referee = null;
    }

    public get referee(): HTMLEDraggableElementBase | null {
        return this._referee;
    }
    
    public connectedCallback() {
        this.tabIndex = this.tabIndex;
        this.draggable = true;
    }

    public disconnectedCallback() {
        if (this.referee) {
            const thisRefereeIndex = this.referee.references.indexOf(this);
            if (thisRefereeIndex > -1) {
                this.referee.references.splice(thisRefereeIndex, 1);
            }
        }
    }

    public getReference(): HTMLEDraggableElementBase {
        const reference = this.cloneNode(true) as HTMLEDraggableElementBase;
        reference._referee = this;
        this.references.push(reference);
        return reference;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "e-draggable": HTMLEDraggableElement,
    }
}