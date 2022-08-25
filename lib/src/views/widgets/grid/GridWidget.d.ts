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
    "__#65@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#65@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#65@#template": HTMLElement;
    "__#65@#rowsWalker": TreeWalker;
    "__#65@#cellsWalker": TreeWalker;
    "__#65@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#65@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#65@#cellsWalkerNodeFilter"(node: Node): number;
    "__#65@#rowsWalkerNodeFilter"(node: Node): number;
    "__#65@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#65@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#65@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#65@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#65@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#65@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#65@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#65@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#65@#clearCellsSelection"(grid: HTMLElement): void;
    "__#65@#clearRowsSelection"(grid: HTMLElement): void;
    "__#65@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#65@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#65@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#65@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#65@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#65@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#65@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#65@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#65@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#65@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#65@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#65@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#65@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#65@#handleFocusEvent"(event: FocusEvent): void;
    "__#65@#handleFocusInEvent"(event: FocusEvent): void;
    "__#65@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#65@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#65@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#65@#handleSelectEvent"(event: Event): void;
};
