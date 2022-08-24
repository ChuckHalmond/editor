import { HTMLEMenuElement } from "./src/elements/containers/menus/Menu";
import { EMenuItem } from "./src/elements/containers/menus/MenuItem";
import { HTMLEToolBarElement } from "./src/elements/containers/toolbars/ToolBar";
import { HTMLEToolBarItemElement } from "./src/elements/containers/toolbars/ToolBarItem";
import { HTMLETreeElement } from "./src/elements/containers/trees/Tree";
import { HTMLETreeItemElement } from "./src/elements/containers/trees/TreeItem";
import { CustomElement, element, fragment, reactiveElement } from "./src/elements/Element";
import { ModelEvent, ModelProperty } from "./src/models/Model";
import { GridColumnModel, GridModel, GridRowModel, GridView } from "./src/views/GridView";
import { MenuItemModel, MenuModel, MenuView } from "./src/views/MenuView";
import { TreeItemModelList, TreeItemModel, TreeModel, TreeView } from "./src/views/TreeView";
import { widget } from "./src/views/widgets/Widget";

class MyTreeItemModelList extends TreeItemModelList {
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
        const result = this.items.map(item_i => item_i.name).join(" ");
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
                    extract: (row) => String(row.age),
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
                    extract: (row) => String(new Date().getFullYear() - row.age)
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
    document.body.append(
        new MenuView(
            new MenuModel({
                items: [
                    new MenuItemModel({
                        label: "Menuitem 1",
                        type: "checkbox"
                    })
                ]
            })
        )
    );

    @CustomElement({
        name: "e-mytreeview"
    })
    class MyTreeView extends TreeView {

        override render(): void {
            super.render();
            const {shadowRoot, treeElement} = this;
            shadowRoot.prepend(
                element("link", {
                    attributes: {
                        rel: "stylesheet",
                        href: "css/views/mytreeview.css"
                    }
                })
            );
            treeElement!.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
        }

        override itemContentDelegate(item: MyTreeItemModel) {
            return fragment(
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
                ),
                ...(
                    item.type == "parent" ? [
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
                )
            );
        }

        override itemToolbarDelegate(this: TreeView, item: MyTreeItemModel): HTMLEToolBarElement {
            return reactiveElement(
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
        }

        override itemMenuDelegate(this: TreeView): HTMLEMenuElement {
            const {treeElement} = this;
            const {activeItem: activeItemElement} = treeElement!;
            const selectedItems = <MyTreeItemModel[]>this.selectedItems();
            const activeItem = <MyTreeItemModel>this.activeItem();
            return element("e-menu", {
                attributes: {
                    contextual: true
                },
                children: [
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
                                        const selectedItemsList = selectedItems.includes(activeItem) ?
                                            new MyTreeItemModelList(selectedItems) : new MyTreeItemModelList([activeItem]);
                                        activeItem.visibility ?
                                            selectedItemsList.hide() :
                                            selectedItemsList.show();
                                        activeItemElement!.focus();
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
                                    label: "Delete"
                                },
                                children: "Delete",
                                listeners: {
                                    click: () => {
                                        const selectedItemsList = selectedItems.includes(activeItem) ?
                                            new MyTreeItemModelList(selectedItems) : new MyTreeItemModelList([activeItem]);
                                        const {count} = selectedItemsList;
                                        const doRemove = confirm(`Remove ${count} items?`);
                                        if (doRemove) {
                                            selectedItemsList.remove();
                                        }
                                        treeElement!.focus();
                                    }
                                }
                            })
                        ]
                    })
                ]
            });
        }

        #handleKeyDownEvent(event: KeyboardEvent) {
            const {currentTarget, target, key} = event;
            const targetTree = <HTMLETreeElement>currentTarget;
            const targetItem = <HTMLETreeItemElement>(<Element>target).closest("e-treeitem");
            const selectedItems = this.selectedItems();
            const {model} = this;
            const targetItemModel = model.getItemByUri(targetItem.dataset.uri!)!;
            switch (key) {
                case "Delete": {
                    const selectedItemsList = selectedItems.includes(targetItemModel) ?
                        new TreeItemModelList(selectedItems) : new TreeItemModelList([targetItemModel]);
                    const {count} = selectedItemsList;
                    const doRemove = confirm(`Remove ${count} items?`);
                    if (doRemove) {
                        selectedItemsList.remove();
                    }
                    targetTree.focus();
                    event.preventDefault();
                    break;
                }
            }
        }
    };

    const treeView = new MyTreeView();
    treeView.draggable = true;
    treeView.setModel(treeModel);
    treeView.render();
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