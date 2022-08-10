export { HTMLETreeItemGroupElement };
interface HTMLETreeItemGroupElementConstructor {
    prototype: HTMLETreeItemGroupElement;
    new (): HTMLETreeItemGroupElement;
}
interface HTMLETreeItemGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-treeitemgroup": HTMLETreeItemGroupElement;
    }
}
declare var HTMLETreeItemGroupElement: HTMLETreeItemGroupElementConstructor;
