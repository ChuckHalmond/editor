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
declare class HTMLEDraggableElementBase extends HTMLElement implements HTMLEDraggableElement {
    selected: boolean;
    dragovered: boolean;
    dragged: boolean;
    disabled: boolean;
    type: string;
    data: object | null;
    private _referee;
    readonly references: HTMLEDraggableElementBase[];
    constructor();
    get referee(): HTMLEDraggableElementBase | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    getReference(): HTMLEDraggableElementBase;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-draggable": HTMLEDraggableElement;
    }
}
