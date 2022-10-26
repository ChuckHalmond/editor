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
    "__#53@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#53@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#53@#template": HTMLElement;
    "__#53@#rowsWalker": TreeWalker;
    "__#53@#cellsWalker": TreeWalker;
    "__#53@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#53@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#53@#cellsWalkerNodeFilter"(node: Node): number;
    "__#53@#rowsWalkerNodeFilter"(node: Node): number;
    "__#53@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#53@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#53@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#53@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#53@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#53@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#53@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#53@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#53@#clearCellsSelection"(grid: HTMLElement): void;
    "__#53@#clearRowsSelection"(grid: HTMLElement): void;
    "__#53@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#53@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#53@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#53@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#53@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#53@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#53@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#53@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#53@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#53@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#53@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#53@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#53@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#53@#handleFocusEvent"(event: FocusEvent): void;
    "__#53@#handleFocusInEvent"(event: FocusEvent): void;
    "__#53@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#53@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#53@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#53@#handleSelectEvent"(event: Event): void;
};
