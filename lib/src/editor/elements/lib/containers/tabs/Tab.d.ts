import { HTMLETabPanelElement } from "src/editor/elements/lib/containers/tabs/TabPanel";
export { HTMLETabElement };
export { BaseHTMLETabElement };
interface HTMLETabElement extends HTMLElement {
    name: string;
    active: boolean;
    disabled: boolean;
    controls: string;
    panel: HTMLETabPanelElement | null;
}
declare class BaseHTMLETabElement extends HTMLElement implements HTMLETabElement {
    name: string;
    disabled: boolean;
    active: boolean;
    controls: string;
    panel: HTMLETabPanelElement | null;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tab": HTMLETabElement;
    }
}
