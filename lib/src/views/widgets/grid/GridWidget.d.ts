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
    "__#17@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#17@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#17@#template": HTMLElement;
    "__#17@#rowsWalker": TreeWalker;
    "__#17@#cellsWalker": TreeWalker;
    "__#17@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#17@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#17@#cellsWalkerNodeFilter"(node: Node): number;
    "__#17@#rowsWalkerNodeFilter"(node: Node): number;
    "__#17@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#17@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#17@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#17@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#17@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#17@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#17@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#17@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#17@#clearCellsSelection"(grid: HTMLElement): void;
    "__#17@#clearRowsSelection"(grid: HTMLElement): void;
    "__#17@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#17@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#17@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#17@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#17@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#17@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#17@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#17@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#17@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#17@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#17@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#17@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#17@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#17@#handleFocusEvent"(event: FocusEvent): void;
    "__#17@#handleFocusInEvent"(event: FocusEvent): void;
    "__#17@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#17@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#17@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#17@#handleSelectEvent"(event: Event): void;
};
