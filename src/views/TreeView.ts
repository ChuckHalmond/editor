import { element, reactiveChildElements, reactiveElement } from "../elements/Element";
import { ModelEvent, ModelList, ModelObject, ModelProperty } from "../models/Model";
import { menuWidget } from "./widgets/menu/MenuWidget";
import { toolbarItemWidget } from "./widgets/toolbar/ToolBarItemWidget";
import { toolbarWidget } from "./widgets/toolbar/ToolBarWidget";
import { treeItemWidget } from "./widgets/tree/TreeItemWidget";
import { treeWidget } from "./widgets/tree/TreeWidget";
import { widget } from "./widgets/Widget";

export { TreeModel };
export { TreeItemModel };
export { treeView };

class TreeModel extends ModelObject {
    readonly items: ModelList<TreeItemModel>;
    readonly childItems: ModelList<TreeItemModel>;
    sortFunction: ((item_a: TreeItemModel, item_b: TreeItemModel) => number) | null;
    
    constructor()
    constructor(init: {items: TreeItemModel[], sortFunction?: (item_a: TreeItemModel, item_b: TreeItemModel) => number})
    constructor(init?: {items: TreeItemModel[], sortFunction?: (item_a: TreeItemModel, item_b: TreeItemModel) => number}) {
        super();
        const {items, sortFunction} = init ?? {};
        const childItems = new ModelList(items ?? []);
        childItems.setParent(this);
        this.childItems = childItems;
        this.items = new ModelList(this.flattenItems());
        this.sortFunction = sortFunction ??
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
    readonly items: TreeItemModel[];

    constructor(items: TreeItemModel[]) {
        this.items = items;
    }

    get count(): number {
        return this.items.length;
    }

    static from(items: TreeItemModel[]): TreeItemList {
        return new TreeItemList(items);
    }

    static of(...items: TreeItemModel[]): TreeItemList {
        return new TreeItemList(items);
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

class TreeItemModel extends ModelObject implements TreeItem {
    readonly childItems: ModelList<TreeItemModel>;
    readonly type: "leaf" | "parent";
    readonly label: string;

    @ModelProperty()
    childCount: number;

    @ModelProperty()
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
        const {label, type, items} = init;
        const childItems = new ModelList(items ?? []);
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

interface TreeViewFactory {
    create(model: TreeModel): HTMLElement;
    getModel(tree: HTMLElement): TreeModel | null;
    selectedItems(tree: HTMLElement): TreeItemModel[];
}

var treeView = new class TreeViewFactoryBase implements TreeViewFactory {
    #models: WeakMap<HTMLElement, TreeModel>;
    #dragImages: WeakMap<TreeItemModel, WeakRef<Element>>;
    
    constructor() {
        this.#models = new WeakMap();
        this.#dragImages = new WeakMap();
    }

    create(model: TreeModel): HTMLElement {
        const treeElement = widget("tree", {
            properties: {
                tabIndex: 0,
            },
            slotted: reactiveChildElements(
                model.childItems, item => this.#renderTreeItem(item)
            ),
            listeners: {
                dragstart: <EventListener>this.#handleDragStartEvent.bind(this),
                drop: <EventListener>this.#handleDropEvent.bind(this),
                contextmenu: <EventListener>this.#handleContextMenuEvent.bind(this),
                keydown: <EventListener>this.#handleKeyDownEvent.bind(this),
                focusin: <EventListener>this.#handleFocusInEvent.bind(this),
                focusout: <EventListener>this.#handleFocusOutEvent.bind(this),
            }
        });
        const rootElement = element("div", {
            attributes: {
                class: "tree-view",
            },
            children: [
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
            ]
        });
        this.#models.set(treeElement, model);
        return rootElement;
    }
    
    getModel(tree: HTMLElement): TreeModel | null {
        return this.#models.get(tree) ?? null;
    }

    selectedItems(tree: HTMLElement): TreeItemModel[] {
        const model = this.getModel(tree)!;
        const selectedElements = treeWidget.selectedItems(tree);
        return selectedElements.map(
            item_i => <TreeItemModel>model.getItemByUri(item_i.dataset.uri!)
        );
    }

    #getDragImage(model: TreeItemModel): Element | null {
        return this.#dragImages.get(model)?.deref() ?? null;
    }

    #renderTreeItem(item: TreeItemModel): Element {
        const treeItemElement = reactiveElement(
            item,
            widget("treeitem", {
                properties: {
                    type: item.type,
                    draggable: true,
                    label: item.label
                },
                dataset: {
                    uri: item.uri
                },
                slotted: {
                    content: <Node[]>
                        ([
                            element("span", {
                                attributes: {
                                    class: "label"
                                }
                            })
                        ]).concat((item.type == "parent") ? [
                            element("span", {
                                attributes: {
                                    class: "badge"
                                }
                            })
                        ] : []).concat([
                            widget("toolbar", {
                                properties: {
                                    tabIndex: -1
                                },
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
                            })
                        ]),
                    group:
                        <Node[]>((item.type == "parent") ? [
                        widget("treeitemgroup", {
                            slotted: reactiveChildElements(item.childItems,
                                item => this.#renderTreeItem(item)
                            )
                        })
                    ] : [])
                }
            }),
            ["label", "childCount", "visibility"],
            (treeitem, property, oldValue, newValue) => {
                switch (property) {
                    case "label": {
                        const label = treeitem.querySelector<HTMLElement>(":scope > .content > .label");
                        if (label) {
                            label.textContent = `${newValue}`;
                        }
                        treeItemWidget.setLabel(treeitem, newValue);
                        break;
                    }
                    case "childCount": {
                        const badge = treeitem.querySelector<HTMLElement>(":scope > .content > .badge");
                        if (badge) {
                            badge.textContent = `(${newValue})`;
                        }
                        break;
                    }
                    case "visibility": {
                        const toolbar = treeitem.querySelector<HTMLElement>(":scope > .content > .toolbar");
                        if (toolbar) {
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
        const targetTree = <HTMLElement>currentTarget;
        const targetItem = <HTMLElement>(<HTMLElement>target).closest(".treeitem");
        const targetModel = this.getModel(targetTree)!;
        if (targetItem) {
            const {dataTransfer} = event;
            const selectedElements = treeWidget.selectedItems(targetTree);
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
                const lastItem = targetModel.getItemByUri(lastUri);
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
        const targetTree = <HTMLElement>currentTarget;
        const targetItem = <HTMLElement>(<HTMLElement>target).closest(".treeitem");
        const targetModel = this.getModel(targetTree)!;
        const {sortFunction} = targetModel;
        if (targetItem) {
            const {dataTransfer} = event;
            if (dataTransfer) {
                const targetUri = targetItem.dataset.uri!;
                const targetItemModel = targetModel.getItemByUri(targetUri)!;
                const transferedUris = dataTransfer.getData("text/plain").split("\n");
                const targetIsWithin = transferedUris.some(uri_i => targetUri.startsWith(`${uri_i}/`) || uri_i == targetUri);
                if (!targetIsWithin) {
                    const transferedItems = <TreeItemModel[]>transferedUris.map(
                        uri_i => targetModel.getItemByUri(uri_i)
                    ).filter(
                        item_i => item_i !== null
                    );
                    const {type: targetType, parentItem: targetParentItem} = targetItemModel;
                    const {childItems: targetList} = targetType == "parent" ?
                        targetItemModel :
                        targetParentItem ?
                        targetParentItem :
                        targetModel;
                    const targetItems = Array.from(targetList.values());
                    targetItems.forEach((item_i) => {
                        const sameLabelIndex = transferedItems.findIndex(item_j => item_j.label == item_i.label);
                        if (sameLabelIndex > -1) {
                            const doReplace = confirm(`Replace ${item_i.label}?`);
                            if (doReplace) {
                                targetList.remove(item_i);
                            }
                            else {
                                transferedItems.copyWithin(sameLabelIndex, sameLabelIndex + 1);
                                transferedItems.length--;
                            }
                        }
                    });
                    TreeItemList.from(transferedItems).remove();
                    if (sortFunction) {
                        targetList.beginChanges();
                        targetList.append(...transferedItems);
                        targetList.sort(sortFunction);
                        targetList.endChanges();
                    }
                    else {
                        targetList.insert(treeItemWidget.getPosInSet(targetItem), ...transferedItems);
                    }
                    
                    const newElements = targetTree.querySelectorAll<HTMLElement>(`.treeitem:is(${
                        transferedItems.map(item_i => `[data-uri="${item_i.uri}"]`).join(",")
                    })`);
                    treeWidget.beginSelection(targetTree);
                    newElements.forEach((element_i) => {
                        treeItemWidget.setSelected(element_i, true);
                    });
                    treeWidget.endSelection(targetTree);
                }
            }
        }
    }

    #handleContextMenuEvent(event: MouseEvent): void {
        const {clientX, clientY, currentTarget, target} = event;
        const targetTree = <HTMLElement>currentTarget;
        const targetItem = <HTMLElement>(<HTMLElement>target).closest(".treeitem");
        const targetModel = this.getModel(targetTree)!;
        if (targetItem) {
            const activeItem = targetModel.getItemByUri(targetItem.dataset.uri!)!;
            const contextMenu = widget("menu", {
                properties: {
                    contextual: true,
                    position: {
                        x: clientX,
                        y: clientY
                    }
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
                                        const selectedItems = TreeItemList.from(this.selectedItems(targetTree));
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
                                        const selectedItems = TreeItemList.from(this.selectedItems(targetTree));
                                        const {count} = selectedItems;
                                        const doRemove = confirm(`Remove ${count} items?`);
                                        if (doRemove) {
                                            selectedItems.remove();
                                        }
                                        targetTree.focus();
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
                                        const selectedItems = TreeItemList.from(
                                            this.selectedItems(targetTree)
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
                listeners: {
                    close: () => {
                        targetItem.focus({preventScroll: true});
                    }
                }
            });
            targetTree.append(contextMenu);
            contextMenu.focus({preventScroll: true});
            event.preventDefault();
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const targetElement = <HTMLElement>target;
        if (targetElement.matches(".treeitem")) {
            const targetItem = targetElement;
            const toolbar = targetItem.querySelector<HTMLElement>(".toolbar");
            if (toolbar) {
                toolbar.tabIndex = 0;
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {target} = event;
        const targetElement = <HTMLElement>target;
        if (targetElement.matches(".treeitem")) {
            const targetItem = targetElement;
            const toolbar = targetItem.querySelector<HTMLElement>(".toolbar");
            if (toolbar) {
                toolbar.tabIndex = -1;
            }
        }
    }

    #handleKeyDownEvent(event: KeyboardEvent) {
        const {currentTarget, key} = event;
        const targetTree = <HTMLElement>currentTarget;
        switch (key) {
            case "Delete": {
                const itemsList = TreeItemList.from(this.selectedItems(targetTree));
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