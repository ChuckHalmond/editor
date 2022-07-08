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
    "__#13311@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#13311@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#13311@#template": HTMLElement;
    "__#13311@#rowsWalker": TreeWalker;
    "__#13311@#cellsWalker": TreeWalker;
    "__#13311@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#13311@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(init?: {
        multisectable?: boolean | undefined;
        selectby?: GridSelectBy | undefined;
    } | undefined): HTMLElement;
    slot(grid: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(grid: HTMLElement, slot: HTMLElement): void;
    setMultiSelectable(grid: HTMLElement, value: boolean): void;
    getMultiSelectable(grid: HTMLElement): boolean;
    setSelectBy(grid: HTMLElement, value: GridSelectBy): void;
    getSelectBy(grid: HTMLElement): GridSelectBy;
    beginSelection(grid: HTMLElement): void;
    endSelection(grid: HTMLElement): void;
    "__#13311@#clearSelection"(grid: HTMLElement): void;
    selectedCells(grid: HTMLElement): HTMLElement[];
    selectedRows(grid: HTMLElement): HTMLElement[];
    "__#13311@#cellsWalkerNodeFilter"(node: Node): number;
    "__#13311@#rowsWalkerNodeFilter"(node: Node): number;
    "__#13311@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#13311@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#13311@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#13311@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#13311@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#13311@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#13311@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#13311@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#13311@#clearCellsSelection"(grid: HTMLElement): void;
    "__#13311@#clearRowsSelection"(grid: HTMLElement): void;
    "__#13311@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#13311@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#13311@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#13311@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#13311@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#13311@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#13311@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#13311@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#13311@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#13311@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#13311@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#13311@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#13311@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#13311@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#13311@#handleFocusEvent"(event: FocusEvent): void;
    "__#13311@#handleFocusInEvent"(event: FocusEvent): void;
    "__#13311@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#13311@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#13311@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#13311@#handleSelectEvent"(event: Event): void;
};
