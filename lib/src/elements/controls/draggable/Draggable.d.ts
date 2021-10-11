export { HTMLEDraggableElement };
interface HTMLEDraggableElementConstructor {
    readonly prototype: HTMLEDraggableElement;
    new (): HTMLEDraggableElement;
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
        "e-draggable": HTMLEDraggableElement;
    }
}
declare var HTMLEDraggableElement: HTMLEDraggableElementConstructor;
