export { HTMLELoaderElement };
interface HTMLELoaderElementConstructor {
    prototype: HTMLELoaderElement;
    new (): HTMLELoaderElement;
}
interface HTMLELoaderElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    type: "bar" | "spinner";
}
declare global {
    interface HTMLElementTagNameMap {
        "e-loader": HTMLELoaderElement;
    }
}
declare var HTMLELoaderElement: HTMLELoaderElementConstructor;
