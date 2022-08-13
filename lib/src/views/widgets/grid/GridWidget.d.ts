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
    "__#59@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#59@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#59@#template": HTMLElement;
    "__#59@#rowsWalker": TreeWalker;
    "__#59@#cellsWalker": TreeWalker;
    "__#59@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#59@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#59@#cellsWalkerNodeFilter"(node: Node): number;
    "__#59@#rowsWalkerNodeFilter"(node: Node): number;
    "__#59@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#59@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#59@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#59@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#59@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#59@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#59@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#59@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#59@#clearCellsSelection"(grid: HTMLElement): void;
    "__#59@#clearRowsSelection"(grid: HTMLElement): void;
    "__#59@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#59@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#59@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#59@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#59@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#59@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#59@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#59@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#59@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#59@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#59@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#59@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#59@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#59@#handleFocusEvent"(event: FocusEvent): void;
    "__#59@#handleFocusInEvent"(event: FocusEvent): void;
    "__#59@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#59@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#59@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#59@#handleSelectEvent"(event: Event): void;
};
