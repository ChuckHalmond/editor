import { ModelList, ModelObject } from "../models/Model";
import { View } from "./View";
export { GridModel };
export { GridRowModel };
export { GridColumnModel };
export { GridView };
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
    name: string;
    age: number;
    constructor(init: {
        id: number;
        name: string;
        age: number;
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
    resizable: boolean;
    sortable: boolean;
    setColumnDelegate(delegate: (column: GridColumnModel) => string | Node): void;
    setCellDelegate(delegate: (row: GridRowModel, column: GridColumnModel) => string | Node): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridview": GridView;
    }
}
declare var GridView: GridViewConstructor;
