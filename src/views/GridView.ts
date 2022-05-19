import { HTMLEGridElement } from "../elements/containers/grid/Grid";
import { HTMLEGridCellElement } from "../elements/containers/grid/GridCell";
import { HTMLEGridRowElement } from "../elements/containers/grid/GridRow";
import { element, reactiveChildElements, CustomElement, Fragment, AttributeProperty, trimMultilineIndent, reactiveElement } from "../elements/Element";
import { HTMLEWidthSashElement } from "../elements/utils/WidthSash";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";
import { HTMLEMenuItemElement } from "../elements/containers/menus/MenuItem";
import { HTMLEMenuItemRadioList } from "../elements/containers/menus/MenuItemCollection";

export { GridModel };
export { GridRowModel };
export { GridColumnModel };
export { GridView };

class GridModel extends ModelObject {
    readonly rows: ModelList<GridRowModel>;
    readonly columns: ModelList<GridColumnModel>;

    constructor()
    constructor(init: {rows: GridRowModel[], columns: GridColumnModel[]})
    constructor(init?: {rows: GridRowModel[], columns: GridColumnModel[]}) {
        super();
        const rows = new ModelList(init?.rows ?? []);
        rows.setParent(this);
        this.rows = rows;
        const columns = new ModelList(init?.columns ?? []);
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
            column_i.sortorder = column_i == column ? sortOrder : void 0;
        });
        this.rows.sort(
            (row_1, row_2) => {
                const cell_1 = <string>column.extract(row_1).toString();
                const cell_2 = <string>column.extract(row_2).toString();
                return sortOrder * cell_1.localeCompare(cell_2);
            }
        )
    }
}

type Constructor = {
    new(...args: any): any;
    readonly prototype: any;
}

type GridRowFilter = {
    filter: (row: GridRowModel) => boolean;
}

class GridColumnModel<T extends Constructor = Constructor> extends ModelObject {
    readonly name: string;
    readonly label: string;
    readonly type: T;
    readonly extract: (row: GridRowModel) => InstanceType<T>;
    readonly filters: (GridRowFilter & {name: string})[];

    @ModelProperty()
    sortorder: number | undefined;

    constructor(init: {
        name: string,
        label: string,
        type: T,
        extract: (row: GridRowModel) => InstanceType<T>,
        filters?: (GridRowFilter & {name: string})[]
    }) {
        super();
        const {name, label, type, extract} = init;
        this.name = name;
        this.label = label;
        this.type = type;
        this.extract = extract;
        this.filters = init.filters ?? [];
        this.sortorder = 1;
    }
}

class GridRowModel extends ModelObject {
    @ModelProperty()
    name: string;

    @ModelProperty()
    age: number;
    
    constructor(init: {name: string, age: number}) {
        super();
        const {name, age} = init;
        this.name = name;
        this.age = age;
    }
}

interface GridViewConstructor {
    readonly prototype: GridView;
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
        "v-grid": GridView,
    }
}

@CustomElement({
    name: "v-grid"
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

    #gridRowElementsMap: WeakMap<GridRowModel, WeakRef<HTMLEGridRowElement>>
    
    constructor()
    constructor(model: GridModel)
    constructor(model?: GridModel) {
        super();
        this.#displayFilters = [];
        this.#searchFilter = null;
        this.#gridRowElementsMap = new WeakMap();
        this.attachShadow({mode: "open"});
        this.setModel(model ?? new GridModel());
        this.#cellDelegate = (row: GridRowModel, column: GridColumnModel) => {
            return element("label", {
                properties: {
                    textContent: column.extract(row)
                }
            });
        };
        this.#columnDelegate = (column: GridColumnModel) => {
            return element("label", {
                properties: {
                    textContent: column.label
                }
            });
        };
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "resizable":
            case "sortable": {
                this.refresh();
                break;
            }
        }
    }

    get gridElement(): HTMLEGridElement {
        return this.getGridElement()!;
    }

    setColumnDelegate(delegate: (column: GridColumnModel) => string | Node): void {
        this.#columnDelegate = delegate;
    }

    setCellDelegate(delegate: (row: GridRowModel, column: GridColumnModel) => string | Node): void {
        this.#cellDelegate = delegate;
    }

    getGridElement(): HTMLEGridElement | null {
        return this.shadowRoot.querySelector(`:scope > e-grid`);
    }

    getRowElement(row: GridRowModel): HTMLEGridRowElement | null {
        return this.#gridRowElementsMap.get(row)?.deref() ?? null;
    }

    getColumnHeaderElement(column: GridColumnModel): HTMLEGridCellElement | null {
        return this.shadowRoot.querySelector(`:scope > e-grid > e-gridhead > e-gridrow > e-gridcell[type=columnheader][name=${column.name}]`);
    }

    getColumnDataElements(column: GridColumnModel): HTMLEGridCellElement[] {
        return Array.from(this.shadowRoot.querySelectorAll(`:scope > e-grid > e-gridbody > e-gridrow > e-gridcell[headers~=${column.name}]`));
    }

    renderShadow(): Node {
        const {model} = this;
        return Fragment(
            element("link", {
                properties: {
                    rel: "stylesheet",
                    href: "css/main.css"
                }
            }),
            element("link", {
                properties: {
                    rel: "stylesheet",
                    href: "css/views/gridview.css"
                }
            }),
            element("div", {
                children: [
                    element("input", {
                        properties: {
                            type: "search"
                        },
                        eventListeners: {
                            input: <EventListener>this.#handleSearchInputEvent.bind(this)
                        }
                    })
                ]
            }),
            element("e-grid", {
                properties: {
                    tabIndex: 0,
                    selectby: "row"
                },
                children: [
                    element("e-gridhead", {
                        children: [
                            element("e-gridrow", {
                                children: reactiveChildElements(
                                    model.columns, column => this.#renderGridColumnHeaderCell(column)
                                )
                            })
                        ]
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

    setSearchFilter(filter: GridRowFilter | null): void {
        this.#searchFilter = filter;
        Array.from(this.model.rows.values()).forEach((row_i) => {
            const rowElement = this.getRowElement(row_i);
            if (rowElement) {
                rowElement.hidden =
                    !this.#displayFilters.some(filter_i => filter_i.filter(row_i))
                    && !(filter?.filter(row_i) ?? true);
            }
        });
        const {gridElement} = this;
        gridElement.beginSelection();
        gridElement.selectedRows().forEach(selectedRow_i => selectedRow_i.selected = false);
        gridElement.endSelection();
    }

    addDisplayFilter(filter: (GridRowFilter & {name: string;})): void {
        const displayFilters = this.#displayFilters;
        if (!displayFilters.includes(filter)) {
            this.#displayFilters.push(filter);
            Array.from(this.model.rows.values()).forEach((row_i) => {
                const rowElement = this.getRowElement(row_i);
                if (rowElement) {
                    rowElement.hidden = !this.#displayFilters.some(filter_i => filter_i.filter(row_i));
                }
            });
        }
        const {gridElement} = this;
        gridElement.beginSelection();
        gridElement.selectedRows().forEach(selectedRow_i => selectedRow_i.selected = false);
        gridElement.endSelection();
    }

    removeDisplayFilter(filter: (GridRowFilter & {name: string;})): void {
        const displayFilters = this.#displayFilters;
        const filterIndex = displayFilters.indexOf(filter);
        if (filterIndex > -1) {
            displayFilters.splice(filterIndex, 1);
            Array.from(this.model.rows.values()).forEach((row_i) => {
                const rowElement = this.getRowElement(row_i);
                if (rowElement) {
                    rowElement.hidden = !this.#displayFilters.every(filter_i => filter_i.filter(row_i));
                }
            });
        }
        const {gridElement} = this;
        gridElement.beginSelection();
        gridElement.selectedRows().forEach(selectedRow_i => selectedRow_i.selected = false);
        gridElement.endSelection();
    }

    #renderGridColumnHeaderCell(column: GridColumnModel): Element {
        const {model} = this;
        const gridColumnElement = reactiveElement(
            column,
            element("e-gridcell", {
                properties: {
                    tabIndex: -1,
                    name: column.name,
                    id: this.resizable ? `${column.name}-columnheader` : void 0,
                    type: "columnheader"
                },
                children: [
                    element("span", {
                        properties: {
                            className: "gridcell-content"
                        },
                        children: (<Node[]>[
                            element("label", {
                                properties: {
                                    className: "gridcell-label",
                                    textContent: column.label
                                },
                                eventListeners: {
                                    click: <EventListener>this.#handleColumnLabelClickEvent.bind(this)
                                }
                            }),
                            element("e-toolbar", {
                                properties: {
                                    tabIndex: -1,
                                },
                                children: [
                                    element("e-toolbaritem", {
                                        properties: {
                                            type: "menubutton",
                                            tabIndex: -1,
                                        },
                                        children: [
                                            element("e-menubutton",  {
                                                properties: {
                                                    slot: "menubutton",
                                                    tabIndex: -1,
                                                },
                                                children: [
                                                    element("e-menu",  {
                                                        properties: {
                                                            slot: "menu",
                                                            tabIndex: -1,
                                                        },
                                                        children: [
                                                            element("e-menuitem",  {
                                                                properties: {
                                                                    type: "button",
                                                                    textContent: "Resize column",
                                                                    tabIndex: -1,
                                                                },
                                                                eventListeners: {
                                                                    trigger: () => {
                                                                        const columnHeaderElement = this.getColumnHeaderElement(column);
                                                                        if (columnHeaderElement) {
                                                                            columnHeaderElement.style.removeProperty("width");
                                                                            columnHeaderElement.style.removeProperty("max-width");
                                                                            this.getColumnDataElements(column).forEach(
                                                                                cell_i => cell_i.style.maxWidth = "unset"
                                                                            );
                                                                        }
                                                                    }
                                                                }
                                                            }),
                                                            element("e-menuitem",  {
                                                                properties: {
                                                                    type: "submenu",
                                                                    textContent: "Sort",
                                                                    tabIndex: -1,
                                                                },
                                                                children: [
                                                                    reactiveElement(
                                                                        column,
                                                                        element("e-menu",  {
                                                                            properties: {
                                                                                slot: "menu",
                                                                                tabIndex: -1,
                                                                            },
                                                                            children: [
                                                                                element("e-menuitem",  {
                                                                                    properties: {
                                                                                        type: "radio",
                                                                                        name: "sort",
                                                                                        textContent: "Ascending",
                                                                                        value: "1",
                                                                                        tabIndex: -1,
                                                                                    }
                                                                                }),
                                                                                element("e-menuitem",  {
                                                                                    properties: {
                                                                                        type: "radio",
                                                                                        name: "sort",
                                                                                        textContent: "Descending",
                                                                                        value: "-1",
                                                                                        tabIndex: -1,
                                                                                    }
                                                                                })
                                                                            ],
                                                                            eventListeners: {
                                                                                trigger: (event) => {
                                                                                    const {target} = event;
                                                                                    const sortOrder = (<HTMLEMenuItemElement>target).value;
                                                                                    model.sortByColumn(column, parseInt(sortOrder));
                                                                                }
                                                                            }
                                                                        }),
                                                                        ["sortorder"],
                                                                        (menu, property, oldValue, newValue) => {
                                                                            Array.from(menu.items).filter(item_i => item_i.name.startsWith("sort"))
                                                                                .forEach((sortRadioItem_i => {
                                                                                    sortRadioItem_i.checked = parseInt(sortRadioItem_i.value) === newValue;
                                                                                })
                                                                            );
                                                                        }
                                                                    )
                                                                ]
                                                            }),
                                                            element("e-menuitem",  {
                                                                properties: {
                                                                    type: "submenu",
                                                                    textContent: "Filter",
                                                                    tabIndex: -1,
                                                                },
                                                                children: [
                                                                    element("e-menu",  {
                                                                        properties: {
                                                                            slot: "menu",
                                                                            tabIndex: -1,
                                                                        },
                                                                        children: column.filters.map((filter_i, i) =>
                                                                            element("e-menuitem", {
                                                                                properties: {
                                                                                    tabIndex: -1,
                                                                                    textContent: filter_i.name,
                                                                                    type: "checkbox",
                                                                                    checked: this.#displayFilters.includes(filter_i)
                                                                                },
                                                                                eventListeners: {
                                                                                    trigger: (event) => {
                                                                                        const {currentTarget} = event;
                                                                                        if (currentTarget instanceof HTMLEMenuItemElement) {
                                                                                            const {checked} = currentTarget;
                                                                                            if (checked) {
                                                                                                this.addDisplayFilter(filter_i);
                                                                                            }
                                                                                            else {
                                                                                                this.removeDisplayFilter(filter_i);
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })
                                                                        )
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]).concat(
                            this.resizable ? [
                                element("e-wsash", {
                                    properties: {
                                        controls: `${column.name}-columnheader`
                                    },
                                    eventListeners: {
                                        resize: () => {
                                            this.getColumnDataElements(column).forEach(
                                                cell_i => cell_i.style.removeProperty("max-width")
                                            );
                                        }
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
                    case "sortorder":
                        if (typeof newValue !== "undefined") {
                            cell.dataset.sortorder = newValue.toString();
                        }
                        else {
                            delete cell.dataset.sortorder;
                        }
                        break;
                }
            }
        );
        return gridColumnElement;
    }

    #renderGridBodyRow(row: GridRowModel): Element {
        const {model} = this;
        const gridRowElement = element("e-gridrow", {
            properties: {
                tabIndex: -1
            },
            children: reactiveChildElements(
                model.columns, column => this.#renderGridDataCell(row, column)
            )
        });
        this.#gridRowElementsMap.set(row, new WeakRef(gridRowElement));
        return gridRowElement;
    }

    #renderGridDataCell(row: GridRowModel, column: GridColumnModel): Element {
        const gridCellElement = element("e-gridcell", {
            properties: {
                type: "gridcell",
                headers: column.name
            },
            children: [
                this.#cellDelegate(row, column)
            ]
        });
        return gridCellElement;
    }

    #handleSearchInputEvent(event: InputEvent) {
        const {target} = event;
        if (target instanceof HTMLInputElement) {
            const {value} = target;
            this.setSearchFilter(value !== "" ? {
                filter: (row) => row.name.toLowerCase().startsWith(value.toLowerCase())
            } : null);
        }
    }

    #handleColumnLabelClickEvent(event: MouseEvent): void {
        const {currentTarget} = event;
        const {model} = this;
        const {columns} = model;
        if (currentTarget instanceof Element) {
            const targetCell = currentTarget.closest("e-gridcell");
            if (targetCell) {
                const targetColumn = Array.from(columns.values()).find(column_i => column_i.name == targetCell.name);
                if (targetColumn) {
                    const sortorder = typeof targetColumn.sortorder !== "undefined" ? -targetColumn.sortorder : 1;
                    model.sortByColumn(targetColumn, sortorder);
                }
            }
        }
    }
}

var GridView: GridViewConstructor = GridViewBase;