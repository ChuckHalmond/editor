import { MenuItemGroupWidget, MenuItemWidget, MenuWidget, MenuBarWidget } from "./src/views/MenuBarWidget";
import { TreeItemModel, TreeModel, TreeView } from "./src/views/TreeView";
import { Editor, HotKey, Key, KeyModifier } from "./index";
import "./index";
console.log("hello");
export async function main() {
    const tree = new TreeView();
    console.log("there");
    const menubar = new MenuBarWidget([
        new MenuItemWidget({
            label: "File",
            name: "file",
            type: "menu",
            menu: new MenuWidget({
                name: "File",
                groups: [
                    new MenuItemGroupWidget({
                        name: "fileActions",
                        items: [
                            new MenuItemWidget({
                                label: "Import file...",
                                name: "import"
                            }),
                            new MenuItemWidget({
                                label: "Export file...",
                                name: "export",
                                hotkey: new HotKey(Key.B, KeyModifier.Control, KeyModifier.Alt)
                            })
                        ]
                    })
                ]
            })
        }),
        new MenuItemWidget({
            label: "Preferences",
            name: "preferences",
            type: "menu",
            menu: new MenuWidget({
                name: "Preferences",
                groups: [
                    new MenuItemGroupWidget({
                        name: "fileActions",
                        items: [
                            new MenuItemWidget({
                                label: "Advanced User",
                                name: "advanced",
                                type: "checkbox",
                                hotkey: new HotKey(Key.A, KeyModifier.Control, KeyModifier.Alt)
                            }),
                            new MenuItemWidget({
                                label: "Layout",
                                name: "layout",
                                type: "submenu",
                                menu: new MenuWidget({
                                    name: "Layout",
                                    groups: [
                                        new MenuItemGroupWidget({
                                            name: "Layout",
                                            items: [
                                                new MenuItemWidget({
                                                    label: "Standard",
                                                    name: "standard",
                                                    type: "radio"
                                                }),
                                                new MenuItemWidget({
                                                    label: "Advanced",
                                                    name: "advanced",
                                                    type: "radio"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            })
                        ]
                    })
                ]
            })
        })
    ]);
    const treeModel = new TreeModel({
        items: [
            new TreeItemModel({
                label: "TI 1",
                type: "parent",
                items: [
                    new TreeItemModel({
                        label: "TI 1A",
                        type: "parent",
                        items: [
                            new TreeItemModel({
                                type: "leaf",
                                label: "TI 1AX"
                            }),
                        ]
                    }),
                    new TreeItemModel({
                        type: "parent",
                        label: "TI 1B"
                    })
                ]
            }),
            new TreeItemModel({
                type: "leaf",
                label: "TI 2"
            }),
            new TreeItemModel({
                type: "leaf",
                label: "TI 3"
            })
        ],
        sortFunction: (item_a, item_b) => {
            const { label: aLabel } = item_a;
            const { label: bLabel } = item_b;
            return bLabel.localeCompare(aLabel);
        }
    });
    tree.setModel(treeModel);
    document.body.append(tree);
    tree.model.items.append(new TreeItemModel({
        label: "yo",
        type: "parent",
        items: [
            new TreeItemModel({
                type: "leaf",
                label: "plop"
            })
        ]
    }));
    tree.model.items.insert(0, new TreeItemModel({
        label: "ouech",
        type: "parent"
    }));
    const newItem = new TreeItemModel({
        label: "ouech4",
        type: "parent"
    });
    tree.model.items.get(0).items.insert(0, newItem);
    tree.model.items.sort(tree.model.sortFunction);
    const editor = new Editor();
    editor.setup();
    /*editor.registerCheckboxAction("toggleAdvancedUser", (_, newValue) => {
        console.log(`Advanced user is now ${newValue}`);
    }, {hotkey: new HotKey(Key.ARROW_DOWN, KeyModifier.Alt)});

    editor.registerRadioAction("setLayout", (_, newValue) => {
        editor.setPair("layout", newValue);
    });

    editor.registerButtonAction("execLayout", () => {
        const layout = editor.getPair("layout");
        console.log(`Layout is ${layout}`);
    }, {hotkey: new HotKey(Key.ARROW_UP, KeyModifier.Alt)});*/
    editor.registerRadioAction("selectTest", (oldValue, newValue) => {
        console.log(`Test is ${newValue}`);
    }, { value: "2", key: "test" });
    document.body.append(menubar.element);
    /*setTimeout(() => {
        const execLayoutToolBarItem = document.querySelector<HTMLEActionElement>("e-toolbaritem[name=execLayout]");
        if (execLayoutToolBarItem) {
            editor.addPairListener("layout", (oldValue, newValue) => {
                if (newValue !== oldValue) {
                    execLayoutToolBarItem.value = newValue;
                }
            });
        }
    }, 100);

    const button = HTML("button", {
        properties: {
            textContent: "Focus"
        },
        listeners: {
            click: () => {
                const menuitem = document.querySelector<HTMLEMenuItemElement>("e-menuitem#hey");
                if (menuitem) {
                    menuitem.focus();
                }
            }
        }
    });
    document.body.append(button);
    document.body.append(menubar.element);
    
    editor.executeCheckboxAction("toggleAdvancedUser", true);
    editor.setCheckboxActionValue("toggleAdvancedUser", false);*/
    //editor.setRadioActionValue("selectTest", "2");
    //editor.executeRadioAction("setLayout", "other");
}
//# sourceMappingURL=main.js.map