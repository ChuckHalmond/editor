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
    "__#55@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#55@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#55@#template": HTMLElement;
    "__#55@#rowsWalker": TreeWalker;
    "__#55@#cellsWalker": TreeWalker;
    "__#55@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#55@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#55@#cellsWalkerNodeFilter"(node: Node): number;
    "__#55@#rowsWalkerNodeFilter"(node: Node): number;
    "__#55@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#55@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#55@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#55@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#55@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#55@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#55@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#55@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#55@#clearCellsSelection"(grid: HTMLElement): void;
    "__#55@#clearRowsSelection"(grid: HTMLElement): void;
    "__#55@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#55@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#55@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#55@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#55@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#55@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#55@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#55@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#55@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#55@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#55@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#55@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#55@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#55@#handleFocusEvent"(event: FocusEvent): void;
    "__#55@#handleFocusInEvent"(event: FocusEvent): void;
    "__#55@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#55@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#55@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#55@#handleSelectEvent"(event: Event): void;
};
