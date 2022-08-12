//import { MenuItemGroupWidget, MenuItemWidget, MenuWidget, MenuBarWidget } from "./src/views/MenuBarWidget";
import { treeView, TreeItemModel, TreeModel } from "./src/views/TreeView";

import "./index";
import { ListItemModel, ListModel, ListView } from "./src/views/ListView";
import { GridColumnModel, GridModel, GridRowModel, GridView } from "./src/views/GridView";
import { element, fragment } from "./src/elements/Element";
import { treeItemWidget } from "./src/views/widgets/tree/TreeItemWidget";
import { widget } from "./src/views/widgets/Widget";
import { Editor } from "./src/Editor";
import { comboBoxWidget, menuWidget, optionWidget } from "./index";

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
    const treeElement = treeView.create(treeModel);
    document.body.append(treeElement);
    
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

    //document.body.append(listView);

    // Menu actions
    // Toolbar actions
    const gridView = new GridView();
    gridView.resizable = true;
    gridView.sortable = true;
    /*gridView.setColumnDelegate((column) => {
        return fragment(
            element("label", {
                children: column.label
            }),
            element("e-toolbar", {
                children: [
                    element("e-toolbaritem", {
                        attributes: {
                            type: "button"
                        }
                    })
                ]
            })
        );
    });*/
    gridView.setModel(
        new GridModel({
            columns: [
                new GridColumnModel({
                    name: "name",
                    label: "Name",
                    extract: (row) => row.name
                }),
                new GridColumnModel({
                    name: "age",
                    label: "Age",
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
                }),
                new GridRowModel({
                    name: "Mamagubida",
                    age: 128
                })
            ]
        })
    );
    document.body.append(gridView);
    
    const menuView = widget("menubar", {
        slotted: [
            widget("menuitem", {
                properties: {
                    label: "MenuItem 0",
                    name: "MenuItem 0",
                    type: "menu",
                    disabled: true
                },
                slotted: [
                    widget("menu", {
                        slotted: [
                            widget("menuitem", {
                                properties: {
                                    label: "MenuItem 1",
                                    name: "MenuItem 1",
                                    type: "checkbox"
                                }
                            })
                        ]
                    })
                ]
            }),
            widget("menuitem", {
                properties: {
                    label: "MenuItem 0",
                    name: "MenuItem 0",
                    type: "menu"
                },
                slotted: [
                    widget("menu", {
                        slotted: [
                            widget("menuitem", {
                                properties: {
                                    label: "MenuItem 1",
                                    name: "MenuItem 1",
                                    type: "checkbox"
                                }
                            })
                        ]
                    })
                ]
            }),
            widget("menuitem", {
                properties: {
                    label: "MenuItem 1",
                    name: "MenuItem 1",
                    type: "menu"
                },
                slotted: [
                    widget("menu", {
                        slotted: [
                            widget("menuitemgroup", {
                                slotted: [
                                    widget("menuitem", {
                                        properties: {
                                            label: "MenuItem 1",
                                            type: "checkbox",
                                            keyshortcut: "Ctrl+B",
                                            disabled: true,
                                            checked: true
                                        }
                                    }),
                                    widget("menuitem", {
                                        properties: {
                                            type: "button",
                                            label: "MenuItem 2",
                                            keyshortcut: "Ctrl+A"
                                        }
                                    })
                                ]
                            }),
                            widget("separator"),
                            widget("menuitem", {
                                properties: {
                                    label: "Submenu",
                                    type: "submenu"
                                },
                                slotted: [
                                    widget("menu", {
                                        slotted: [
                                            widget("menuitem", {
                                                properties: {
                                                    label: "MenuItem 1",
                                                    type: "radio",
                                                    name: "radio",
                                                    value: "1"
                                                }
                                            }),
                                            widget("menuitem", {
                                                properties: {
                                                    type: "radio",
                                                    label: "MenuItem 2",
                                                    name: "radio",
                                                    value: "2"
                                                }
                                            }),
                                            widget("menuitem", {
                                                properties: {
                                                    type: "radio",
                                                    label: "MenuItem 3",
                                                    name: "radio",
                                                    value: "3"
                                                }
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    })
    document.body.append(menuView);


    /*const tree = widget("tree", {
        slotted: [
            widget("treeitem", {
                properties: {
                    label: "treeitem 0",
                    type: "parent",
                    draggable: true
                    //disabled: true
                },
                slotted: {
                    group: [
                        widget("treeitemgroup", {
                            slotted: [
                                widget("treeitem", {
                                    properties: {
                                        label: "treeitem 1",
                                        type: "leaf",
                                        draggable: true
                                    }
                                })
                            ]
                        })
                    ]
                },
                listeners: {
                    contextmenu: <EventListener>((event: MouseEvent) => {
                        const {target, clientX, clientY} = event;
                        const targetItem = <HTMLElement>(<HTMLElement>target).closest(".treeitem");
                        const menu = widget("menu", {
                            properties: {
                                contextual: true
                            },
                            slotted: [
                                widget("menuitemgroup", {
                                    slotted: [
                                        widget("menuitem", {
                                            properties: {
                                                label: "Display"
                                            },
                                            listeners: {
                                                click: () => {
                                                    console.log(treeItemWidget.getLabel(targetItem));
                                                }
                                            }
                                        }),
                                        widget("menuitem", {
                                            properties: {
                                                label: "Delete"
                                            },
                                            listeners: {
                                                click: () => {
                                                    targetItem.remove();
                                                }
                                            }
                                        })
                                    ]
                                }),
                            ]
                        });
                        targetItem.append(menu);
                        menuWidget.positionContextual(menu, clientX, clientY);
                        menu.focus({preventScroll: true});
                        event.preventDefault();
                    })
                }
            }),
            widget("treeitem", {
                properties: {
                    label: "treeitem 0",
                    type: "parent",
                    draggable: true,
                    disabled: true
                },
                slotted: {
                    group: [
                        widget("treeitemgroup", {
                            slotted: [
                                widget("treeitem", {
                                    properties: {
                                        label: "treeitem 1",
                                        type: "leaf",
                                        draggable: true
                                    }
                                })
                            ]
                        })
                    ]
                }
            }),
            widget("treeitem", {
                properties: {
                    label: "treeitem 1",
                    type: "leaf",
                    draggable: true
                },
                slotted: {
                    content: [
                        widget("toolbar", {
                            slotted: [
                                widget("toolbaritem",  {
                                    properties: {
                                        label: "First item",
                                        type: "button"
                                    }
                                }),
                                widget("toolbaritem",  {
                                    properties: {
                                        label: "Second item",
                                        type: "checkbox"
                                    }
                                })
                            ]
                        })
                    ]
                }
            })
        ]
    })
    document.body.append(tree);*/

    document.body.append(
        widget("toolbar", {
            slotted: [
                widget("toolbaritem",  {
                    properties: {
                        label: "First item",
                        type: "menubutton"
                    },
                    slotted: [
                        widget("menu", {
                            slotted: [
                                widget("menuitem", {
                                    properties: {
                                        label: "MenuItem 1",
                                        name: "MenuItem 1",
                                        type: "checkbox"
                                    }
                                }),
                                widget("menuitem", {
                                    properties: {
                                        label: "MenuItem 2",
                                        name: "MenuItem 2",
                                        type: "checkbox"
                                    }
                                })
                            ]
                        })
                    ]
                }),
                widget("toolbaritem",  {
                    properties: {
                        label: "Second item",
                        type: "checkbox"
                    }
                }),
                widget("toolbaritem",  {
                    properties: {
                        label: "Third item",
                        type: "checkbox",
                        disabled: true,
                    }
                }),
                widget("toolbaritem",  {
                    properties: {
                        label: "Fourth item",
                        type: "checkbox"
                    }
                })
            ]
        })
    );

    document.body.append(
        widget("list", {
            slotted: [
                widget("listitemgroup",  {
                    slotted: [   
                        widget("listitem",  {
                            properties: {
                                label: "First item"
                            }
                        })
                    ]
                }),
                widget("listitem",  {
                    properties: {
                        label: "Second item"
                    },
                    slotted: [
                        widget("toolbar", {
                            slotted: [
                                widget("toolbaritem",  {
                                    properties: {
                                        label: "First item",
                                        type: "button"
                                    }
                                }),
                                widget("toolbaritem",  {
                                    properties: {
                                        label: "Second item",
                                        type: "checkbox"
                                    }
                                })
                            ]
                        })
                    ]
                }),
                widget("listitem",  {
                    properties: {
                        label: "Third item",
                        disabled: true,
                    }
                }),
                widget("listitem",  {
                    properties: {
                        label: "Fourth item"
                    }
                })
            ]
        })
    );

    document.body.append(
        widget("grid", {
            properties: {
                selectby: "row",
                multisectable: true
            },
            slotted: {
                headers: [
                    widget("gridheader",  {
                        slotted: "First header"
                    }),
                    widget("gridheader",  {
                        slotted: "Second header"
                    })
                ],
                rows: [
                    widget("gridrow",  {
                        slotted: [   
                            widget("gridcell",  {
                                slotted: "First cell"
                            }),
                            widget("gridcell",  {
                                slotted: "Second cell"
                            })
                        ]
                    }),
                    widget("gridrow",  {
                        slotted: [   
                            widget("gridcell",  {
                                slotted: "Third cell"
                            }),
                            widget("gridcell",  {
                                slotted: "Fourth cell"
                            })
                        ]
                    }),
                    widget("gridrow",  {
                        slotted: [   
                            widget("gridcell",  {
                                slotted: "Fifth cell"
                            }),
                            widget("gridcell",  {
                                slotted: "Sixth cell"
                            })
                        ]
                    }),
                    widget("gridrow",  {
                        slotted: [   
                            widget("gridcell",  {
                                slotted: "Heighth cell"
                            }),
                            widget("gridcell",  {
                                slotted: "Nineth cell"
                            })
                        ]
                    })
                ]
            }
        })
    );

    document.body.append(
        widget("combobox", {
            slotted: [
                widget("option",  {
                    properties: {
                        label: "First option"
                    }
                }),
                widget("option",  {
                    properties: {
                        label: "Second option"
                    }
                }),
                widget("option",  {
                    properties: {
                        label: "Third option",
                        selected: true
                    }
                })
            ],
            listeners: {
                change: (event) => {
                    const {currentTarget} = event;
                    const comboBoxTarget = <HTMLElement>currentTarget;
                    console.log(optionWidget.getLabel(comboBoxWidget.selectedOption(comboBoxTarget)!));
                }
            }
        })
    );
    
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