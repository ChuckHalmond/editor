export { HTMLELoaderElement };
interface HTMLELoaderElementConstructor {
    readonly prototype: HTMLELoaderElement;
    new (): HTMLELoaderElement;
}
interface HTMLELoaderElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    type: "bar" | "circle";
    promise: Promise<any> | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-loader": HTMLELoaderElement;
    }
}
declare var HTMLELoaderElement: HTMLELoaderElementConstructor;
