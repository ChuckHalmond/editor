export { HTMLEWidthSashElement };
declare type EWidthSashDirection = "left" | "right";
interface HTMLEWidthSashElement extends HTMLElement {
    controls: string;
    growdir: EWidthSashDirection;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-wsash": HTMLEWidthSashElement;
    }
    interface HTMLElementEventMap {
        "e_resize": Event;
    }
}
