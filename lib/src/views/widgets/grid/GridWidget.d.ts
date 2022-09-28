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
    "__#61@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#61@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#61@#template": HTMLElement;
    "__#61@#rowsWalker": TreeWalker;
    "__#61@#cellsWalker": TreeWalker;
    "__#61@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#61@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#61@#cellsWalkerNodeFilter"(node: Node): number;
    "__#61@#rowsWalkerNodeFilter"(node: Node): number;
    "__#61@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#61@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#61@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#61@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#61@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#61@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#61@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#61@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#61@#clearCellsSelection"(grid: HTMLElement): void;
    "__#61@#clearRowsSelection"(grid: HTMLElement): void;
    "__#61@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#61@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#61@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#61@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#61@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#61@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#61@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#61@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#61@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#61@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#61@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#61@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#61@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#61@#handleFocusEvent"(event: FocusEvent): void;
    "__#61@#handleFocusInEvent"(event: FocusEvent): void;
    "__#61@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#61@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#61@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#61@#handleSelectEvent"(event: Event): void;
};
