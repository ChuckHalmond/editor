import { HTML } from "./index";

import { TreeItemModel, TreeModel } from "./src/views/TreeView";

export async function main() {
    document.body.append(HTML("v-treeview", {
        properties: {
            model: new TreeModel([
                new TreeItemModel("TI 1", [
                    new TreeItemModel("TI 1A", [
                        new TreeItemModel("TI 1AX"),
                    ]),
                    new TreeItemModel("TI 1B")
                ]),
                new TreeItemModel("TI 2"),
                new TreeItemModel("TI 3")
            ])
        }
    }));
}