import { HTMLETabElement } from "./Tab";
export { HTMLETabListElement };
interface HTMLETabListElementConstructor {
    prototype: HTMLETabListElement;
    new (): HTMLETabListElement;
}
interface HTMLETabListElement extends HTMLElement {
    get activeTab(): HTMLETabElement | null;
    get selectedTab(): HTMLETabElement | null;
    get tabs(): HTMLETabElement[];
    firstItem(): HTMLETabElement | null;
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tablist": HTMLETabListElement;
    }
}
declare var HTMLETabListElement: HTMLETabListElementConstructor;
