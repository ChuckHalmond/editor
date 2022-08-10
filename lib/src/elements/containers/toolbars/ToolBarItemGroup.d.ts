export { HTMLEToolBarItemGroupElement };
interface HTMLEToolBarItemGroupElementConstructor {
    prototype: HTMLEToolBarItemGroupElement;
    new (): HTMLEToolBarItemGroupElement;
}
interface HTMLEToolBarItemGroupElement extends HTMLElement {
    name: string;
    label: string;
    disabled: boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-toolbaritemgroup": HTMLEToolBarItemGroupElement;
    }
}
declare var HTMLEToolBarItemGroupElement: HTMLEToolBarItemGroupElementConstructor;
