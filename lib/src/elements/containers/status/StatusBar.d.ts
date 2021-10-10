import { HTMLEStatusItemElement } from "./StatusItem";
export { HTMLEStatusBarElement };
interface HTMLEStatusBarElement extends HTMLElement {
    items: HTMLEStatusItemElement[];
}
declare global {
    interface HTMLElementTagNameMap {
        "e-statusbar": HTMLEStatusBarElement;
    }
}
