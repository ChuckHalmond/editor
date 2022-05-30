import { HTMLEToolBarElement } from "../..";
import { HTMLEToolBarItemElement } from "../elements/containers/toolbars/ToolBarItem";
import { HTMLETreeElement } from "../elements/containers/trees/Tree";
import { HTMLETreeItemElement } from "../elements/containers/trees/TreeItem";
import { element, reactiveChildElements, reactiveElement, CustomElement, Fragment, TextNode } from "../elements/Element";
import { ModelEvent, ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";

export { TreeModel };
export { TreeItemModel };
export { TreeView };

class TreeModel extends ModelObject {
    readonly items: ModelList<TreeItemModel>;
    readonly childItems: ModelList<TreeItemModel>;
    sortFunction: ((item_a: TreeItemModel, item_b: TreeItemModel) => number) | null;
    
    constructor()
    constructor(init: {items: TreeItemModel[], sortFunction?: (item_a: TreeItemModel, item_b: TreeItemModel) => number})
    constructor(init?: {items: TreeItemModel[], sortFunction?: (item_a: TreeItemModel, item_b: TreeItemModel) => number}) {
        super();
        const childItems = new ModelList(init?.items ?? []);
        childItems.setParent(this);
        this.childItems = childItems;
        this.items = new ModelList(this.flattenItems());
        this.sortFunction = init?.sortFunction ??
            function(item_a: TreeItemModel, item_b: TreeItemModel) {
                return item_a.label.localeCompare(item_b.label);
            };
        this.addEventListener("modelchange", this.#handleModelChangeEvent.bind(this));
    }

    #handleModelChangeEvent(event: ModelEvent): void {
        const {target} = event;
        const {items, sortFunction, flattenItems} = this;
        if (target instanceof ModelList) {
            const records = target.getRecords();
            records.forEach((record_i) => {
                const {insertedItems, removedItems} = record_i;
                const flattenedInsertedItems = (<TreeItemModel[]>Array.from(insertedItems.values())).flatMap(
                    insertedItem_i => Array.of(insertedItem_i, ...flattenItems.call(insertedItem_i))
                );
                const flattenedRemovedItems = (<TreeItemModel[]>Array.from(removedItems.values())).flatMap(
                    removedItem_i => Array.of(removedItem_i, ...flattenItems.call(removedItem_i))
                );
                items.beginChanges();
                items.append(...flattenedInsertedItems);
                flattenedRemovedItems.forEach((removedItem_i) => items.remove(removedItem_i));
                if (sortFunction) items.sort(sortFunction);
                items.endChanges();
            });
        }
    }

    flattenItems(this: TreeModel | TreeItemModel): TreeItemModel[] {
        const {childItems} = this;
        return Array.from(childItems.values()).flatMap(
            treeItem_i => Array.of(treeItem_i, ...TreeModel.prototype.flattenItems.call(treeItem_i))
        );
    }

    getItemByUri(this: TreeModel | TreeItemModel, uri: string): TreeItemModel | null {
        const {childItems} = this;
        const {length: itemsCount} = childItems;
        const {length: uriLength} = uri;
        for (let i = 0; i < itemsCount; i++) {
            const item_i = childItems.get(i)!;
            const {uri: itemUri} = item_i;
            const {length: itemUriLength} = itemUri;
            if (uri.startsWith(itemUri)) {
                if (uri.charAt(itemUriLength) == "/") {
                    return TreeModel.prototype.getItemByUri.call(item_i, uri);
                }
                else if (itemUriLength == uriLength) {
                    return item_i;
                }
            }
        }
        return null;
    }
}

interface TreeItem {
    show(): void;
    hide(): void;
    display(): void;
    remove(): void;
}

class TreeItemList implements TreeItem {
    #items: TreeItemModel[];

    constructor(items: TreeItemModel[]) {
        this.#items = items;
    }

    static from(items: TreeItemModel[]): TreeItemList {
        return new TreeItemList(items);
    }

    static of(...items: TreeItemModel[]): TreeItemList {
        return new TreeItemList(items);
    }

    show(): void {
        console.log(this.#items);
        this.#items.forEach(item_i => item_i.show());
    }

    hide(): void {
        this.#items.forEach(item_i => item_i.hide());
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
            if (parentNode instanceof TreeItemModel || parentNode instanceof TreeModel) {
                const {childItems} = parentNode;
                const group = map.get(childItems);
                if (group) group.push(item_i);
                else map.set(childItems, [item_i]);
            }
            return map;
        }, new Map<ModelList, TreeItemModel[]>());
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

class TreeItemModel extends ModelObject implements TreeItem {
    readonly childItems: ModelList<TreeItemModel>;
    readonly type: "leaf" | "parent";
    readonly label: string;

    @ModelProperty(/*{type: Number}*/)
    childCount: number;

    @ModelProperty(/*{type: Boolean}*/)
    visibility: boolean;

    get uri(): string {
        const {parentNode} = this;
        if (parentNode instanceof TreeItemModel) {
            return `${parentNode.uri}/${this.label}`;
        }
        return this.label;
    }

    get parentItem(): TreeItemModel | null {
        const {parentNode} = this;
        if (parentNode instanceof TreeItemModel) {
            return parentNode;
        }
        return null;
    }
    
    constructor(init: {label: string, type: "leaf" | "parent", items?: TreeItemModel[]}) {
        super();
        const {label, type} = init;
        const childItems = new ModelList(init.items ?? []);
        childItems.setParent(this);
        this.childItems = childItems;
        this.label = label;
        this.type = type;
        this.childCount = childItems.length;
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
    
    remove(): void {
        const {parentNode} = this;
        if (parentNode instanceof TreeItemModel || parentNode instanceof TreeModel) {
            const {childItems} = parentNode;
            if (childItems) {
                childItems.remove(this);
            }
        }
    }

    #handleModelChangeEvent(event: ModelEvent): void {
        const {target} = event;
        const {childItems} = this;
        if (target == childItems) {
            this.childCount = childItems.length;
        }
    }
}

interface TreeViewConstructor {
    readonly prototype: TreeView;
    new(): TreeView;
    new(model: TreeModel): TreeView;
}

interface TreeView extends View {
    model: TreeModel;
}

declare global {
    interface HTMLElementTagNameMap {
        "v-tree": TreeView,
    }
}

@CustomElement({
    name: "v-tree"
})
class TreeViewBase extends View implements TreeView {
    readonly model!: TreeModel;
    #treeElement: WeakRef<HTMLETreeElement> | undefined;
    #dragImagesElementsMap: WeakMap<TreeItemModel, WeakRef<Element>>;
    #treeItemElementsMap: WeakMap<TreeItemModel, WeakRef<HTMLETreeItemElement>>;
    
    constructor()
    constructor(model: TreeModel)
    constructor(model?: TreeModel) {
        super();
        this.#treeItemElementsMap = new WeakMap();
        this.#dragImagesElementsMap = new WeakMap();
        this.attachShadow({mode: "open"});
        this.setModel(model ?? new TreeModel());
    }

    getTreeElement(): HTMLETreeElement | null {
        return this.#treeElement?.deref() ?? null;
    }

    getTreeItemElement(model: TreeItemModel): HTMLETreeItemElement | null {
        return this.#treeItemElementsMap.get(model)?.deref() ?? null;
    }

    getDragImageElement(model: TreeItemModel): Element | null {
        return this.#dragImagesElementsMap.get(model)?.deref() ?? null;
    }

    selectedItems(): TreeItemModel[] {
        const tree = this.getTreeElement();
        if (tree) {
            const {model} = this;
            const selectedElements = tree.selectedItems();
            return selectedElements.map(
                item_i => <TreeItemModel>model.getItemByUri(item_i.dataset.uri!)
            );
        }
        return [];
    }

    renderShadow(): Node {
        const {model} = this;
        const treeElement = element("e-tree", {
            properties: {
                tabIndex: 0,
            },
            children: reactiveChildElements(
                model.childItems, item => this.#renderTreeItem(item)
            ),
            eventListeners: {
                dragstart: <EventListener>this.#handleDragStartEvent.bind(this),
                drop: <EventListener>this.#handleDropEvent.bind(this),
                contextmenu: <EventListener>this.#handleContextMenuEvent.bind(this),
                keydown: <EventListener>this.#handleKeyDownEvent.bind(this)
            }
        });
        this.#treeElement = new WeakRef(treeElement);
        return Fragment(
            element("link", {
                properties: {
                    rel: "stylesheet",
                    href: "css/main.css"
                }
            }),
            element("link", {
                properties: {
                    rel: "stylesheet",
                    href: "css/views/treeview.css"
                }
            }),
            treeElement,
            element("div", {
                properties: {
                    className: "offscreen",
                    hidden: true
                },
                children: reactiveChildElements(model.items,
                    item => this.#renderTreeItemDragImage(item)
                )
            })
        );
    }

    #renderTreeItem(item: TreeItemModel): Element {
        const treeItemElement = reactiveElement(
            item,
            element("e-treeitem", {
                properties: {
                    tabIndex: -1,
                    label: item.label,
                    type: item.type,
                    draggable: true
                },
                dataset: {
                    uri: item.uri
                },
                children:
                    ((item.type == "parent") ? [
                        element("e-treeitemgroup", {
                            properties: {
                                slot: "group"
                            },
                            children: reactiveChildElements(item.childItems,
                                item => this.#renderTreeItem(item)
                            )
                        })
                    ] : []).concat([
                        element("span", {
                            properties: {
                                className: "label"
                            }
                        })
                    ]).concat((item.type == "parent") ? [
                        element("span", {
                            properties: {
                                className: "badge"
                            }
                        })
                    ] : []).concat([
                        element("e-toolbar", {
                            properties: {
                                tabIndex: 0
                            },
                            children: [
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
                                })
                            ]
                        })
                    ])
            }),
            ["label", "childCount", "visibility"],
            (treeitem, property, oldValue, newValue) => {
                switch (property) {
                    case "label":
                        const label = treeitem.querySelector(":scope > .label");
                        if (label) {
                            label.textContent = newValue;
                        }
                        break;
                    case "childCount":
                        const badge = treeitem.querySelector(":scope > .badge");
                        if (badge) {
                            badge.textContent = `(${newValue})`;
                        }
                        break;
                    case "visibility": {
                        const toolbar = treeitem.querySelector<HTMLEToolBarElement>(":scope > e-toolbar");
                        if (toolbar) {
                            const visibilityItem = <HTMLEToolBarItemElement>toolbar.items.namedItem("visibility");
                            if (visibilityItem) {
                                visibilityItem.title = newValue ? "Hide" : "Show";
                                visibilityItem.checked = newValue;
                            }
                        }
                    }
                }
            }
        );
        this.#treeItemElementsMap.set(item, new WeakRef(treeItemElement));
        return treeItemElement;
    }

    #renderTreeItemDragImage(item: TreeItemModel): Element {
        const dragImageElement = reactiveElement(
            item,
            element("span", {
                properties: {
                    className: "dragimage"
                }
            }),
            ["label"],
            (span, property, oldValue, newValue) => {
                span.textContent = newValue;
            }
        );
        this.#dragImagesElementsMap.set(item, new WeakRef(dragImageElement));
        return dragImageElement;
    }

    #handleDragStartEvent(event: DragEvent): void {
        const {currentTarget, target} = event;
        const {model} = this;
        if (currentTarget instanceof HTMLETreeElement && target instanceof HTMLETreeItemElement) {
            const {dataTransfer} = event;
            const selectedElements = currentTarget.selectedItems();
            const {length: selectedCount} = selectedElements;
            if (selectedCount > 0) {
                const selectedUris = 
                    selectedElements
                    .map((element_i) =>
                        element_i.dataset.uri!
                    )
                    .filter(
                        (uri_i, _, uris) => !uris.some(
                            uri_j => uri_i.startsWith(`${uri_j}/`)
                        )
                    );
                const selectedUrisString = selectedUris.join("\n");
                const lastUri = selectedUris[selectedUris.length - 1];
                const lastItem = model.getItemByUri(lastUri);
                if (lastItem && dataTransfer) {
                    dataTransfer.dropEffect = "move";
                    dataTransfer.setData("text/plain", selectedUrisString);
                    const dragImage = this.getDragImageElement(lastItem);
                    if (dragImage) {
                        dataTransfer.setDragImage(dragImage, -16, 0);
                    }
                }
            }
        }
    }

    #handleDropEvent(event: DragEvent): void {
        const {currentTarget, target} = event;
        const {model} = this;
        const {sortFunction} = model;
        if (currentTarget instanceof HTMLETreeElement && target instanceof HTMLETreeItemElement) {
            const {dataTransfer} = event;
            if (dataTransfer) {
                const targetUri = target.dataset.uri!;
                const targetItem = model.getItemByUri(targetUri)!;
                const transferedUris = dataTransfer.getData("text/plain").split("\n");
                const targetIsWithin = transferedUris.some(uri_i => targetUri.startsWith(`${uri_i}/`) || uri_i == targetUri);
                if (!targetIsWithin) {
                    const transferedItems = <TreeItemModel[]>transferedUris.map(
                        uri_i => model.getItemByUri(uri_i)
                    ).filter(
                        item_i => item_i !== null
                    );
                    //TODO: handle items with same label (replace or cancel)
                    const {type: targetType, parentItem: targetParentItem} = targetItem;
                    const targetList = targetType == "parent" ?
                        targetItem.childItems :
                        targetParentItem ?
                        targetParentItem.childItems :
                        model.childItems;
                    TreeItemList.from(transferedItems).remove();
                    if (sortFunction) {
                        targetList.beginChanges();
                        targetList.append(...transferedItems);
                        targetList.sort(sortFunction);
                        targetList.endChanges();
                    }
                    else {
                        targetList.insert(target.posinset, ...transferedItems);
                    }
                    const newElements = transferedItems.map(
                        item_i => this.getTreeItemElement(item_i)!
                    );
                    currentTarget.beginSelection();
                    newElements.forEach(
                        (element_i) => {
                            element_i.selected = true;
                        }
                    );
                    currentTarget.endSelection();
                }
            }
        }
    }

    #handleContextMenuEvent(event: MouseEvent): void {
        const {clientX, clientY, currentTarget, target} = event;
        const {model} = this;
        if (currentTarget instanceof HTMLETreeElement && target instanceof HTMLETreeItemElement) {
            const activeItem = model.getItemByUri(target.dataset.uri!)!;
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
                                        TreeItemList.from(
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
                                        TreeItemList.from(
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
                                        const selectedItems = TreeItemList.from(
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
            document.body.append(menu);
            menu.positionContextual(clientX, clientY);
            menu.focus({preventScroll: true});
            event.preventDefault();
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {currentTarget, key} = event;
        if (currentTarget instanceof HTMLETreeElement) {
            switch (key) {
                case "Delete": {
                    TreeItemList.from(
                        this.selectedItems()
                    ).remove();
                    event.preventDefault();
                    break;
                }
            }
        }
    }
}

var TreeView: TreeViewConstructor = TreeViewBase;