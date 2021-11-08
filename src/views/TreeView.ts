import { HTML, ReactiveChildNodes, ReactiveNode, CustomElement } from "../elements/Element";
import { ListModel, ObjectModel } from "../models/Model";
import { HTMLView, HTMLViewBase } from "./View";

export class TreeModel extends ObjectModel {
    public items: ListModel<TreeItemModel>;
    
    constructor(items: TreeItemModel[] = []) {
        super();
        this.items = new ListModel(items);
    }
}

export class TreeItemModel extends ObjectModel {
    public items: ListModel<TreeItemModel>;
    public label: string;

    constructor(label: string, items: TreeItemModel[] = []) {
        super();
        this.label = label;
        this.items = new ListModel(items);
    }
}

interface HTMLVTreeView extends HTMLView {
    model: TreeModel;
}

declare global {
    interface HTMLElementTagNameMap {
        "v-treeview": HTMLVTreeView,
    }
}

@CustomElement({
    name: "v-treeview"
})
class HTMLVTreeViewBase extends HTMLViewBase implements HTMLVTreeView {
    model: TreeModel;

    constructor() {
        super();
        this.model = new TreeModel();
    }

    private renderTreeItem(item: TreeItemModel): Node {
        return ReactiveNode(item,
            HTML("e-treeitem", {
                part: [
                    "treeitem"
                ],
                exportparts: [
                    "content: treeitem-content",
                    "container: treeitem-container"
                ],
                properties: {
                    label: item.label,
                    leaf: item.items.length() === 0
                },
                children: ReactiveChildNodes(item.items,
                    item => this.renderTreeItem(item)
                )
            }),
            (node, property, oldValue, newValue) => {
                switch (property) {
                    case "label":
                        node.label = (newValue as TreeItemModel["label"]);
                        break;
                    case "items":
                        node.leaf = (newValue as TreeItemModel["items"]).length() === 0;
                        break;
                }
            }
        );
    };

    public render() {
        return HTML("e-tree", {
            part: [
                "tree"
            ],
            exportparts: [
                "container: tree-container"
            ],
            children: ReactiveChildNodes(
                this.model.items, item => this.renderTreeItem(item)
            )
        });
    }
}