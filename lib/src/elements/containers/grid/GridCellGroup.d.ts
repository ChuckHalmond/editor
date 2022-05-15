export { HTMLEGridCellGroupElement };
interface HTMLEGridCellGroupElementConstructor {
    readonly prototype: HTMLEGridCellGroupElement;
    new (): HTMLEGridCellGroupElement;
}
interface HTMLEGridCellGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridcellgroup": HTMLEGridCellGroupElement;
    }
}
declare var HTMLEGridCellGroupElement: HTMLEGridCellGroupElementConstructor;
