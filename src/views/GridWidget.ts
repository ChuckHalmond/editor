import { HTMLEGridElement } from "../elements/containers/grid/Grid";
import { HTMLEGridCellElement } from "../elements/containers/grid/GridCell";
import { HTMLEGridRowElement } from "../elements/containers/grid/GridRow";
import { element, reactiveChildElements, trimMultilineIndent } from "../elements/Element";
import { HTMLEWidthSashElement } from "../elements/utils/WidthSash";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";

export { GridModel };
export { GridRowModel };
export { GridColumnModel };
export { GridWidget };

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
}

interface GridCellMixin {
    /*show(): void;
    hide(): void;
    display(): void;
    remove(): void;*/
}

class GridColumnModel extends ModelObject {
    readonly name: string;
    readonly label: string;
    readonly extract: (row: GridRowModel) => any;

    constructor(init: {
        name: string,
        label: string,
        extract: (row: GridRowModel) => any
    }) {
        super();
        const {name, label, extract} = init;
        this.name = name;
        this.label = label;
        this.extract = extract;
    }
}

class GridRowModel extends ModelObject {
    @ModelProperty()
    label: string;

    @ModelProperty()
    age: number;
    
    constructor(init: {label: string, age: number}) {
        super();
        const {label, age} = init;
        this.label = label;
        this.age = age;
    }
}

class GridWidget {

    get model(): GridModel {
        return this.#model;
    }

    get element(): HTMLEGridElement {
        return this.#element;
    }

    #gridElement: WeakRef<HTMLEGridElement> | null;
    #gridRowsMap: WeakMap<GridRowModel, WeakRef<HTMLEGridRowElement>>;
    #gridColumnsMap: WeakMap<GridColumnModel, WeakRef<HTMLEGridCellElement>>;
    #columnDelegate: (column: GridColumnModel) => string | Node;
    #cellDelegate: (row: GridRowModel, column: GridColumnModel) => string | Node;

    resizable!: boolean;
    sortable!: boolean;

    #model: GridModel;
    #element: HTMLEGridElement;

    static {
        document.head.append(
            element("style", {
                attributes: {
                    id: "v-grid-style"
                },
                children: [
                    trimMultilineIndent(/*css*/`
                        .c-grid-view e-gridcell[data-sortorder="-1"]::after {
                            display: inline-block;
                            content: "^";
                        }

                        .c-grid-view e-gridcell[data-sortorder="1"]::after {
                            display: inline-block;
                            content: "v";
                        }
                    `)
                ]
            })
        );
    }
    
    constructor() {
        this.#gridElement = null;
        this.#gridRowsMap = new WeakMap();
        this.#gridColumnsMap = new WeakMap();
        this.#model = new GridModel();
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
        this.#element = this.render();
    }

    setModel(model: GridModel): void {
        this.#model = model;
        this.#element = this.render();
    }

    setColumnDelegate(delegate: (column: GridColumnModel) => string | Node): void {
        this.#columnDelegate = delegate;
    }

    setCellDelegate(delegate: (row: GridRowModel, column: GridColumnModel) => string | Node): void {
        this.#cellDelegate = delegate;
    }

    getGridElement(): HTMLEGridElement | null {
        return <HTMLEGridElement | null>this.#gridElement?.deref() ?? null;
    }

    getGridRowElement(row: GridRowModel): HTMLEGridRowElement | null {
        return <HTMLEGridRowElement | null>this.#gridRowsMap.get(row)?.deref()  ?? null;
    }

    getGridColumnCellElement(column: GridColumnModel): HTMLEGridCellElement | null {
        return <HTMLEGridCellElement | null>this.#gridColumnsMap.get(column)?.deref() ?? null;
    }
    
    render(): HTMLEGridElement {
        const {model} = this;
        const gridElement = element("e-grid", {
            attributes: {
                tabindex: 0,
                selectby: "row",
                class: "c-grid-view"
            },
            children: [
                element("e-gridhead", {
                    children: [
                        this.#renderGridHeadRow()
                    ]
                }),
                element("e-gridbody", {
                    children: reactiveChildElements(
                        model.rows, row => this.#renderGridBodyRow(row)
                    )
                })
            ]
        });
        this.#gridElement = new WeakRef(gridElement);
        return gridElement;
    }

    #renderGridHeadRow(): Element {
        const {model} = this;
        const gridHeadRowElement = element("e-gridrow", {
            children: reactiveChildElements(
                model.columns, column => this.#renderGridColumnHeaderCell(column)
            )
        });
        return gridHeadRowElement;
    }

    #renderGridColumnHeaderCell(column: GridColumnModel): Element {
        const gridColumnElement = element("e-gridcell", {
            attributes: {
                tabindex: -1,
                name: column.name,
                id: this.resizable ? this.#columnID(column.name) : undefined,
                type: "columnheader"
            },
            children: [
                this.#columnDelegate(column)
            ].concat(
                this.resizable ? [element("e-wsash", {
                    attributes: {
                        controls: this.#columnID(column.name)
                    },
                    listeners: {
                        resize: <EventListener>this.#handleColumnResizeEvent.bind(this)
                    }
                })] : []
            ),
            listeners: this.sortable ? Object.assign({
                click: <EventListener>this.#handleColumnClickEvent.bind(this)
            }, {}) : {}
        });
        this.#gridColumnsMap.set(column, new WeakRef(gridColumnElement));
        return gridColumnElement;
    }

    #renderGridBodyRow(row: GridRowModel): Element {
        const {model} = this;
        const gridRowElement = element("e-gridrow", {
            attributes: {
                tabindex: -1
            },
            children: reactiveChildElements(
                model.columns, column => this.#renderGridDataCell(row, column)
            )
        });
        this.#gridRowsMap.set(row, new WeakRef(gridRowElement));
        return gridRowElement;
    }

    #renderGridDataCell(row: GridRowModel, column: GridColumnModel): Element {
        const gridCellElement = element("e-gridcell", {
            attributes: {
                type: "gridcell"
                /*style: this.resizable ?
                    "width:" +
                    `var(${this.#columnWidthVariableName(column.name)}, ` +
                    `var(${this.#columnDefaultWidthVariableName()}))`
                 : undefined,*/
            },
            children: [
                this.#cellDelegate(row, column)
            ]
        });
        return gridCellElement;
    }

    #handleColumnClickEvent(event: MouseEvent): void {
        const {target} = event;
        if (target instanceof HTMLEGridCellElement) {
            const {dataset} = target;
            let sortorder = dataset.sortorder ? parseInt(dataset.sortorder) : 1;
            sortorder *= -1;
            target.dataset.sortorder = String(sortorder);
            const {model} = this;
            const {rows, columns} = model;
            const column = Array.from(columns.values()).find(
                column_i => column_i.name === target.name
            );
            if (column) {
                rows.sort(
                    (row_1, row_2) => {
                        const cell_1 = String(column.extract(row_1));
                        const cell_2 = String(column.extract(row_2));
                        return sortorder * cell_1.localeCompare(cell_2);
                    }
                );
            }
        }
    }

    #handleColumnResizeEvent(event: Event): void {
        const {target} = event;
        if (target instanceof HTMLEWidthSashElement) {
            const {target: sashTarget} = target;
            const columnheader = <HTMLEGridCellElement | null>sashTarget;
            if (sashTarget && columnheader) {
                const grid = this.getGridElement();
                if (grid) {
                    grid.style.setProperty(
                        this.#columnWidthVariableName(columnheader.name),
                        window.getComputedStyle(sashTarget).getPropertyValue("width")
                    );
                }
            }
        }
    }

    #columnID(columnName: string): string {
        return `${columnName}-columnheader`;
    }

    #columnWidthVariableName(columnName: string): string {
        return `--${columnName}-columnheader-width`;
    }
    
    #columnDefaultWidthVariableName(): string {
        return `--default-columnheader-width`;
    }
}