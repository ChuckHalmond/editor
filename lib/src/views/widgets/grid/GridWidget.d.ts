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
    "__#20508@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#20508@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#20508@#template": HTMLElement;
    "__#20508@#rowsWalker": TreeWalker;
    "__#20508@#cellsWalker": TreeWalker;
    "__#20508@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#20508@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
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
    "__#20508@#cellsWalkerNodeFilter"(node: Node): number;
    "__#20508@#rowsWalkerNodeFilter"(node: Node): number;
    "__#20508@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#20508@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#20508@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#20508@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#20508@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#20508@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#20508@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#20508@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#20508@#clearCellsSelection"(grid: HTMLElement): void;
    "__#20508@#clearRowsSelection"(grid: HTMLElement): void;
    "__#20508@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#20508@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#20508@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#20508@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#20508@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#20508@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#20508@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#20508@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#20508@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#20508@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#20508@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#20508@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#20508@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#20508@#handleFocusEvent"(event: FocusEvent): void;
    "__#20508@#handleFocusInEvent"(event: FocusEvent): void;
    "__#20508@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#20508@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#20508@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#20508@#handleSelectEvent"(event: Event): void;
};
