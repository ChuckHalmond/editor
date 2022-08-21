import { EMenuItem } from "./src/elements/containers/menus/MenuItem";
import { HTMLEToolBarItemElement } from "./src/elements/containers/toolbars/ToolBarItem";
import { element, fragment, reactiveElement } from "./src/elements/Element";
import { ModelEvent, ModelList, ModelObject, ModelProperty } from "./src/models/Model";
import { GridColumnModel, GridModel, GridRowModel, GridView } from "./src/views/GridView";
import { TreeItemList, TreeItemModel, TreeModel, TreeView } from "./src/views/TreeView";
import { toolbarItemWidget } from "./src/views/widgets/toolbar/ToolBarItemWidget";
import { toolbarWidget } from "./src/views/widgets/toolbar/ToolBarWidget";
import { widget } from "./src/views/widgets/Widget";

class MyTreeItemList extends TreeItemList {
    readonly items!: MyTreeItemModel[];

    constructor(items: MyTreeItemModel[]) {
        super(items);
    }

    get count(): number {
        return this.items.length;
    }

    show(): void {
        this.items.forEach(item_i => item_i.show());
    }

    hide(): void {
        this.items.forEach(item_i => item_i.hide());
    }

    display(): void {
        const result = this.items.reduce(
            (result, item_i) => `${result} ${item_i.name}`, ""
        );
        console.log(result);
    }
}

class MyTreeItemModel extends TreeItemModel {
    
    @ModelProperty()
    childCount: number;

    @ModelProperty()
    visibility: boolean;

    constructor(init: {name: string, type: "leaf" | "parent", items?: TreeItemModel[]}) {
        super(init);
        this.childCount = this.childItems.length;
        this.visibility = true;
        this.addEventListener("modelchange", this.#handleModelChangeEvent.bind(this));
    }

    show(): void {
        this.visibility = true;
    }

    hide(): void {
        this.visibility = false;
    }

    display(): void {
        console.log(this.name);
    }

    #handleModelChangeEvent(event: ModelEvent): void {
        const {target} = event;
        const {childItems} = this;
        if (target == childItems) {
            this.childCount = childItems.length;
        }
    }
}

export async function TreeMain() {
    const gridView = new GridView();
    gridView.resizable = true;
    gridView.setModel(
        new GridModel({
            columns: [
                new GridColumnModel({
                    name: "name",
                    type: String,
                    label: "Name",
                    extract: (row) => row.name
                }),
                new GridColumnModel({
                    name: "age",
                    type: Number,
                    label: "Age",
                    extract: (row) => row.age,
                    filters: [{
                        name: "Minors",
                        filter: (row) => row.age < 18
                    },{
                        name: "Majors",
                        filter: (row) => row.age >= 18
                    }]
                }),
                new GridColumnModel({
                    name: "birthyear",
                    type: String,
                    label: "Brith Year",
                    extract: (row) => new Date().getFullYear() - row.age
                }),
            ],
            rows: [
                new GridRowModel({
                    id: 1,
                    name: "Denis",
                    age: 13
                }),
                new GridRowModel({
                    id: 2,
                    name: "Jean-Charles",
                    age: 32
                }),
                new GridRowModel({
                    id: 3,
                    name: "Charles",
                    age: 25
                }),
                new GridRowModel({
                    id: 4,
                    name: "Mamagubida",
                    age: 128
                })
            ]
        })
    );
    document.body.append(gridView);

    const treeModel = new TreeModel({
        items: [
            new MyTreeItemModel({
                name: "TI 0",
                type: "parent",
                items: [
                    new MyTreeItemModel({
                        name: "TI 1A",
                        type: "parent",
                        items: [
                            new MyTreeItemModel({
                                type: "leaf",
                                name: "TI 1AX"
                            }),
                        ]
                    }),
                    new MyTreeItemModel({
                        type: "parent",
                        name: "TI 1B"
                    })
                ]
            }),
            new MyTreeItemModel({
                name: "TI 1",
                type: "parent",
                items: [
                    new MyTreeItemModel({
                        name: "TI 1A",
                        type: "parent",
                        items: [
                            new MyTreeItemModel({
                                type: "leaf",
                                name: "TI 1AX"
                            }),
                        ]
                    }),
                    new MyTreeItemModel({
                        type: "parent",
                        name: "TI 1B"
                    })
                ]
            }),
            new MyTreeItemModel({
                type: "leaf",
                name: "TI 2"
            }),
            new MyTreeItemModel({
                type: "leaf",
                name: "TI 3"
            })
        ],
        /*sortFunction: (item_a: TreeItemModel, item_b: TreeItemModel) => {
            const {name: aLabel} = item_a;
            const {name: bLabel} = item_b;
            return bLabel.localeCompare(aLabel);
        }*/
    });
    (<any>window)["model"] = treeModel;
    const treeView = new TreeView(treeModel);
    treeView.itemContentDelegate = <typeof treeView.itemContentDelegate>(
        (item: MyTreeItemModel) => {
            return fragment(
                ...([
                    reactiveElement(
                        item,
                        element("span", {
                            attributes: {
                                class: "label"
                            }
                        }),
                        ["name"],
                        (label, property, oldValue, newValue) => {
                            label.textContent = `${item.name}`;
                        }
                    )
                ]).concat(
                    (item.type == "parent") ? [
                        reactiveElement(
                            item,
                            element("span", {
                                attributes: {
                                    class: "badge"
                                }
                            }),
                            ["childCount"],
                            (badge, property, oldValue, newValue) => {
                                badge.textContent = `(${newValue})`;
                            }
                        )
                    ] : []
                ).concat([
                    reactiveElement(
                        item,
                        element("e-toolbar", {
                            children: [
                                element("e-toolbaritem", {
                                    attributes: {
                                        name: "visibility",
                                        type: "checkbox",
                                        label: "Visibility"
                                    },
                                    listeners: {
                                        click: () => {
                                            item.visibility ?
                                                item.hide() :
                                                item.show();
                                        }
                                    }
                                })
                            ]
                        }),
                        ["visibility"],
                        (toolbar, property, oldValue, newValue) => {
                            switch (property) {
                                case "visibility": {
                                    const visibilityItem = toolbar
                                        .querySelector<HTMLEToolBarItemElement>("e-toolbaritem[name=visibility]");
                                    if (visibilityItem) {
                                        const label = newValue ? "Hide" : "Show";
                                        visibilityItem.label = label;
                                        visibilityItem.title = label;
                                        visibilityItem.pressed = newValue;
                                    }
                                }
                            }
                        }
                    )
                ])
            );
        }
    );
    treeView.itemContextMenuDelegate = <typeof treeView.itemContextMenuDelegate>(
        (activeItem: MyTreeItemModel, selectedItems: MyTreeItemModel[]) => {
            return fragment(
                element("e-menuitemgroup", {
                    children: [
                        element("e-menuitem", {
                            attributes: {
                                label: "Display"
                            },
                            children: "Display",
                            listeners: {
                                click: () => {
                                    const itemsList = new MyTreeItemList(selectedItems);
                                    itemsList.display();
                                }
                            }
                        }),
                        element("e-menuitem", {
                            attributes: {
                                label: "Delete"
                            },
                            children: "Delete",
                            listeners: {
                                click: () => {
                                    const itemsList = new MyTreeItemList(selectedItems);
                                    const {count} = itemsList;
                                    const doRemove = confirm(`Remove ${count} items?`);
                                    if (doRemove) {
                                        itemsList.remove();
                                    }
                                    treeView.treeElement().focus();
                                }
                            }
                        })
                    ]
                }),
                element("e-separator"),
                element("e-menuitemgroup", {
                    children: [
                        element("e-menuitem", {
                            attributes: {
                                type: "checkbox",
                                label: activeItem.visibility ? "Hide" : "Show"
                            },
                            children: activeItem.visibility ? "Hide" : "Show",
                            listeners: {
                                click: () => {
                                    const itemsList = new MyTreeItemList(selectedItems);
                                    activeItem.visibility ?
                                        itemsList.hide() :
                                        itemsList.show();
                                }
                            }
                        })
                    ]
                })
            )
        }
    );
    treeView.refresh();
    document.body.append(treeView);

    document.body.append(
        element("e-menubar", {
            children: element("e-menuitem", {
                attributes: {
                    type: "menu",
                    label: "Menu 1"
                },
                children: [
                    "Menu 1",
                    element("e-menu", {
                        attributes: {
                            slot: "menu"
                        },
                        children: [
                            element("e-menuitem", {
                                attributes: {
                                    type: "checkbox"
                                },
                                children: "Hey"
                            }),
                            element("e-menuitem", {
                                attributes: {
                                    type: "submenu"
                                },
                                children: [
                                    "Submenu 1",
                                    element("e-menu", {
                                        attributes: {
                                            slot: "menu"
                                        },
                                        children: [
                                            /*element("e-menuitem", {
                                                attributes: {
                                                    type: "checkbox"
                                                },
                                                children: "Yo"
                                            })*/
                                            new EMenuItem({
                                                label: "Yo"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        })
    );
        
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
            ]
        })
    );

    document.body.append(
        widget("toolbar", {
            slotted: [
                widget("toolbaritem",  {
                    properties: {
                        type: "menubutton"
                    },
                    slotted: [
                        "Yo!",
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
    );
}