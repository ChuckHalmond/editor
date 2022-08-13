import { ModelList, ModelObject } from "../models/Model";
export { TreeItemList };
export { TreeModel };
export { TreeItemModel };
export { treeView };
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
    static from(items: TreeItemModel[]): TreeItemList;
    static of(...items: TreeItemModel[]): TreeItemList;
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
declare var treeView: {
    "__#31245@#models": WeakMap<HTMLElement, TreeModel>;
    "__#31245@#dragImages": WeakMap<TreeItemModel, WeakRef<Element>>;
    itemContentDelegate(item: TreeItemModel): string | Node;
    itemContextMenuDelegate(activeItem: TreeItemModel, selectedItems: TreeItemList): Node | null;
    create(init: {
        model: TreeModel;
    }): HTMLElement;
    getModel(tree: HTMLElement): TreeModel | null;
    selectedItems(tree: HTMLElement): TreeItemModel[];
    "__#31245@#getDragImage"(model: TreeItemModel): Element | null;
    "__#31245@#renderTreeItem"(item: TreeItemModel, model: TreeModel): Element;
    "__#31245@#renderTreeItemDragImage"(item: TreeItemModel): Element;
    "__#31245@#handleDragStartEvent"(event: DragEvent): void;
    "__#31245@#handleDropEvent"(event: DragEvent): void;
    "__#31245@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#31245@#handleFocusInEvent"(event: FocusEvent): void;
    "__#31245@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#31245@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
