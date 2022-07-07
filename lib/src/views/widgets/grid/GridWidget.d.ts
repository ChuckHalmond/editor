import { WidgetFactory } from "../Widget";
export { gridWidget };
declare type GridSelectBy = "cell" | "row";
interface GridRowWidgetFactory extends WidgetFactory {
    create(init?: {
        multisectable?: boolean;
        selectby?: GridSelectBy;
    }): HTMLElement;
    setSelectBy(item: HTMLElement, value: GridSelectBy): void;
    getSelectBy(item: HTMLElement): GridSelectBy;
    headers(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    beginSelection(grid: HTMLElement): void;
    endSelection(grid: HTMLElement): void;
    selectedCells(grid: HTMLElement): HTMLElement[];
    selectedRows(grid: HTMLElement): HTMLElement[];
}
declare global {
    interface WidgetNameMap {
        "grid": GridRowWidgetFactory;
    }
}
declare var gridWidget: {
    "__#14171@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#14171@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#14171@#template": HTMLElement;
    "__#14171@#rowsWalker": TreeWalker;
    "__#14171@#cellsWalker": TreeWalker;
    "__#14171@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#14171@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
        multisectable?: boolean;
        selectby?: GridSelectBy;
    }): HTMLElement;
    slot(grid: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(grid: HTMLElement, slot: HTMLElement): void;
    setMultiSelectable(grid: HTMLElement, value: boolean): void;
    getMultiSelectable(grid: HTMLElement): boolean;
    setSelectBy(grid: HTMLElement, value: GridSelectBy): void;
    getSelectBy(grid: HTMLElement): GridSelectBy;
    beginSelection(grid: HTMLElement): void;
    endSelection(grid: HTMLElement): void;
    "__#14171@#clearSelection"(grid: HTMLElement): void;
    selectedCells(grid: HTMLElement): HTMLElement[];
    selectedRows(grid: HTMLElement): HTMLElement[];
    "__#14171@#cellsWalkerNodeFilter"(node: Node): number;
    "__#14171@#rowsWalkerNodeFilter"(node: Node): number;
    "__#14171@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#14171@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#14171@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#14171@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#14171@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#14171@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#14171@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#14171@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#14171@#clearCellsSelection"(grid: HTMLElement): void;
    "__#14171@#clearRowsSelection"(grid: HTMLElement): void;
    "__#14171@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#14171@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#14171@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#14171@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#14171@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#14171@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#14171@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#14171@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#14171@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#14171@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#14171@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#14171@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#14171@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#14171@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#14171@#handleFocusEvent"(event: FocusEvent): void;
    "__#14171@#handleFocusInEvent"(event: FocusEvent): void;
    "__#14171@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14171@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#14171@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#14171@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
