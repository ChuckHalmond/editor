import { ModelList, ModelObject } from "../models/Model";
import { View } from "./View";
export { GridModel };
export { GridRowModel };
export { GridColumnModel };
export { GridView };
declare class GridModel extends ModelObject {
    readonly rows: ModelList<GridRowModel>;
    readonly columns: ModelList<GridColumnModel>;
    constructor();
    constructor(init: {
        rows: GridRowModel[];
        columns: GridColumnModel[];
    });
    getColumnByName(name: string): GridColumnModel | null;
    sortByColumn(column: GridColumnModel, sortOrder: number): void;
}
declare type Constructor = {
    new (...args: any): any;
    prototype: any;
};
declare type GridRowFilter = {
    filter: (row: GridRowModel) => boolean;
};
declare class GridColumnModel<T extends Constructor = Constructor> extends ModelObject {
    readonly name: string;
    readonly label: string;
    readonly extract: (row: GridRowModel) => InstanceType<T>;
    readonly filters: (GridRowFilter & {
        name: string;
    })[];
    sortorder: number | undefined;
    constructor(init: {
        name: string;
        label: string;
        extract: (row: GridRowModel) => InstanceType<T>;
        filters?: (GridRowFilter & {
            name: string;
        })[];
    });
}
declare class GridRowModel extends ModelObject {
    name: string;
    age: number;
    constructor(init: {
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
        "v-grid": GridView;
    }
}
declare var GridView: GridViewConstructor;
