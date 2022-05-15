import { HTMLEGridCellCollection } from "./GridCellCollection";
import { HTMLEGridRowCollection } from "./GridRowCollection";
export { HTMLEGridBodyElement };
interface HTMLEGridBodyElementConstructor {
    readonly prototype: HTMLEGridBodyElement;
    new (): HTMLEGridBodyElement;
}
interface HTMLEGridBodyElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly cells: HTMLEGridCellCollection;
    readonly rows: HTMLEGridRowCollection;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridbody": HTMLEGridBodyElement;
    }
}
declare var HTMLEGridBodyElement: HTMLEGridBodyElementConstructor;
