import { WidgetFactory } from "../Widget";
export { gridWidget };
declare type GridSelectBy = "cell" | "row";
interface GridRowWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
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
    clearSelection(grid: HTMLElement): void;
}
declare global {
    interface WidgetNameMap {
        "grid": GridRowWidgetFactory;
    }
}
declare var gridWidget: {
    "__#14@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#14@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#14@#template": HTMLElement;
    "__#14@#rowsWalker": TreeWalker;
    "__#14@#cellsWalker": TreeWalker;
    "__#14@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#14@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        multisectable?: boolean;
        selectby?: GridSelectBy;
    }): HTMLElement;
    slot(grid: HTMLElement): HTMLElement | null;
    setMultiSelectable(grid: HTMLElement, value: boolean): void;
    getMultiSelectable(grid: HTMLElement): boolean;
    setSelectBy(grid: HTMLElement, value: GridSelectBy): void;
    getSelectBy(grid: HTMLElement): GridSelectBy;
    beginSelection(grid: HTMLElement): void;
    endSelection(grid: HTMLElement): void;
    clearSelection(grid: HTMLElement): void;
    selectedCells(grid: HTMLElement): HTMLElement[];
    selectedRows(grid: HTMLElement): HTMLElement[];
    "__#14@#cellsWalkerNodeFilter"(node: Node): number;
    "__#14@#rowsWalkerNodeFilter"(node: Node): number;
    "__#14@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#14@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#14@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#14@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#14@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#14@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#14@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#14@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#14@#clearCellsSelection"(grid: HTMLElement): void;
    "__#14@#clearRowsSelection"(grid: HTMLElement): void;
    "__#14@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#14@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#14@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#14@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#14@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#14@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#14@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#14@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#14@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#14@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#14@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#14@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#14@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#14@#handleFocusEvent"(event: FocusEvent): void;
    "__#14@#handleFocusInEvent"(event: FocusEvent): void;
    "__#14@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#14@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#14@#handleSelectEvent"(event: Event): void;
};
