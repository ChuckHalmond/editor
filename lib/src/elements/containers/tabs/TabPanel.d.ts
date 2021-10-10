export { HTMLETabPanelElement };
interface HTMLETabPanelElementConstructor {
    readonly prototype: HTMLETabPanelElement;
    new (): HTMLETabPanelElement;
}
interface HTMLETabPanelElement extends HTMLElement {
    name: string;
}
declare var HTMLETabPanelElement: HTMLETabPanelElementConstructor;
declare global {
    interface HTMLElementTagNameMap {
        "e-tabpanel": HTMLETabPanelElement;
    }
}
