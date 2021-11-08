import { ListModel, ObjectModel } from "../models/Model";
import { HTMLView } from "./View";
export declare class TreeModel extends ObjectModel {
    items: ListModel<TreeItemModel>;
    constructor(items?: TreeItemModel[]);
}
export declare class TreeItemModel extends ObjectModel {
    items: ListModel<TreeItemModel>;
    label: string;
    constructor(label: string, items?: TreeItemModel[]);
}
interface HTMLVTreeView extends HTMLView {
    model: TreeModel;
}
declare global {
    interface HTMLElementTagNameMap {
        "v-treeview": HTMLVTreeView;
    }
}
export {};
