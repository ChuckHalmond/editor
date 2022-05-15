import { HTMLEMenuElement } from "./Menu";
export { HTMLEContextMenuElement };
interface HTMLEContextMenuElement extends HTMLEMenuElement {
    clientX: number;
    clientY: number;
    close(): void;
}
interface HTMLEContextMenuElementConstructor {
    readonly prototype: HTMLEContextMenuElement;
    new (): HTMLEContextMenuElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-contextmenu": HTMLEContextMenuElement;
    }
}
declare var HTMLEContextMenuElement: HTMLEContextMenuElementConstructor;
