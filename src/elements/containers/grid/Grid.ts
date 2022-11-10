import { DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEGridBodyElement } from "./GridBody";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridHeadElement } from "./GridHead";
import { HTMLEGridRowElement } from "./GridRow";
import { HTMLEGridRowGroupElement } from "./GridRowGroup";

import "./GridBody";
import "./GridHead";
import "./GridRowGroup";
import "./GridRow";
import "./GridCell";

export { HTMLEGridElement };

interface HTMLEGridElementConstructor {
    prototype: HTMLEGridElement;
    new(): HTMLEGridElement;
}

interface HTMLEGridElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly body: HTMLEGridBodyElement | null;
    readonly head: HTMLEGridHeadElement | null
    readonly activeCell: HTMLEGridCellElement | null;
    readonly activeRow: HTMLEGridRowElement | null;
    selectby: "cell" | "row";
    name: string;
    multiselectable: boolean;
    cells(): HTMLEGridCellElement[];
    rows(): HTMLEGridRowElement[];
    beginSelection(): void;
    endSelection(): void;
    clearSelection(): void;
    selectedCells(): HTMLEGridCellElement[];
    selectedRows(): HTMLEGridRowElement[];
}

declare global {
    interface HTMLElementTagNameMap {
        "e-grid": HTMLEGridElement,
    }
}

HTMLEGridHeadElement;
HTMLEGridBodyElement;

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-grid"
})
class HTMLEGridElementBase extends HTMLElement implements HTMLEGridElement {

    readonly shadowRoot!: ShadowRoot;

    cells(): HTMLEGridCellElement[] {
        return Array.from(this.querySelectorAll<HTMLEGridCellElement>(
            "e-gridcell"
        ));
    }

    rows(): HTMLEGridRowElement[] {
        return Array.from(this.querySelectorAll<HTMLEGridRowElement>(
            "e-gridrow"
        ));
    }

    get activeCell(): HTMLEGridCellElement | null {
        return this.querySelector<HTMLEGridCellElement>("e-gridcell[active]");
    }

    get activeRow(): HTMLEGridRowElement | null {
        return this.querySelector<HTMLEGridRowElement>("e-gridrow[active]");
    }

    get body(): HTMLEGridBodyElement | null {
        return this.querySelector<HTMLEGridBodyElement>(":scope > e-gridbody");
    }

    get head(): HTMLEGridHeadElement | null {
        return this.querySelector<HTMLEGridHeadElement>(":scope > e-gridhead");
    }

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String, defaultValue: "cell"})
    selectby!: "cell" | "row";

    @AttributeProperty({type: Boolean})
    multiselectable!: boolean;

    #onSelection: boolean;
    #hasSelectionChanged: boolean;
    #cellsWalker: TreeWalker;
    #rowsWalker: TreeWalker;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: table;
                user-select: none;
                line-height: 22px;
            }
            
            :host(:focus) {
                outline: 1px solid var(--theme-focused-item-outline-color, ${DEFAULT_THEME_FOCUSED_ITEM_OUTLINE_COLOR});
                outline-offset: -1px;
            }
        `;
    }
    
    constructor() {
        super();
        this.#cellsWalker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#cellsWalkerNodeFilter.bind(this)
        );
        this.#rowsWalker = document.createTreeWalker(
            this, NodeFilter.SHOW_ELEMENT, this.#rowsWalkerNodeFilter.bind(this)
        );
        this.#onSelection = false;
        this.#hasSelectionChanged = false;
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.addEventListener("click", this.#handleClickEvent.bind(this));
        this.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this));
        this.addEventListener("dblclick", this.#handleDblClickEvent.bind(this));
        this.addEventListener("focus", this.#handleFocusEvent.bind(this));
        this.addEventListener("focusin", this.#handleFocusInEvent.bind(this));
        this.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        this.addEventListener("select", this.#handleSelectEvent.bind(this));
        shadowRoot.addEventListener("slotchange", this.#handleSlotChangeEvent.bind(this));
    }
    
    connectedCallback(): void {
        const {tabIndex} = this;
        this.tabIndex = tabIndex;
    }
    
    beginSelection(): void {
        this.#onSelection = true;
    }

    endSelection(): void {
        this.#onSelection = false;
        if (this.#hasSelectionChanged) {
            this.dispatchEvent(new Event("selectionchange", {bubbles: true}));
            this.#hasSelectionChanged = false;
        }
    }

    clearSelection(): void {
        this.#clearCellsSelection();
        this.#clearRowsSelection();
    }

    selectedCells(): HTMLEGridCellElement[] {
        return Array.from(this.querySelectorAll("e-gridcell[selected]"));
    }

    selectedRows(): HTMLEGridRowElement[] {
        return Array.from(this.querySelectorAll("e-gridrow[selected]"));
    }

    #cellsWalkerNodeFilter(node: Node): number {
        if (node instanceof HTMLEGridCellElement && !node.hidden) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEGridBodyElement || node instanceof HTMLEGridRowGroupElement || node instanceof HTMLEGridRowElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    #rowsWalkerNodeFilter(node: Node): number {
        if (node instanceof HTMLEGridRowElement && !node.hidden) {
            return NodeFilter.FILTER_ACCEPT;
        }
        if (node instanceof HTMLEGridBodyElement || node instanceof HTMLEGridRowGroupElement) {
            return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_REJECT;
    }

    #getCellsRange(from: HTMLEGridCellElement, to: HTMLEGridCellElement): HTMLEGridCellElement[] {
        const cells = Array.from(this.cells());
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

    #getRowsRange(from: HTMLEGridRowElement, to: HTMLEGridRowElement): HTMLEGridRowElement[] {
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

    #setCellsSelection(...cells: HTMLEGridCellElement[]): void {
        this.beginSelection();
        const selectedCells = this.selectedCells();
        selectedCells.forEach((selectedCell_i) => {
            if (!cells.includes(selectedCell_i)) {
                selectedCell_i.selected = false;
            }
        });
        cells.forEach((cell_i) => {
            if (!cell_i.selected) {
                cell_i.selected = true;
            }
        });
        this.endSelection();
    }

    #setRowsSelection(...rows: HTMLEGridRowElement[]): void {
        this.beginSelection();
        const selectedRows = this.selectedRows();
        selectedRows.forEach((selectedRow_i) => {
            if (!rows.includes(selectedRow_i)) {
                selectedRow_i.selected = false;
            }
        });
        rows.forEach((row_i) => {
            if (!row_i.selected) {
                row_i.selected = true;
            }
        });
        this.endSelection();
    }

    #addCellsToSelection(...cells: HTMLEGridCellElement[]): void {
        this.beginSelection();
        cells.forEach((cell_i) => {
            if (!cell_i.selected) {
                cell_i.selected = true;
            }
        });
        this.endSelection();
    }

    #addRowsToSelection(...rows: HTMLEGridRowElement[]): void {
        this.beginSelection();
        rows.forEach((row_i) => {
            if (!row_i.selected) {
                row_i.selected = true;
            }
        });
        this.endSelection();
    }

    #removeCellsFromSelection(...cells: HTMLEGridCellElement[]): void {
        this.beginSelection();
        const selectedCells = this.selectedCells();
        cells.forEach((cell_i) => {
            if (selectedCells.includes(cell_i)) {
                cell_i.selected = false;
            }
        });
        this.endSelection();
    }

    #removeRowsFromSelection(...rows: HTMLEGridRowElement[]): void {
        this.beginSelection();
        const selectedRows = this.selectedRows();
        rows.forEach((row_i) => {
            if (selectedRows.includes(row_i)) {
                row_i.selected = false;
            }
        });
        this.endSelection();
    }

    #clearCellsSelection(): void {
        this.beginSelection();
        const selectedCells = this.selectedCells();
        selectedCells.forEach((cell_i) => {
            if (cell_i.selected) {
                cell_i.selected = false;
            }
        });
        this.endSelection();
    }

    #clearRowsSelection(): void {
        this.beginSelection();
        const selectedRows = this.selectedRows();
        selectedRows.forEach((row_i) => {
            if (row_i.selected) {
                row_i.selected = false;
            }
        });
        this.endSelection();
    }

    #setActiveCell(cell: HTMLEGridCellElement | null): void {
        const {activeCell} = this;
        if (activeCell !== null && activeCell !== cell) {
            activeCell.active = false;
            activeCell.tabIndex = -1;
        }
        if (cell !== null) {
            const cellsWalker = this.#cellsWalker;
            cellsWalker.currentNode = cell;
            cell.active = true;
            cell.tabIndex = 0;
        }
    }

    #setActiveRow(row: HTMLEGridRowElement | null): void {
        const {activeRow} = this;
        if (activeRow !== null && activeRow !== row) {
            activeRow.active = false;
            activeRow.tabIndex = -1;
        }
        if (row !== null) {
            const rowsWalker = this.#rowsWalker;
            rowsWalker.currentNode = row;
            row.active = true;
            row.tabIndex = 0;
        }
    }

    #firstCell(row: HTMLEGridRowElement): HTMLEGridCellElement | null {
        const cellsWalker = this.#cellsWalker;
        cellsWalker.currentNode = row;
        return <HTMLEGridCellElement | null>cellsWalker.firstChild();
    }

    #lastCell(row: HTMLEGridRowElement): HTMLEGridCellElement | null {
        const cellsWalker = this.#cellsWalker;
        cellsWalker.currentNode = row;
        return <HTMLEGridCellElement | null>cellsWalker.lastChild();
    }

    #previousCell(cell: HTMLEGridCellElement): HTMLEGridCellElement | null {
        const cellsWalker = this.#cellsWalker;
        cellsWalker.currentNode = cell;
        return <HTMLEGridCellElement | null>cellsWalker.previousNode();
    }

    #nextCell(cell: HTMLEGridCellElement): HTMLEGridCellElement | null {
        const cellsWalker = this.#cellsWalker;
        cellsWalker.currentNode = cell;
        return <HTMLEGridCellElement | null>cellsWalker.nextNode();
    }

    #closestRow(cell: HTMLEGridCellElement): HTMLEGridRowElement | null {
        const rowsWalker = this.#rowsWalker;
        rowsWalker.currentNode = cell;
        return <HTMLEGridRowElement | null>rowsWalker.parentNode();
    }

    #firstRow(): HTMLEGridRowElement | null {
        const rowsWalker = this.#rowsWalker;
        const {root} = rowsWalker;
        rowsWalker.currentNode = root;
        return <HTMLEGridRowElement | null>rowsWalker.firstChild();
    }

    #lastRow(): HTMLEGridRowElement | null {
        const rowsWalker = this.#rowsWalker;
        const {root} = rowsWalker;
        rowsWalker.currentNode = root;
        return <HTMLEGridRowElement | null>rowsWalker.lastChild();
    }

    #previousRow(row: HTMLEGridRowElement): HTMLEGridRowElement | null {
        const rowsWalker = this.#rowsWalker;
        rowsWalker.currentNode = row;
        return <HTMLEGridRowElement | null>rowsWalker.previousNode();
    }

    #nextRow(row: HTMLEGridRowElement): HTMLEGridRowElement | null {
        const rowsWalker = this.#rowsWalker;
        rowsWalker.currentNode = row;
        return <HTMLEGridRowElement | null>rowsWalker.nextNode();
    }

    #topCell(cell: HTMLEGridCellElement): HTMLEGridCellElement | null {
        const closestRow = this.#closestRow(cell);
        if (closestRow) {
            const closestRowCells = closestRow.cells();
            const cellIndex = closestRowCells.indexOf(cell);
            const previousRow = this.#previousRow(closestRow);
            if (previousRow) {
                const previousRowCells = previousRow.cells();
                return previousRowCells[
                    Math.min(cellIndex, previousRowCells.length)
                ];
            }
        }
        return null;
    }

    #bottomCell(cell: HTMLEGridCellElement): HTMLEGridCellElement | null {
        const closestRow = this.#closestRow(cell);
        if (closestRow) {
            const closestRowCells = closestRow.cells();
            const cellIndex = closestRowCells.indexOf(cell);
            const nextRow = this.#nextRow(closestRow);
            if (nextRow) {
                const nextRowCells = nextRow.cells();
                return nextRowCells[
                    Math.min(cellIndex, nextRowCells.length)
                ];
            }
        }
        return null;
    }



    #handleClickEvent(event: MouseEvent): void {
        const {ctrlKey, shiftKey} = event;
        const {selectby} = this;
        switch (selectby) {
            case "cell": {
                const composedPath = event.composedPath();
                const targetCell = composedPath.find(
                    target_i => target_i instanceof HTMLEGridBodyElement
                ) ? composedPath.find(
                    target_i => target_i instanceof HTMLEGridCellElement
                ) : null;
                const selectedCells = this.selectedCells();
                if (targetCell instanceof HTMLEGridCellElement) {
                    if (!shiftKey && !ctrlKey) {
                        this.#setCellsSelection(targetCell);
                    }
                    else if (ctrlKey) {
                        !targetCell.selected ?
                            this.#addCellsToSelection(targetCell) :
                            this.#removeCellsFromSelection(targetCell);
                    }
                    else if (shiftKey) {
                        const lastSelectedCell = selectedCells[selectedCells.length - 1];
                        if (lastSelectedCell) {
                            const range = this.#getCellsRange(
                                lastSelectedCell,
                                targetCell
                            );
                            if (range) {
                                selectedCells.includes(targetCell) ?
                                    this.#removeCellsFromSelection(...range) :
                                    this.#addCellsToSelection(...range);
                            }
                        }
                        else {
                            this.#setCellsSelection(targetCell);
                        }
                    }
                }
                break;
            }
            case "row": {
                const selectedRows = this.selectedRows();
                const composedPath = event.composedPath();
                const targetRow = composedPath.find(
                    target_i => target_i instanceof HTMLEGridBodyElement
                ) ? composedPath.find(
                    target_i => target_i instanceof HTMLEGridRowElement
                ) : null;
                if (targetRow instanceof HTMLEGridRowElement) {
                    if (!shiftKey && !ctrlKey) {
                        this.#setRowsSelection(targetRow);
                    }
                    else if (ctrlKey) {
                        !targetRow.selected ?
                            this.#addRowsToSelection(targetRow) :
                            this.#removeRowsFromSelection(targetRow);
                    }
                    else if (shiftKey) {
                        const lastSelectedRow = selectedRows[selectedRows.length - 1];
                        if (lastSelectedRow) {
                            const range = this.#getRowsRange(
                                lastSelectedRow,
                                targetRow
                            );
                            if (range) {
                                selectedRows.includes(targetRow) ?
                                    this.#removeRowsFromSelection(...range) :
                                    this.#addRowsToSelection(...range);
                            }
                        }
                        else {
                            this.#setRowsSelection(targetRow);
                        }
                    }
                }
                break;
            }
        }
        event.stopPropagation();
    }

    #handleContextMenuEvent(event: MouseEvent): void {
        event.stopPropagation();
    }

    #handleDblClickEvent(event: MouseEvent): void {
        event.stopPropagation();
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {key} = event;
        const {selectby, activeCell, activeRow} = this;
        switch (key) {
            case "a": {
                const {ctrlKey} = event;
                if (ctrlKey) {
                    switch (selectby) {
                        case "cell": {
                            const firstRow = this.#firstRow();
                            const firstCell = firstRow ? this.#firstCell(firstRow) : null;
                            const lastRow = this.#lastRow();
                            const lastCell = lastRow ? this.#lastCell(lastRow) : null;
                            if (firstCell && lastCell) {
                                const range = this.#getCellsRange(firstCell, lastCell);
                                if (range) {
                                    this.#setCellsSelection(...range);
                                }
                            }
                            break;
                        }
                        case "row": {
                            const firstRow = this.#firstRow();
                            const lastRow = this.#lastRow();
                            if (firstRow && lastRow) {
                                const range = this.#getRowsRange(firstRow, lastRow);
                                if (range) {
                                    this.#setRowsSelection(...range);
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
                                previousCell.selected ?
                                    this.#removeCellsFromSelection(previousCell) :
                                    this.#addCellsToSelection(previousCell);
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
                                nextCell.selected ?
                                    this.#removeCellsFromSelection(nextCell) :
                                    this.#addCellsToSelection(nextCell);
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
                        const firstRow = activeRow ?? this.#firstRow();
                        const topCell = activeCell ?
                            this.#topCell(activeCell) :
                            firstRow ?
                            this.#firstCell(firstRow) :
                            null;
                        if (topCell) {
                            topCell.focus({preventScroll: true});
                            const {shiftKey} = event;
                            if (shiftKey) {
                                topCell.selected ?
                                    this.#removeCellsFromSelection(topCell) :
                                    this.#addCellsToSelection(topCell);
                            }
                        }
                        break;
                    }
                    case "row": {
                        const previousRow = activeRow ?
                            this.#previousRow(activeRow) :
                            this.#firstRow();
                        if (previousRow) {
                            previousRow.focus({preventScroll: true});
                            const {shiftKey} = event;
                            if (shiftKey) {
                                previousRow.selected ?
                                    this.#removeRowsFromSelection(previousRow) :
                                    this.#addRowsToSelection(previousRow);
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
                        const lastRow = activeRow ?? this.#lastRow();
                        const bottomCell = activeCell ?
                            this.#bottomCell(activeCell) :
                            lastRow ?
                            this.#lastCell(lastRow) :
                            null;
                            if (bottomCell) {
                                bottomCell.focus({preventScroll: true});
                                const {shiftKey} = event;
                                if (shiftKey) {
                                    bottomCell.selected ?
                                        this.#removeCellsFromSelection(bottomCell) :
                                        this.#addCellsToSelection(bottomCell);
                                }
                            }
                        }
                        break;
                    case "row": {
                        const nextRow = activeRow ?
                            this.#nextRow(activeRow) :
                            this.#lastRow();
                        if (nextRow) {
                            nextRow.focus({preventScroll: true});
                            const {shiftKey} = event;
                            if (shiftKey) {
                                nextRow.selected ?
                                    this.#removeRowsFromSelection(nextRow) :
                                    this.#addRowsToSelection(nextRow);
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
                        const firstRow = this.#firstRow();
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
                        const lastRow = this.#lastRow();
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
                            this.#setCellsSelection(activeCell);
                            activeCell.click();
                        }
                        break;
                    }
                    case "row": {
                        if (activeRow) {
                            this.#setRowsSelection(activeRow);
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
                        this.#clearCellsSelection();
                        this.#setActiveCell(null);
                        break;
                    }
                    case "row": {
                        this.#clearRowsSelection();
                        this.#setActiveRow(null);
                        break;
                    }
                }
                this.focus();
                event.stopPropagation();
                break;
            }
        }
    }

    #handleFocusEvent(event: FocusEvent): void {
        const {relatedTarget} = event;
        const {selectby} = this;
        switch (selectby) {
            case "cell": {
                const {activeCell} = this;
                if (activeCell && relatedTarget !== activeCell) {
                    activeCell.focus();
                }
                break;
            }
            case "row": {
                const {activeRow} = this;
                if (activeRow && relatedTarget !== activeRow) {
                    activeRow.focus();
                }
                break;
            }
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const {selectby} = this;
        switch (selectby) {
            case "cell": {
                const targetCell = (<HTMLElement>target).closest<HTMLEGridCellElement>("e-gridcell");
                if (targetCell) {
                    this.#setActiveCell(targetCell);
                }
                break;
            }
            case "row": {
                const targetRow = (<HTMLElement>target).closest<HTMLEGridRowElement>("e-gridrow");
                if (targetRow) {
                    this.#setActiveRow(targetRow);
                }
                break;
            }
        }
    }

    #handleSelectEvent(): void {
        if (this.#onSelection) {
            this.#hasSelectionChanged = true;
        }
        else {
            this.dispatchEvent(new Event("selectionchange", {bubbles: true}));
        }
    }

    #handleSlotChangeEvent(event: Event): void {
        const {target} = event;
        const assignedRows = <HTMLEGridRowElement[]>(<HTMLSlotElement>target)
            .assignedElements()
            .filter(
                element_i => element_i instanceof HTMLEGridRowElement
            );
            assignedRows.forEach((row_i, i) => {
                row_i.posinset = i;
            });
    }
}

var HTMLEGridElement: HTMLEGridElementConstructor = HTMLEGridElementBase;