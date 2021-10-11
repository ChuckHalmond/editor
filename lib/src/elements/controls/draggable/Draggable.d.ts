export { HTMLEDraggableElement };
interface HTMLEDraggableElementConstructor {
    readonly prototype: HTMLEDraggableElement;
    new (): HTMLEDraggableElement;
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
        "e-draggable": HTMLEDraggableElement;
    }
}
declare var HTMLEDraggableElement: HTMLEDraggableElementConstructor;
