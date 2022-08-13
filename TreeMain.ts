
import { ModelEvent, ModelList, ModelObject, ModelProperty } from "./src/models/Model";
import { TreeItemList, TreeItemModel, TreeModel, treeView } from "./src/views/TreeView";

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
            (result, item_i) => `${result} ${item_i.label}`, ""
        );
        console.log(result);
    }
}

class MyTreeItemModel extends TreeItemModel {

    @ModelProperty()
    childCount: number;

    @ModelProperty()
    visibility: boolean;

    constructor(init: {label: string, type: "leaf" | "parent", items?: TreeItemModel[]}) {
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
        console.log(this.label);
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
    const treeModel = new TreeModel({
        items: [
            new MyTreeItemModel({
                label: "TI 0",
                type: "parent",
                items: [
                    new MyTreeItemModel({
                        label: "TI 1A",
                        type: "parent",
                        items: [
                            new MyTreeItemModel({
                                type: "leaf",
                                label: "TI 1AX"
                            }),
                        ]
                    }),
                    new MyTreeItemModel({
                        type: "parent",
                        label: "TI 1B"
                    })
                ]
            }),
            new MyTreeItemModel({
                label: "TI 1",
                type: "parent",
                items: [
                    new MyTreeItemModel({
                        label: "TI 1A",
                        type: "parent",
                        items: [
                            new MyTreeItemModel({
                                type: "leaf",
                                label: "TI 1AX"
                            }),
                        ]
                    }),
                    new MyTreeItemModel({
                        type: "parent",
                        label: "TI 1B"
                    })
                ]
            }),
            new MyTreeItemModel({
                type: "leaf",
                label: "TI 2"
            }),
            new MyTreeItemModel({
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
    const treeElement = treeView.create({
        model: treeModel/*,
        itemContextMenuDelegate: (activeItem: MyTreeItemModel, selectedItems: MyTreeItemList) => 
            fragment(
                widget("menuitemgroup", {
                    slotted: [
                        widget("menuitem", {
                            properties: {
                                label: "Display"
                            },
                            listeners: {
                                click: () => {
                                    selectedItems.display();
                                }
                            }
                        }),
                        widget("menuitem", {
                            properties: {
                                label: "Delete"
                            },
                            listeners: {
                                click: () => {
                                    const {count} = selectedItems;
                                    const doRemove = confirm(`Remove ${count} items?`);
                                    if (doRemove) {
                                        selectedItems.remove();
                                    }
                                }
                            }
                        })
                    ]
                }),
                widget("menuitemgroup", {
                    slotted: [
                        widget("menuitem", {
                            properties: {
                                type: "checkbox",
                                label: activeItem.visibility ? "Hide" : "Show"
                            },
                            listeners: {
                                click: () => {
                                    activeItem.visibility ?
                                        selectedItems.hide() :
                                        selectedItems.show();
                                }
                            }
                        })
                    ]
                })
            ),
        itemContentDelegate: (item: MyTreeItemModel) => 
            fragment(
                ...([
                    reactiveElement(
                        item,
                        element("span", {
                            attributes: {
                                class: "label"
                            }
                        }),
                        ["label"],
                        (label, property, oldValue, newValue) => {
                            label.textContent = newValue;
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
                        widget("toolbar", {
                            slotted: [
                                widget("toolbaritem", {
                                    properties: {
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
                                    const visibilityItem = toolbarWidget.slot(toolbar)
                                        ?.querySelector<HTMLElement>(".toolbaritem[name=visibility]");
                                    if (visibilityItem) {
                                        const label = newValue ? "Hide" : "Show";
                                        toolbarItemWidget.setLabel(visibilityItem, label);
                                        toolbarItemWidget.setTitle(visibilityItem, label);
                                        toolbarItemWidget.setPressed(visibilityItem, newValue);
                                    }
                                }
                            }
                        }
                    )
                ])
            )*/
    });
    document.body.append(treeElement);
}