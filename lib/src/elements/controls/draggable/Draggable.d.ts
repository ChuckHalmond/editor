export { HTMLEDraggableElement };
interface HTMLEDraggableElementConstructor {
    readonly prototype: HTMLEDraggableElement;
    new (): HTMLEDraggableElement;
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
        "e-draggable": HTMLEDraggableElement;
    }
}
declare var HTMLEDraggableElement: HTMLEDraggableElementConstructor;
