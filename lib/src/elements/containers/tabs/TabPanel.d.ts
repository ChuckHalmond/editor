export { HTMLETabPanelElement };
interface HTMLETabPanelElementConstructor {
    prototype: HTMLETabPanelElement;
    new (): HTMLETabPanelElement;
}
interface HTMLETabPanelElement extends HTMLElement {
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tabpanel": HTMLETabPanelElement;
    }
}
declare var HTMLETabPanelElement: HTMLETabPanelElementConstructor;
