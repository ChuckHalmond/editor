import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridRowElement } from "./GridRow";
export { HTMLEGridBodyElement };
interface HTMLEGridBodyElementConstructor {
    prototype: HTMLEGridBodyElement;
    new (): HTMLEGridBodyElement;
}
interface HTMLEGridBodyElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    cells(): HTMLEGridCellElement[];
    rows(): HTMLEGridRowElement[];
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridbody": HTMLEGridBodyElement;
    }
}
declare var HTMLEGridBodyElement: HTMLEGridBodyElementConstructor;
