export { HTMLEHeightSashElement };
declare type EHeightSashDirection = "top" | "bottom";
interface HTMLEHeightSashElementConstructor {
    readonly prototype: HTMLEHeightSashElement;
    new (): HTMLEHeightSashElement;
}
interface HTMLEHeightSashElement extends HTMLElement {
    controls: string;
    growdir: EHeightSashDirection;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-hsash": HTMLEHeightSashElement;
    }
    interface HTMLElementEventMap {
        "e_resize": Event;
    }
}
declare var HTMLEHeightSashElement: HTMLEHeightSashElementConstructor;
