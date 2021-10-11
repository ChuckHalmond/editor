import { RegisterCustomHTMLElement, GenerateAttributeAccessors, bindShadowRoot } from "../../HTMLElement";
import { forAllSubtreeElements } from "../../Snippets";

export { HTMLEDraggableElement };

interface HTMLEDraggableElementConstructor {
    readonly prototype: HTMLEDraggableElement;
    new(): HTMLEDraggableElement;
}

interface HTMLEDraggableElement extends HTMLElement {
    selected: boolean;
    dragged: boolean;
    type: string;
    dragovered: boolean;

    connectedCallback(): void;
    disconnectedCallback(): void;

    getReference(): HTMLEDraggableElement;
    readonly referee: HTMLEDraggableElement | null;
    readonly references: HTMLEDraggableElement[];
}

declare global {
    interface HTMLElementTagNameMap {
        "e-draggable": HTMLEDraggableElement,
    }
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
    
    public connectedCallback(): void {
        this.tabIndex = this.tabIndex;
        this.draggable = true;
    }

    public disconnectedCallback(): void {
        if (this.referee) {
            const thisRefIndex = this.referee.references.indexOf(this);
            if (thisRefIndex > -1) {
                this.referee.references.splice(thisRefIndex, 1);
                const refereeId = this.referee.id;
                if (refereeId) {
                    this.referee.references.slice(thisRefIndex).forEach((reference, index) => {
                        forAllSubtreeElements(reference, (element) => {
                            if (element.id) {
                                element.id = `${element.id}-${thisRefIndex + index + 1}`;
                            }
                        });
                    });
                }
            }
        }
    }

    public getReference(): HTMLEDraggableElementBase {
        const reference = this.cloneNode(true) as HTMLEDraggableElementBase;
        const referenceIdx = this.references.push(reference);
        reference._referee = this;
        if (this.id) {
            forAllSubtreeElements(reference, (element) => {
                if (element.id) {
                    element.id = `${element.id}-${referenceIdx}`;
                }
            });
        }
        return reference;
    }
}

var HTMLEDraggableElement: HTMLEDraggableElementConstructor = HTMLEDraggableElementBase