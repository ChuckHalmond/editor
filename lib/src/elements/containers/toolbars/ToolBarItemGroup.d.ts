export { HTMLEToolBarItemGroupElement };
interface HTMLEToolBarItemGroupElementConstructor {
    readonly prototype: HTMLEToolBarItemGroupElement;
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
