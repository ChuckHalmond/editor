import { HTMLEListElement } from "../elements/containers/lists/List";
import { HTMLEListItemElement } from "../elements/containers/lists/ListItem";
import { EMenu } from "../elements/containers/menus/Menu";
import { EMenuButton } from "../elements/containers/menus/MenuButton";
import { HTMLEMenuItemElement, EMenuItem } from "../elements/containers/menus/MenuItem";
import { EMenuItemGroup } from "../elements/containers/menus/MenuItemGroup";
import { EToolBarItem } from "../elements/containers/toolbars/ToolBarItem";
import { element, reactiveChildElements, reactiveElement, CustomElement, Fragment } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";

export { ListModel };
export { ListItemModel };
export { ListView };

class ListModel extends ModelObject {
    readonly items: ModelList<ListItemModel>;
    sortFunction: ((item_a: ListItemModel, item_b: ListItemModel) => number) | null;
    
    constructor()
    constructor(init: {items: ListItemModel[], sortFunction?: (item_a: ListItemModel, item_b: ListItemModel) => number})
    constructor(init?: {items: ListItemModel[], sortFunction?: (item_a: ListItemModel, item_b: ListItemModel) => number}) {
        super();
        const sortFunction = init?.sortFunction ?? function(item_a: ListItemModel, item_b: ListItemModel) {
            return item_a.label.localeCompare(item_b.label);
        };
        const items = new ModelList(init?.items ?? []);
        items.setParent(this);
        this.sortFunction = sortFunction;
        this.items = items;
    }

    getItemByIndex(index: number): ListItemModel | null {
        return this.items.get(index);
    }
}

interface TreeItem {
    show(): void;
    hide(): void;
    display(): void;
    remove(): void;
}

class ListItemList implements TreeItem {
    #items: ListItemModel[];

    constructor(items: ListItemModel[]) {
        this.#items = items;
    }

    static from(items: ListItemModel[]): ListItemList {
        return new ListItemList(items);
    }

    show(): void {
        const items = this.#items;
        items.forEach(item_i => {
            item_i.show();
        });
    }

    hide(): void {
        const items = this.#items;
        items.forEach(item_i => {
            item_i.hide();
        });
    }

    display(): void {
        const items = this.#items;
        const result = items.reduce(
            (result, item_i) => `${result} ${item_i.label}`, ""
        );
        console.log(result);
    }

    remove(): void {
        const items = this.#items;
        const removedItemsGroups = items.reduce((map, item_i) => {
            const {parentNode} = item_i;
            if (parentNode instanceof ListModel) {
                const {items} = parentNode;
                const group = map.get(items);
                if (group) group.push(item_i);
                else map.set(items, [item_i]);
            }
            return map;
        }, new Map<ModelList, ListItemModel[]>());
        Array.from(removedItemsGroups.entries()).forEach(
            ([list_i, children_i]) => {
                list_i.beginChanges();
                children_i.forEach((child_i) => {
                    list_i.remove(child_i);
                });
                list_i.endChanges();
            }
        );
    }
}

class ListItemModel extends ModelObject implements TreeItem {
    readonly label: string;

    @ModelProperty()
    visibility: boolean;
    
    constructor(init: {label: string}) {
        super();
        const {label} = init;
        this.label = label;
        this.visibility = true;
    }

    get index(): number {
        const {parentNode} = this;
        if (parentNode instanceof ListModel) {
            return parentNode.items.index(this);
        }
        return -1;
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
    
    remove(): void {
        const {parentNode} = this;
        if (parentNode instanceof ListModel) {
            const {items} = parentNode;
            if (items) {
                items.remove(this);
            }
        }
    }
}

interface ListViewConstructor {
    readonly prototype: ListView;
    new(): ListView;
    new(model: ListModel): ListView;
}

interface ListView extends View {
    model: ListModel;
}

declare global {
    interface HTMLElementTagNameMap {
        "v-list": ListView,
    }
}

@CustomElement({
    name: "v-list"
})
class ListViewBase extends View implements ListView {
    readonly model!: ListModel;
    #listElementMap: WeakMap<ListModel, WeakRef<HTMLEListElement>>;
    #listItemElementsMap: WeakMap<ListItemModel, WeakRef<HTMLEListItemElement>>;

    constructor()
    constructor(model: ListModel)
    constructor(model?: ListModel) {
        super();
        this.attachShadow({mode: "open"});
        this.#listElementMap = new WeakMap();
        this.#listItemElementsMap = new WeakMap();
        this.setModel(model ?? new ListModel());
    }

    getListElement(): HTMLEListElement | null {
        const {model} = this;
        return this.#listElementMap.get(model)?.deref() ?? null;
    }

    getListItemElement(model: ListItemModel): HTMLEListItemElement | null {
        return this.#listItemElementsMap.get(model)?.deref()  ?? null;
    }

    selectedItems(): ListItemModel[] {
        const list = this.getListElement();
        if (list) {
            const {model} = this;
            const selectedElements = list.selectedItems();
            return selectedElements.map(
                item_i => <ListItemModel>model.getItemByIndex(
                    item_i.posinset
                )
            );
        }
        return [];
    }

    renderShadow(): Node {
        return Fragment(
            element("style", {
                properties: {
                    textContent: /*css*/`
                        :host {
                            display: block;
                        }
                    `
                }
            }),
            element("slot")
        );
    }
    
    renderLight(): Node {
        const {model} = this;
        const listElement = element("e-list", {
            properties: {
                tabIndex: 0
            },
            children: [
                element("e-listitemgroup", {
                    children: reactiveChildElements(
                        model.items, item => this.#renderListItem(item)
                    )
                })
            ],
            eventListeners: {
                contextmenu: <EventListener>this.#handleContextMenuEvent.bind(this),
                keydown: <EventListener>this.#handleKeyDownEvent.bind(this)
            }
        });
        this.#listElementMap.set(model, new WeakRef(listElement));
        return listElement;
    }

    #renderListItem(item: ListItemModel): Element {
        const listItemElement = element("e-listitem", {
            properties: {
                tabIndex: -1,
                name: item.label,
                draggable: true
            },
            dataset: {
                index: item.index
            },
            children: [
                element("span", {
                    properties: {
                        textContent: item.label
                    }
                }),
                element("e-toolbar", {
                    properties: {
                        //slot: "toolbar",
                        tabIndex: 0
                    },
                    children: [
                        element("e-toolbaritemgroup", {
                            children: [
                                EToolBarItem.menubutton({
                                    name: "settings",
                                    label: "Actions",
                                    menubutton: new EMenuButton({
                                        menu: reactiveElement(
                                            item,
                                            new EMenu({
                                                children: [
                                                    new EMenuItemGroup({
                                                        items: [
                                                            EMenuItem.button({
                                                                name: "display",
                                                                label: "Display",
                                                                trigger: () => {
                                                                    item.display();
                                                                }
                                                            }),
                                                            EMenuItem.button({
                                                                name: "delete",
                                                                label: "Delete",
                                                                trigger: () => {
                                                                    item.remove();
                                                                }
                                                            })
                                                        ]
                                                    }),
                                                    new EMenuItemGroup({
                                                        items: [
                                                            EMenuItem.button({
                                                                name: "visibility",
                                                                label: "Visibility",
                                                                trigger: () => {
                                                                    item.visibility ?
                                                                    item.hide() :
                                                                    item.show();
                                                                }
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            ["visibility"],
                                            (menu, property, oldValue, newValue) => {
                                                //const {items} = menu;
                                                switch (property) {
                                                    case "visibility": {
                                                        /*const item = <HTMLEMenuItemElement>items.namedItem("visibility");
                                                        item.textContent = newValue ? "Hide" : "Show";
                                                        item.title = newValue ? "Hide" : "Show";*/
                                                    }
                                                }
                                            }
                                        )
                                    })
                                }),
                                reactiveElement(
                                    item,
                                    element("e-toolbaritem", {
                                        properties: {
                                            name: "visibility",
                                            type: "checkbox",
                                            tabIndex: -1
                                        },
                                        eventListeners: {
                                            trigger: () => {
                                                item.visibility ?
                                                    item.hide() :
                                                    item.show();
                                            }
                                        }
                                    }),
                                    ["visibility"],
                                    (toolbaritem, property, oldValue, newValue) => {
                                        toolbaritem.title = newValue ? "Hide" : "Show";
                                        toolbaritem.checked = newValue;
                                    }
                                )
                            ]
                        })
                    ]
                })
            ]
        });
        this.#listItemElementsMap.set(item, new WeakRef(listItemElement));
        return listItemElement;
    }

    #handleContextMenuEvent(event: MouseEvent): void {
        const {clientX, clientY, currentTarget, target} = event;
        const {model} = this;
        if (currentTarget instanceof HTMLEListElement && target instanceof HTMLEListItemElement) {
            const activeItem = model.getItemByIndex(
                parseInt(target.dataset.index!)
            )!;
            const menu = element("e-menu", {
                properties: {
                    tabIndex: -1,
                    contextual: true
                },
                children: [
                    element("e-menuitemgroup", {
                        properties: {
                            tabIndex: -1
                        },
                        children: [
                            element("e-menuitem", {
                                properties: {
                                    tabIndex: -1,
                                    textContent: "Display"
                                },
                                eventListeners: {
                                    trigger: () => {
                                        ListItemList.from(
                                            this.selectedItems()
                                        ).display();
                                    }
                                }
                            }),
                            element("e-menuitem", {
                                properties: {
                                    tabIndex: -1,
                                    textContent: "Delete"
                                },
                                eventListeners: {
                                    trigger: () => {
                                        ListItemList.from(
                                            this.selectedItems()
                                        ).remove();
                                    }
                                }
                            })
                        ]
                    }),
                    element("e-menuitemgroup", {
                        properties: {
                            tabIndex: -1
                        },
                        children: [
                            element("e-menuitem", {
                                properties: {
                                    tabIndex: -1,
                                    type: "checkbox",
                                    textContent: activeItem.visibility ? "Hide" : "Show"
                                },
                                eventListeners: {
                                    trigger: () => {
                                        const selectedItems = ListItemList.from(
                                            this.selectedItems()
                                        );
                                        activeItem.visibility ?
                                            selectedItems.hide() :
                                            selectedItems.show();
                                    }
                                }
                            })
                        ]
                    })
                ],
                eventListeners: {
                    close: () => {
                        target.focus({preventScroll: true});
                    }
                }
            });
            target.append(menu);
            menu.positionContextual(clientX, clientY);
            menu.focus({preventScroll: true});
            event.preventDefault();
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {currentTarget, key} = event;
        if (currentTarget instanceof HTMLEListElement) {
            switch (key) {
                case "Delete": {
                    ListItemList.from(
                        this.selectedItems()
                    ).remove();
                    event.preventDefault();
                    break;
                }
            }
        }
    }
}

var ListView: ListViewConstructor = ListViewBase;