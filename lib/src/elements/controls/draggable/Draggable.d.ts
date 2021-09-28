export { HTMLEDraggableElement };
export { HTMLEDraggableElementBase };
interface HTMLEDraggableElement extends HTMLElement {
    selected: boolean;
    dragged: boolean;
    type: string;
    dragovered: boolean;
    data: object;
}
declare class HTMLEDraggableElementBase extends HTMLElement implements HTMLEDraggableElement {
    selected: boolean;
    dragovered: boolean;
    dragged: boolean;
    disabled: boolean;
    type: string;
    data: object;
    constructor();
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-draggable": HTMLEDraggableElement;
    }
}
