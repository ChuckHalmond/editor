import { element, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";
import { gridCellWidget } from "./GridCellWidget";
import { gridRowWidget } from "./GridRowWidget";

export { gridWidget };

type GridSelectBy = "cell" | "row";

interface GridRowWidgetFactory extends WidgetFactory {
    create(init?: {
        selectby?: GridSelectBy
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
        "grid": GridRowWidgetFactory,
    }
}

var gridWidget = new (
Widget({
    name: "grid"
})(class GridWidgetFactoryBase extends WidgetFactory implements GridRowWidgetFactory {

    #getActiveRow(grid: HTMLElement): HTMLElement | null {
        return grid.querySelector<HTMLElement>(".gridrow.active");
    }

    #getActiveCell(grid: HTMLElement): HTMLElement | null {
        return grid.querySelector<HTMLElement>(".gridcell.active");
    }

    headers(grid: HTMLElement): HTMLElement[] {
        return Array.from(grid.querySelectorAll<HTMLElement>(
            ":scope > .gridhead > .gridheader"
        ));
    }

    rows(grid: HTMLElement): HTMLElement[] {
        return Array.from(grid.querySelectorAll<HTMLElement>(
            ":scope > .gridbody > .gridrow"
        ));
    }

    cells(grid: HTMLElement): HTMLElement[] {
        return Array.from(grid.querySelectorAll<HTMLElement>(
            ":scope > .gridbody > .gridrow > .gridcell"
        ));
    }

    #template: HTMLElement;
    #rowsWalker: TreeWalker;
    #cellsWalker: TreeWalker;
    #onSelection: WeakMap<HTMLElement, boolean>;
    #hasSelectionChanged: WeakMap<HTMLElement, boolean>;

    constructor() {
        super();
        this.#template = element("table", {
            attributes: {
                class: "grid",
                tabindex: 0
            },
            children: [
                element("thead", {
                    attributes: {
                        class: "gridhead"
                    }
                }),
                element("tbody", {
                    attributes: {
                        class: "gridbody"
                    }
                }),
            ]
        });
        this.#onSelection = new WeakMap();
        this.#hasSelectionChanged = new WeakMap();
        this.#cellsWalker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT, this.#cellsWalkerNodeFilter.bind(this)
        );
        this.#rowsWalker = document.createTreeWalker(
            document, NodeFilter.SHOW_ELEMENT, this.#rowsWalkerNodeFilter.bind(this)
        );
    }

    create(init?: {
        selectby?: GridSelectBy;
    }) {
        const grid = <HTMLElement>this.#template.cloneNode(true);
        if (init !== void 0) {
            const {selectby} = init;
            if (selectby !== void 0) {
                this.setSelectBy(grid, selectby);
            }
        }
        grid.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this));
        grid.addEventListener("click", this.#handleClickEvent.bind(this));
        grid.addEventListener("focus", this.#handleFocusEvent.bind(this));
        grid.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        grid.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        grid.addEventListener("select", this.#handleSelectEvent.bind(this));
        return grid;
    }

    slot(grid: HTMLElement, name: string | null): HTMLElement | null {
        switch (name) {
            case "headers":
                return grid.querySelector(":scope > .gridhead");
            case "rows":
            default:
                return grid.querySelector(":scope > .gridbody");
        }
    }

    slottedCallback(grid: HTMLElement, slot: HTMLElement) {
        Array.from(slot.childNodes).forEach((item_i, i) => {
            if (item_i instanceof HTMLElement) {
                gridRowWidget.setPosInSet(item_i, i);
            }
        });
    }

    setSelectBy(item: HTMLElement, value: GridSelectBy): void {
        item.setAttribute("data-selectby", value);
    }

    getSelectBy(item: HTMLElement): GridSelectBy {
        return <GridSelectBy>item.getAttribute("data-selectby") ?? "cell";
    }

    beginSelection(grid: HTMLElement): void {
        this.#onSelection.set(grid, true);
    }

    endSelection(grid: HTMLElement): void {
        this.#onSelection.set(grid, false);
        if (this.#hasSelectionChanged.get(grid)) {
            grid.dispatchEvent(new Event("selectionchange", {bubbles: true}));
            this.#hasSelectionChanged.set(grid, false);
        }
    }

    #clearSelection(grid: HTMLElement): void {
        this.#clearCellsSelection(grid);
        this.#clearRowsSelection(grid);
    }

    selectedCells(grid: HTMLElement): HTMLElement[] {
        return Array.from(grid.querySelectorAll(":scope > .gridbody > .gridrow > .gridcell[aria-selected]"));
    }

    selectedRows(grid: HTMLElement): HTMLElement[] {
        return Array.from(grid.querySelectorAll(":scope > .gridbody > .gridrow[aria-selected]"));
    }

    #cellsWalkerNodeFilter(node: Node): number {
        if (node instanceof HTMLElement) {
            const {classList} = node;
            if (classList.contains("gridcell") && !gridCellWidget.getDisabled(node) && !node.hidden) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("gridrow") || classList.contains("gridbody")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    }

    #rowsWalkerNodeFilter(node: Node): number {
        if (node instanceof HTMLElement) {
            const {classList} = node;
            if (classList.contains("gridrow") && !gridRowWidget.getDisabled(node) && !node.hidden) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("gridbody")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    }

    #getCellsRange(grid: HTMLElement, from: HTMLElement, to: HTMLElement): HTMLElement[] {
        const cells = this.cells(grid);
        const fromIndex = cells.indexOf(from);
        const toIndex = cells.indexOf(to);
        if (fromIndex > -1 && toIndex > -1) {
            if (from == to) {
                return [from];
            }
            return cells.slice(
                Math.min(fromIndex, toIndex),
                Math.max(fromIndex, toIndex) + 1
            );
        }
        return [];
    }

    #getRowsRange(from: HTMLElement, to: HTMLElement): HTMLElement[] {
        if (from == to) {
            return [from];
        }
        const position = from.compareDocumentPosition(to);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            const range = [from];
            let nextVisibleRow = this.#nextRow(from);
            while (nextVisibleRow && nextVisibleRow !== to) {
                range.push(nextVisibleRow);
                nextVisibleRow = this.#nextRow(nextVisibleRow);
            }
            range.push(to);
            return range;
        }
        else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            const range = [from];
            let previousVisibleRow = this.#previousRow(from);
            while (previousVisibleRow && previousVisibleRow !== to) {
                range.push(previousVisibleRow);
                previousVisibleRow = this.#previousRow(previousVisibleRow);
            }
            range.push(to);
            return range;
        }
        return [];
    }

    #setCellsSelection(grid: HTMLElement, ...cells: HTMLElement[]): void {
        this.beginSelection(grid);
        const selectedCells = this.selectedCells(grid);
        selectedCells.forEach((selectedCell_i) => {
            if (!cells.includes(selectedCell_i)) {
                gridCellWidget.setSelected(selectedCell_i, false);
            }
        });
        cells.forEach((cell_i) => {
            const selected = gridCellWidget.getSelected(cell_i);
            if (!selected) {
                gridCellWidget.setSelected(cell_i, true);
            }
        });
        this.endSelection(grid);
    }

    #setRowsSelection(grid: HTMLElement, ...rows: HTMLElement[]): void {
        this.beginSelection(grid);
        const selectedRows = this.selectedRows(grid);
        selectedRows.forEach((selectedRow_i) => {
            if (!rows.includes(selectedRow_i)) {
                gridRowWidget.setSelected(selectedRow_i, false);
            }
        });
        rows.forEach((row_i) => {
            const selected = gridRowWidget.getSelected(row_i);
            if (!selected) {
                gridRowWidget.setSelected(row_i, true);
            }
        });
        this.endSelection(grid);
    }

    #addCellsToSelection(grid: HTMLElement, ...cells: HTMLElement[]): void {
        this.beginSelection(grid);
        cells.forEach((cell_i) => {
            const selected = gridCellWidget.getSelected(cell_i);
            if (!selected) {
                gridCellWidget.setSelected(cell_i, true);
            }
        });
        this.endSelection(grid);
    }

    #addRowsToSelection(grid: HTMLElement, ...rows: HTMLElement[]): void {
        this.beginSelection(grid);
        rows.forEach((row_i) => {
            const selected = gridRowWidget.getSelected(row_i);
            if (!selected) {
                gridRowWidget.setSelected(row_i, true);
            }
        });
        this.endSelection(grid);
    }

    #removeCellsFromSelection(grid: HTMLElement, ...cells: HTMLElement[]): void {
        this.beginSelection(grid);
        const selectedCells = this.selectedCells(grid);
        cells.forEach((cell_i) => {
            if (selectedCells.includes(cell_i)) {
                gridCellWidget.setSelected(cell_i, false);
            }
        });
        this.endSelection(grid);
    }

    #removeRowsFromSelection(grid: HTMLElement, ...rows: HTMLElement[]): void {
        this.beginSelection(grid);
        const selectedRows = this.selectedRows(grid);
        rows.forEach((row_i) => {
            if (selectedRows.includes(row_i)) {
                gridRowWidget.setSelected(row_i, false);
            }
        });
        this.endSelection(grid);
    }

    #clearCellsSelection(grid: HTMLElement): void {
        this.beginSelection(grid);
        const selectedCells = this.selectedCells(grid);
        selectedCells.forEach((cell_i) => {
            const selected = gridCellWidget.getSelected(cell_i);
            if (selected) {
                gridCellWidget.setSelected(cell_i, false);
            }
        });
        this.endSelection(grid);
    }

    #clearRowsSelection(grid: HTMLElement): void {
        this.beginSelection(grid);
        const selectedRows = this.selectedRows(grid);
        selectedRows.forEach((row_i) => {
            const selected = gridRowWidget.getSelected(row_i);
            if (selected) {
                gridRowWidget.setSelected(row_i, false);
            }
        });
        this.endSelection(grid);
    }

    #setActiveCell(grid: HTMLElement, cell: HTMLElement | null): void {
        const activeCell = this.#getActiveCell(grid);
        if (activeCell !== null && activeCell !== cell) {
            gridCellWidget.setActive(activeCell, false);
            activeCell.tabIndex = -1;
        }
        if (cell !== null) {
            gridCellWidget.setActive(cell, true);
            cell.tabIndex = 0;
        }
    }

    #setActiveRow(grid: HTMLElement, row: HTMLElement | null): void {
        const activeRow = this.#getActiveRow(grid);
        if (activeRow !== null && activeRow !== row) {
            gridRowWidget.setActive(activeRow, false);
            activeRow.tabIndex = -1;
        }
        if (row !== null) {
            gridCellWidget.setActive(row, true);
            row.tabIndex = 0;
        }
    }

    #firstCell(row: HTMLElement): HTMLElement | null {
        const cellsWalker = this.#cellsWalker;
        cellsWalker.currentNode = row;
        return <HTMLElement | null>cellsWalker.firstChild();
    }

    #lastCell(row: HTMLElement): HTMLElement | null {
        const cellsWalker = this.#cellsWalker;
        cellsWalker.currentNode = row;
        return <HTMLElement | null>cellsWalker.lastChild();
    }

    #previousCell(cell: HTMLElement): HTMLElement | null {
        const cellsWalker = this.#cellsWalker;
        cellsWalker.currentNode = cell;
        return <HTMLElement | null>cellsWalker.previousNode();
    }

    #nextCell(cell: HTMLElement): HTMLElement | null {
        const cellsWalker = this.#cellsWalker;
        cellsWalker.currentNode = cell;
        return <HTMLElement | null>cellsWalker.nextNode();
    }

    #closestRow(cell: HTMLElement): HTMLElement | null {
        const rowsWalker = this.#rowsWalker;
        rowsWalker.currentNode = cell;
        return <HTMLElement | null>rowsWalker.parentNode();
    }

    #firstRow(grid: HTMLElement): HTMLElement | null {
        const rowsWalker = this.#rowsWalker;
        rowsWalker.currentNode = grid;
        return <HTMLElement | null>rowsWalker.firstChild();
    }

    #lastRow(grid: HTMLElement): HTMLElement | null {
        const rowsWalker = this.#rowsWalker;
        rowsWalker.currentNode = grid;
        return <HTMLElement | null>rowsWalker.lastChild();
    }

    #previousRow(row: HTMLElement): HTMLElement | null {
        const rowsWalker = this.#rowsWalker;
        rowsWalker.currentNode = row;
        return <HTMLElement | null>rowsWalker.previousNode();
    }

    #nextRow(row: HTMLElement): HTMLElement | null {
        const rowsWalker = this.#rowsWalker;
        rowsWalker.currentNode = row;
        return <HTMLElement | null>rowsWalker.nextNode();
    }

    #topCell(cell: HTMLElement): HTMLElement | null {
        const closestRow = this.#closestRow(cell);
        if (closestRow) {
            const closestRowCells = gridRowWidget.cells(closestRow);
            const cellIndex = Array.from(closestRowCells.values()).indexOf(cell);
            const previousRow = this.#previousRow(closestRow);
            if (previousRow) {
                const previousRowCells = gridRowWidget.cells(previousRow);
                return previousRowCells[Math.min(cellIndex, previousRowCells.length)];
            }
        }
        return null;
    }

    #bottomCell(cell: HTMLElement): HTMLElement | null {
        const closestRow = this.#closestRow(cell);
        if (closestRow) {
            const closestRowCells = gridRowWidget.cells(closestRow);
            const cellIndex = Array.from(closestRowCells.values()).indexOf(cell);
            const nextRow = this.#nextRow(closestRow);
            if (nextRow) {
                const nextRowCells = gridRowWidget.cells(nextRow);
                return nextRowCells[Math.min(cellIndex, nextRowCells.length)];
            }
        }
        return null;
    }

    #handleContextMenuEvent(event: MouseEvent) {
        const {currentTarget, target} = event;
        const targetGrid = <HTMLElement>currentTarget;
        const selectby = this.getSelectBy(targetGrid);
        switch (selectby) {
            case "cell": {
                const targetCell = (<HTMLElement>target).closest<HTMLElement>(".gridcell");
                if (targetCell) {
                    const selectedCells = this.selectedCells(targetGrid);
                    if (!selectedCells.includes(targetCell)) {
                        this.#setCellsSelection(targetCell);
                    }
                    targetCell.focus({preventScroll: true});
                    event.preventDefault();
                }
                break;
            }
            case "row": {
                const targetRow = (<HTMLElement>target).closest<HTMLElement>(".gridrow");
                if (targetRow) {
                    const selectedRows = this.selectedRows(targetGrid);
                    if (!selectedRows.includes(targetRow)) {
                        this.#setRowsSelection(targetRow);
                    }
                    targetRow.focus({preventScroll: true});
                }
                break;
            }
        }
        event.preventDefault();
    }

    #handleClickEvent(event: MouseEvent): void {
        const {currentTarget, target, ctrlKey, shiftKey} = event;
        const targetGrid = <HTMLElement>currentTarget;
        const selectby = this.getSelectBy(targetGrid);
        switch (selectby) {
            case "cell": {
                const targetCell = (<HTMLElement>target).closest<HTMLElement>(".gridcell");
                console.log(targetCell);
                console.log(target);
                if (targetCell) {
                    if (!shiftKey && !ctrlKey) {
                        this.#setCellsSelection(targetGrid, targetCell);
                    }
                    else if (ctrlKey) {
                        const selected = gridCellWidget.getSelected(targetCell);
                        !selected ?
                            this.#addCellsToSelection(targetGrid, targetCell) :
                            this.#removeCellsFromSelection(targetGrid, targetCell);
                        event.stopPropagation();
                    }
                    else if (shiftKey) {
                        const selectedCells = this.selectedCells(targetGrid);
                        const lastSelectedCell = selectedCells[selectedCells.length - 1];
                        if (lastSelectedCell) {
                            const range = this.#getCellsRange(
                                targetGrid,
                                lastSelectedCell,
                                targetCell
                            );
                            if (range) {
                                selectedCells.includes(targetCell) ?
                                    this.#removeCellsFromSelection(targetGrid, ...range) :
                                    this.#addCellsToSelection(targetGrid, ...range);
                            }
                        }
                        else {
                            this.#setCellsSelection(targetGrid, targetCell);
                        }
                        event.stopPropagation();
                    }
                }
                break;
            }
            case "row": {
                const targetRow = (<HTMLElement>target).closest<HTMLElement>(".gridrow");
                if (targetRow) {
                    if (!shiftKey && !ctrlKey) {
                        this.#setRowsSelection(targetGrid, targetRow);
                    }
                    else if (ctrlKey) {
                        const selected = gridRowWidget.getSelected(targetRow);
                        !selected ?
                            this.#addRowsToSelection(targetGrid, targetRow) :
                            this.#removeRowsFromSelection(targetGrid, targetRow);
                        event.stopPropagation();
                    }
                    else if (shiftKey) {
                        const selectedRows = this.selectedRows(targetGrid);
                        const lastSelectedRow = selectedRows[selectedRows.length - 1];
                        if (lastSelectedRow) {
                            const range = this.#getRowsRange(
                                lastSelectedRow,
                                targetRow
                            );
                            if (range) {
                                selectedRows.includes(targetRow) ?
                                    this.#removeRowsFromSelection(targetGrid, ...range) :
                                    this.#addRowsToSelection(targetGrid, ...range);
                            }
                        }
                        else {
                            this.#setRowsSelection(targetGrid, targetRow);
                        }
                        event.stopPropagation();
                    }
                }
                break;
            }
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {currentTarget, key} = event;
        const targetGrid = <HTMLElement>currentTarget;
        const activeCell = this.#getActiveCell(targetGrid);
        const activeRow = this.#getActiveRow(targetGrid);
        const selectby = this.getSelectBy(targetGrid);
        switch (key) {
            case "a": {
                const {ctrlKey} = event;
                if (ctrlKey) {
                    switch (selectby) {
                        case "cell": {
                            const firstRow = this.#firstRow(targetGrid);
                            const firstCell = firstRow ? this.#firstCell(firstRow) : null;
                            const lastRow = this.#lastRow(targetGrid);
                            const lastCell = lastRow ? this.#lastCell(lastRow) : null;
                            if (firstCell && lastCell) {
                                const range = this.#getCellsRange(targetGrid, firstCell, lastCell);
                                if (range) {
                                    this.#setCellsSelection(targetGrid, ...range);
                                }
                            }
                            break;
                        }
                        case "row": {
                            const firstRow = this.#firstRow(targetGrid);
                            const lastRow = this.#lastRow(targetGrid);
                            if (firstRow && lastRow) {
                                const range = this.#getRowsRange(firstRow, lastRow);
                                if (range) {
                                    this.#setRowsSelection(targetGrid, ...range);
                                }
                            }
                            break;
                        }
                    }
                }
                event.preventDefault();
                break;
            }
            case "ArrowLeft": {
                if (selectby == "cell") {
                    if (activeCell) {
                        const previousCell = this.#previousCell(activeCell);
                        if (previousCell) {
                            previousCell.focus({preventScroll: true});
                            const {shiftKey} = event;
                            if (shiftKey) {
                                const selected = gridCellWidget.getSelected(previousCell);
                                selected ?
                                    this.#removeCellsFromSelection(targetGrid, previousCell) :
                                    this.#addCellsToSelection(targetGrid, previousCell);
                            }
                        }
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowRight": {
                if (selectby == "cell") {
                    if (activeCell) {
                        const nextCell = this.#nextCell(activeCell);
                        if (nextCell) {
                            nextCell.focus({preventScroll: true});
                            const {shiftKey} = event;
                            if (shiftKey) {
                                const selected = gridCellWidget.getSelected(nextCell);
                                selected ?
                                    this.#removeCellsFromSelection(targetGrid, nextCell) :
                                    this.#addCellsToSelection(targetGrid, nextCell);
                            }
                        }
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowUp": {
                switch (selectby) {
                    case "cell": {
                        const firstRow = activeRow ?? this.#firstRow(targetGrid);
                        const topCell = activeCell ?
                            this.#topCell(activeCell) :
                            firstRow ?
                            this.#firstCell(firstRow) :
                            null;
                        if (topCell) {
                            topCell.focus({preventScroll: true});
                            const {shiftKey} = event;
                            if (shiftKey) {
                                const selected = gridCellWidget.getSelected(topCell);
                                selected ?
                                    this.#removeCellsFromSelection(targetGrid, topCell) :
                                    this.#addCellsToSelection(targetGrid, topCell);
                            }
                        }
                        break;
                    }
                    case "row": {
                        const previousRow = activeRow ?
                            this.#previousRow(activeRow) :
                            this.#firstRow(targetGrid);
                        if (previousRow) {
                            previousRow.focus({preventScroll: true});
                            const {shiftKey} = event;
                            if (shiftKey) {
                                const selected = gridRowWidget.getSelected(previousRow);
                                selected ?
                                    this.#removeRowsFromSelection(targetGrid, previousRow) :
                                    this.#addRowsToSelection(targetGrid, previousRow);
                            }
                        }
                        break;
                    }
                }
                event.stopPropagation();
                break;
            }
            case "ArrowDown": {
                switch (selectby) {
                    case "cell": {
                        const lastRow = activeRow ?? this.#lastRow(targetGrid);
                        const bottomCell = activeCell ?
                            this.#bottomCell(activeCell) :
                            lastRow ?
                            this.#lastCell(lastRow) :
                            null;
                            if (bottomCell) {
                                bottomCell.focus({preventScroll: true});
                                const {shiftKey} = event;
                                if (shiftKey) {
                                    const selected = gridCellWidget.getSelected(bottomCell);
                                    selected ?
                                        this.#removeCellsFromSelection(targetGrid, bottomCell) :
                                        this.#addCellsToSelection(targetGrid, bottomCell);
                                }
                            }
                        }
                        break;
                    case "row": {
                        const nextRow = activeRow ?
                            this.#nextRow(activeRow) :
                            this.#lastRow(targetGrid);
                        if (nextRow) {
                            nextRow.focus({preventScroll: true});
                            const {shiftKey} = event;
                            if (shiftKey) {
                                const selected = gridRowWidget.getSelected(nextRow);
                                selected ?
                                    this.#removeRowsFromSelection(targetGrid, nextRow) :
                                    this.#addRowsToSelection(targetGrid, nextRow);
                            }
                        }
                        break;
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Home": {
                switch (selectby) {
                    case "cell": {
                        if (activeRow) {
                            const firstCell = this.#firstCell(activeRow);
                            if (firstCell) {
                                firstCell.focus({preventScroll: true});
                            }
                        }
                        break;
                    }
                    case "row": {
                        const firstRow = this.#firstRow(targetGrid);
                        if (firstRow) {
                            firstRow.focus({preventScroll: true});
                        }
                        break;
                    }
                }
                event.stopPropagation();
                break;
            }
            case "End": {
                switch (selectby) {
                    case "cell": {
                        if (activeRow) {
                            const lastCell = this.#lastCell(activeRow);
                            if (lastCell) {
                                lastCell.focus({preventScroll: true});
                            }
                        }
                        break;
                    }
                    case "row": {
                        const lastRow = this.#lastRow(targetGrid);
                        if (lastRow) {
                            lastRow.focus({preventScroll: true});
                        }
                        break;
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Enter": {
                switch (selectby) {
                    case "cell": {
                        if (activeCell) {
                            this.#setCellsSelection(targetGrid, activeCell);
                            activeCell.click();
                        }
                        break;
                    }
                    case "row": {
                        if (activeRow) {
                            this.#setRowsSelection(targetGrid, activeRow);
                            activeRow.click();
                        }
                        break;
                    }
                }
                event.stopPropagation();
                break;
            }
            case "Escape": {
                switch (selectby) {
                    case "cell": {
                        this.#clearCellsSelection(targetGrid);
                        this.#setActiveCell(targetGrid, null);
                        break;
                    }
                    case "row": {
                        this.#clearRowsSelection(targetGrid);
                        this.#setActiveRow(targetGrid, null);
                        break;
                    }
                }
                targetGrid.focus();
                event.stopPropagation();
                break;
            }
        }
    }

    #handleFocusEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetGrid = <HTMLElement>currentTarget;
        const selectby = this.getSelectBy(targetGrid);
        switch (selectby) {
            case "cell": {
                const activeCell = this.#getActiveCell(targetGrid);
                if (activeCell && relatedTarget !== activeCell) {
                    activeCell.focus();
                }
                break;
            }
            case "row": {
                const activeRow = this.#getActiveRow(targetGrid);
                if (activeRow && relatedTarget !== activeRow) {
                    activeRow.focus();
                }
                break;
            }
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {currentTarget, target} = event;
        const targetGrid = <HTMLElement>currentTarget;
        const selectby = this.getSelectBy(targetGrid);
        switch (selectby) {
            case "cell": {
                const targetCell = (<HTMLElement>target).closest<HTMLElement>(".gridcell");
                if (targetCell) {
                    this.#setActiveCell(targetGrid, targetCell);
                }
                break;
            }
            case "row": {
                const targetRow = (<HTMLElement>target).closest<HTMLElement>(".gridrow");
                if (targetRow) {
                    this.#setActiveRow(targetGrid, targetRow);
                }
                break;
            }
        }
    }

    #handleSelectEvent(event: Event): void {
        const {currentTarget} = event;
        const targetList = <HTMLElement>currentTarget;
        if (targetList) {
            if (this.#onSelection.get(targetList)) {
                this.#hasSelectionChanged.set(targetList, true);
            }
            else {
                targetList.dispatchEvent(new Event("selectionchange", {bubbles: true}));
            }
        }
    }
}));