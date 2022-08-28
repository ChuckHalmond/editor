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
    "__#63@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#63@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#63@#template": HTMLElement;
    "__#63@#rowsWalker": TreeWalker;
    "__#63@#cellsWalker": TreeWalker;
    "__#63@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#63@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#63@#cellsWalkerNodeFilter"(node: Node): number;
    "__#63@#rowsWalkerNodeFilter"(node: Node): number;
    "__#63@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#63@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#63@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#63@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#63@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#63@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#63@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#63@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#63@#clearCellsSelection"(grid: HTMLElement): void;
    "__#63@#clearRowsSelection"(grid: HTMLElement): void;
    "__#63@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#63@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#63@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#63@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#63@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#63@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#63@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#63@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#63@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#63@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#63@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#63@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#63@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#63@#handleFocusEvent"(event: FocusEvent): void;
    "__#63@#handleFocusInEvent"(event: FocusEvent): void;
    "__#63@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#63@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#63@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#63@#handleSelectEvent"(event: Event): void;
};
