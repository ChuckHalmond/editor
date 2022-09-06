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
    "__#62@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#62@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#62@#template": HTMLElement;
    "__#62@#rowsWalker": TreeWalker;
    "__#62@#cellsWalker": TreeWalker;
    "__#62@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#62@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#62@#cellsWalkerNodeFilter"(node: Node): number;
    "__#62@#rowsWalkerNodeFilter"(node: Node): number;
    "__#62@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#62@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#62@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#62@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#62@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#62@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#62@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#62@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#62@#clearCellsSelection"(grid: HTMLElement): void;
    "__#62@#clearRowsSelection"(grid: HTMLElement): void;
    "__#62@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#62@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#62@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#62@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#62@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#62@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#62@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#62@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#62@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#62@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#62@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#62@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#62@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#62@#handleFocusEvent"(event: FocusEvent): void;
    "__#62@#handleFocusInEvent"(event: FocusEvent): void;
    "__#62@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#62@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#62@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#62@#handleSelectEvent"(event: Event): void;
};
