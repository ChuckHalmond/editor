import { HTMLETabPanelElement } from "./TabPanel";
export { ETabChangeEvent };
export { HTMLETabElement };
interface HTMLETabElementConstructor {
    readonly prototype: HTMLETabElement;
    new (): HTMLETabElement;
}
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
declare global {
    interface HTMLElementEventMap {
        "e_tabchange": ETabChangeEvent;
    }
    interface HTMLElementTagNameMap {
        "e-tab": HTMLETabElement;
    }
}
declare var HTMLETabElement: HTMLETabElementConstructor;
