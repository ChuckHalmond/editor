import { HTMLETabElement } from "./Tab";
export { HTMLETabListElement };
interface HTMLETabListElementConstructor {
    readonly prototype: HTMLETabListElement;
    new (): HTMLETabListElement;
}
interface HTMLETabListElement extends HTMLElement {
    readonly activeTab: HTMLETabElement | null;
    tabs: HTMLETabElement[];
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tablist": HTMLETabListElement;
    }
}
declare var HTMLETabListElement: HTMLETabListElementConstructor;
