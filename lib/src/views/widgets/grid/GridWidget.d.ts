import { WidgetFactory } from "../Widget";
export { gridWidget };
declare type GridSelectBy = "cell" | "row";
interface GridRowWidgetFactory extends WidgetFactory {
    create(init?: {
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
    "__#31152@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#31152@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#31152@#template": HTMLElement;
    "__#31152@#rowsWalker": TreeWalker;
    "__#31152@#cellsWalker": TreeWalker;
    "__#31152@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#31152@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
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
    "__#31152@#clearSelection"(grid: HTMLElement): void;
    selectedCells(grid: HTMLElement): HTMLElement[];
    selectedRows(grid: HTMLElement): HTMLElement[];
    "__#31152@#cellsWalkerNodeFilter"(node: Node): number;
    "__#31152@#rowsWalkerNodeFilter"(node: Node): number;
    "__#31152@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#31152@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#31152@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#31152@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#31152@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#31152@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#31152@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#31152@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#31152@#clearCellsSelection"(grid: HTMLElement): void;
    "__#31152@#clearRowsSelection"(grid: HTMLElement): void;
    "__#31152@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#31152@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#31152@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#31152@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#31152@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#31152@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#31152@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#31152@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#31152@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#31152@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#31152@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#31152@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#31152@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#31152@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#31152@#handleFocusEvent"(event: FocusEvent): void;
    "__#31152@#handleFocusInEvent"(event: FocusEvent): void;
    "__#31152@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#31152@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#31152@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
