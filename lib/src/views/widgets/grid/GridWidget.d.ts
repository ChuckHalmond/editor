import { WidgetFactory } from "../Widget";
export { gridWidget };
declare type GridSelectBy = "cell" | "row";
interface GridRowWidgetFactory extends WidgetFactory {
    create(init?: {
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
    "__#21113@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#21113@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#21113@#template": HTMLElement;
    "__#21113@#rowsWalker": TreeWalker;
    "__#21113@#cellsWalker": TreeWalker;
    "__#21113@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#21113@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
        selectby?: GridSelectBy | undefined;
    } | undefined): HTMLElement;
    slot(grid: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(grid: HTMLElement, slot: HTMLElement): void;
    setSelectBy(item: HTMLElement, value: GridSelectBy): void;
    getSelectBy(item: HTMLElement): GridSelectBy;
    beginSelection(grid: HTMLElement): void;
    endSelection(grid: HTMLElement): void;
    "__#21113@#clearSelection"(grid: HTMLElement): void;
    selectedCells(grid: HTMLElement): HTMLElement[];
    selectedRows(grid: HTMLElement): HTMLElement[];
    "__#21113@#cellsWalkerNodeFilter"(node: Node): number;
    "__#21113@#rowsWalkerNodeFilter"(node: Node): number;
    "__#21113@#getCellsRange"(grid: HTMLElement, from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#21113@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#21113@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#21113@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#21113@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#21113@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#21113@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#21113@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#21113@#clearCellsSelection"(grid: HTMLElement): void;
    "__#21113@#clearRowsSelection"(grid: HTMLElement): void;
    "__#21113@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#21113@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#21113@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#21113@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#21113@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#21113@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#21113@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#21113@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#21113@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#21113@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#21113@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#21113@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#21113@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#21113@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#21113@#handleClickEvent"(event: MouseEvent): void;
    "__#21113@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#21113@#handleFocusEvent"(event: FocusEvent): void;
    "__#21113@#handleFocusInEvent"(event: FocusEvent): void;
    "__#21113@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
