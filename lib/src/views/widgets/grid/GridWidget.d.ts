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
    "__#54@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#54@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#54@#template": HTMLElement;
    "__#54@#rowsWalker": TreeWalker;
    "__#54@#cellsWalker": TreeWalker;
    "__#54@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#54@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#54@#cellsWalkerNodeFilter"(node: Node): number;
    "__#54@#rowsWalkerNodeFilter"(node: Node): number;
    "__#54@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#54@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#54@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#54@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#54@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#54@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#54@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#54@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#54@#clearCellsSelection"(grid: HTMLElement): void;
    "__#54@#clearRowsSelection"(grid: HTMLElement): void;
    "__#54@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#54@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#54@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#54@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#54@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#54@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#54@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#54@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#54@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#54@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#54@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#54@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#54@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#54@#handleFocusEvent"(event: FocusEvent): void;
    "__#54@#handleFocusInEvent"(event: FocusEvent): void;
    "__#54@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#54@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#54@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#54@#handleSelectEvent"(event: Event): void;
};
