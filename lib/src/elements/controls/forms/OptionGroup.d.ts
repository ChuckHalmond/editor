export { HTMLEOptionGroupElement };
interface HTMLEOptionGroupElementConstructor {
    readonly prototype: HTMLEOptionGroupElement;
    new (): HTMLEOptionGroupElement;
}
interface HTMLEOptionGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-optiongroup": HTMLEOptionGroupElement;
    }
}
declare var HTMLEOptionGroupElement: HTMLEOptionGroupElementConstructor;
