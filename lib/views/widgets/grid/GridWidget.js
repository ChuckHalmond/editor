var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GridWidgetFactoryBase_instances, _GridWidgetFactoryBase_getActiveRow, _GridWidgetFactoryBase_getActiveCell, _GridWidgetFactoryBase_template, _GridWidgetFactoryBase_rowsWalker, _GridWidgetFactoryBase_cellsWalker, _GridWidgetFactoryBase_onSelection, _GridWidgetFactoryBase_hasSelectionChanged, _GridWidgetFactoryBase_cellsWalkerNodeFilter, _GridWidgetFactoryBase_rowsWalkerNodeFilter, _GridWidgetFactoryBase_getCellsRange, _GridWidgetFactoryBase_getRowsRange, _GridWidgetFactoryBase_setCellsSelection, _GridWidgetFactoryBase_setRowsSelection, _GridWidgetFactoryBase_addCellsToSelection, _GridWidgetFactoryBase_addRowsToSelection, _GridWidgetFactoryBase_removeCellsFromSelection, _GridWidgetFactoryBase_removeRowsFromSelection, _GridWidgetFactoryBase_clearCellsSelection, _GridWidgetFactoryBase_clearRowsSelection, _GridWidgetFactoryBase_setActiveCell, _GridWidgetFactoryBase_setActiveRow, _GridWidgetFactoryBase_firstCell, _GridWidgetFactoryBase_lastCell, _GridWidgetFactoryBase_previousCell, _GridWidgetFactoryBase_nextCell, _GridWidgetFactoryBase_closestRow, _GridWidgetFactoryBase_firstRow, _GridWidgetFactoryBase_lastRow, _GridWidgetFactoryBase_previousRow, _GridWidgetFactoryBase_nextRow, _GridWidgetFactoryBase_topCell, _GridWidgetFactoryBase_bottomCell, _GridWidgetFactoryBase_handleFocusEvent, _GridWidgetFactoryBase_handleFocusInEvent, _GridWidgetFactoryBase_handleFocusOutEvent, _GridWidgetFactoryBase_handleKeyDownEvent, _GridWidgetFactoryBase_handleMouseDownEvent, _GridWidgetFactoryBase_handleSelectEvent, _a;
import { element } from "../../../elements/Element";
import { Widget, WidgetFactory } from "../Widget";
import { gridCellWidget } from "./GridCellWidget";
import { gridRowWidget } from "./GridRowWidget";
export { gridWidget };
var gridWidget = new (Widget({
    name: "grid"
})((_a = class GridWidgetFactoryBase extends WidgetFactory {
        constructor() {
            super();
            _GridWidgetFactoryBase_instances.add(this);
            _GridWidgetFactoryBase_template.set(this, void 0);
            _GridWidgetFactoryBase_rowsWalker.set(this, void 0);
            _GridWidgetFactoryBase_cellsWalker.set(this, void 0);
            _GridWidgetFactoryBase_onSelection.set(this, void 0);
            _GridWidgetFactoryBase_hasSelectionChanged.set(this, void 0);
            __classPrivateFieldSet(this, _GridWidgetFactoryBase_template, element("table", {
                attributes: {
                    class: "grid",
                    role: "grid",
                    tabindex: 0
                }
            }), "f");
            __classPrivateFieldSet(this, _GridWidgetFactoryBase_onSelection, new WeakMap(), "f");
            __classPrivateFieldSet(this, _GridWidgetFactoryBase_hasSelectionChanged, new WeakMap(), "f");
            __classPrivateFieldSet(this, _GridWidgetFactoryBase_cellsWalker, document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_cellsWalkerNodeFilter).bind(this)), "f");
            __classPrivateFieldSet(this, _GridWidgetFactoryBase_rowsWalker, document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_rowsWalkerNodeFilter).bind(this)), "f");
        }
        headers(grid) {
            return Array.from(grid.querySelectorAll(":scope > .gridhead > .gridheader"));
        }
        rows(grid) {
            return Array.from(grid.querySelectorAll(":scope > .gridbody > .gridrow"));
        }
        cells(grid) {
            return Array.from(grid.querySelectorAll(":scope > .gridbody > .gridrow > .gridcell"));
        }
        create(properties) {
            const grid = __classPrivateFieldGet(this, _GridWidgetFactoryBase_template, "f").cloneNode(true);
            //grid.addEventListener("contextmenu", this.#handleContextMenuEvent.bind(this));
            grid.addEventListener("mousedown", __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_handleMouseDownEvent).bind(this));
            grid.addEventListener("focus", __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_handleFocusEvent).bind(this));
            grid.addEventListener("focusin", __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_handleFocusInEvent).bind(this));
            grid.addEventListener("focusout", __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_handleFocusOutEvent).bind(this));
            grid.addEventListener("keydown", __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_handleKeyDownEvent).bind(this));
            grid.addEventListener("select", __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_handleSelectEvent).bind(this));
            if (properties !== undefined) {
                const { id, classList, tabIndex, selectby, multisectable } = properties;
                if (id !== undefined) {
                    grid.id = id;
                }
                if (classList !== undefined) {
                    grid.classList.add(...classList);
                }
                if (tabIndex !== undefined) {
                    grid.tabIndex = tabIndex;
                }
                if (selectby !== undefined) {
                    this.setSelectBy(grid, selectby);
                }
                if (multisectable !== undefined) {
                    this.setMultiSelectable(grid, multisectable);
                }
            }
            return grid;
        }
        slot(grid) {
            return grid;
        }
        setMultiSelectable(grid, value) {
            grid.setAttribute("aria-multiselectable", String(value));
        }
        getMultiSelectable(grid) {
            return JSON.parse(grid.getAttribute("aria-multiselectable") ?? String(false));
        }
        setSelectBy(grid, value) {
            grid.setAttribute("data-selectby", value);
        }
        getSelectBy(grid) {
            return grid.getAttribute("data-selectby") ?? "cell";
        }
        beginSelection(grid) {
            __classPrivateFieldGet(this, _GridWidgetFactoryBase_onSelection, "f").set(grid, true);
        }
        endSelection(grid) {
            __classPrivateFieldGet(this, _GridWidgetFactoryBase_onSelection, "f").set(grid, false);
            if (__classPrivateFieldGet(this, _GridWidgetFactoryBase_hasSelectionChanged, "f").get(grid)) {
                grid.dispatchEvent(new Event("selectionchange", { bubbles: true }));
                __classPrivateFieldGet(this, _GridWidgetFactoryBase_hasSelectionChanged, "f").set(grid, false);
            }
        }
        clearSelection(grid) {
            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_clearCellsSelection).call(this, grid);
            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_clearRowsSelection).call(this, grid);
        }
        selectedCells(grid) {
            return Array.from(grid.querySelectorAll(":scope > .gridbody > .gridrow > .gridcell[aria-selected=true]"));
        }
        selectedRows(grid) {
            return Array.from(grid.querySelectorAll(":scope > .gridbody > .gridrow[aria-selected=true]"));
        }
    },
    _GridWidgetFactoryBase_template = new WeakMap(),
    _GridWidgetFactoryBase_rowsWalker = new WeakMap(),
    _GridWidgetFactoryBase_cellsWalker = new WeakMap(),
    _GridWidgetFactoryBase_onSelection = new WeakMap(),
    _GridWidgetFactoryBase_hasSelectionChanged = new WeakMap(),
    _GridWidgetFactoryBase_instances = new WeakSet(),
    _GridWidgetFactoryBase_getActiveRow = function _GridWidgetFactoryBase_getActiveRow(grid) {
        return grid.querySelector(".gridrow.active");
    },
    _GridWidgetFactoryBase_getActiveCell = function _GridWidgetFactoryBase_getActiveCell(grid) {
        return grid.querySelector(".gridcell.active");
    },
    _GridWidgetFactoryBase_cellsWalkerNodeFilter = function _GridWidgetFactoryBase_cellsWalkerNodeFilter(node) {
        if (node instanceof HTMLElement) {
            const { classList } = node;
            if (classList.contains("gridcell") && !gridCellWidget.getDisabled(node) && !node.hidden) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("gridrow") || classList.contains("gridbody")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    },
    _GridWidgetFactoryBase_rowsWalkerNodeFilter = function _GridWidgetFactoryBase_rowsWalkerNodeFilter(node) {
        if (node instanceof HTMLElement) {
            const { classList } = node;
            if (classList.contains("gridrow") && !gridRowWidget.getDisabled(node) && !node.hidden) {
                return NodeFilter.FILTER_ACCEPT;
            }
            else if (classList.contains("gridbody")) {
                return NodeFilter.FILTER_SKIP;
            }
        }
        return NodeFilter.FILTER_REJECT;
    },
    _GridWidgetFactoryBase_getCellsRange = function _GridWidgetFactoryBase_getCellsRange(from, to) {
        if (from == to) {
            return [from];
        }
        const position = from.compareDocumentPosition(to);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            const range = [from];
            let nextCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_nextCell).call(this, from);
            while (nextCell && nextCell !== to) {
                range.push(nextCell);
                nextCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_nextCell).call(this, nextCell);
            }
            range.push(to);
            return range;
        }
        else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            const range = [from];
            let previousCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_previousCell).call(this, from);
            while (previousCell && previousCell !== to) {
                range.push(previousCell);
                previousCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_previousRow).call(this, previousCell);
            }
            range.push(to);
            return range;
        }
        return [];
    },
    _GridWidgetFactoryBase_getRowsRange = function _GridWidgetFactoryBase_getRowsRange(from, to) {
        if (from == to) {
            return [from];
        }
        const position = from.compareDocumentPosition(to);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
            const range = [from];
            let nextRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_nextRow).call(this, from);
            while (nextRow && nextRow !== to) {
                range.push(nextRow);
                nextRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_nextRow).call(this, nextRow);
            }
            range.push(to);
            return range;
        }
        else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
            const range = [from];
            let previousRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_previousRow).call(this, from);
            while (previousRow && previousRow !== to) {
                range.push(previousRow);
                previousRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_previousRow).call(this, previousRow);
            }
            range.push(to);
            return range;
        }
        return [];
    },
    _GridWidgetFactoryBase_setCellsSelection = function _GridWidgetFactoryBase_setCellsSelection(grid, ...cells) {
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
    },
    _GridWidgetFactoryBase_setRowsSelection = function _GridWidgetFactoryBase_setRowsSelection(grid, ...rows) {
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
    },
    _GridWidgetFactoryBase_addCellsToSelection = function _GridWidgetFactoryBase_addCellsToSelection(grid, ...cells) {
        this.beginSelection(grid);
        cells.forEach((cell_i) => {
            const selected = gridCellWidget.getSelected(cell_i);
            if (!selected) {
                gridCellWidget.setSelected(cell_i, true);
            }
        });
        this.endSelection(grid);
    },
    _GridWidgetFactoryBase_addRowsToSelection = function _GridWidgetFactoryBase_addRowsToSelection(grid, ...rows) {
        this.beginSelection(grid);
        rows.forEach((row_i) => {
            const selected = gridRowWidget.getSelected(row_i);
            if (!selected) {
                gridRowWidget.setSelected(row_i, true);
            }
        });
        this.endSelection(grid);
    },
    _GridWidgetFactoryBase_removeCellsFromSelection = function _GridWidgetFactoryBase_removeCellsFromSelection(grid, ...cells) {
        this.beginSelection(grid);
        const selectedCells = this.selectedCells(grid);
        cells.forEach((cell_i) => {
            if (selectedCells.includes(cell_i)) {
                gridCellWidget.setSelected(cell_i, false);
            }
        });
        this.endSelection(grid);
    },
    _GridWidgetFactoryBase_removeRowsFromSelection = function _GridWidgetFactoryBase_removeRowsFromSelection(grid, ...rows) {
        this.beginSelection(grid);
        const selectedRows = this.selectedRows(grid);
        rows.forEach((row_i) => {
            if (selectedRows.includes(row_i)) {
                gridRowWidget.setSelected(row_i, false);
            }
        });
        this.endSelection(grid);
    },
    _GridWidgetFactoryBase_clearCellsSelection = function _GridWidgetFactoryBase_clearCellsSelection(grid) {
        this.beginSelection(grid);
        const selectedCells = this.selectedCells(grid);
        selectedCells.forEach((cell_i) => {
            const selected = gridCellWidget.getSelected(cell_i);
            if (selected) {
                gridCellWidget.setSelected(cell_i, false);
            }
        });
        this.endSelection(grid);
    },
    _GridWidgetFactoryBase_clearRowsSelection = function _GridWidgetFactoryBase_clearRowsSelection(grid) {
        this.beginSelection(grid);
        const selectedRows = this.selectedRows(grid);
        selectedRows.forEach((row_i) => {
            const selected = gridRowWidget.getSelected(row_i);
            if (selected) {
                gridRowWidget.setSelected(row_i, false);
            }
        });
        this.endSelection(grid);
    },
    _GridWidgetFactoryBase_setActiveCell = function _GridWidgetFactoryBase_setActiveCell(grid, cell) {
        const activeCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getActiveCell).call(this, grid);
        if (activeCell !== null && activeCell !== cell) {
            gridCellWidget.setActive(activeCell, false);
            activeCell.tabIndex = -1;
        }
        if (cell !== null) {
            gridCellWidget.setActive(cell, true);
            cell.tabIndex = 0;
        }
    },
    _GridWidgetFactoryBase_setActiveRow = function _GridWidgetFactoryBase_setActiveRow(grid, row) {
        const activeRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getActiveRow).call(this, grid);
        if (activeRow !== null && activeRow !== row) {
            gridRowWidget.setActive(activeRow, false);
            activeRow.tabIndex = -1;
        }
        if (row !== null) {
            gridCellWidget.setActive(row, true);
            row.tabIndex = 0;
        }
    },
    _GridWidgetFactoryBase_firstCell = function _GridWidgetFactoryBase_firstCell(row) {
        const cellsWalker = __classPrivateFieldGet(this, _GridWidgetFactoryBase_cellsWalker, "f");
        cellsWalker.currentNode = row;
        return cellsWalker.firstChild();
    },
    _GridWidgetFactoryBase_lastCell = function _GridWidgetFactoryBase_lastCell(row) {
        const cellsWalker = __classPrivateFieldGet(this, _GridWidgetFactoryBase_cellsWalker, "f");
        cellsWalker.currentNode = row;
        return cellsWalker.lastChild();
    },
    _GridWidgetFactoryBase_previousCell = function _GridWidgetFactoryBase_previousCell(cell) {
        const cellsWalker = __classPrivateFieldGet(this, _GridWidgetFactoryBase_cellsWalker, "f");
        cellsWalker.currentNode = cell;
        return cellsWalker.previousNode();
    },
    _GridWidgetFactoryBase_nextCell = function _GridWidgetFactoryBase_nextCell(cell) {
        const cellsWalker = __classPrivateFieldGet(this, _GridWidgetFactoryBase_cellsWalker, "f");
        cellsWalker.currentNode = cell;
        return cellsWalker.nextNode();
    },
    _GridWidgetFactoryBase_closestRow = function _GridWidgetFactoryBase_closestRow(cell) {
        const rowsWalker = __classPrivateFieldGet(this, _GridWidgetFactoryBase_rowsWalker, "f");
        rowsWalker.currentNode = cell;
        return rowsWalker.parentNode();
    },
    _GridWidgetFactoryBase_firstRow = function _GridWidgetFactoryBase_firstRow(grid) {
        const rowsWalker = __classPrivateFieldGet(this, _GridWidgetFactoryBase_rowsWalker, "f");
        rowsWalker.currentNode = grid;
        return rowsWalker.firstChild();
    },
    _GridWidgetFactoryBase_lastRow = function _GridWidgetFactoryBase_lastRow(grid) {
        const rowsWalker = __classPrivateFieldGet(this, _GridWidgetFactoryBase_rowsWalker, "f");
        rowsWalker.currentNode = grid;
        return rowsWalker.lastChild();
    },
    _GridWidgetFactoryBase_previousRow = function _GridWidgetFactoryBase_previousRow(row) {
        const rowsWalker = __classPrivateFieldGet(this, _GridWidgetFactoryBase_rowsWalker, "f");
        rowsWalker.currentNode = row;
        return rowsWalker.previousNode();
    },
    _GridWidgetFactoryBase_nextRow = function _GridWidgetFactoryBase_nextRow(row) {
        const rowsWalker = __classPrivateFieldGet(this, _GridWidgetFactoryBase_rowsWalker, "f");
        rowsWalker.currentNode = row;
        return rowsWalker.nextNode();
    },
    _GridWidgetFactoryBase_topCell = function _GridWidgetFactoryBase_topCell(cell) {
        const closestRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_closestRow).call(this, cell);
        if (closestRow) {
            const closestRowCells = gridRowWidget.cells(closestRow);
            const cellIndex = Array.from(closestRowCells.values()).indexOf(cell);
            const previousRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_previousRow).call(this, closestRow);
            if (previousRow) {
                const previousRowCells = gridRowWidget.cells(previousRow);
                return previousRowCells[Math.min(cellIndex, previousRowCells.length)];
            }
        }
        return null;
    },
    _GridWidgetFactoryBase_bottomCell = function _GridWidgetFactoryBase_bottomCell(cell) {
        const closestRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_closestRow).call(this, cell);
        if (closestRow) {
            const closestRowCells = gridRowWidget.cells(closestRow);
            const cellIndex = Array.from(closestRowCells.values()).indexOf(cell);
            const nextRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_nextRow).call(this, closestRow);
            if (nextRow) {
                const nextRowCells = gridRowWidget.cells(nextRow);
                return nextRowCells[Math.min(cellIndex, nextRowCells.length)];
            }
        }
        return null;
    },
    _GridWidgetFactoryBase_handleFocusEvent = function _GridWidgetFactoryBase_handleFocusEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetGrid = currentTarget;
        const selectby = this.getSelectBy(targetGrid);
        switch (selectby) {
            case "cell": {
                const activeCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getActiveCell).call(this, targetGrid);
                if (activeCell && relatedTarget !== activeCell) {
                    activeCell.focus();
                }
                break;
            }
            case "row": {
                const activeRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getActiveRow).call(this, targetGrid);
                if (activeRow && relatedTarget !== activeRow) {
                    activeRow.focus();
                }
                break;
            }
        }
    },
    _GridWidgetFactoryBase_handleFocusInEvent = function _GridWidgetFactoryBase_handleFocusInEvent(event) {
        const { currentTarget, target } = event;
        const targetGrid = currentTarget;
        const selectby = this.getSelectBy(targetGrid);
        switch (selectby) {
            case "cell": {
                const targetCell = target.closest(".gridcell");
                if (targetCell) {
                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setActiveCell).call(this, targetGrid, targetCell);
                }
                break;
            }
            case "row": {
                const targetRow = target.closest(".gridrow");
                if (targetRow) {
                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setActiveRow).call(this, targetGrid, targetRow);
                }
                break;
            }
        }
    },
    _GridWidgetFactoryBase_handleFocusOutEvent = function _GridWidgetFactoryBase_handleFocusOutEvent(event) {
        const { currentTarget, relatedTarget } = event;
        const targetGrid = currentTarget;
        const lostFocusWithin = !targetGrid.contains(relatedTarget);
        if (lostFocusWithin) {
            targetGrid.tabIndex = 0;
        }
    },
    _GridWidgetFactoryBase_handleKeyDownEvent = function _GridWidgetFactoryBase_handleKeyDownEvent(event) {
        const { currentTarget, key } = event;
        const targetGrid = currentTarget;
        const activeCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getActiveCell).call(this, targetGrid);
        const activeRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getActiveRow).call(this, targetGrid);
        const selectby = this.getSelectBy(targetGrid);
        const multiselectable = this.getMultiSelectable(targetGrid);
        switch (key) {
            case "a": {
                const { ctrlKey } = event;
                if (ctrlKey && multiselectable) {
                    switch (selectby) {
                        case "cell": {
                            const firstRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_firstRow).call(this, targetGrid);
                            const firstCell = firstRow ? __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_firstCell).call(this, firstRow) : null;
                            const lastRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_lastRow).call(this, targetGrid);
                            const lastCell = lastRow ? __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_lastCell).call(this, lastRow) : null;
                            if (firstCell && lastCell) {
                                const range = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getCellsRange).call(this, firstCell, lastCell);
                                if (range) {
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setCellsSelection).call(this, targetGrid, ...range);
                                }
                            }
                            break;
                        }
                        case "row": {
                            const firstRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_firstRow).call(this, targetGrid);
                            const lastRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_lastRow).call(this, targetGrid);
                            if (firstRow && lastRow) {
                                const range = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getRowsRange).call(this, firstRow, lastRow);
                                if (range) {
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setRowsSelection).call(this, targetGrid, ...range);
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
                        const previousCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_previousCell).call(this, activeCell);
                        if (previousCell) {
                            previousCell.focus({ preventScroll: true });
                            const { shiftKey } = event;
                            if (shiftKey && multiselectable) {
                                const selected = gridCellWidget.getSelected(previousCell);
                                selected ?
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_removeCellsFromSelection).call(this, targetGrid, previousCell) :
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_addCellsToSelection).call(this, targetGrid, previousCell);
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
                        const nextCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_nextCell).call(this, activeCell);
                        if (nextCell) {
                            nextCell.focus({ preventScroll: true });
                            const { shiftKey } = event;
                            if (shiftKey && multiselectable) {
                                const selected = gridCellWidget.getSelected(nextCell);
                                selected ?
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_removeCellsFromSelection).call(this, targetGrid, nextCell) :
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_addCellsToSelection).call(this, targetGrid, nextCell);
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
                        const firstRow = activeRow ?? __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_firstRow).call(this, targetGrid);
                        const topCell = activeCell ?
                            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_topCell).call(this, activeCell) :
                            firstRow ?
                                __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_firstCell).call(this, firstRow) :
                                null;
                        if (topCell) {
                            topCell.focus({ preventScroll: true });
                            const { shiftKey } = event;
                            if (shiftKey && multiselectable) {
                                const selected = gridCellWidget.getSelected(topCell);
                                selected ?
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_removeCellsFromSelection).call(this, targetGrid, topCell) :
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_addCellsToSelection).call(this, targetGrid, topCell);
                            }
                        }
                        break;
                    }
                    case "row": {
                        const previousRow = activeRow ?
                            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_previousRow).call(this, activeRow) :
                            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_firstRow).call(this, targetGrid);
                        if (previousRow) {
                            previousRow.focus({ preventScroll: true });
                            const { shiftKey } = event;
                            if (shiftKey && multiselectable) {
                                const selected = gridRowWidget.getSelected(previousRow);
                                selected ?
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_removeRowsFromSelection).call(this, targetGrid, previousRow) :
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_addRowsToSelection).call(this, targetGrid, previousRow);
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
                            const lastRow = activeRow ?? __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_lastRow).call(this, targetGrid);
                            const bottomCell = activeCell ?
                                __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_bottomCell).call(this, activeCell) :
                                lastRow ?
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_lastCell).call(this, lastRow) :
                                    null;
                            if (bottomCell) {
                                bottomCell.focus({ preventScroll: true });
                                const { shiftKey } = event;
                                if (shiftKey && multiselectable) {
                                    const selected = gridCellWidget.getSelected(bottomCell);
                                    selected ?
                                        __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_removeCellsFromSelection).call(this, targetGrid, bottomCell) :
                                        __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_addCellsToSelection).call(this, targetGrid, bottomCell);
                                }
                            }
                        }
                        break;
                    case "row": {
                        const nextRow = activeRow ?
                            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_nextRow).call(this, activeRow) :
                            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_lastRow).call(this, targetGrid);
                        if (nextRow) {
                            nextRow.focus({ preventScroll: true });
                            const { shiftKey } = event;
                            if (shiftKey && multiselectable) {
                                const selected = gridRowWidget.getSelected(nextRow);
                                selected ?
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_removeRowsFromSelection).call(this, targetGrid, nextRow) :
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_addRowsToSelection).call(this, targetGrid, nextRow);
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
                            const firstCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_firstCell).call(this, activeRow);
                            if (firstCell) {
                                firstCell.focus({ preventScroll: true });
                            }
                        }
                        break;
                    }
                    case "row": {
                        const firstRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_firstRow).call(this, targetGrid);
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
                            const lastCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_lastCell).call(this, activeRow);
                            if (lastCell) {
                                lastCell.focus({ preventScroll: true });
                            }
                        }
                        break;
                    }
                    case "row": {
                        const lastRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_lastRow).call(this, targetGrid);
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
                            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setCellsSelection).call(this, targetGrid, activeCell);
                            activeCell.click();
                        }
                        break;
                    }
                    case "row": {
                        if (activeRow) {
                            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setRowsSelection).call(this, targetGrid, activeRow);
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
                        __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_clearCellsSelection).call(this, targetGrid);
                        __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setActiveCell).call(this, targetGrid, null);
                        break;
                    }
                    case "row": {
                        __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_clearRowsSelection).call(this, targetGrid);
                        __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setActiveRow).call(this, targetGrid, null);
                        break;
                    }
                }
                targetGrid.focus();
                event.stopPropagation();
                break;
            }
        }
    },
    _GridWidgetFactoryBase_handleMouseDownEvent = function _GridWidgetFactoryBase_handleMouseDownEvent(event) {
        const { currentTarget, target, ctrlKey, shiftKey } = event;
        const targetGrid = currentTarget;
        const selectby = this.getSelectBy(targetGrid);
        const multiselectable = this.getMultiSelectable(targetGrid);
        switch (selectby) {
            case "cell": {
                const targetCell = target.closest(".gridcell");
                if (targetCell) {
                    if (multiselectable) {
                        if (!shiftKey && !ctrlKey) {
                            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setCellsSelection).call(this, targetGrid, targetCell);
                        }
                        else if (ctrlKey) {
                            const selected = gridCellWidget.getSelected(targetCell);
                            !selected ?
                                __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_addCellsToSelection).call(this, targetGrid, targetCell) :
                                __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_removeCellsFromSelection).call(this, targetGrid, targetCell);
                            event.stopPropagation();
                        }
                        else if (shiftKey) {
                            const activeCell = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getActiveCell).call(this, targetGrid);
                            if (activeCell) {
                                const range = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getCellsRange).call(this, activeCell, targetCell);
                                if (range) {
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setCellsSelection).call(this, targetGrid, ...range);
                                }
                            }
                            event.stopPropagation();
                        }
                    }
                    else {
                        __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setCellsSelection).call(this, targetGrid, targetCell);
                    }
                    event.stopPropagation();
                }
                break;
            }
            case "row": {
                const targetRow = target.closest(".gridrow");
                if (targetRow) {
                    if (multiselectable) {
                        if (!shiftKey && !ctrlKey) {
                            __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setRowsSelection).call(this, targetGrid, targetRow);
                        }
                        else if (ctrlKey) {
                            const selected = gridRowWidget.getSelected(targetRow);
                            !selected ?
                                __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_addRowsToSelection).call(this, targetGrid, targetRow) :
                                __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_removeRowsFromSelection).call(this, targetGrid, targetRow);
                            event.stopPropagation();
                        }
                        else if (shiftKey) {
                            const activeRow = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getActiveRow).call(this, targetGrid);
                            if (activeRow) {
                                const range = __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_getRowsRange).call(this, activeRow, targetRow);
                                if (range) {
                                    __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setRowsSelection).call(this, targetGrid, ...range);
                                }
                            }
                            event.stopPropagation();
                        }
                    }
                    else {
                        __classPrivateFieldGet(this, _GridWidgetFactoryBase_instances, "m", _GridWidgetFactoryBase_setRowsSelection).call(this, targetGrid, targetRow);
                    }
                    event.stopPropagation();
                }
                break;
            }
        }
    },
    _GridWidgetFactoryBase_handleSelectEvent = function _GridWidgetFactoryBase_handleSelectEvent(event) {
        const { currentTarget } = event;
        const targetList = currentTarget;
        if (targetList) {
            if (__classPrivateFieldGet(this, _GridWidgetFactoryBase_onSelection, "f").get(targetList)) {
                __classPrivateFieldGet(this, _GridWidgetFactoryBase_hasSelectionChanged, "f").set(targetList, true);
            }
            else {
                targetList.dispatchEvent(new Event("selectionchange", { bubbles: true }));
            }
        }
    },
    _a)));
//# sourceMappingURL=GridWidget.js.map