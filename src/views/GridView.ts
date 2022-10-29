import { element, reactiveChildElements, CustomElement, fragment, AttributeProperty, reactiveElement } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";
import { HTMLEGridCellElement } from "../elements/containers/grid/GridCell";
import { HTMLEGridElement } from "../elements/containers/grid/Grid";
import { HTMLEGridRowElement } from "../elements/containers/grid/GridRow";
import { HTMLEWidthSashElement } from "../elements/misc/WidthSash";
import { HTMLEMenuElement } from "../elements/containers/menus/Menu";
import { resetStylesheet } from "../stylesheets/Reset";

export { GridModel };
export { GridRowModel };
export { GridColumnModel };
export { GridView };

HTMLEGridElement;
HTMLEWidthSashElement;
HTMLEMenuElement;

interface GridInit {
    rows: GridRowModel[];
    columns: GridColumnModel[];
}

class GridModel extends ModelObject {
    readonly rows: ModelList<GridRowModel>;
    readonly columns: ModelList<GridColumnModel>;

    constructor()
    constructor(init: GridInit)
    constructor(init?: GridInit) {
        super();
        const {rows: initRows = [], columns: initColumns = []} = init ?? {};
        const rows = new ModelList(initRows);
        rows.setParent(this);
        this.rows = rows;
        const columns = new ModelList(initColumns);
        columns.setParent(this);
        this.columns = columns;
    }

    getColumnByName(name: string): GridColumnModel | null {
        return Array.from(this.columns.values()).find(
            column_i => column_i.name == name
        ) ?? null;
    }

    sortByColumn(column: GridColumnModel, sortOrder: number) {
        Array.from(this.columns.values()).forEach((column_i) => {
            column_i.sortorder = column_i === column ? sortOrder : undefined;
        });
        const sortTest = (() => {
            const {type} = column;
            switch (type) {
                case String: {
                    return (row_1: GridRowModel, row_2: GridRowModel) => {
                        const cell_1 = String(column.extract(row_1));
                        const cell_2 = String(column.extract(row_2));
                        return sortOrder * cell_1.localeCompare(cell_2);
                    };
                }
                default: {
                    return (row_1: GridRowModel, row_2: GridRowModel) => {
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


type GridRowFilter = {
    filter: (row: GridRowModel) => boolean;
}

interface GridColumnInit {
    name: string,
    type: NumberConstructor | StringConstructor | DateConstructor,
    label: string,
    extract: (row: GridRowModel) => string,
    filters?: (GridRowFilter & {name: string})[]
}

class GridColumnModel extends ModelObject {
    readonly name: string
    readonly type: NumberConstructor | StringConstructor | DateConstructor;
    readonly label: string;
    readonly extract: (row: GridRowModel) => string;
    readonly filters: (GridRowFilter & {name: string})[];

    @ModelProperty()
    sortorder: number | undefined;

    constructor(init: GridColumnInit) {
        super();
        const {name, type, label, extract, filters = []} = init;
        this.name = name;
        this.type = type;
        this.label = label;
        this.extract = extract;
        this.filters = filters;
    }
}

class GridRowModel extends ModelObject {
    id: number;

    @ModelProperty()
    name: string;

    @ModelProperty()
    age: number;
    
    constructor(init: {
        id: number;
        name: string,
        age: number
    }) {
        super();
        const {id, name, age} = init;
        this.id = id;
        this.name = name;
        this.age = age;
    }
}

interface GridViewConstructor {
    prototype: GridView;
    new(): GridView;
    new(model: GridModel): GridView;
}

interface GridView extends View {
    readonly shadowRoot: ShadowRoot;
    model: GridModel;
    resizable: boolean;
    sortable: boolean;
    setColumnDelegate(delegate: (column: GridColumnModel) => string | Node): void;
    setCellDelegate(delegate: (row: GridRowModel, column: GridColumnModel) => string | Node): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-gridview": GridView,
    }
}

var style: string;

@CustomElement({
    name: "e-gridview"
})
class GridViewBase extends View implements GridView {

    readonly shadowRoot!: ShadowRoot;
    readonly model!: GridModel;

    #columnDelegate: (column: GridColumnModel) => string | Node;
    #cellDelegate: (row: GridRowModel, column: GridColumnModel) => string | Node;
    
    @AttributeProperty({type: Boolean, observed: true})
    resizable!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    sortable!: boolean;

    #displayFilters: (GridRowFilter & {name: string})[];
    #searchFilter: GridRowFilter | null;

    static {
        style = /*css*/`
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
    }
    
    constructor()
    constructor(model: GridModel)
    constructor(model?: GridModel) {
        super();
        this.#displayFilters = [];
        this.#searchFilter = null;
        this.#cellDelegate =
            (row: GridRowModel, column: GridColumnModel) =>
                element("label", {
                    children: column.extract(row)
                });
        this.#columnDelegate =
            (column: GridColumnModel) =>
                element("label", {
                    children: column.label
                });
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet, resetStylesheet];
        this.setModel(model ?? new GridModel());
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "resizable":
            case "sortable": {
                this.render();
                break;
            }
        }
    }

    get gridElement(): HTMLEGridElement {
        return this.shadowRoot.querySelector("e-grid")!;
    }

    setColumnDelegate(delegate: (column: GridColumnModel) => string | Node): void {
        this.#columnDelegate = delegate;
    }

    setCellDelegate(delegate: (row: GridRowModel, column: GridColumnModel) => string | Node): void {
        this.#cellDelegate = delegate;
    }

    getRowElement(row: GridRowModel): HTMLEGridRowElement | null {
        return this.shadowRoot.querySelector(`e-grid > e-gridbody > e-gridrow[data-index='${row.id}']`);
    }

    getColumnHeaderElement(column: GridColumnModel): HTMLEGridCellElement | null {
        return this.shadowRoot.querySelector(`e-grid > e-gridhead > e-gridcell[id=${column.name}]`);
    }
    
    getColumnCellsElements(column: GridColumnModel): HTMLEGridCellElement[] {
        return Array.from(this.shadowRoot.querySelectorAll(`e-grid > e-gridbody > e-gridrow > e-gridcell[headers~=${column.name}]`));
    }

    renderShadow(): Node {
        const {model} = this;
        return fragment(
            element("div", {
                children: element("input", {
                    attributes: {
                        type: "search"
                    },
                    listeners: {
                        input: <EventListener>this.#handleSearchInputEvent.bind(this)
                    }
                })
            }),
            element("e-grid", {
                attributes: {
                    tabindex: 0,
                    selectby: "row",
                    multisectable: true
                },
                children: [
                    element("e-gridhead", {
                        children: reactiveChildElements(
                            model.columns, column => this.#renderGridColumnHeaderCell(column)
                        ),
                        listeners: {
                            contextmenu: <EventListener>this.#handleHeadContextMenuEvent.bind(this),
                            click: <EventListener>this.#handleHeadClickEvent.bind(this)
                        }
                    }),
                    element("e-gridbody", {
                        children: reactiveChildElements(
                            model.rows, row => this.#renderGridBodyRow(row)
                        )
                    })
                ]
            })
        );
    }

    #filter(row: GridRowModel): boolean {
        const displayFilters = this.#displayFilters;
        const searchFilter = this.#searchFilter;
        return (displayFilters.length > 0 ? displayFilters.some(filter_i => filter_i.filter(row)) : true) &&
        (searchFilter ? searchFilter.filter(row) : true);
    }

    setSearchFilter(filter: GridRowFilter | null): void {
        const {model, gridElement} = this;
        const {rows} = model;
        this.#searchFilter = filter;
        Array.from(rows.values()).forEach((row_i) => {
            const rowElement = this.getRowElement(row_i);
            if (rowElement) {
                rowElement.hidden = !this.#filter(row_i);
            }
        });
        gridElement.clearSelection();
    }

    addDisplayFilter(filter: (GridRowFilter & {name: string;})): void {
        const {model, gridElement} = this;
        const {rows} = model;
        const displayFilters = this.#displayFilters;
        if (!displayFilters.includes(filter)) {
            displayFilters.push(filter);
            Array.from(rows.values()).forEach((row_i) => {
                const rowElement = this.getRowElement(row_i);
                if (rowElement) {
                    rowElement.hidden = !this.#filter(row_i);
                }
            });
        }
        gridElement.clearSelection();
    }

    removeDisplayFilter(filter: (GridRowFilter & {name: string;})): void {
        const {model, gridElement} = this;
        const {rows} = model;
        const displayFilters = this.#displayFilters;
        const filterIndex = displayFilters.indexOf(filter);
        if (filterIndex > -1) {
            displayFilters.splice(filterIndex, 1);
            Array.from(rows.values()).forEach((row_i) => {
                const rowElement = this.getRowElement(row_i);
                if (rowElement) {
                    rowElement.hidden = !this.#filter(row_i);
                }
            });
        }
        gridElement.clearSelection();
    }

    removeAllDisplayFilters(): void {
        const {model, gridElement} = this;
        const {rows} = model;
        const displayFilters = this.#displayFilters;
        displayFilters.splice(0, displayFilters.length);
        Array.from(rows.values()).forEach((row_i) => {
            const rowElement = this.getRowElement(row_i);
            if (rowElement) {
                rowElement.hidden = !this.#filter(row_i);
            }
        });
        gridElement.clearSelection();
    }

    #renderGridColumnHeaderCell(column: GridColumnModel): Element {
        const gridColumnElement = reactiveElement(
            column,
            element("e-gridcell", {
                attributes: {
                    type: "columnheader",
                    id: column.name
                },
                children: [
                    element("span", {
                        attributes: {
                            class: "gridheader-content"
                        },
                        children: (<Node[]>[
                            element("span", {
                                attributes: {
                                    class: "gridheader-label"
                                },
                                children: this.#columnDelegate(column)
                            }),
                            element("span", {
                                attributes: {
                                    class: "gridheader-sort-indicator"
                                }
                            })
                        ]).concat(
                            this.resizable ? [
                                element("e-wsash", {
                                    attributes: {
                                        controls: column.name
                                    }
                                })
                            ] : []
                        )
                    })
                ]
            }),
            ["sortorder"],
            (cell, property, oldValue, newValue) => {
                switch (property) {
                    case "sortorder": {
                        const {dataset} = cell;
                        if (typeof newValue !== "undefined") {
                            dataset.sortorder = newValue.toString();
                        }
                        else {
                            delete dataset.sortorder;
                        }
                        break;
                    }
                }
            }
        );
        return gridColumnElement;
    }

    #renderGridBodyRow(row: GridRowModel): Element {
        const {model} = this;
        const gridRowElement = element("e-gridrow", {
            dataset: {
                index: row.id
            },
            children: reactiveChildElements(
                model.columns, column => this.#renderGridDataCell(row, column)
            )
        });
        return gridRowElement;
    }

    #renderGridDataCell(row: GridRowModel, column: GridColumnModel): Element {
        const gridCellElement = element("e-gridcell", {
            attributes: {
                type: "gridcell",
                headers: column.name
            },
            children: element("span", {
                attributes: {
                    class: "gridcell-content"
                },
                children: (<Node[]>[
                    element("span", {
                        attributes: {
                            class: "gridcell-label"
                        },
                        children: this.#cellDelegate(row, column)
                    })
                ])
            })
        });
        return gridCellElement;
    }

    #handleHeadContextMenuEvent(event: MouseEvent): void {
        const {clientX, clientY, currentTarget, target} = event;
        const {gridElement} = this;
        const targetHead = <HTMLElement>currentTarget;
        const targetHeader = <HTMLEGridCellElement>(<HTMLElement>target).closest("e-gridcell");
        const {model} = this;
        if (targetHeader) {
            const column = model.getColumnByName(targetHeader.id)!;
            const {sortorder, filters} = column;
            const contextMenu = element("e-menu",  {
                attributes: {
                    contextual: true
                },
                children: [
                    element("e-menuitem",  {
                        attributes: {
                            label: "Resize Auto"
                        },
                        children: "Resize auto",
                        listeners: {
                            click: () => {
                                const columnHeaderElement = this.getColumnHeaderElement(column);
                                if (columnHeaderElement) {
                                    const {style} = columnHeaderElement;
                                    const labels = this.getColumnCellsElements(column).map(
                                        cell_i => cell_i.querySelector(".gridcell-label")!
                                    );
                                    const maxWidth = labels.reduce(
                                        (maxWidth, label) => Math.max(maxWidth, label.getBoundingClientRect().width), 0
                                    );
                                    style.setProperty("width", `${maxWidth}px`);
                                }
                                gridElement.focus();
                            }
                        }
                    }),
                    element("e-menuitem",  {
                        attributes: {
                            label: "Resize To Default"
                        },
                        children: "Resize to Default",
                        listeners: {
                            click: () => {
                                const columnHeaderElement = this.getColumnHeaderElement(column);
                                if (columnHeaderElement) {
                                    const {style} = columnHeaderElement;
                                    style.removeProperty("width");
                                }
                                gridElement.focus();
                            }
                        }
                    }),
                    element("e-menuitem",  {
                        attributes: {
                            type: "submenu",
                            label: "Sort",
                        },
                        children: [
                            "Sort",
                            element("e-menu",  {
                                attributes: {
                                    slot: "menu"
                                },
                                children: [
                                    element("e-menuitem",  {
                                        attributes: {
                                            type: "radio",
                                            name: "sort",
                                            value: "1",
                                            label: "Ascending",
                                            checked: sortorder === 1
                                        },
                                        children: "Ascending"
                                    }),
                                    element("e-menuitem",  {
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
                                        const {target} = event;
                                        const targetItem = (<HTMLElement>target).closest("e-menuitem");
                                        if (targetItem) {
                                            model.sortByColumn(column, Number(targetItem.value));
                                        }
                                        gridElement.focus();
                                    }
                                }
                            })
                        ]
                    }),
                    element("e-menuitem",  {
                        attributes: {
                            type: "submenu",
                            label: "Filter"
                        },
                        children: [
                            "Filter",
                            element("e-menu",  {
                                attributes: {
                                    slot: "menu"
                                },
                                children: filters.map(filter => {
                                    const {name} = filter;
                                    return element("e-menuitem", {
                                        attributes: {
                                            type: "checkbox",
                                            checked: this.#displayFilters.includes(filter),
                                            label: name
                                        },
                                        children: name
                                    })
                                }).concat(
                                    element("e-menuitem", {
                                        attributes: {
                                            type: "button",
                                            label: "Remove filters"
                                        },
                                        children: "Remove filters"
                                    })
                                ),
                                listeners: {
                                    click: (event) => {
                                        const {target} = event;
                                        const targetItem = (<HTMLElement>target).closest("e-menuitem");
                                        if (targetItem) {
                                            const {checked, label} = targetItem;
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
            contextMenu.focus({preventScroll: true});
            event.preventDefault();
        }
    }

    #handleSearchInputEvent(event: InputEvent) {
        const {target} = event;
        if (target instanceof HTMLInputElement) {
            const {value} = target;
            if (value !== "") {
                this.setSearchFilter({
                    filter: (row) => row.name.toLowerCase().includes(value.toLowerCase())
                });
            }
            else {
                this.setSearchFilter(null);
            }
        }
    }

    #handleHeadClickEvent(event: MouseEvent): void {
        const {target} = event;
        const targetIsHeaderContent = (<HTMLElement>target).matches("e-gridcell[type=columnheader] :scope:not(e-wsash)");
        if (targetIsHeaderContent) {
            const targetHeader = <HTMLEGridCellElement>(<HTMLElement>target).closest("e-gridcell");
            const {model} = this;
            const {columns} = model;
            if (targetHeader) {
                const targetColumn = Array.from(columns.values()).find(column_i => column_i.name == targetHeader.id);
                if (targetColumn) {
                    const {sortorder = -1} = targetColumn;
                    model.sortByColumn(targetColumn, -sortorder);
                }
            }
        }
    }
}

var GridView: GridViewConstructor = GridViewBase;