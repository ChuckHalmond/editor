import { ModelList, ModelObject } from "../models/Model";
import { View } from "./View";
import { HTMLEGridCellElement } from "../elements/containers/grid/GridCell";
import { HTMLEGridElement } from "../elements/containers/grid/Grid";
import { HTMLEGridRowElement } from "../elements/containers/grid/GridRow";
export { GridModel };
export { GridRowModel };
export { GridRowFilter };
export { GridColumnModel };
export { GridView };
import "../elements/controls/sashes";
import "../elements/containers/grid";
import "../elements/containers/menus";
interface GridInit {
    rows: GridRowModel[];
    columns: GridColumnModel[];
}
declare class GridModel extends ModelObject {
    readonly rows: ModelList<GridRowModel>;
    readonly columns: ModelList<GridColumnModel>;
    constructor();
    constructor(init: GridInit);
    getColumnByName(name: string): GridColumnModel | null;
    sortByColumn(column: GridColumnModel, sortOrder: number): void;
}
declare type GridRowFilter = {
    filter: (row: GridRowModel) => boolean;
};
interface GridColumnInit {
    name: string;
    type: NumberConstructor | StringConstructor | DateConstructor;
    label: string;
    extract: (row: GridRowModel) => string;
    filters?: (GridRowFilter & {
        name: string;
    })[];
}
declare class GridColumnModel extends ModelObject {
    readonly name: string;
    readonly type: NumberConstructor | StringConstructor | DateConstructor;
    readonly label: string;
    readonly extract: (row: GridRowModel) => string;
    readonly filters: (GridRowFilter & {
        name: string;
    })[];
    sortorder: number | undefined;
    constructor(init: GridColumnInit);
}
declare class GridRowModel extends ModelObject {
    id: number;
    constructor(init: {
        id: number;
    });
}
interface GridViewConstructor {
    prototype: GridView;
    new (): GridView;
    new (model: GridModel): GridView;
}
interface GridView extends View {
    readonly shadowRoot: ShadowRoot;
    model: GridModel;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get gridElement(): HTMLEGridElement;
    filter(row: GridRowModel): boolean;
    setColumnDelegate(delegate: (column: GridColumnModel) => string | Node): void;
    setCellDelegate(delegate: (row: GridRowModel, column: GridColumnModel) => string | Node): void;
    getRowElement(row: GridRowModel): HTMLEGridRowElement | null;
    getColumnHeaderElement(column: GridColumnModel): HTMLEGridCellElement | null;
    getColumnCellsElements(column: GridColumnModel): HTMLEGridCellElement[];
    renderShadow(): Node;
    addDisplayFilter(filter: (GridRowFilter & {
        name: string;
    })): void;
    removeDisplayFilter(filter: (GridRowFilter & {
        name: string;
    })): void;
    removeAllDisplayFilters(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridview": GridView;
    }
}
declare var GridView: GridViewConstructor;
