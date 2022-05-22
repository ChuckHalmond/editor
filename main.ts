//import { MenuItemGroupWidget, MenuItemWidget, MenuWidget, MenuBarWidget } from "./src/views/MenuBarWidget";
import { TreeItemModel, TreeModel, TreeView } from "./src/views/TreeView";
import { Editor, HotKey, Key, KeyModifier } from "./index";

import "./index";
import { ListItemModel, ListModel, ListView } from "./src/views/ListView";
import { GridColumnModel, GridModel, GridRowModel, GridView } from "./src/views/GridView";
import { element, Fragment, widget } from "./src/elements/Element";
import { MenuItemModel, MenuModel, MenuView } from "./src/views/MenuView";
import { MenuItemWidget } from "./src/views/widgets/MenuItemWidget";
import { MenuWidget } from "./src/views/widgets/MenuWidget";

export async function main() {
    
    /*const menubar = new MenuBarWidget([
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
    ]);*/

    const treeView = new TreeView();
    const treeModel = new TreeModel({
        items: [
            new TreeItemModel({
                label: "TI 0",
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
        sortFunction: (item_a: TreeItemModel, item_b: TreeItemModel) => {
            const {label: aLabel} = item_a;
            const {label: bLabel} = item_b;
            return bLabel.localeCompare(aLabel);
        }
    });
    treeView.setModel(treeModel);
    document.body.append(treeView);
    
    treeModel.childItems.append(
        new TreeItemModel({
            label: "yo",
            type: "parent",
            items: [
                new TreeItemModel({
                    type: "leaf",
                    label: "plop"
                })
            ]
        })
    );

    const listView = new ListView();
    listView.setModel(
        new ListModel({
            items: [
                new ListItemModel({
                    label: "Hey"
                }),
                new ListItemModel({
                    label: "Yo"
                })
            ]
        })
    );

    document.body.append(listView);

    // Menu actions
    // Toolbar actions
    const gridView = new GridView();
    gridView.resizable = true;
    gridView.sortable = true;
    gridView.setColumnDelegate((column) => {
        return Fragment(
            element("label", {
                properties: {
                    textContent: column.label
                }
            })/*,
            element("e-toolbar", {
                children: [
                    element("e-toolbaritem", {
                        properties: {
                            type: "button"
                        }
                    })
                ]
            })*/
        );
    });
    gridView.setModel(
        new GridModel({
            columns: [
                new GridColumnModel({
                    name: "name",
                    label: "Name",
                    type: String,
                    extract: (row) => row.name
                }),
                new GridColumnModel({
                    name: "age",
                    label: "Age",
                    type: Number,
                    extract: (row) => row.age,
                    filters: [{
                        name: "Minors",
                        filter: (row) => row.age < 18
                    },{
                        name: "Majors",
                        filter: (row) => row.age >= 18
                    }]
                })
            ],
            rows: [
                new GridRowModel({
                    name: "Denis",
                    age: 13
                }),
                new GridRowModel({
                    name: "Jean-Charles",
                    age: 32
                }),
                new GridRowModel({
                    name: "Charles",
                    age: 25
                })
            ]
        })
    );

    //document.body.append(gridView);
    /*const menuWidget = new MenuWidget([
        new MenuItemWidget({
            label: "MenuItem A1",
            type: "checkbox"
        }),
        new MenuItemWidget({
            label: "MenuItem A2",
            type: "submenu",
            menu: new MenuWidget([
                new MenuItemWidget({label: "MenuItem B1", type: "checkbox"}),
                new MenuItemWidget({label: "MenuItem B2", type: "checkbox"})
            ])
        })
    ]);
    document.body.append(menuWidget.element);*/

    const menuView = new MenuView(
        new MenuModel({
            items: [
                new MenuItemModel({
                    name: "MenuItem A1",
                    label: "MenuItem A1",
                    type: "submenu",
                    menu: new MenuModel({
                        name: "MenuItem A2",
                        items: [
                            new MenuItemModel({name: "MenuItem B1", label: "MenuItem B1", type: "checkbox"}),
                            new MenuItemModel({name: "MenuItem B2", label: "MenuItem B2", type: "checkbox"})
                        ]
                    })
                }),
            ]
        })
    );
    document.body.append(menuView);
    const submenuItems = [
        widget("menuitem", {
            properties: {
                type: "checkbox",
                label: "First"
            }
        }),
        widget("menuitem", {
            properties: {
                type: "button",
                label: "Second"
            }
        })
    ];
    const submenu = widget("menu");
    submenu.insertItems(0, ...submenuItems);

    const menu = widget("menu", {
        children: [
            widget("menuitem", {
                properties: {
                    type: "checkbox",
                    label: "Hello, World!"
                }
            }).element,
            widget("menuitem", {
                properties: {
                    type: "submenu",
                    label: "Submenu",
                    hasPopup: true
                },
                children: [
                    submenu.element
                ]
            }).element,
        ]
    });
    
    menu.items[0].trigger();

    document.body.append(menu.element);
    
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


    /*editor.registerRadioAction("selectTest", (oldValue, newValue) => {
        console.log(`Test is ${newValue}`);
    }, {value: "2", key: "test"});

    document.addEventListener("slotchange", (event) => {
        console.log(event);
    });*/
    
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

    const button = element("button", {
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