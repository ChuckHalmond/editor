var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var _GridViewBase_instances, _GridViewBase_columnDelegate, _GridViewBase_cellDelegate, _GridViewBase_displayFilters, _GridViewBase_searchFilter, _GridViewBase_filter, _GridViewBase_renderGridColumnHeaderCell, _GridViewBase_renderGridBodyRow, _GridViewBase_renderGridDataCell, _GridViewBase_handleHeadContextMenuEvent, _GridViewBase_handleSearchInputEvent, _GridViewBase_handleHeadClickEvent;
import { element, reactiveChildElements, CustomElement, fragment, AttributeProperty, reactiveElement } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";
export { GridModel };
export { GridRowModel };
export { GridColumnModel };
export { GridView };
class GridModel extends ModelObject {
    constructor(init) {
        super();
        const { rows: initRows = [], columns: initColumns = [] } = init ?? {};
        const rows = new ModelList(initRows);
        rows.setParent(this);
        this.rows = rows;
        const columns = new ModelList(initColumns);
        columns.setParent(this);
        this.columns = columns;
    }
    getColumnByName(name) {
        return Array.from(this.columns.values()).find(column_i => column_i.name == name) ?? null;
    }
    sortByColumn(column, sortOrder) {
        Array.from(this.columns.values()).forEach((column_i) => {
            column_i.sortorder = column_i === column ? sortOrder : undefined;
        });
        const sortTest = (() => {
            const { type } = column;
            switch (type) {
                case String: {
                    return (row_1, row_2) => {
                        const cell_1 = String(column.extract(row_1));
                        const cell_2 = String(column.extract(row_2));
                        return sortOrder * cell_1.localeCompare(cell_2);
                    };
                }
                default: {
                    return (row_1, row_2) => {
                        const cell_1 = Number(column.extract(row_1));
                        const cell_2 = Number(column.extract(row_2));
                        return Math.sign(sortOrder * (cell_1 - cell_2));
                    };
                }
            }
        })();
        this.rows.sort(sortTest);
    }
}
class GridColumnModel extends ModelObject {
    constructor(init) {
        super();
        const { name, type, label, extract, filters = [] } = init;
        this.name = name;
        this.type = type;
        this.label = label;
        this.extract = extract;
        this.filters = filters;
    }
}
__decorate([
    ModelProperty()
], GridColumnModel.prototype, "sortorder", void 0);
class GridRowModel extends ModelObject {
    constructor(init) {
        super();
        const { id, name, age } = init;
        this.id = id;
        this.name = name;
        this.age = age;
    }
}
__decorate([
    ModelProperty()
], GridRowModel.prototype, "name", void 0);
__decorate([
    ModelProperty()
], GridRowModel.prototype, "age", void 0);
var style;
let GridViewBase = class GridViewBase extends View {
    constructor(model) {
        super();
        _GridViewBase_instances.add(this);
        _GridViewBase_columnDelegate.set(this, void 0);
        _GridViewBase_cellDelegate.set(this, void 0);
        _GridViewBase_displayFilters.set(this, void 0);
        _GridViewBase_searchFilter.set(this, void 0);
        __classPrivateFieldSet(this, _GridViewBase_displayFilters, [], "f");
        __classPrivateFieldSet(this, _GridViewBase_searchFilter, null, "f");
        __classPrivateFieldSet(this, _GridViewBase_cellDelegate, (row, column) => element("label", {
            children: column.extract(row)
        }), "f");
        __classPrivateFieldSet(this, _GridViewBase_columnDelegate, (column) => element("label", {
            children: column.label
        }), "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        this.setModel(model ?? new GridModel());
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "resizable":
            case "sortable": {
                this.render();
                break;
            }
        }
    }
    get gridElement() {
        return this.shadowRoot.querySelector("e-grid");
    }
    setColumnDelegate(delegate) {
        __classPrivateFieldSet(this, _GridViewBase_columnDelegate, delegate, "f");
    }
    setCellDelegate(delegate) {
        __classPrivateFieldSet(this, _GridViewBase_cellDelegate, delegate, "f");
    }
    getRowElement(row) {
        return this.shadowRoot.querySelector(`e-grid > e-gridbody > e-gridrow[data-index='${row.id}']`);
    }
    getColumnHeaderElement(column) {
        return this.shadowRoot.querySelector(`e-grid > e-gridhead > e-gridcell[id=${column.name}]`);
    }
    getColumnCellsElements(column) {
        return Array.from(this.shadowRoot.querySelectorAll(`e-grid > e-gridbody > e-gridrow > e-gridcell[headers~=${column.name}]`));
    }
    renderShadow() {
        const { model } = this;
        return fragment(element("link", {
            attributes: {
                rel: "stylesheet",
                href: "/css/main.css"
            }
        }), element("div", {
            children: element("input", {
                attributes: {
                    type: "search"
                },
                listeners: {
                    input: __classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_handleSearchInputEvent).bind(this)
                }
            })
        }), element("e-grid", {
            attributes: {
                tabindex: 0,
                selectby: "row",
                multisectable: true
            },
            children: [
                element("e-gridhead", {
                    children: reactiveChildElements(model.columns, column => __classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_renderGridColumnHeaderCell).call(this, column)),
                    listeners: {
                        contextmenu: __classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_handleHeadContextMenuEvent).bind(this),
                        click: __classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_handleHeadClickEvent).bind(this)
                    }
                }),
                element("e-gridbody", {
                    children: reactiveChildElements(model.rows, row => __classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_renderGridBodyRow).call(this, row))
                })
            ]
        }));
    }
    setSearchFilter(filter) {
        const { model, gridElement } = this;
        const { rows } = model;
        __classPrivateFieldSet(this, _GridViewBase_searchFilter, filter, "f");
        Array.from(rows.values()).forEach((row_i) => {
            const rowElement = this.getRowElement(row_i);
            if (rowElement) {
                rowElement.hidden = !__classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_filter).call(this, row_i);
            }
        });
        gridElement.clearSelection();
    }
    addDisplayFilter(filter) {
        const { model, gridElement } = this;
        const { rows } = model;
        const displayFilters = __classPrivateFieldGet(this, _GridViewBase_displayFilters, "f");
        if (!displayFilters.includes(filter)) {
            displayFilters.push(filter);
            Array.from(rows.values()).forEach((row_i) => {
                const rowElement = this.getRowElement(row_i);
                if (rowElement) {
                    rowElement.hidden = !__classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_filter).call(this, row_i);
                }
            });
        }
        gridElement.clearSelection();
    }
    removeDisplayFilter(filter) {
        const { model, gridElement } = this;
        const { rows } = model;
        const displayFilters = __classPrivateFieldGet(this, _GridViewBase_displayFilters, "f");
        const filterIndex = displayFilters.indexOf(filter);
        if (filterIndex > -1) {
            displayFilters.splice(filterIndex, 1);
            Array.from(rows.values()).forEach((row_i) => {
                const rowElement = this.getRowElement(row_i);
                if (rowElement) {
                    rowElement.hidden = !__classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_filter).call(this, row_i);
                }
            });
        }
        gridElement.clearSelection();
    }
    removeAllDisplayFilters() {
        const { model, gridElement } = this;
        const { rows } = model;
        const displayFilters = __classPrivateFieldGet(this, _GridViewBase_displayFilters, "f");
        displayFilters.splice(0, displayFilters.length);
        Array.from(rows.values()).forEach((row_i) => {
            const rowElement = this.getRowElement(row_i);
            if (rowElement) {
                rowElement.hidden = !__classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_filter).call(this, row_i);
            }
        });
        gridElement.clearSelection();
    }
};
_GridViewBase_columnDelegate = new WeakMap(), _GridViewBase_cellDelegate = new WeakMap(), _GridViewBase_displayFilters = new WeakMap(), _GridViewBase_searchFilter = new WeakMap(), _GridViewBase_instances = new WeakSet(), _GridViewBase_filter = function _GridViewBase_filter(row) {
    const displayFilters = __classPrivateFieldGet(this, _GridViewBase_displayFilters, "f");
    const searchFilter = __classPrivateFieldGet(this, _GridViewBase_searchFilter, "f");
    return (displayFilters.length > 0 ? displayFilters.some(filter_i => filter_i.filter(row)) : true) &&
        (searchFilter ? searchFilter.filter(row) : true);
}, _GridViewBase_renderGridColumnHeaderCell = function _GridViewBase_renderGridColumnHeaderCell(column) {
    const gridColumnElement = reactiveElement(column, element("e-gridcell", {
        attributes: {
            type: "columnheader",
            id: column.name
        },
        children: [
            element("span", {
                attributes: {
                    class: "gridheader-content"
                },
                children: [
                    element("span", {
                        attributes: {
                            class: "gridheader-label"
                        },
                        children: __classPrivateFieldGet(this, _GridViewBase_columnDelegate, "f").call(this, column)
                    }),
                    element("span", {
                        attributes: {
                            class: "gridheader-sort-indicator"
                        }
                    })
                ].concat(this.resizable ? [
                    element("e-wsash", {
                        attributes: {
                            controls: column.name
                        }
                    })
                ] : [])
            })
        ]
    }), ["sortorder"], (cell, property, oldValue, newValue) => {
        switch (property) {
            case "sortorder": {
                const { dataset } = cell;
                if (typeof newValue !== "undefined") {
                    dataset.sortorder = newValue.toString();
                }
                else {
                    delete dataset.sortorder;
                }
                break;
            }
        }
    });
    return gridColumnElement;
}, _GridViewBase_renderGridBodyRow = function _GridViewBase_renderGridBodyRow(row) {
    const { model } = this;
    const gridRowElement = element("e-gridrow", {
        dataset: {
            index: row.id
        },
        children: reactiveChildElements(model.columns, column => __classPrivateFieldGet(this, _GridViewBase_instances, "m", _GridViewBase_renderGridDataCell).call(this, row, column))
    });
    return gridRowElement;
}, _GridViewBase_renderGridDataCell = function _GridViewBase_renderGridDataCell(row, column) {
    const gridCellElement = element("e-gridcell", {
        attributes: {
            type: "gridcell",
            headers: column.name
        },
        children: element("span", {
            attributes: {
                class: "gridcell-content"
            },
            children: [
                element("span", {
                    attributes: {
                        class: "gridcell-label"
                    },
                    children: __classPrivateFieldGet(this, _GridViewBase_cellDelegate, "f").call(this, row, column)
                })
            ]
        })
    });
    return gridCellElement;
}, _GridViewBase_handleHeadContextMenuEvent = function _GridViewBase_handleHeadContextMenuEvent(event) {
    const { clientX, clientY, currentTarget, target } = event;
    const { gridElement } = this;
    const targetHead = currentTarget;
    const targetHeader = target.closest("e-gridcell");
    const { model } = this;
    if (targetHeader) {
        const column = model.getColumnByName(targetHeader.id);
        const { sortorder, filters } = column;
        const contextMenu = element("e-menu", {
            attributes: {
                contextual: true
            },
            children: [
                element("e-menuitem", {
                    attributes: {
                        label: "Resize Auto"
                    },
                    children: "Resize auto",
                    listeners: {
                        click: () => {
                            const columnHeaderElement = this.getColumnHeaderElement(column);
                            if (columnHeaderElement) {
                                const { style } = columnHeaderElement;
                                const labels = this.getColumnCellsElements(column).map(cell_i => cell_i.querySelector(".gridcell-label"));
                                const maxWidth = labels.reduce((maxWidth, label) => Math.max(maxWidth, label.getBoundingClientRect().width), 0);
                                style.setProperty("width", `${maxWidth}px`);
                            }
                            gridElement.focus();
                        }
                    }
                }),
                element("e-menuitem", {
                    attributes: {
                        label: "Resize To Default"
                    },
                    children: "Resize to Default",
                    listeners: {
                        click: () => {
                            const columnHeaderElement = this.getColumnHeaderElement(column);
                            if (columnHeaderElement) {
                                const { style } = columnHeaderElement;
                                style.removeProperty("width");
                            }
                            gridElement.focus();
                        }
                    }
                }),
                element("e-menuitem", {
                    attributes: {
                        type: "submenu",
                        label: "Sort",
                    },
                    children: [
                        "Sort",
                        element("e-menu", {
                            attributes: {
                                slot: "menu"
                            },
                            children: [
                                element("e-menuitem", {
                                    attributes: {
                                        type: "radio",
                                        name: "sort",
                                        value: "1",
                                        label: "Ascending",
                                        checked: sortorder === 1
                                    },
                                    children: "Ascending"
                                }),
                                element("e-menuitem", {
                                    attributes: {
                                        type: "radio",
                                        name: "sort",
                                        value: "-1",
                                        label: "Descending",
                                        checked: sortorder === -1
                                    },
                                    children: "Descending"
                                })
                            ],
                            listeners: {
                                click: (event) => {
                                    const { target } = event;
                                    const targetItem = target.closest("e-menuitem");
                                    if (targetItem) {
                                        model.sortByColumn(column, Number(targetItem.value));
                                    }
                                    gridElement.focus();
                                }
                            }
                        })
                    ]
                }),
                element("e-menuitem", {
                    attributes: {
                        type: "submenu",
                        label: "Filter"
                    },
                    children: [
                        "Filter",
                        element("e-menu", {
                            attributes: {
                                slot: "menu"
                            },
                            children: filters.map(filter => {
                                const { name } = filter;
                                return element("e-menuitem", {
                                    attributes: {
                                        type: "checkbox",
                                        checked: __classPrivateFieldGet(this, _GridViewBase_displayFilters, "f").includes(filter),
                                        label: name
                                    },
                                    children: name
                                });
                            }).concat(element("e-menuitem", {
                                attributes: {
                                    type: "button",
                                    label: "Remove filters"
                                },
                                children: "Remove filters"
                            })),
                            listeners: {
                                click: (event) => {
                                    const { target } = event;
                                    const targetItem = target.closest("e-menuitem");
                                    if (targetItem) {
                                        const { checked, label } = targetItem;
                                        const filter = filters.find(filter => filter.name === label);
                                        if (filter) {
                                            if (checked) {
                                                this.addDisplayFilter(filter);
                                            }
                                            else {
                                                this.removeDisplayFilter(filter);
                                            }
                                        }
                                        else {
                                            this.removeAllDisplayFilters();
                                        }
                                    }
                                    gridElement.focus();
                                }
                            }
                        })
                    ]
                })
            ]
        });
        targetHead.append(contextMenu);
        contextMenu.positionContextual(clientX, clientY);
        contextMenu.focus({ preventScroll: true });
        event.preventDefault();
    }
}, _GridViewBase_handleSearchInputEvent = function _GridViewBase_handleSearchInputEvent(event) {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
        const { value } = target;
        if (value !== "") {
            this.setSearchFilter({
                filter: (row) => row.name.toLowerCase().includes(value.toLowerCase())
            });
        }
        else {
            this.setSearchFilter(null);
        }
    }
}, _GridViewBase_handleHeadClickEvent = function _GridViewBase_handleHeadClickEvent(event) {
    const { target } = event;
    const targetIsHeaderContent = target.matches("e-gridcell[type=columnheader] :scope:not(e-wsash)");
    if (targetIsHeaderContent) {
        const targetHeader = target.closest("e-gridcell");
        const { model } = this;
        const { columns } = model;
        if (targetHeader) {
            const targetColumn = Array.from(columns.values()).find(column_i => column_i.name == targetHeader.id);
            if (targetColumn) {
                const { sortorder = -1 } = targetColumn;
                model.sortByColumn(targetColumn, -sortorder);
            }
        }
    }
};
(() => {
    style = /*css*/ `
            :host {
                display: block;
            }
            
            e-gridrow[hidden] {
                display: none;
            }
            
            e-gridcell[type="gridcell"] {
                max-width: 0;
            
                overflow: clip;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            e-gridcell[type="columnheader"] {
                width: 120px;
            }
            
            .gridcell-label,
            .gridheader-label {
                padding-left: 4px;
            }
            
            .gridcell-content {
                overflow: clip;
            }
            
            .gridheader-content {
                display: flex;
            }
            
            .gridheader-label {
                flex: 1 1 0;
                overflow: clip;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            e-treeitem::part(arrow) {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px 4px 1px 1px;
            }
            
            .gridheader-sort-indicator {
                display: inline-block;
                width: 18px;
                height: 18px;
            }
            
            .gridheader-sort-indicator::before {
                display: inline-block;
                width: 18px;
                height: 18px;
                margin: 1px;
                content: "";
                mask-size: 18px 18px;
                -webkit-mask-size: 18px 18px;
                background-color: var(--sortorder-indicator-color, none);
            }
            
            e-gridcell[type="columnheader"]:not([data-sortorder]) .gridheader-sort-indicator::before {
                background-color: unset;
            }
            
            e-gridcell[type="columnheader"][data-sortorder="1"] .gridheader-sort-indicator::before {
                -webkit-mask-image: var(--sortorder-indicator-ascending, none);
                mask-image: var(--sortorder-indicator-ascending, none);
            }
            
            e-gridcell[type="columnheader"][data-sortorder="-1"] .gridheader-sort-indicator::before {
                -webkit-mask-image: var(--sortorder-indicator-descending, none);
                mask-image: var(--sortorder-indicator-descending, none);
            }
            
            e-gridhead e-wsash:not(:hover) {
                flex: 0 0 auto;
                width: 2px;
                margin-right: 1px;
                margin-left: 1px;
            }
        `;
})();
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], GridViewBase.prototype, "resizable", void 0);
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], GridViewBase.prototype, "sortable", void 0);
GridViewBase = __decorate([
    CustomElement({
        name: "e-gridview"
    })
], GridViewBase);
var GridView = GridViewBase;
//# sourceMappingURL=GridView.js.map