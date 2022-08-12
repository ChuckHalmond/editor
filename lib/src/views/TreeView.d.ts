import { ModelList, ModelObject } from "../models/Model";
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
interface TreeItem {
    show(): void;
    hide(): void;
    display(): void;
    remove(): void;
}
declare class TreeItemModel extends ModelObject implements TreeItem {
    #private;
    readonly childItems: ModelList<TreeItemModel>;
    readonly type: "leaf" | "parent";
    readonly label: string;
    childCount: number;
    visibility: boolean;
    get uri(): string;
    get parentItem(): TreeItemModel | null;
    constructor(init: {
        label: string;
        type: "leaf" | "parent";
        items?: TreeItemModel[];
    });
    show(): void;
    hide(): void;
    display(): void;
    remove(): void;
}
declare var treeView: {
    "__#66@#models": WeakMap<HTMLElement, TreeModel>;
    "__#66@#dragImages": WeakMap<TreeItemModel, WeakRef<Element>>;
    create(model: TreeModel): HTMLElement;
    getModel(tree: HTMLElement): TreeModel | null;
    selectedItems(tree: HTMLElement): TreeItemModel[];
    "__#66@#getDragImage"(model: TreeItemModel): Element | null;
    "__#66@#renderTreeItem"(item: TreeItemModel): Element;
    "__#66@#renderTreeItemDragImage"(item: TreeItemModel): Element;
    "__#66@#handleDragStartEvent"(event: DragEvent): void;
    "__#66@#handleDropEvent"(event: DragEvent): void;
    "__#66@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#66@#handleFocusInEvent"(event: FocusEvent): void;
    "__#66@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#66@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
