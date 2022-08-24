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
    "__#64@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#64@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#64@#template": HTMLElement;
    "__#64@#rowsWalker": TreeWalker;
    "__#64@#cellsWalker": TreeWalker;
    "__#64@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#64@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#64@#cellsWalkerNodeFilter"(node: Node): number;
    "__#64@#rowsWalkerNodeFilter"(node: Node): number;
    "__#64@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#64@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#64@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#64@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#64@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#64@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#64@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#64@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#64@#clearCellsSelection"(grid: HTMLElement): void;
    "__#64@#clearRowsSelection"(grid: HTMLElement): void;
    "__#64@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#64@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#64@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#64@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#64@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#64@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#64@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#64@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#64@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#64@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#64@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#64@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#64@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#64@#handleFocusEvent"(event: FocusEvent): void;
    "__#64@#handleFocusInEvent"(event: FocusEvent): void;
    "__#64@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#64@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#64@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#64@#handleSelectEvent"(event: Event): void;
};
