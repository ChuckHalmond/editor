import { HTMLETreeElement } from "../elements/containers/trees/Tree";
import { HTMLETreeItemElement } from "../elements/containers/trees/TreeItem";
import { CustomElement, element, fragment, reactiveChildElements, reactiveElement } from "../elements/Element";
import { ModelEvent, ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";

export { TreeItemList };
export { TreeModel };
export { TreeItemModel };
export { TreeView };

class TreeModel extends ModelObject {
    readonly items: ModelList<TreeItemModel>;
    readonly childItems: ModelList<TreeItemModel>;
    sortFunction: ((item_a: TreeItemModel, item_b: TreeItemModel) => number) | null;

    constructor()
    constructor(init: {
        items: TreeItemModel[], sortFunction?: (item_a: TreeItemModel, item_b: TreeItemModel) => number;
    })
    constructor(init?: {
        items: TreeItemModel[], sortFunction?: (item_a: TreeItemModel, item_b: TreeItemModel) => number;
    }) {
        super();
        const {items = [], sortFunction} = init ?? {};
        items.forEach((item_i, i) => item_i.index = i);
        const childItems = new ModelList(items);
        childItems.setParent(this);
        this.childItems = childItems;
        this.items = new ModelList(this.flattenItems());
        this.sortFunction = sortFunction ??
            function(item_a: TreeItemModel, item_b: TreeItemModel) {
                return item_a.name.localeCompare(item_b.name);
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
            Array.from((<ModelList<TreeItemModel>>target).values()).forEach((item_i, i) => {
                item_i.index = i;
            });
        }
    }

    flattenItems(): TreeItemModel[] {
        const {childItems} = this;
        return Array.from(childItems.values()).flatMap(
            treeItem_i => Array.of(treeItem_i, ...treeItem_i.flattenItems())
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
                if (uri.charAt(itemUriLength) === "/") {
                    return TreeModel.prototype.getItemByUri.call(item_i, uri);
                }
                else if (itemUriLength === uriLength) {
                    return <TreeItemModel>item_i;
                }
            }
        }
        return null;
    }
}

class TreeItemList {
    readonly items: TreeItemModel[];

    constructor(items: TreeItemModel[]) {
        this.items = items;
    }

    get count(): number {
        return this.items.length;
    }

    remove(): void {
        const {items} = this;
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

class TreeItemModel extends ModelObject {
    readonly childItems: ModelList<TreeItemModel>;
    readonly type: "leaf" | "parent";
    readonly name: string;
    
    @ModelProperty()
    index: number;

    get level(): number {
        const {parentNode} = this;
        if (parentNode instanceof TreeItemModel) {
            return parentNode.level + 1;
        }
        else {
            return 0;
        }
    }

    get uri(): string {
        const {parentNode} = this;
        if (parentNode instanceof TreeItemModel) {
            return `${parentNode.uri}/${this.name}`;
        }
        return this.name;
    }

    get parentItem(): TreeItemModel | null {
        const {parentNode} = this;
        if (parentNode instanceof TreeItemModel) {
            return parentNode;
        }
        return null;
    }
    
    constructor(init: {name: string, type: "leaf" | "parent", items?: TreeItemModel[]}) {
        super();
        const {name, type, items = []} = init;
        items.forEach((item_i, i) => item_i.index = i);
        const childItems = new ModelList(items);
        childItems.setParent(this);
        this.name = name;
        this.childItems = childItems;
        this.type = type;
        this.index = -1;
    }

    flattenItems(): TreeItemModel[] {
        const {childItems} = this;
        return Array.from(childItems.values()).flatMap(
            treeItem_i => Array.of(treeItem_i, ...treeItem_i.flattenItems())
        );
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
}

interface TreeViewConstructor {
    prototype: TreeView;
    new(): TreeView;
    new(model: TreeModel): TreeView;
}

interface TreeView extends View {
    readonly shadowRoot: ShadowRoot;
    readonly model: TreeModel;
    treeElement(): HTMLETreeElement;
    treeItemElement(item: TreeItemModel): HTMLETreeItemElement;
    itemContentDelegate: <Item extends TreeItemModel>(item: Item) => string | Node;
    itemContextMenuDelegate: <Item extends TreeItemModel>(activeItem: Item, selectedItems: Item[]) => string | Node;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeview": TreeView,
    }
}

@CustomElement({
    name: "e-treeview"
})
class TreeViewBase extends View implements TreeView {
    readonly shadowRoot!: ShadowRoot;
    readonly model!: TreeModel;

    #dragImages: WeakMap<TreeItemModel, WeakRef<Element>>;

    itemContentDelegate: <Item extends TreeItemModel>(item: Item) => string | Node;
    itemContextMenuDelegate: <Item extends TreeItemModel>(activeItem: Item, selectedItems: Item[]) => string | Node;
    
    constructor()
    constructor(model: TreeModel)
    constructor(model?: TreeModel) {
        super();
        this.attachShadow({mode: "open"});
        this.#dragImages = new WeakMap();
        this.itemContentDelegate = function(item: TreeItemModel) {
            return reactiveElement(
                item,
                element("span"),
                ["label"],
                (label, property, oldValue, newValue) => {
                    label.textContent = newValue;
                }
            );
        };
        this.itemContextMenuDelegate = function(activeItem: TreeItemModel, selectedItems: TreeItemModel[]) {
            return fragment(
                element("e-menuitemgroup", {
                    children: [
                        element("e-menuitem", {
                            attributes: {
                                label: "Delete"
                            },
                            listeners: {
                                click: () => {
                                    const itemsList = new TreeItemList(selectedItems);
                                    const {count} = itemsList;
                                    const doRemove = confirm(`Remove ${count} items?`);
                                    if (doRemove) {
                                        itemsList.remove();
                                    }
                                }
                            }
                        })
                    ]
                })
            );
        };
        this.setModel(model ?? new TreeModel());
    }

    treeElement(): HTMLETreeElement {
        return this.shadowRoot.querySelector<HTMLETreeElement>("e-tree")!;
    }

    treeItemElement(item: TreeItemModel): HTMLETreeItemElement {
        return this.shadowRoot.querySelector<HTMLETreeItemElement>(`e-treeitem[uri=${item.uri}]`)!;
    }

    renderShadow(): Node {
        const {model} = this;
        const treeElement = element("e-tree", {
            attributes: {
                tabindex: 0,
            },
            children: reactiveChildElements(
                model.childItems, item => this.#renderTreeItem(item, model)
            ),
            listeners: {
                dragstart: <EventListener>this.#handleDragStartEvent.bind(this),
                drop: <EventListener>this.#handleDropEvent.bind(this),
                contextmenu: <EventListener>this.#handleContextMenuEvent.bind(this),
                keydown: <EventListener>this.#handleKeyDownEvent.bind(this),
                focus: <EventListener>this.#handleFocusEvent.bind(this),
                focusin: <EventListener>this.#handleFocusInEvent.bind(this),
                focusout: <EventListener>this.#handleFocusOutEvent.bind(this),
            }
        });
        return fragment(
            element("link", {
                attributes: {
                    rel: "stylesheet",
                    href: "css/main.css"
                }
            }),
            element("link", {
                attributes: {
                    rel: "stylesheet",
                    href: "css/views/gridview.css"
                }
            }),
            treeElement,
            element("div", {
                attributes: {
                    class: "offscreen",
                    hidden: true
                },
                children: reactiveChildElements(model.items,
                    item => this.#renderTreeItemDragImage(item)
                )
            })
        );
    }

    selectedItems(tree: HTMLETreeElement): TreeItemModel[] {
        const {model} = this;
        const selectedElements = tree.selectedItems();
        return selectedElements.map(
            item_i => <TreeItemModel>model.getItemByUri(item_i.dataset.uri!)
        );
    }

    #getDragImage(model: TreeItemModel): Element | null {
        return this.#dragImages.get(model)?.deref() ?? null;
    }

    #renderTreeItem(item: TreeItemModel, model: TreeModel): HTMLETreeItemElement {
        const treeItemElement = reactiveElement(
            item,
            element("e-treeitem", {
                attributes: {
                    type: item.type,
                    draggable: String(true),
                    posinset: item.index,
                    level: item.level
                },
                dataset: {
                    uri: item.uri
                },
                children: [
                    this.itemContentDelegate(item),
                    ].concat(
                        (item.type === "parent") ? [
                            element("e-treeitemgroup", {
                                attributes: {
                                    slot: "group"
                                },
                                children: reactiveChildElements(item.childItems,
                                    item => this.#renderTreeItem(item, model)
                                )
                            })
                        ] : []
                    )
            }),
            ["index"],
            (treeitem, propertyName, oldValue, newValue) => {
                treeitem.posinset = newValue;
            }
        );
        return treeItemElement;
    }

    #renderTreeItemDragImage(item: TreeItemModel): Element {
        const dragImageElement = reactiveElement(
            item,
            element("span", {
                attributes: {
                    class: "dragimage"
                }
            }),
            ["label"],
            (span, property, oldValue, newValue) => {
                span.textContent = newValue;
            }
        );
        this.#dragImages.set(item, new WeakRef(dragImageElement));
        return dragImageElement;
    }

    #handleDragStartEvent(event: DragEvent): void {
        const {currentTarget, target} = event;
        const targetTree = <HTMLETreeElement>currentTarget;
        const targetItem = <HTMLETreeItemElement>(<Element>target).closest("e-treeitem");
        const {model} = this;
        if (targetItem) {
            const {dataTransfer} = event;
            const selectedElements = targetTree.selectedItems();
            const {length: selectedCount} = selectedElements;
            if (selectedCount > 0) {
                const selectedUris = 
                    selectedElements
                    .map(element_i => element_i.dataset.uri!)
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
                    const dragImage = this.#getDragImage(lastItem);
                    if (dragImage) {
                        dataTransfer.setDragImage(dragImage, -16, 0);
                    }
                }
            }
        }
    }

    #handleDropEvent(event: DragEvent): void {
        const {currentTarget, target} = event;
        const targetTree = <HTMLETreeElement>currentTarget;
        const targetItem = <HTMLETreeItemElement>(<Element>target).closest("e-treeitem");
        const {model} = this;
        const {sortFunction} = model;
        if (targetItem) {
            const {dataTransfer} = event;
            if (dataTransfer) {
                const targetUri = targetItem.dataset.uri!;
                const targetItemModel = model.getItemByUri(targetUri)!;
                const transferedUris = dataTransfer.getData("text/plain").split("\n");
                const targetIsWithin = transferedUris.some(uri_i => targetUri.startsWith(`${uri_i}/`) || uri_i === targetUri);
                if (!targetIsWithin) {
                    const transferedItems = <TreeItemModel[]>transferedUris.map(
                        uri_i => model.getItemByUri(uri_i)
                    ).filter(
                        item_i => item_i !== null
                    );
                    const {type: targetType, parentItem: targetParentItem} = targetItemModel;
                    const {childItems: targetList} =
                        targetType === "parent" ? targetItemModel :
                        targetParentItem ? targetParentItem : model;
                    const targetItems = Array.from(targetList.values());
                    targetItems.forEach((item_i) => {
                        const sameLabelIndex = transferedItems.findIndex(item_j => item_j.name === item_i.name);
                        if (sameLabelIndex > -1) {
                            const doReplace = confirm(`Replace ${item_i.name}?`);
                            if (doReplace) {
                                targetList.remove(item_i);
                            }
                            else {
                                transferedItems.copyWithin(sameLabelIndex, sameLabelIndex + 1);
                                transferedItems.length--;
                            }
                        }
                    });
                    const itemsList = new TreeItemList(transferedItems);
                    itemsList.remove();
                    if (sortFunction) {
                        targetList.beginChanges();
                        targetList.append(...transferedItems);
                        targetList.sort(sortFunction);
                        targetList.endChanges();
                    }
                    else {
                        targetList.insert(targetItem.posinset, ...transferedItems);
                    }
                    const newElements = targetTree.querySelectorAll<HTMLETreeItemElement>(`e-treeitem:is(${
                        transferedItems.map(item_i => `[data-uri="${item_i.uri}"]`).join(",")
                    })`);
                    targetTree.beginSelection();
                    newElements.forEach(element_i => element_i.selected = true);
                    targetTree.endSelection();
                }
            }
        }
    }

    #handleContextMenuEvent(event: MouseEvent): void {
        const {clientX, clientY, currentTarget, target} = event;
        const targetTree = <HTMLETreeElement>currentTarget;
        const targetItem = <HTMLETreeItemElement>(<Element>target).closest("e-treeitem");
        const {model} = this;
        if (targetItem) {
            const targetItemModel = model.getItemByUri(targetItem.dataset.uri!)!;
            const contextMenu = element("e-menu", {
                attributes: {
                    contextual: true
                },
                children: this.itemContextMenuDelegate(targetItemModel, this.selectedItems(targetTree)),
                listeners: {
                    close: () => {
                        targetItem.focus({preventScroll: true});
                    }
                }
            });
            targetTree.append(contextMenu);
            contextMenu.positionContextual(clientX, clientY);
            contextMenu.focus({preventScroll: true});
        }
        event.preventDefault();
    }

    #handleFocusEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetTree = <HTMLETreeElement>currentTarget;
        if (relatedTarget !== null && !this.contains(<Node>relatedTarget)) {
            const relatedPosition = (<Node>relatedTarget).compareDocumentPosition(this);
            if (relatedPosition & Node.DOCUMENT_POSITION_PRECEDING) {
                const {activeItem} = targetTree;
                if (activeItem) {
                    const toolbar = activeItem.querySelector("e-toolbar");
                    if (toolbar) {
                        event.preventDefault();
                        toolbar.focus();
                    }
                }
            }
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const targetItem = <HTMLETreeItemElement>(<Element>target).closest("e-treeitem");
        if (targetItem) {
            const toolbar = targetItem.querySelector("e-toolbar");
            if (toolbar) {
                toolbar.tabIndex = toolbar.contains(<Node>target) ? -1 : 0;
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {target} = event;
        const targetItem = <HTMLETreeItemElement>(<Element>target).closest("e-treeitem");
        if (targetItem) {
            const toolbar = targetItem.querySelector("e-toolbar");
            if (toolbar) {
                toolbar.tabIndex = toolbar.contains(<Node>target) ? 0 : -1;
            }
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {currentTarget, key} = event;
        const targetTree = <HTMLETreeElement>currentTarget;
        switch (key) {
            case "Delete": {
                const itemsList = new TreeItemList(this.selectedItems(targetTree));
                const {count} = itemsList;
                const doRemove = confirm(`Remove ${count} items?`);
                if (doRemove) {
                    itemsList.remove();
                }
                targetTree.focus();
                event.preventDefault();
                break;
            }
        }
    }
}

var TreeView: TreeViewConstructor = TreeViewBase;