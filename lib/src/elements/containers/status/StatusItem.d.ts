export { HTMLEStatusItemElement };
interface HTMLEStatusItemElementConstructor {
    readonly prototype: HTMLEStatusItemElement;
    new (): HTMLEStatusItemElement;
}
interface HTMLEStatusItemElement extends HTMLElement {
}
declare var HTMLEStatusItemElement: HTMLEStatusItemElementConstructor;
declare global {
    interface HTMLElementTagNameMap {
        "e-statusitem": HTMLEStatusItemElement;
    }
}
