export { HTMLEListItemGroupElement };
interface HTMLEListItemGroupElementConstructor {
    prototype: HTMLEListItemGroupElement;
    new (): HTMLEListItemGroupElement;
}
interface HTMLEListItemGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-listitemgroup": HTMLEListItemGroupElement;
    }
}
declare var HTMLEListItemGroupElement: HTMLEListItemGroupElementConstructor;
