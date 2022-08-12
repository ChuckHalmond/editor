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
    "__#57@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#57@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#57@#template": HTMLElement;
    "__#57@#rowsWalker": TreeWalker;
    "__#57@#cellsWalker": TreeWalker;
    "__#57@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#57@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        multisectable?: boolean | undefined;
        selectby?: GridSelectBy | undefined;
    } | undefined): HTMLElement;
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
    "__#57@#cellsWalkerNodeFilter"(node: Node): number;
    "__#57@#rowsWalkerNodeFilter"(node: Node): number;
    "__#57@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#57@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#57@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#57@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#57@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#57@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#57@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#57@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#57@#clearCellsSelection"(grid: HTMLElement): void;
    "__#57@#clearRowsSelection"(grid: HTMLElement): void;
    "__#57@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#57@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#57@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#57@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#57@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#57@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#57@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#57@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#57@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#57@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#57@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#57@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#57@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#57@#handleFocusEvent"(event: FocusEvent): void;
    "__#57@#handleFocusInEvent"(event: FocusEvent): void;
    "__#57@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#57@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#57@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#57@#handleSelectEvent"(event: Event): void;
};
