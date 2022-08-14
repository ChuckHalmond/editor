import { ModelList, ModelObject } from "../models/Model";
export { TreeItemList };
export { TreeModel };
export { TreeItemModel };
export { treeView };
export { TreeViewFactoryBase };
export { TreeViewFactory };
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
interface TreeViewFactory {
    create(init: {
        model: TreeModel;
    }): HTMLElement;
    itemContentDelegate(item: TreeItemModel): string | Node;
    itemContextMenuDelegate(activeItem: TreeItemModel, selectedItems: TreeItemModel[]): Node;
    getModel(tree: HTMLElement): TreeModel | null;
    selectedItems(tree: HTMLElement): TreeItemModel[];
}
declare class TreeViewFactoryBase implements TreeViewFactory {
    #private;
    itemContextMenuDelegate(activeItem: TreeItemModel, selectedItems: TreeItemModel[]): Node;
    itemContentDelegate(item: TreeItemModel): string | Node;
    constructor();
    create(init: {
        model: TreeModel;
    }): HTMLElement;
    getModel(tree: HTMLElement): TreeModel | null;
    selectedItems(tree: HTMLElement): TreeItemModel[];
}
declare var treeView: TreeViewFactoryBase;
