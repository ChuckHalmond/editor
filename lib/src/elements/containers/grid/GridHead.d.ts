import { HTMLEGridCellCollection } from "./GridCellCollection";
import { HTMLEGridRowCollection } from "./GridRowCollection";
export { HTMLEGridHeadElement };
interface HTMLEGridHeadElementConstructor {
    readonly prototype: HTMLEGridHeadElement;
    new (): HTMLEGridHeadElement;
}
interface HTMLEGridHeadElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly cells: HTMLEGridCellCollection;
    readonly rows: HTMLEGridRowCollection;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridhead": HTMLEGridHeadElement;
    }
}
declare var HTMLEGridHeadElement: HTMLEGridHeadElementConstructor;
