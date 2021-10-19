export { HTMLEWidthSashElement };
declare type EWidthSashDirection = "left" | "right";
interface HTMLEWidthSashElement extends HTMLElement {
    controls: string;
    growdir: EWidthSashDirection;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-wsash": HTMLEWidthSashElement;
    }
    interface HTMLElementEventMap {
        "e_resize": Event;
    }
}
