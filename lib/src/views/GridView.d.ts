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
    readonly prototype: any;
};
declare type GridRowFilter = {
    name: string;
    filter: (row: GridRowModel) => boolean;
};
declare class GridColumnModel<T extends Constructor = Constructor> extends ModelObject {
    readonly name: string;
    readonly label: string;
    readonly type: T;
    readonly extract: (row: GridRowModel) => InstanceType<T>;
    readonly filters: GridRowFilter[];
    sortorder: number | undefined;
    constructor(init: {
        name: string;
        label: string;
        type: T;
        extract: (row: GridRowModel) => InstanceType<T>;
        filters?: GridRowFilter[];
    });
}
declare class GridRowModel extends ModelObject {
    label: string;
    age: number;
    constructor(init: {
        label: string;
        age: number;
    });
}
interface GridViewConstructor {
    readonly prototype: GridView;
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
