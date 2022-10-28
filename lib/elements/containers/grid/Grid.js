var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _HTMLEGridElementBase_instances, _HTMLEGridElementBase_onSelection, _HTMLEGridElementBase_hasSelectionChanged, _HTMLEGridElementBase_cellsWalker, _HTMLEGridElementBase_rowsWalker, _HTMLEGridElementBase_cellsWalkerNodeFilter, _HTMLEGridElementBase_rowsWalkerNodeFilter, _HTMLEGridElementBase_getCellsRange, _HTMLEGridElementBase_getRowsRange, _HTMLEGridElementBase_setCellsSelection, _HTMLEGridElementBase_setRowsSelection, _HTMLEGridElementBase_addCellsToSelection, _HTMLEGridElementBase_addRowsToSelection, _HTMLEGridElementBase_removeCellsFromSelection, _HTMLEGridElementBase_removeRowsFromSelection, _HTMLEGridElementBase_clearCellsSelection, _HTMLEGridElementBase_clearRowsSelection, _HTMLEGridElementBase_setActiveCell, _HTMLEGridElementBase_setActiveRow, _HTMLEGridElementBase_firstCell, _HTMLEGridElementBase_lastCell, _HTMLEGridElementBase_previousCell, _HTMLEGridElementBase_nextCell, _HTMLEGridElementBase_closestRow, _HTMLEGridElementBase_firstRow, _HTMLEGridElementBase_lastRow, _HTMLEGridElementBase_previousRow, _HTMLEGridElementBase_nextRow, _HTMLEGridElementBase_topCell, _HTMLEGridElementBase_bottomCell, _HTMLEGridElementBase_handleClickEvent, _HTMLEGridElementBase_handleContextMenuEvent, _HTMLEGridElementBase_handleDblClickEvent, _HTMLEGridElementBase_handleKeyDownEvent, _HTMLEGridElementBase_handleFocusEvent, _HTMLEGridElementBase_handleFocusInEvent, _HTMLEGridElementBase_handleSelectEvent, _HTMLEGridElementBase_handleSlotChangeEvent;
import { CustomElement, AttributeProperty, element } from "../../Element";
import { HTMLEGridBodyElement } from "./GridBody";
import { HTMLEGridCellElement } from "./GridCell";
import { HTMLEGridHeadElement } from "./GridHead";
import { HTMLEGridRowElement } from "./GridRow";
import { HTMLEGridRowGroupElement } from "./GridRowGroup";
export { HTMLEGridElement };
HTMLEGridHeadElement;
HTMLEGridBodyElement;
var shadowTemplate;
var style;
let HTMLEGridElementBase = class HTMLEGridElementBase extends HTMLElement {
    constructor() {
        super();
        _HTMLEGridElementBase_instances.add(this);
        _HTMLEGridElementBase_onSelection.set(this, void 0);
        _HTMLEGridElementBase_hasSelectionChanged.set(this, void 0);
        _HTMLEGridElementBase_cellsWalker.set(this, void 0);
        _HTMLEGridElementBase_rowsWalker.set(this, void 0);
        __classPrivateFieldSet(this, _HTMLEGridElementBase_cellsWalker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_cellsWalkerNodeFilter).bind(this)), "f");
        __classPrivateFieldSet(this, _HTMLEGridElementBase_rowsWalker, document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_rowsWalkerNodeFilter).bind(this)), "f");
        __classPrivateFieldSet(this, _HTMLEGridElementBase_onSelection, false, "f");
        __classPrivateFieldSet(this, _HTMLEGridElementBase_hasSelectionChanged, false, "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(shadowTemplate.content.cloneNode(true));
        this.addEventListener("click", __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_handleClickEvent).bind(this));
        this.addEventListener("contextmenu", __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_handleContextMenuEvent).bind(this));
        this.addEventListener("dblclick", __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_handleDblClickEvent).bind(this));
        this.addEventListener("focus", __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_handleFocusEvent).bind(this));
        this.addEventListener("focusin", __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_handleFocusInEvent).bind(this));
        this.addEventListener("keydown", __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_handleKeyDownEvent).bind(this));
        this.addEventListener("select", __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_handleSelectEvent).bind(this));
        shadowRoot.addEventListener("slotchange", __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_handleSlotChangeEvent).bind(this));
    }
    cells() {
        return Array.from(this.querySelectorAll("e-gridcell"));
    }
    rows() {
        return Array.from(this.querySelectorAll("e-gridrow"));
    }
    get activeCell() {
        return this.querySelector("e-gridcell[active]");
    }
    get activeRow() {
        return this.querySelector("e-gridrow[active]");
    }
    get body() {
        return this.querySelector(":scope > e-gridbody");
    }
    get head() {
        return this.querySelector(":scope > e-gridhead");
    }
    connectedCallback() {
        const { tabIndex } = this;
        this.tabIndex = tabIndex;
    }
    beginSelection() {
        __classPrivateFieldSet(this, _HTMLEGridElementBase_onSelection, true, "f");
    }
    endSelection() {
        __classPrivateFieldSet(this, _HTMLEGridElementBase_onSelection, false, "f");
        if (__classPrivateFieldGet(this, _HTMLEGridElementBase_hasSelectionChanged, "f")) {
            this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
            __classPrivateFieldSet(this, _HTMLEGridElementBase_hasSelectionChanged, false, "f");
        }
    }
    clearSelection() {
        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_clearCellsSelection).call(this);
        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_clearRowsSelection).call(this);
    }
    selectedCells() {
        return Array.from(this.querySelectorAll("e-gridcell[selected]"));
    }
    selectedRows() {
        return Array.from(this.querySelectorAll("e-gridrow[selected]"));
    }
};
_HTMLEGridElementBase_onSelection = new WeakMap(), _HTMLEGridElementBase_hasSelectionChanged = new WeakMap(), _HTMLEGridElementBase_cellsWalker = new WeakMap(), _HTMLEGridElementBase_rowsWalker = new WeakMap(), _HTMLEGridElementBase_instances = new WeakSet(), _HTMLEGridElementBase_cellsWalkerNodeFilter = function _HTMLEGridElementBase_cellsWalkerNodeFilter(node) {
    if (node instanceof HTMLEGridCellElement && !node.hidden) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEGridBodyElement || node instanceof HTMLEGridRowGroupElement || node instanceof HTMLEGridRowElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLEGridElementBase_rowsWalkerNodeFilter = function _HTMLEGridElementBase_rowsWalkerNodeFilter(node) {
    if (node instanceof HTMLEGridRowElement && !node.hidden) {
        return NodeFilter.FILTER_ACCEPT;
    }
    if (node instanceof HTMLEGridBodyElement || node instanceof HTMLEGridRowGroupElement) {
        return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_REJECT;
}, _HTMLEGridElementBase_getCellsRange = function _HTMLEGridElementBase_getCellsRange(from, to) {
    const cells = Array.from(this.cells());
    const fromIndex = cells.indexOf(from);
    const toIndex = cells.indexOf(to);
    if (fromIndex > -1 && toIndex > -1) {
        if (from == to) {
            return [from];
        }
        return cells.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1);
    }
    return [];
}, _HTMLEGridElementBase_getRowsRange = function _HTMLEGridElementBase_getRowsRange(from, to) {
    if (from == to) {
        return [from];
    }
    const position = from.compareDocumentPosition(to);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        const range = [from];
        let nextVisibleRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_nextRow).call(this, from);
        while (nextVisibleRow && nextVisibleRow !== to) {
            range.push(nextVisibleRow);
            nextVisibleRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_nextRow).call(this, nextVisibleRow);
        }
        range.push(to);
        return range;
    }
    else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        const range = [from];
        let previousVisibleRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_previousRow).call(this, from);
        while (previousVisibleRow && previousVisibleRow !== to) {
            range.push(previousVisibleRow);
            previousVisibleRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_previousRow).call(this, previousVisibleRow);
        }
        range.push(to);
        return range;
    }
    return [];
}, _HTMLEGridElementBase_setCellsSelection = function _HTMLEGridElementBase_setCellsSelection(...cells) {
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
}, _HTMLEGridElementBase_setRowsSelection = function _HTMLEGridElementBase_setRowsSelection(...rows) {
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
}, _HTMLEGridElementBase_addCellsToSelection = function _HTMLEGridElementBase_addCellsToSelection(...cells) {
    this.beginSelection();
    cells.forEach((cell_i) => {
        if (!cell_i.selected) {
            cell_i.selected = true;
        }
    });
    this.endSelection();
}, _HTMLEGridElementBase_addRowsToSelection = function _HTMLEGridElementBase_addRowsToSelection(...rows) {
    this.beginSelection();
    rows.forEach((row_i) => {
        if (!row_i.selected) {
            row_i.selected = true;
        }
    });
    this.endSelection();
}, _HTMLEGridElementBase_removeCellsFromSelection = function _HTMLEGridElementBase_removeCellsFromSelection(...cells) {
    this.beginSelection();
    const selectedCells = this.selectedCells();
    cells.forEach((cell_i) => {
        if (selectedCells.includes(cell_i)) {
            cell_i.selected = false;
        }
    });
    this.endSelection();
}, _HTMLEGridElementBase_removeRowsFromSelection = function _HTMLEGridElementBase_removeRowsFromSelection(...rows) {
    this.beginSelection();
    const selectedRows = this.selectedRows();
    rows.forEach((row_i) => {
        if (selectedRows.includes(row_i)) {
            row_i.selected = false;
        }
    });
    this.endSelection();
}, _HTMLEGridElementBase_clearCellsSelection = function _HTMLEGridElementBase_clearCellsSelection() {
    this.beginSelection();
    const selectedCells = this.selectedCells();
    selectedCells.forEach((cell_i) => {
        if (cell_i.selected) {
            cell_i.selected = false;
        }
    });
    this.endSelection();
}, _HTMLEGridElementBase_clearRowsSelection = function _HTMLEGridElementBase_clearRowsSelection() {
    this.beginSelection();
    const selectedRows = this.selectedRows();
    selectedRows.forEach((row_i) => {
        if (row_i.selected) {
            row_i.selected = false;
        }
    });
    this.endSelection();
}, _HTMLEGridElementBase_setActiveCell = function _HTMLEGridElementBase_setActiveCell(cell) {
    const { activeCell } = this;
    if (activeCell !== null && activeCell !== cell) {
        activeCell.active = false;
        activeCell.tabIndex = -1;
    }
    if (cell !== null) {
        const cellsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_cellsWalker, "f");
        cellsWalker.currentNode = cell;
        cell.active = true;
        cell.tabIndex = 0;
    }
}, _HTMLEGridElementBase_setActiveRow = function _HTMLEGridElementBase_setActiveRow(row) {
    const { activeRow } = this;
    if (activeRow !== null && activeRow !== row) {
        activeRow.active = false;
        activeRow.tabIndex = -1;
    }
    if (row !== null) {
        const rowsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_rowsWalker, "f");
        rowsWalker.currentNode = row;
        row.active = true;
        row.tabIndex = 0;
    }
}, _HTMLEGridElementBase_firstCell = function _HTMLEGridElementBase_firstCell(row) {
    const cellsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_cellsWalker, "f");
    cellsWalker.currentNode = row;
    return cellsWalker.firstChild();
}, _HTMLEGridElementBase_lastCell = function _HTMLEGridElementBase_lastCell(row) {
    const cellsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_cellsWalker, "f");
    cellsWalker.currentNode = row;
    return cellsWalker.lastChild();
}, _HTMLEGridElementBase_previousCell = function _HTMLEGridElementBase_previousCell(cell) {
    const cellsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_cellsWalker, "f");
    cellsWalker.currentNode = cell;
    return cellsWalker.previousNode();
}, _HTMLEGridElementBase_nextCell = function _HTMLEGridElementBase_nextCell(cell) {
    const cellsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_cellsWalker, "f");
    cellsWalker.currentNode = cell;
    return cellsWalker.nextNode();
}, _HTMLEGridElementBase_closestRow = function _HTMLEGridElementBase_closestRow(cell) {
    const rowsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_rowsWalker, "f");
    rowsWalker.currentNode = cell;
    return rowsWalker.parentNode();
}, _HTMLEGridElementBase_firstRow = function _HTMLEGridElementBase_firstRow() {
    const rowsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_rowsWalker, "f");
    const { root } = rowsWalker;
    rowsWalker.currentNode = root;
    return rowsWalker.firstChild();
}, _HTMLEGridElementBase_lastRow = function _HTMLEGridElementBase_lastRow() {
    const rowsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_rowsWalker, "f");
    const { root } = rowsWalker;
    rowsWalker.currentNode = root;
    return rowsWalker.lastChild();
}, _HTMLEGridElementBase_previousRow = function _HTMLEGridElementBase_previousRow(row) {
    const rowsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_rowsWalker, "f");
    rowsWalker.currentNode = row;
    return rowsWalker.previousNode();
}, _HTMLEGridElementBase_nextRow = function _HTMLEGridElementBase_nextRow(row) {
    const rowsWalker = __classPrivateFieldGet(this, _HTMLEGridElementBase_rowsWalker, "f");
    rowsWalker.currentNode = row;
    return rowsWalker.nextNode();
}, _HTMLEGridElementBase_topCell = function _HTMLEGridElementBase_topCell(cell) {
    const closestRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_closestRow).call(this, cell);
    if (closestRow) {
        const closestRowCells = closestRow.cells();
        const cellIndex = closestRowCells.indexOf(cell);
        const previousRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_previousRow).call(this, closestRow);
        if (previousRow) {
            const previousRowCells = previousRow.cells();
            return previousRowCells[Math.min(cellIndex, previousRowCells.length)];
        }
    }
    return null;
}, _HTMLEGridElementBase_bottomCell = function _HTMLEGridElementBase_bottomCell(cell) {
    const closestRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_closestRow).call(this, cell);
    if (closestRow) {
        const closestRowCells = closestRow.cells();
        const cellIndex = closestRowCells.indexOf(cell);
        const nextRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_nextRow).call(this, closestRow);
        if (nextRow) {
            const nextRowCells = nextRow.cells();
            return nextRowCells[Math.min(cellIndex, nextRowCells.length)];
        }
    }
    return null;
}, _HTMLEGridElementBase_handleClickEvent = function _HTMLEGridElementBase_handleClickEvent(event) {
    const { ctrlKey, shiftKey } = event;
    const { selectby } = this;
    switch (selectby) {
        case "cell": {
            const composedPath = event.composedPath();
            const targetCell = composedPath.find(target_i => target_i instanceof HTMLEGridBodyElement) ? composedPath.find(target_i => target_i instanceof HTMLEGridCellElement) : null;
            const selectedCells = this.selectedCells();
            if (targetCell instanceof HTMLEGridCellElement) {
                if (!shiftKey && !ctrlKey) {
                    __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setCellsSelection).call(this, targetCell);
                }
                else if (ctrlKey) {
                    !targetCell.selected ?
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addCellsToSelection).call(this, targetCell) :
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeCellsFromSelection).call(this, targetCell);
                }
                else if (shiftKey) {
                    const lastSelectedCell = selectedCells[selectedCells.length - 1];
                    if (lastSelectedCell) {
                        const range = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_getCellsRange).call(this, lastSelectedCell, targetCell);
                        if (range) {
                            selectedCells.includes(targetCell) ?
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeCellsFromSelection).call(this, ...range) :
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addCellsToSelection).call(this, ...range);
                        }
                    }
                    else {
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setCellsSelection).call(this, targetCell);
                    }
                }
            }
            break;
        }
        case "row": {
            const selectedRows = this.selectedRows();
            const composedPath = event.composedPath();
            const targetRow = composedPath.find(target_i => target_i instanceof HTMLEGridBodyElement) ? composedPath.find(target_i => target_i instanceof HTMLEGridRowElement) : null;
            if (targetRow instanceof HTMLEGridRowElement) {
                if (!shiftKey && !ctrlKey) {
                    __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setRowsSelection).call(this, targetRow);
                }
                else if (ctrlKey) {
                    !targetRow.selected ?
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addRowsToSelection).call(this, targetRow) :
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeRowsFromSelection).call(this, targetRow);
                }
                else if (shiftKey) {
                    const lastSelectedRow = selectedRows[selectedRows.length - 1];
                    if (lastSelectedRow) {
                        const range = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_getRowsRange).call(this, lastSelectedRow, targetRow);
                        if (range) {
                            selectedRows.includes(targetRow) ?
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeRowsFromSelection).call(this, ...range) :
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addRowsToSelection).call(this, ...range);
                        }
                    }
                    else {
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setRowsSelection).call(this, targetRow);
                    }
                }
            }
            break;
        }
    }
    event.stopPropagation();
}, _HTMLEGridElementBase_handleContextMenuEvent = function _HTMLEGridElementBase_handleContextMenuEvent(event) {
    event.stopPropagation();
}, _HTMLEGridElementBase_handleDblClickEvent = function _HTMLEGridElementBase_handleDblClickEvent(event) {
    event.stopPropagation();
}, _HTMLEGridElementBase_handleKeyDownEvent = function _HTMLEGridElementBase_handleKeyDownEvent(event) {
    const { key } = event;
    const { selectby, activeCell, activeRow } = this;
    switch (key) {
        case "a": {
            const { ctrlKey } = event;
            if (ctrlKey) {
                switch (selectby) {
                    case "cell": {
                        const firstRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_firstRow).call(this);
                        const firstCell = firstRow ? __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_firstCell).call(this, firstRow) : null;
                        const lastRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_lastRow).call(this);
                        const lastCell = lastRow ? __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_lastCell).call(this, lastRow) : null;
                        if (firstCell && lastCell) {
                            const range = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_getCellsRange).call(this, firstCell, lastCell);
                            if (range) {
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setCellsSelection).call(this, ...range);
                            }
                        }
                        break;
                    }
                    case "row": {
                        const firstRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_firstRow).call(this);
                        const lastRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_lastRow).call(this);
                        if (firstRow && lastRow) {
                            const range = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_getRowsRange).call(this, firstRow, lastRow);
                            if (range) {
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setRowsSelection).call(this, ...range);
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
                    const previousCell = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_previousCell).call(this, activeCell);
                    if (previousCell) {
                        previousCell.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            previousCell.selected ?
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeCellsFromSelection).call(this, previousCell) :
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addCellsToSelection).call(this, previousCell);
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
                    const nextCell = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_nextCell).call(this, activeCell);
                    if (nextCell) {
                        nextCell.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            nextCell.selected ?
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeCellsFromSelection).call(this, nextCell) :
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addCellsToSelection).call(this, nextCell);
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
                    const firstRow = activeRow ?? __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_firstRow).call(this);
                    const topCell = activeCell ?
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_topCell).call(this, activeCell) :
                        firstRow ?
                            __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_firstCell).call(this, firstRow) :
                            null;
                    if (topCell) {
                        topCell.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            topCell.selected ?
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeCellsFromSelection).call(this, topCell) :
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addCellsToSelection).call(this, topCell);
                        }
                    }
                    break;
                }
                case "row": {
                    const previousRow = activeRow ?
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_previousRow).call(this, activeRow) :
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_firstRow).call(this);
                    if (previousRow) {
                        previousRow.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            previousRow.selected ?
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeRowsFromSelection).call(this, previousRow) :
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addRowsToSelection).call(this, previousRow);
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
                case "cell":
                    {
                        const lastRow = activeRow ?? __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_lastRow).call(this);
                        const bottomCell = activeCell ?
                            __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_bottomCell).call(this, activeCell) :
                            lastRow ?
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_lastCell).call(this, lastRow) :
                                null;
                        if (bottomCell) {
                            bottomCell.focus({ preventScroll: true });
                            const { shiftKey } = event;
                            if (shiftKey) {
                                bottomCell.selected ?
                                    __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeCellsFromSelection).call(this, bottomCell) :
                                    __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addCellsToSelection).call(this, bottomCell);
                            }
                        }
                    }
                    break;
                case "row": {
                    const nextRow = activeRow ?
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_nextRow).call(this, activeRow) :
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_lastRow).call(this);
                    if (nextRow) {
                        nextRow.focus({ preventScroll: true });
                        const { shiftKey } = event;
                        if (shiftKey) {
                            nextRow.selected ?
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_removeRowsFromSelection).call(this, nextRow) :
                                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_addRowsToSelection).call(this, nextRow);
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
                        const firstCell = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_firstCell).call(this, activeRow);
                        if (firstCell) {
                            firstCell.focus({ preventScroll: true });
                        }
                    }
                    break;
                }
                case "row": {
                    const firstRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_firstRow).call(this);
                    if (firstRow) {
                        firstRow.focus({ preventScroll: true });
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
                        const lastCell = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_lastCell).call(this, activeRow);
                        if (lastCell) {
                            lastCell.focus({ preventScroll: true });
                        }
                    }
                    break;
                }
                case "row": {
                    const lastRow = __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_lastRow).call(this);
                    if (lastRow) {
                        lastRow.focus({ preventScroll: true });
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
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setCellsSelection).call(this, activeCell);
                        activeCell.click();
                    }
                    break;
                }
                case "row": {
                    if (activeRow) {
                        __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setRowsSelection).call(this, activeRow);
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
                    __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_clearCellsSelection).call(this);
                    __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setActiveCell).call(this, null);
                    break;
                }
                case "row": {
                    __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_clearRowsSelection).call(this);
                    __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setActiveRow).call(this, null);
                    break;
                }
            }
            this.focus();
            event.stopPropagation();
            break;
        }
    }
}, _HTMLEGridElementBase_handleFocusEvent = function _HTMLEGridElementBase_handleFocusEvent(event) {
    const { relatedTarget } = event;
    const { selectby } = this;
    switch (selectby) {
        case "cell": {
            const { activeCell } = this;
            if (activeCell && relatedTarget !== activeCell) {
                activeCell.focus();
            }
            break;
        }
        case "row": {
            const { activeRow } = this;
            if (activeRow && relatedTarget !== activeRow) {
                activeRow.focus();
            }
            break;
        }
    }
}, _HTMLEGridElementBase_handleFocusInEvent = function _HTMLEGridElementBase_handleFocusInEvent(event) {
    const { target } = event;
    const { selectby } = this;
    switch (selectby) {
        case "cell": {
            const targetCell = target.closest("e-gridcell");
            if (targetCell) {
                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setActiveCell).call(this, targetCell);
            }
            break;
        }
        case "row": {
            const targetRow = target.closest("e-gridrow");
            if (targetRow) {
                __classPrivateFieldGet(this, _HTMLEGridElementBase_instances, "m", _HTMLEGridElementBase_setActiveRow).call(this, targetRow);
            }
            break;
        }
    }
}, _HTMLEGridElementBase_handleSelectEvent = function _HTMLEGridElementBase_handleSelectEvent() {
    if (__classPrivateFieldGet(this, _HTMLEGridElementBase_onSelection, "f")) {
        __classPrivateFieldSet(this, _HTMLEGridElementBase_hasSelectionChanged, true, "f");
    }
    else {
        this.dispatchEvent(new Event("selectionchange", { bubbles: true }));
    }
}, _HTMLEGridElementBase_handleSlotChangeEvent = function _HTMLEGridElementBase_handleSlotChangeEvent(event) {
    const { target } = event;
    const assignedRows = target
        .assignedElements()
        .filter(element_i => element_i instanceof HTMLEGridRowElement);
    assignedRows.forEach((row_i, i) => {
        row_i.posinset = i;
    });
};
(() => {
    shadowTemplate = element("template");
    shadowTemplate.content.append(element("slot"));
    style = /*css*/ `
            :host {
                display: table;
                user-select: none;
                line-height: 22px;
            }
            
            :host(:focus) {
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
            }
        `;
})();
__decorate([
    AttributeProperty({ type: String })
], HTMLEGridElementBase.prototype, "name", void 0);
__decorate([
    AttributeProperty({ type: String, defaultValue: "cell" })
], HTMLEGridElementBase.prototype, "selectby", void 0);
__decorate([
    AttributeProperty({ type: Boolean })
], HTMLEGridElementBase.prototype, "multiselectable", void 0);
HTMLEGridElementBase = __decorate([
    CustomElement({
        name: "e-grid"
    })
], HTMLEGridElementBase);
var HTMLEGridElement = HTMLEGridElementBase;
//# sourceMappingURL=Grid.js.map