export { HTMLEHeightSashElement };
interface HTMLEHeightSashElementConstructor {
    readonly prototype: HTMLEHeightSashElement;
    new (): HTMLEHeightSashElement;
}
interface HTMLEHeightSashElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly target: HTMLElement | null;
    controls: string;
    growdir: "top" | "bottom";
}
declare global {
    interface HTMLElementTagNameMap {
        "e-hsash": HTMLEHeightSashElement;
    }
    interface HTMLElementEventMap {
        "resize": Event;
    }
}
declare var HTMLEHeightSashElement: HTMLEHeightSashElementConstructor;
