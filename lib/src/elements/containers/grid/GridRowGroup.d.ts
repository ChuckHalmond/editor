export { HTMLEGridRowGroupElement };
interface HTMLEGridRowGroupElementConstructor {
    prototype: HTMLEGridRowGroupElement;
    new (): HTMLEGridRowGroupElement;
}
interface HTMLEGridRowGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridrowgroup": HTMLEGridRowGroupElement;
    }
}
declare var HTMLEGridRowGroupElement: HTMLEGridRowGroupElementConstructor;
