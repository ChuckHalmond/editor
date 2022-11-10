import { HTMLEGridCellElement } from "./GridCell";
import "./GridCell";
export { HTMLEGridRowElement };
interface HTMLEGridRowElementConstructor {
    prototype: HTMLEGridRowElement;
    new (): HTMLEGridRowElement;
}
interface HTMLEGridRowElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    active: boolean;
    selected: boolean;
    posinset: number;
    cells(): HTMLEGridCellElement[];
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridrow": HTMLEGridRowElement;
    }
}
declare var HTMLEGridRowElement: HTMLEGridRowElementConstructor;
