import { element, reactiveChildElements, CustomElement, fragment, AttributeProperty, reactiveElement, widget } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";
import { HTMLEMenuItemElement } from "../elements/containers/menus/MenuItem";
import { gridHeaderWidget } from "./widgets/grid/GridHeaderWidget";
import { gridWidget } from "./widgets/grid/GridWidget";
import { gridRowWidget } from "./widgets/grid/GridRowWidget";
import { menuWidget } from "./widgets/menu/MenuWidget";
import { menuItemWidget } from "./widgets/menu/MenuItemWidget";

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
            column_i.sortorder = column_i === column ? sortOrder : undefined;
        });
        this.rows.sort(
            (row_1, row_2) => {
                const cell_1 = <string>column.extract(row_1).toString();
                const cell_2 = <string>column.extract(row_2).toString();
                return sortOrder * cell_1.localeCompare(cell_2);
            }
        );
    }
}

type Constructor = {
    new(...args: any): any;
    prototype: any;
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

    #gridRowElementsMap: WeakMap<GridRowModel, WeakRef<HTMLElement>>
    
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
                children: [
                    column.extract(row)
                ]
            });
        };
        this.#columnDelegate = (column: GridColumnModel) => {
            return element("label", {
                children: [
                    column.label
                ]
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

    get gridElement(): HTMLElement {
        return this.getGridElement()!;
    }

    setColumnDelegate(delegate: (column: GridColumnModel) => string | Node): void {
        this.#columnDelegate = delegate;
    }

    setCellDelegate(delegate: (row: GridRowModel, column: GridColumnModel) => string | Node): void {
        this.#cellDelegate = delegate;
    }

    getGridElement(): HTMLElement | null {
        return this.shadowRoot.querySelector(`:scope > .grid`);
    }

    getRowElement(row: GridRowModel): HTMLElement | null {
        return this.#gridRowElementsMap.get(row)?.deref() ?? null;
    }

    getColumnHeaderElement(column: GridColumnModel): HTMLElement | null {
        return this.shadowRoot.querySelector(`:scope > .grid > .gridhead > .gridheader[id=${column.name}]`);
    }
    
    getColumnCellsElements(column: GridColumnModel): HTMLElement[] {
        return Array.from(this.shadowRoot.querySelectorAll(`:scope > .grid > .gridbody > .gridrow > .gridcell[headers~=${column.name}]`));
    }

    renderShadow(): Node {
        const {model} = this;
        return fragment(
            element("link", {
                attributes: {
                    rel: "stylesheet",
                    href: "css/main.css"
                }
            }),
            element("link", {
                attributes: {
                    rel: "stylesheet",
                    href: "css/views/gridview.css"
                }
            }),
            element("div", {
                children: [
                    element("input", {
                        attributes: {
                            type: "search"
                        },
                        listeners: {
                            input: <EventListener>this.#handleSearchInputEvent.bind(this)
                        }
                    })
                ]
            }),
            widget("grid", {
                properties: {
                    tabIndex: 0,
                    selectby: "row",
                    multisectable: true
                },
                slotted: [
                    widget("gridhead", {
                        slotted: reactiveChildElements(
                            model.columns, column => this.#renderGridColumnHeaderCell(column)
                        ),
                        listeners: {
                            contextmenu: <EventListener>this.#handleHeadContextMenuEvent.bind(this),
                            click: <EventListener>this.#handleHeadClickEvent.bind(this)
                        }
                    }),
                    widget("gridbody", {
                        slotted: reactiveChildElements(
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
        gridWidget.clearSelection(gridElement);
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
        gridWidget.clearSelection(gridElement);
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
        gridWidget.clearSelection(gridElement);
    }

    #renderGridColumnHeaderCell(column: GridColumnModel): Element {
        const gridColumnElement = reactiveElement(
            column,
            widget("gridheader", {
                properties: {
                    tabIndex: -1,
                    id: column.name
                },
                slotted: [
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
                            })
                        ]).concat(
                            this.resizable ? [
                                element("e-wsash", {
                                    attributes: {
                                        controls: `${column.name}`
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
        const gridRowElement = widget("gridrow", {
            attributes: {
                tabindex: -1
            },
            slotted: reactiveChildElements(
                model.columns, column => this.#renderGridDataCell(row, column)
            )
        });
        this.#gridRowElementsMap.set(row, new WeakRef(gridRowElement));
        return gridRowElement;
    }

    #renderGridDataCell(row: GridRowModel, column: GridColumnModel): Element {
        const gridCellElement = widget("gridcell", {
            properties: {
                headers: column.name
            },
            slotted: element("span", {
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
        const targetHead = <HTMLElement>currentTarget;
        const targetHeader = <HTMLElement>(<HTMLElement>target).closest(".gridheader");
        const {model, gridElement} = this;
        if (targetHeader) {
            const column = model.getColumnByName(targetHeader.id)!;
            const menu = widget("menu",  {
                properties: {
                    tabIndex: -1,
                    contextual: true
                },
                slotted: [
                    widget("menuitem",  {
                        properties: {
                            type: "button",
                            tabIndex: -1,
                            label: "Resize Auto"
                        },
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
                            }
                        }
                    }),
                    widget("menuitem",  {
                        properties: {
                            type: "button",
                            tabIndex: -1,
                            label: "Resize To Default"
                        },
                        listeners: {
                            click: () => {
                                const columnHeaderElement = this.getColumnHeaderElement(column);
                                if (columnHeaderElement) {
                                    const {style} = columnHeaderElement;
                                    style.removeProperty("width");
                                }
                            }
                        }
                    }),
                    widget("menuitem",  {
                        properties: {
                            type: "submenu",
                            tabIndex: -1,
                            label: "Sort",
                        },
                        slotted: [
                            widget("menu",  {
                                attributes: {
                                    tabIndex: -1,
                                },
                                slotted: [
                                    widget("menuitem",  {
                                        properties: {
                                            type: "radio",
                                            name: "sort",
                                            value: "1",
                                            tabIndex: -1,
                                            label: "Ascending"
                                        }
                                    }),
                                    widget("menuitem",  {
                                        properties: {
                                            type: "radio",
                                            name: "sort",
                                            value: "-1",
                                            tabIndex: -1,
                                            label: "Descending"
                                        }
                                    })
                                ],
                                listeners: {
                                    click: (event) => {
                                        const {target} = event;
                                        const targetItem = <HTMLElement>target;
                                        if (targetItem.classList.contains("menuitem")) {
                                            const sortOrder = menuItemWidget.getValue(targetItem);
                                            model.sortByColumn(column, parseInt(sortOrder));
                                        }
                                    }
                                }
                            })
                        ]
                    }),
                    widget("menuitem",  {
                        properties: {
                            type: "submenu",
                            tabIndex: -1,
                            label: "Filter"
                        },
                        slotted: [
                            widget("menu",  {
                                properties: {
                                    tabIndex: -1,
                                },
                                slotted: column.filters.map((filter_i, i) =>
                                    widget("menuitem", {
                                        properties: {
                                            tabIndex: -1,
                                            type: "checkbox",
                                            checked: this.#displayFilters.includes(filter_i),
                                            label: filter_i.name
                                        },
                                        listeners: {
                                            click: (event) => {
                                                const {currentTarget} = event;
                                                const targetItem = <HTMLElement>currentTarget;
                                                const checked = menuItemWidget.getChecked(targetItem);
                                                if (checked) {
                                                    this.addDisplayFilter(filter_i);
                                                }
                                                else {
                                                    this.removeDisplayFilter(filter_i);
                                                }
                                            }
                                        }
                                    })
                                )
                            })
                        ]
                    })
                ]
            });
            targetHead.append(menu);
            menuWidget.positionContextual(menu, clientX, clientY);
            menu.focus({preventScroll: true});
            event.preventDefault();
        }
    }

    #handleSearchInputEvent(event: InputEvent) {
        const {target} = event;
        if (target instanceof HTMLInputElement) {
            const {value} = target;
            this.setSearchFilter(value !== "" ? {
                filter: (row) => row.name.toLowerCase().includes(value.toLowerCase())
            } : null);
        }
    }

    #handleHeadClickEvent(event: MouseEvent): void {
        const {target} = event;
        const targetIsHeaderLabel = (<HTMLElement>target).matches(":is(.gridheader-label, .gridheader-label :scope)");
        if (targetIsHeaderLabel) {
            const targetHeader = <HTMLElement>(<HTMLElement>target).closest(".gridheader");
            const {model} = this;
            const {columns} = model;
            if (targetHeader) {
                const targetColumn = Array.from(columns.values()).find(column_i => column_i.name == targetHeader.id);
                if (targetColumn) {
                    const sortorder = targetColumn.sortorder !== undefined ? -targetColumn.sortorder : 1;
                    model.sortByColumn(targetColumn, sortorder);
                }
            }
        }
    }
}

var GridView: GridViewConstructor = GridViewBase;