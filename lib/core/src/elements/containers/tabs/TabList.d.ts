import { HTMLETabElement } from "./Tab";
export { TabChangeEvent };
export { HTMLETabListElement };
export { BaseHTMLETabListElement };
interface HTMLETabListElement extends HTMLElement {
    readonly activeTab: HTMLETabElement | null;
    tabs: HTMLETabElement[];
}
declare type TabChangeEvent = CustomEvent<{
    tab: HTMLETabElement;
}>;
declare class BaseHTMLETabListElement extends HTMLElement implements HTMLETabListElement {
    tabs: HTMLETabElement[];
    private _activeIndex;
    constructor();
    get activeTab(): HTMLETabElement | null;
    connectedCallback(): void;
    findTab(predicate: (tab: HTMLETabElement) => boolean): HTMLETabElement | null;
    activateTab(predicate: (tab: HTMLETabElement) => boolean): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tablist": HTMLETabListElement;
    }
}
declare global {
    interface HTMLElementEventMap {
        "tabchange": TabChangeEvent;
    }
}
