export { isHTMLETabPanelElement };
export { HTMLETabPanelElement };
export { BaseHTMLETabPanelElement };
interface HTMLETabPanelElement extends HTMLElement {
    name: string;
}
declare function isHTMLETabPanelElement(obj: any): obj is BaseHTMLETabPanelElement;
declare class BaseHTMLETabPanelElement extends HTMLElement implements HTMLETabPanelElement {
    name: string;
    constructor();
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tabpanel": HTMLETabPanelElement;
    }
}
