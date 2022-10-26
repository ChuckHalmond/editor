import { HTMLETabElement } from "./Tab";
export { HTMLETabPanelElement };
interface HTMLETabPanelElementConstructor {
    prototype: HTMLETabPanelElement;
    new (): HTMLETabPanelElement;
}
interface HTMLETabPanelElement extends HTMLElement {
    get tab(): HTMLETabElement | null;
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tabpanel": HTMLETabPanelElement;
    }
}
declare var HTMLETabPanelElement: HTMLETabPanelElementConstructor;
