export { HTMLEDraggableElement };
export { HTMLEDraggableElementBase };
interface HTMLEDraggableElement extends HTMLElement {
    selected: boolean;
    dragged: boolean;
    type: string;
    dragovered: boolean;
    data: object | null;
    clone(): HTMLEDraggableElement;
}
declare class HTMLEDraggableElementBase extends HTMLElement implements HTMLEDraggableElement {
    selected: boolean;
    dragovered: boolean;
    dragged: boolean;
    disabled: boolean;
    type: string;
    data: object | null;
    constructor();
    connectedCallback(): void;
    clone(): HTMLEDraggableElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-draggable": HTMLEDraggableElement;
    }
}
