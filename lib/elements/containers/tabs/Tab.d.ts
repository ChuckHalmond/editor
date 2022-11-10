import { HTMLETabPanelElement } from "./TabPanel";
import "./TabPanel";
export { HTMLETabElement };
interface HTMLETabElementConstructor {
    prototype: HTMLETabElement;
    new (): HTMLETabElement;
}
interface HTMLETabElement extends HTMLElement {
    get panel(): HTMLETabPanelElement | null;
    name: string;
    active: boolean;
    disabled: boolean;
    controls: string;
    selected: boolean;
    select(): void;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tab": HTMLETabElement;
    }
}
declare var HTMLETabElement: HTMLETabElementConstructor;
