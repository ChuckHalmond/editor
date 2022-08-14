import { ModelList, ModelObject } from "../models/Model";
import { View } from "./View";
export { TreeItemList };
export { TreeModel };
export { TreeItemModel };
export { TreeView };
declare class TreeModel extends ModelObject {
    #private;
    readonly items: ModelList<TreeItemModel>;
    readonly childItems: ModelList<TreeItemModel>;
    sortFunction: ((item_a: TreeItemModel, item_b: TreeItemModel) => number) | null;
    constructor();
    constructor(init: {
        items: TreeItemModel[];
        sortFunction?: (item_a: TreeItemModel, item_b: TreeItemModel) => number;
    });
    flattenItems(this: TreeModel | TreeItemModel): TreeItemModel[];
    getItemByUri(this: TreeModel | TreeItemModel, uri: string): TreeItemModel | null;
}
declare class TreeItemList {
    readonly items: TreeItemModel[];
    constructor(items: TreeItemModel[]);
    get count(): number;
    remove(): void;
}
declare class TreeItemModel extends ModelObject {
    readonly childItems: ModelList<TreeItemModel>;
    readonly type: "leaf" | "parent";
    readonly label: string;
    get uri(): string;
    get parentItem(): TreeItemModel | null;
    constructor(init: {
        label: string;
        type: "leaf" | "parent";
        items?: TreeItemModel[];
    });
    remove(): void;
}
interface TreeViewConstructor {
    prototype: TreeView;
    new (): TreeView;
    new (model: TreeModel): TreeView;
}
interface TreeView extends View {
    readonly shadowRoot: ShadowRoot;
    readonly model: TreeModel;
    itemContentDelegate: <Item extends TreeItemModel>(item: Item) => string | Node;
    itemContextMenuDelegate: <Item extends TreeItemModel>(activeItem: Item, selectedItems: Item[]) => string | Node;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-treeview": TreeView;
    }
}
declare var TreeView: TreeViewConstructor;
