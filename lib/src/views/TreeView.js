var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { HTMLETreeElement } from "../elements/containers/trees/Tree";
import { HTMLETreeItemElement } from "../elements/containers/trees/TreeItem";
import { HTML, ReactiveChildNodes, ReactiveNode, CustomElement } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";
export { TreeModel };
export { TreeItemModel };
export { TreeView };
class TreeModel extends ModelObject {
    items;
    sortFunction;
    constructor(init) {
        super();
        const sortFunction = init?.sortFunction ?? function (item_a, item_b) {
            return item_a.label.localeCompare(item_b.label);
        };
        const items = new ModelList(init?.items ?? []);
        items.setParent(this);
        this.sortFunction = sortFunction;
        this.items = items;
    }
    getItemByUri(uri) {
        const { items } = this;
        const { length: itemsCount } = items;
        const { length: uriLength } = uri;
        for (let i = 0; i < itemsCount; i++) {
            const item_i = items.get(i);
            const { uri: itemUri } = item_i;
            const { length: itemUriLength } = itemUri;
            if (uri.startsWith(itemUri)) {
                if (uri.charAt(itemUriLength) === "/") {
                    return TreeModel.prototype.getItemByUri.call(item_i, uri);
                }
                else if (itemUriLength === uriLength) {
                    return item_i;
                }
            }
        }
        return null;
    }
}
class TreeItemList {
    #items;
    constructor(items) {
        this.#items = items;
    }
    static from(items) {
        return new TreeItemList(items);
    }
    static of(...items) {
        return new TreeItemList(items);
    }
    show() {
        const items = this.#items;
        items.forEach(item_i => {
            item_i.show();
        });
    }
    hide() {
        const items = this.#items;
        items.forEach(item_i => {
            item_i.hide();
        });
    }
    display() {
        const items = this.#items;
        const result = items.reduce((result, item_i) => `${result} ${item_i.label}`, "");
        console.log(result);
    }
    remove() {
        const items = this.#items;
        const removedItemsGroups = items.reduce((map, item_i) => {
            const { parentNode } = item_i;
            if (parentNode instanceof TreeItemModel || parentNode instanceof TreeModel) {
                const { items } = parentNode;
                const group = map.get(items);
                if (group)
                    group.push(item_i);
                else
                    map.set(items, [item_i]);
            }
            return map;
        }, new Map());
        Array.from(removedItemsGroups.entries()).forEach(([list_i, children_i]) => {
            list_i.beginChanges();
            children_i.forEach((child_i) => {
                list_i.remove(child_i);
            });
            list_i.endChanges();
        });
    }
}
class TreeItemModel extends ModelObject {
    items;
    type;
    label;
    count;
    visibility;
    get uri() {
        const { parentNode } = this;
        if (parentNode instanceof TreeItemModel) {
            return `${parentNode.uri}/${this.label}`;
        }
        return this.label;
    }
    get parentItem() {
        const { parentNode } = this;
        if (parentNode instanceof TreeItemModel) {
            return parentNode;
        }
        return null;
    }
    constructor(init) {
        super();
        const { label, type } = init;
        const items = new ModelList(init.items ?? []);
        items.setParent(this);
        this.items = items;
        this.label = label;
        this.type = type;
        this.count = items.length;
        this.visibility = true;
        this.addEventListener("modelchange", this.#handleModelChangeEvent.bind(this));
    }
    show() {
        this.visibility = true;
    }
    hide() {
        this.visibility = false;
    }
    display() {
        console.log(this.label);
    }
    remove() {
        const { parentNode } = this;
        if (parentNode instanceof TreeItemModel || parentNode instanceof TreeModel) {
            const { items } = parentNode;
            if (items) {
                items.remove(this);
            }
        }
    }
    #handleModelChangeEvent(event) {
        const { target } = event;
        const { items } = this;
        if (target === items) {
            const records = items.getRecords();
            const countDifference = records.reduce((countDifference, record_i) => {
                return countDifference +
                    record_i.removedCount -
                    record_i.insertedItems.length;
            }, 0);
            if (countDifference !== 0) {
                this.count = items.length;
            }
        }
    }
}
__decorate([
    ModelProperty({ type: Number })
], TreeItemModel.prototype, "count", void 0);
__decorate([
    ModelProperty({ type: Boolean })
], TreeItemModel.prototype, "visibility", void 0);
let TreeViewBase = class TreeViewBase extends View {
    model;
    #treeElementMap;
    #treeItemElementsMap;
    constructor(model) {
        super();
        this.setModel(model ?? new TreeModel());
        this.#treeElementMap = new WeakMap();
        this.#treeItemElementsMap = new WeakMap();
    }
    getTreeElement() {
        const { model } = this;
        return this.#treeElementMap.get(model) ?? null;
    }
    getTreeItemElement(model) {
        return this.#treeItemElementsMap.get(model) ?? null;
    }
    selectedItems() {
        const tree = this.getTreeElement();
        if (tree) {
            const { model } = this;
            const selectedElements = tree.selectedItems();
            return selectedElements.map(item_i => model.getItemByUri(item_i.dataset.uri));
        }
        return [];
    }
    beforeRender() {
        this.#treeElementMap = new WeakMap();
        this.#treeItemElementsMap = new WeakMap();
    }
    renderLight() {
        const { model } = this;
        const treeElement = HTML("e-tree", {
            properties: {
                tabIndex: 0,
            },
            children: [
                HTML("e-treeitemgroup", {
                    properties: {
                        slot: "group"
                    },
                    children: ReactiveChildNodes(model.items, item => this.#renderTreeItem(item))
                })
            ],
            eventListeners: {
                dragstart: this.#handleDragStartEvent.bind(this),
                drop: this.#handleDropEvent.bind(this),
                contextmenu: this.#handleContextMenuEvent.bind(this),
                keydown: this.#handleKeyDownEvent.bind(this)
            }
        });
        this.#treeElementMap.set(model, treeElement);
        return treeElement;
    }
    #renderTreeItem(item) {
        const treeItemElement = HTML("e-treeitem", {
            properties: {
                tabIndex: -1,
                label: item.label,
                type: item.type,
                draggable: true
            },
            dataset: {
                uri: item.uri
            },
            children: ((item.type === "parent") ? [
                HTML("e-treeitemgroup", {
                    properties: {
                        slot: "group"
                    },
                    children: ReactiveChildNodes(item.items, item => this.#renderTreeItem(item))
                }),
                ReactiveNode(item, HTML("span", {
                    properties: {
                        slot: "badge"
                    }
                }), ["count"], (badge, property, oldValue, newValue) => {
                    badge.textContent = `(${newValue})`;
                })
            ] : []).concat(HTML("e-toolbar", {
                properties: {
                    slot: "toolbar"
                },
                children: [
                    ReactiveNode(item, HTML("e-toolbaritem", {
                        properties: {
                            name: "visibility",
                            type: "checkbox"
                        },
                        eventListeners: {
                            trigger: () => {
                                item.visibility ?
                                    item.hide() :
                                    item.show();
                            }
                        }
                    }), ["visibility"], (toolbaritem, property, oldValue, newValue) => {
                        toolbaritem.title = newValue ? "Hide" : "Show";
                        toolbaritem.checked = newValue;
                    })
                ]
            }))
        });
        this.#treeItemElementsMap.set(item, treeItemElement);
        return treeItemElement;
    }
    #handleDragStartEvent(event) {
        const { currentTarget, target } = event;
        if (currentTarget instanceof HTMLETreeElement && target instanceof HTMLETreeItemElement) {
            const { dataTransfer } = event;
            const selectedElements = currentTarget.selectedItems();
            const selectedUris = selectedElements
                .map((element_i) => element_i.dataset.uri)
                .filter((uri_i, _, uris) => !uris.some(uri_j => uri_j.startsWith(uri_i) && uri_j !== uri_i))
                .join("\n");
            if (dataTransfer) {
                dataTransfer.dropEffect = "move";
                dataTransfer.setData("text/plain", selectedUris);
            }
        }
    }
    #handleDropEvent(event) {
        const { currentTarget, target } = event;
        const { model } = this;
        const { sortFunction } = model;
        if (currentTarget instanceof HTMLETreeElement && target instanceof HTMLETreeItemElement) {
            const { dataTransfer } = event;
            if (dataTransfer) {
                const targetUri = target.dataset.uri;
                const targetItem = model.getItemByUri(targetUri);
                const transferedUris = dataTransfer.getData("text/plain").split("\n");
                const targetIsWithin = transferedUris.some(uri_i => targetUri.startsWith(uri_i));
                if (!targetIsWithin) {
                    const transferedItems = transferedUris.map(uri_i => model.getItemByUri(uri_i));
                    const { type: targetType, parentItem: targetParentItem } = targetItem;
                    const targetList = targetType === "parent" ?
                        targetItem.items :
                        targetParentItem ?
                            targetParentItem.items :
                            model.items;
                    TreeItemList.from(transferedItems).remove();
                    if (sortFunction) {
                        targetList.beginChanges();
                        targetList.append(...transferedItems);
                        targetList.sort(sortFunction);
                        targetList.endChanges();
                    }
                    else {
                        targetList.insert(target.index, ...transferedItems);
                    }
                    const newElements = transferedItems.map(item_i => this.getTreeItemElement(item_i));
                    currentTarget.setSelection(...newElements);
                }
            }
        }
    }
    #handleContextMenuEvent(event) {
        const { clientX, clientY, currentTarget, target } = event;
        const { model } = this;
        if (currentTarget instanceof HTMLETreeElement && target instanceof HTMLETreeItemElement) {
            const activeItem = model.getItemByUri(target.dataset.uri);
            const menu = HTML("e-contextmenu", {
                properties: {
                    tabIndex: -1,
                    clientX: clientX,
                    clientY: clientY,
                    slot: "contextmenu"
                },
                children: [
                    HTML("e-menuitemgroup", {
                        properties: {
                            tabIndex: -1
                        },
                        children: [
                            HTML("e-menuitem", {
                                properties: {
                                    tabIndex: -1,
                                    label: "Display"
                                },
                                eventListeners: {
                                    trigger: () => {
                                        TreeItemList.from(this.selectedItems()).display();
                                    }
                                }
                            }),
                            HTML("e-menuitem", {
                                properties: {
                                    tabIndex: -1,
                                    label: "Delete"
                                },
                                eventListeners: {
                                    trigger: () => {
                                        TreeItemList.from(this.selectedItems()).remove();
                                    }
                                }
                            })
                        ]
                    }),
                    HTML("e-menuitemgroup", {
                        properties: {
                            tabIndex: -1
                        },
                        children: [
                            HTML("e-menuitem", {
                                properties: {
                                    tabIndex: -1,
                                    type: "checkbox",
                                    label: activeItem.visibility ? "Hide" : "Show"
                                },
                                eventListeners: {
                                    trigger: () => {
                                        const selectedItems = TreeItemList.from(this.selectedItems());
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
                        target.focus({ preventScroll: true });
                    }
                }
            });
            target.append(menu);
            menu.focus({ preventScroll: true });
            event.preventDefault();
        }
    }
    #handleKeyDownEvent(event) {
        const { currentTarget, key } = event;
        if (currentTarget instanceof HTMLETreeElement) {
            switch (key) {
                case "Delete": {
                    TreeItemList.from(this.selectedItems()).remove();
                    event.preventDefault();
                    break;
                }
            }
        }
    }
};
TreeViewBase = __decorate([
    CustomElement({
        name: "v-tree"
    })
], TreeViewBase);
var TreeView = TreeViewBase;
//# sourceMappingURL=TreeView.js.map