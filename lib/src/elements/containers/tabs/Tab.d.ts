import { HTMLETabPanelElement } from "./TabPanel";
export { ETabChangeEvent };
export { HTMLETabElement };
export { BaseHTMLETabElement };
interface HTMLETabElement extends HTMLElement {
    name: string;
    active: boolean;
    disabled: boolean;
    controls: string;
    panel: HTMLETabPanelElement | null;
}
declare type ETabChangeEvent = CustomEvent<{
    tab: HTMLETabElement;
}>;
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
declare global {
    interface HTMLElementEventMap {
        "e_tabchange": ETabChangeEvent;
    }
}
