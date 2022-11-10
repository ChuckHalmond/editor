import { HTMLEGridBodyElement } from "./GridBody";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridHeadElement } from "./GridHead";
import { HTMLEGridRowElement } from "./GridRow";
import "./GridBody";
import "./GridHead";
import "./GridRowGroup";
import "./GridRow";
import "./GridCell";
export { HTMLEGridElement };
interface HTMLEGridElementConstructor {
    prototype: HTMLEGridElement;
    new (): HTMLEGridElement;
}
interface HTMLEGridElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly body: HTMLEGridBodyElement | null;
    readonly head: HTMLEGridHeadElement | null;
    readonly activeCell: HTMLEGridCellElement | null;
    readonly activeRow: HTMLEGridRowElement | null;
    selectby: "cell" | "row";
    name: string;
    multiselectable: boolean;
    cells(): HTMLEGridCellElement[];
    rows(): HTMLEGridRowElement[];
    beginSelection(): void;
    endSelection(): void;
    clearSelection(): void;
    selectedCells(): HTMLEGridCellElement[];
    selectedRows(): HTMLEGridRowElement[];
}
declare global {
    interface HTMLElementTagNameMap {
        "e-grid": HTMLEGridElement;
    }
}
declare var HTMLEGridElement: HTMLEGridElementConstructor;
