import { HTMLEGridElement } from "../elements/containers/grid/Grid";
import { HTMLEGridCellElement } from "../elements/containers/grid/GridCell";
import { HTMLEGridRowElement } from "../elements/containers/grid/GridRow";
import { ModelList, ModelObject } from "../models/Model";
export { GridModel };
export { GridRowModel };
export { GridColumnModel };
export { GridWidget };
declare class GridModel extends ModelObject {
    readonly rows: ModelList<GridRowModel>;
    readonly columns: ModelList<GridColumnModel>;
    constructor();
    constructor(init: {
        rows: GridRowModel[];
        columns: GridColumnModel[];
    });
}
declare class GridColumnModel extends ModelObject {
    readonly name: string;
    readonly label: string;
    readonly extract: (row: GridRowModel) => any;
    constructor(init: {
        name: string;
        label: string;
        extract: (row: GridRowModel) => any;
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
declare class GridWidget {
    #private;
    get model(): GridModel;
    get element(): HTMLEGridElement;
    resizable: boolean;
    sortable: boolean;
    constructor();
    setModel(model: GridModel): void;
    setColumnDelegate(delegate: (column: GridColumnModel) => string | Node): void;
    setCellDelegate(delegate: (row: GridRowModel, column: GridColumnModel) => string | Node): void;
    getGridElement(): HTMLEGridElement | null;
    getGridRowElement(row: GridRowModel): HTMLEGridRowElement | null;
    getGridColumnCellElement(column: GridColumnModel): HTMLEGridCellElement | null;
    render(): HTMLEGridElement;
}
