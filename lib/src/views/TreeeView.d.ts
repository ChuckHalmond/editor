import { ModelList, ModelObject } from "../models/Model";
import { View } from "./View";
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
interface TreeViewConstructor {
    readonly prototype: TreeView;
    new (): TreeView;
    new (model: TreeModel): TreeView;
}
interface TreeView extends View {
    model: TreeModel;
}
declare global {
    interface HTMLElementTagNameMap {
        "v-treee": TreeView;
    }
}
declare var TreeView: TreeViewConstructor;
export declare var treeView: {
    "__#23961@#models": WeakMap<HTMLElement, TreeModel>;
    "__#23961@#dragImages": WeakMap<TreeItemModel, WeakRef<Element>>;
    create(model: TreeModel): HTMLElement;
    getModel(tree: HTMLElement): TreeModel | null;
    selectedItems(tree: HTMLElement): TreeItemModel[];
    "__#23961@#getDragImage"(model: TreeItemModel): Element | null;
    "__#23961@#renderTreeItem"(item: TreeItemModel): Element;
    "__#23961@#renderTreeItemDragImage"(item: TreeItemModel): Element;
    "__#23961@#handleDragStartEvent"(event: DragEvent): void;
    "__#23961@#handleDropEvent"(event: DragEvent): void;
    "__#23961@#handleContextMenuEvent"(event: MouseEvent): void;
    "__#23961@#handleFocusInEvent"(event: FocusEvent): void;
    "__#23961@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#23961@#handleKeyDownEvent"(event: KeyboardEvent): void;
};
