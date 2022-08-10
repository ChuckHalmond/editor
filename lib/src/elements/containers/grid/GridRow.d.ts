import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEGridCellCollection } from "./GridCellCollection";
export { HTMLEGridRowElement };
interface HTMLEGridRowElementConstructor {
    prototype: HTMLEGridRowElement;
    new (): HTMLEGridRowElement;
}
interface HTMLEGridRowElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly cells: HTMLEGridCellCollection;
    readonly menu: HTMLEMenuElement | null;
    name: string;
    active: boolean;
    selected: boolean;
    posinset: number;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridrow": HTMLEGridRowElement;
    }
}
declare var HTMLEGridRowElement: HTMLEGridRowElementConstructor;
