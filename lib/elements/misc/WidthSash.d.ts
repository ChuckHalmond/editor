export { HTMLEWidthSashElement };
interface HTMLEWidthSashElementConstructor {
    prototype: HTMLEWidthSashElement;
    new (): HTMLEWidthSashElement;
}
interface HTMLEWidthSashElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly target: HTMLElement | null;
    controls: string;
    growdir: "right" | "left";
    max: boolean;
    setWidth(width: number): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-wsash": HTMLEWidthSashElement;
    }
    interface HTMLElementEventMap {
        "resize": Event;
    }
}
declare var HTMLEWidthSashElement: HTMLEWidthSashElementConstructor;
