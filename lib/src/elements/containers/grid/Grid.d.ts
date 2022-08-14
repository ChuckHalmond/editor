import { HTMLEGridBodyElement } from "./GridBody";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridCellCollection } from "./GridCellCollection";
import { HTMLEGridHeadElement } from "./GridHead";
import { HTMLEGridRowElement } from "./GridRow";
import { HTMLEGridRowCollection } from "./GridRowCollection";
export { HTMLEGridElement };
interface HTMLEGridElementConstructor {
    prototype: HTMLEGridElement;
    new (): HTMLEGridElement;
}
interface HTMLEGridElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly body: HTMLEGridBodyElement | null;
    readonly head: HTMLEGridHeadElement | null;
    readonly cells: HTMLEGridCellCollection;
    readonly rows: HTMLEGridRowCollection;
    readonly activeCell: HTMLEGridCellElement | null;
    readonly activeCellIndex: number;
    readonly activeRow: HTMLEGridRowElement | null;
    readonly activeRowIndex: number;
    selectby: "cell" | "row";
    name: string;
    multiselectable: boolean;
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
