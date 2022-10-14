import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridRowElement } from "./GridRow";
export { HTMLEGridHeadElement };
interface HTMLEGridHeadElementConstructor {
    prototype: HTMLEGridHeadElement;
    new (): HTMLEGridHeadElement;
}
interface HTMLEGridHeadElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    cells(): HTMLEGridCellElement[];
    rows(): HTMLEGridRowElement[];
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridhead": HTMLEGridHeadElement;
    }
}
declare var HTMLEGridHeadElement: HTMLEGridHeadElementConstructor;
