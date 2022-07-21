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
}
declare global {
    interface WidgetNameMap {
        "grid": GridRowWidgetFactory;
    }
}
declare var gridWidget: {
    "__#17808@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#17808@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#17808@#template": HTMLElement;
    "__#17808@#rowsWalker": TreeWalker;
    "__#17808@#cellsWalker": TreeWalker;
    "__#17808@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#17808@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        multisectable?: boolean;
        selectby?: GridSelectBy;
    }): HTMLElement;
    slot(grid: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(grid: HTMLElement, slot: HTMLElement): void;
    setMultiSelectable(grid: HTMLElement, value: boolean): void;
    getMultiSelectable(grid: HTMLElement): boolean;
    setSelectBy(grid: HTMLElement, value: GridSelectBy): void;
    getSelectBy(grid: HTMLElement): GridSelectBy;
    beginSelection(grid: HTMLElement): void;
    endSelection(grid: HTMLElement): void;
    "__#17808@#clearSelection"(grid: HTMLElement): void;
    selectedCells(grid: HTMLElement): HTMLElement[];
    selectedRows(grid: HTMLElement): HTMLElement[];
    "__#17808@#cellsWalkerNodeFilter"(node: Node): number;
    "__#17808@#rowsWalkerNodeFilter"(node: Node): number;
    "__#17808@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#17808@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#17808@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#17808@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#17808@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#17808@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#17808@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#17808@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#17808@#clearCellsSelection"(grid: HTMLElement): void;
    "__#17808@#clearRowsSelection"(grid: HTMLElement): void;
    "__#17808@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#17808@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#17808@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#17808@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#17808@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#17808@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#17808@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#17808@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#17808@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#17808@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#17808@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#17808@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#17808@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#17808@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#17808@#handleFocusEvent"(event: FocusEvent): void;
    "__#17808@#handleFocusInEvent"(event: FocusEvent): void;
    "__#17808@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#17808@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#17808@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#17808@#handleSelectEvent"(event: Event): void;
};
