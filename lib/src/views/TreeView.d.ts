import { HTMLEMenuElement } from "../elements/containers/menus/Menu";
import { HTMLEToolBarElement } from "../elements/containers/toolbars/ToolBar";
import { HTMLETreeElement } from "../elements/containers/trees/Tree";
import { HTMLETreeItemElement } from "../elements/containers/trees/TreeItem";
import { ModelList, ModelObject } from "../models/Model";
import { View } from "./View";
export { TreeItemModelList };
export { TreeModel };
export { TreeItemModel };
export { TreeView };
interface TreeModelInit {
    items: TreeItemModel[];
    sortFunction?: (item_a: TreeItemModel, item_b: TreeItemModel) => number;
}
declare class TreeModel extends ModelObject {
    #private;
    readonly items: ModelList<TreeItemModel>;
    readonly childItems: ModelList<TreeItemModel>;
    sortFunction: ((item_a: TreeItemModel, item_b: TreeItemModel) => number) | null;
    constructor();
    constructor(init: TreeModelInit);
    flattenItems(): TreeItemModel[];
    getItemByUri(this: TreeModel | TreeItemModel, uri: string): TreeItemModel | null;
}
declare class TreeItemModelList {
    readonly items: TreeItemModel[];
    constructor(items: TreeItemModel[]);
    get count(): number;
    remove(): void;
}
declare class TreeItemModel extends ModelObject {
    readonly childItems: ModelList<TreeItemModel>;
    readonly type: "leaf" | "parent";
    readonly name: string;
    index: number;
    get level(): number;
    get uri(): string;
    get parentItem(): TreeItemModel | null;
    constructor(init: {
        name: string;
        type: "leaf" | "parent";
        items?: TreeItemModel[];
    });
    flattenItems(): TreeItemModel[];
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
    setModel(model: TreeModel): void;
    renderShadow(): Node;
    draggable: boolean;
    selectedItems(): TreeItemModel[];
    activeItem(): TreeItemModel | null;
    get treeElement(): HTMLETreeElement | null;
    treeItemElement(item: TreeItemModel): HTMLETreeItemElement | null;
    itemContentDelegate(this: TreeView, item: TreeItemModel): string | Node;
    itemToolbarDelegate(this: TreeView, item: TreeItemModel): HTMLEToolBarElement | null;
    itemMenuDelegate(this: TreeView): HTMLEMenuElement | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-treeview": TreeView;
    }
}
declare var TreeView: TreeViewConstructor;
