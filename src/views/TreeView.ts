import { HTMLEMenuElement } from "../elements/containers/menus/Menu";
import { HTMLEToolBarElement } from "../elements/containers/toolbars/ToolBar";
import { HTMLETreeElement } from "../elements/containers/trees/Tree";
import { HTMLETreeItemElement } from "../elements/containers/trees/TreeItem";
import { AttributeProperty, CustomElement, element, fragment, reactiveChildElements, reactiveElement } from "../elements/Element";
import { ModelEvent, ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";

export { TreeItemModelList };
export { TreeModel };
export { TreeItemModel };
export { TreeView };

interface TreeModelInit {
    items: TreeItemModel[];
    sortFunction?: (item_a: TreeItemModel, item_b: TreeItemModel) => number;
}

class TreeModel extends ModelObject {
    readonly items: ModelList<TreeItemModel>;
    readonly childItems: ModelList<TreeItemModel>;
    sortFunction: ((item_a: TreeItemModel, item_b: TreeItemModel) => number) | null;

    constructor()
    constructor(init: TreeModelInit)
    constructor(init?: TreeModelInit) {
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

class TreeItemModelList {
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
    setModel(model: TreeModel): void;
    renderShadow(): Node;
    draggable: boolean;
    selectedItems(): TreeItemModel[];
    activeItem(): TreeItemModel | null;
    get treeElement(): HTMLETreeElement | null ;
    treeItemElement(item: TreeItemModel): HTMLETreeItemElement | null ;
    itemContentDelegate(this: TreeView, item: TreeItemModel): string | Node;
    itemToolbarDelegate(this: TreeView, item: TreeItemModel): HTMLEToolBarElement | null;
    itemMenuDelegate(this: TreeView): HTMLEMenuElement | null;
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

    @AttributeProperty({type: Boolean, observed: true})
    draggable!: boolean;
    
    constructor()
    constructor(model: TreeModel)
    constructor(model?: TreeModel) {
        super();
        this.attachShadow({mode: "open"});
        this.#dragImages = new WeakMap();
        this.setModel(model ?? new TreeModel());
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "draggable": {
                const {treeElement} = this;
                if (treeElement) {
                    Array.from(treeElement.items).forEach(
                        item_i => item_i.draggable = newValue !== null
                    );
                }
                break;
            }
        }
    }

    get treeElement(): HTMLETreeElement | null {
        return this.shadowRoot.querySelector<HTMLETreeElement>("e-tree")!;
    }

    treeItemElement(item: TreeItemModel): HTMLETreeItemElement | null  {
        return this.shadowRoot.querySelector<HTMLETreeItemElement>(`e-treeitem[uri=${item.uri}]`)!;
    }

    override renderShadow(): Node {
        const {model} = this;
        const treeElement = element("e-tree", {
            attributes: {
                tabindex: 0,
            },
            children: reactiveChildElements(
                model.childItems, item => this.#renderTreeItem(item)
            ),
            listeners: {
                dragstart: <EventListener>this.#handleDragStartEvent.bind(this),
                drop: <EventListener>this.#handleDropEvent.bind(this),
                contextmenu: <EventListener>this.#handleContextMenuEvent.bind(this),
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
                    href: "css/views/treeview.css"
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

    itemContentDelegate(item: TreeItemModel): string | Node {
        return reactiveElement(
            item,
            element("span"),
            ["name"],
            (label, property, oldValue, newValue) => {
                label.textContent = newValue;
            }
        );
    }

    itemToolbarDelegate(item: TreeItemModel): HTMLEToolBarElement | null {
        return null;
    }
    
    itemMenuDelegate(this: TreeView): HTMLEMenuElement | null {
        return null;
    }

    selectedItems(): TreeItemModel[] {
        const {model, treeElement} = this;
        if (treeElement) {
            const selectedElements = treeElement.selectedItems();
            return selectedElements.map(
                item_i => <TreeItemModel>model.getItemByUri(item_i.dataset.uri!)
            );
        }
        return [];
    }

    activeItem(): TreeItemModel | null {
        const {model, treeElement} = this;
        if (treeElement) {
        const {activeItem} = treeElement;
            return activeItem ?
                model.getItemByUri(activeItem?.dataset.uri!) : null;
        }
        return null;
    }

    #getDragImage(model: TreeItemModel): Element | null {
        return this.#dragImages.get(model)?.deref() ?? null;
    }

    #renderTreeItem(item: TreeItemModel): HTMLETreeItemElement {
        const {draggable} = this;
        const {type, index, level, uri} = item;
        const toolbar = this.itemToolbarDelegate(item);
        const content = this.itemContentDelegate(item);
        const treeItemElement = reactiveElement(
            item,
            element("e-treeitem", {
                attributes: {
                    type: type,
                    draggable: String(draggable),
                    posinset: index,
                    level: level
                },
                dataset: {
                    uri: uri
                },
                children: [
                    ...(content ? [content] : []),
                    ...(toolbar ? [toolbar] : []),
                    ...(type === "parent") ? [
                        element("e-treeitemgroup", {
                            attributes: {
                                slot: "group"
                            },
                            children: reactiveChildElements(item.childItems,
                                item => this.#renderTreeItem(item)
                            )
                        })
                    ] : []
                ]
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
            ["name"],
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
                    const transferedItems = <TreeItemModel[]>(
                        transferedUris.map(
                            uri_i => model.getItemByUri(uri_i)
                        ).filter(
                            item_i => item_i !== null
                        )
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
                    const transferedItemsModelList = new TreeItemModelList(transferedItems);
                    transferedItemsModelList.remove();
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
        if (targetItem) {
            const contextMenu = this.itemMenuDelegate();
            if (contextMenu !== null) {
                contextMenu.contextual = true;
                contextMenu.addEventListener("close", () => {
                    targetItem.focus({preventScroll: true});
                });
                targetTree.append(contextMenu);
                contextMenu.positionContextual(clientX, clientY);
                contextMenu.focus({preventScroll: true});
            }
        }
        event.preventDefault();
    }

    #handleFocusEvent(event: FocusEvent): void {
        const {currentTarget, relatedTarget} = event;
        const targetTree = <HTMLETreeElement>currentTarget;
        if (relatedTarget !== null  && !this.contains(<Node | null>relatedTarget)) {
            const relatedPosition = (<Node>relatedTarget).compareDocumentPosition(this);
            if (!(relatedPosition & Node.DOCUMENT_POSITION_DISCONNECTED) && (relatedPosition & Node.DOCUMENT_POSITION_PRECEDING)) {
                const {activeItem} = targetTree;
                if (activeItem) {
                    const itemToolbar = activeItem.querySelector("e-toolbar");
                    if (itemToolbar) {
                        event.preventDefault();
                        itemToolbar.focus();
                    }
                }
            }
        }
    }

    #handleFocusInEvent(event: FocusEvent): void {
        const {target} = event;
        const targetItem = <HTMLETreeItemElement>(<Element>target).closest("e-treeitem");
        if (targetItem) {
            const itemToolbar = targetItem.querySelector("e-toolbar");
            if (itemToolbar) {
                itemToolbar.tabIndex = itemToolbar.contains(<Node | null>target) ? -1 : 0;
            }
        }
    }

    #handleFocusOutEvent(event: FocusEvent): void {
        const {target} = event;
        const targetItem = <HTMLETreeItemElement>(<Element>target).closest("e-treeitem");
        if (targetItem) {
            const itemToolbar = targetItem.querySelector("e-toolbar");
            if (itemToolbar) {
                itemToolbar.tabIndex = itemToolbar.contains(<Node | null>target) ? 0 : -1;
            }
        }
    }
}

var TreeView: TreeViewConstructor = TreeViewBase;