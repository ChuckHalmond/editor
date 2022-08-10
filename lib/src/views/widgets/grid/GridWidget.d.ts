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
    "__#10867@#getActiveRow"(grid: HTMLElement): HTMLElement | null;
    "__#10867@#getActiveCell"(grid: HTMLElement): HTMLElement | null;
    headers(grid: HTMLElement): HTMLElement[];
    rows(grid: HTMLElement): HTMLElement[];
    cells(grid: HTMLElement): HTMLElement[];
    "__#10867@#template": HTMLElement;
    "__#10867@#rowsWalker": TreeWalker;
    "__#10867@#cellsWalker": TreeWalker;
    "__#10867@#onSelection": WeakMap<HTMLElement, boolean>;
    "__#10867@#hasSelectionChanged": WeakMap<HTMLElement, boolean>;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
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
    "__#10867@#clearSelection"(grid: HTMLElement): void;
    selectedCells(grid: HTMLElement): HTMLElement[];
    selectedRows(grid: HTMLElement): HTMLElement[];
    "__#10867@#cellsWalkerNodeFilter"(node: Node): number;
    "__#10867@#rowsWalkerNodeFilter"(node: Node): number;
    "__#10867@#getCellsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#10867@#getRowsRange"(from: HTMLElement, to: HTMLElement): HTMLElement[];
    "__#10867@#setCellsSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#10867@#setRowsSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#10867@#addCellsToSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#10867@#addRowsToSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#10867@#removeCellsFromSelection"(grid: HTMLElement, ...cells: HTMLElement[]): void;
    "__#10867@#removeRowsFromSelection"(grid: HTMLElement, ...rows: HTMLElement[]): void;
    "__#10867@#clearCellsSelection"(grid: HTMLElement): void;
    "__#10867@#clearRowsSelection"(grid: HTMLElement): void;
    "__#10867@#setActiveCell"(grid: HTMLElement, cell: HTMLElement | null): void;
    "__#10867@#setActiveRow"(grid: HTMLElement, row: HTMLElement | null): void;
    "__#10867@#firstCell"(row: HTMLElement): HTMLElement | null;
    "__#10867@#lastCell"(row: HTMLElement): HTMLElement | null;
    "__#10867@#previousCell"(cell: HTMLElement): HTMLElement | null;
    "__#10867@#nextCell"(cell: HTMLElement): HTMLElement | null;
    "__#10867@#closestRow"(cell: HTMLElement): HTMLElement | null;
    "__#10867@#firstRow"(grid: HTMLElement): HTMLElement | null;
    "__#10867@#lastRow"(grid: HTMLElement): HTMLElement | null;
    "__#10867@#previousRow"(row: HTMLElement): HTMLElement | null;
    "__#10867@#nextRow"(row: HTMLElement): HTMLElement | null;
    "__#10867@#topCell"(cell: HTMLElement): HTMLElement | null;
    "__#10867@#bottomCell"(cell: HTMLElement): HTMLElement | null;
    "__#10867@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#10867@#handleFocusEvent"(event: FocusEvent): void;
    "__#10867@#handleFocusInEvent"(event: FocusEvent): void;
    "__#10867@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#10867@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#10867@#handleMouseDownEvent"(event: MouseEvent): void;
    "__#10867@#handleSelectEvent"(event: Event): void;
};
