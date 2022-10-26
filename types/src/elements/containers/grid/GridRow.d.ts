import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEGridCellElement } from "./GridCell";
export { HTMLEGridRowElement };
interface HTMLEGridRowElementConstructor {
    prototype: HTMLEGridRowElement;
    new (): HTMLEGridRowElement;
}
interface HTMLEGridRowElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
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
