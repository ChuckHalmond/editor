var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _TreeModel_instances, _TreeModel_handleModelChangeEvent, _TreeViewBase_instances, _TreeViewBase_dragImages, _TreeViewBase_getTreeItemElementUri, _TreeViewBase_getDragImage, _TreeViewBase_renderTreeItem, _TreeViewBase_renderTreeItemDragImage, _TreeViewBase_handleDragStartEvent, _TreeViewBase_handleDropEvent, _TreeViewBase_handleContextMenuEvent, _TreeViewBase_handleFocusEvent, _TreeViewBase_handleFocusInEvent, _TreeViewBase_handleFocusOutEvent;
import { AttributeProperty, CustomElement, element, fragment, reactiveChildElements, reactiveElement } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";
export { TreeItemModelList };
export { TreeModel };
export { TreeItemModel };
export { TreeView };
class TreeModel extends ModelObject {
    constructor(init) {
        super();
        _TreeModel_instances.add(this);
        const { items = [], sortFunction } = init ?? {};
        items.forEach((item_i, i) => item_i.index = i);
        const childItems = new ModelList(items);
        childItems.setParent(this);
        this.childItems = childItems;
        this.items = new ModelList(this.subtreeItems());
        this.sortFunction = sortFunction ??
            function (item_a, item_b) {
                return item_a.name.localeCompare(item_b.name);
            };
        this.addEventListener("modelchange", __classPrivateFieldGet(this, _TreeModel_instances, "m", _TreeModel_handleModelChangeEvent).bind(this));
    }
    subtreeItems() {
        const { childItems } = this;
        return Array.from(childItems.values()).flatMap(treeItem_i => Array.of(treeItem_i, ...treeItem_i.subtreeItems()));
    }
    getItemByUri(uri) {
        const { childItems } = this;
        const { length: itemsCount } = childItems;
        const { length: uriLength } = uri;
        for (let i = 0; i < itemsCount; i++) {
            const item_i = childItems.get(i);
            const { uri: itemUri } = item_i;
            const { length: itemUriLength } = itemUri;
            if (uri.startsWith(itemUri)) {
                if (itemUriLength === uriLength) {
                    return item_i;
                }
                return TreeModel.prototype.getItemByUri.call(item_i, uri);
            }
        }
        return null;
    }
}
_TreeModel_instances = new WeakSet(), _TreeModel_handleModelChangeEvent = function _TreeModel_handleModelChangeEvent(event) {
    const { target } = event;
    const { items, sortFunction, subtreeItems } = this;
    if (target instanceof ModelList) {
        const records = target.getRecords();
        records.forEach((record_i) => {
            const { insertedItems, removedItems } = record_i;
            const flattenedInsertedItems = Array.from(insertedItems.values()).flatMap(insertedItem_i => Array.of(insertedItem_i, ...subtreeItems.call(insertedItem_i)));
            const flattenedRemovedItems = Array.from(removedItems.values()).flatMap(removedItem_i => Array.of(removedItem_i, ...subtreeItems.call(removedItem_i)));
            items.beginChanges();
            items.append(...flattenedInsertedItems);
            flattenedRemovedItems.forEach((removedItem_i) => items.remove(removedItem_i));
            if (sortFunction)
                items.sort(sortFunction);
            items.endChanges();
        });
        Array.from(target.values()).forEach((item_i, i) => {
            item_i.index = i;
        });
    }
};
class TreeItemModelList {
    constructor(items) {
        this.items = items;
    }
    get count() {
        return this.items.length;
    }
    remove() {
        const { items } = this;
        const removedItemsGroups = items.reduce((map, item_i) => {
            const { parentNode } = item_i;
            if (parentNode instanceof TreeItemModel || parentNode instanceof TreeModel) {
                const { childItems } = parentNode;
                const group = map.get(childItems);
                if (group)
                    group.push(item_i);
                else
                    map.set(childItems, [item_i]);
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
    constructor(init) {
        super();
        const { name, type, items = [] } = init;
        items.forEach((item_i, i) => item_i.index = i);
        const childItems = new ModelList(items);
        childItems.setParent(this);
        this.name = name;
        this.childItems = childItems;
        this.type = type;
        this.index = -1;
    }
    get level() {
        const { parentNode } = this;
        if (parentNode instanceof TreeItemModel) {
            return parentNode.level + 1;
        }
        else {
            return 0;
        }
    }
    get uri() {
        const { parentNode, name } = this;
        if (parentNode instanceof TreeItemModel) {
            return `${parentNode.uri}${name}/`;
        }
        return `${name}/`;
    }
    get parentItem() {
        const { parentNode } = this;
        if (parentNode instanceof TreeItemModel) {
            return parentNode;
        }
        return null;
    }
    subtreeItems() {
        const { childItems } = this;
        return Array.from(childItems.values()).flatMap(treeItem_i => Array.of(treeItem_i, ...treeItem_i.subtreeItems()));
    }
    remove() {
        const { parentNode } = this;
        if (parentNode instanceof TreeItemModel || parentNode instanceof TreeModel) {
            const { childItems } = parentNode;
            if (childItems) {
                childItems.remove(this);
            }
        }
    }
}
__decorate([
    ModelProperty()
], TreeItemModel.prototype, "name", void 0);
__decorate([
    ModelProperty()
], TreeItemModel.prototype, "type", void 0);
__decorate([
    ModelProperty()
], TreeItemModel.prototype, "index", void 0);
var style;
let TreeViewBase = class TreeViewBase extends View {
    constructor(model) {
        super();
        _TreeViewBase_instances.add(this);
        _TreeViewBase_dragImages.set(this, void 0);
        __classPrivateFieldSet(this, _TreeViewBase_dragImages, new WeakMap(), "f");
        const shadowRoot = this.attachShadow({ mode: "open" });
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        this.setModel(model ?? new TreeModel());
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "draggable": {
                const { treeElement } = this;
                if (treeElement) {
                    Array.from(treeElement.items).forEach(item_i => item_i.draggable = newValue !== null);
                }
                break;
            }
        }
    }
    get treeElement() {
        return this.shadowRoot.querySelector("e-tree");
    }
    treeItemElement(item) {
        return this.shadowRoot.querySelector(`e-treeitem[uri=${item.uri}]`);
    }
    treeItem(element) {
        return this.model.getItemByUri(__classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_getTreeItemElementUri).call(this, element));
    }
    renderShadow() {
        const { model } = this;
        const treeElement = element("e-tree", {
            attributes: {
                tabindex: 0,
            },
            children: reactiveChildElements(model.childItems, item => __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_renderTreeItem).call(this, item)),
            listeners: {
                dragstart: __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_handleDragStartEvent).bind(this),
                drop: __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_handleDropEvent).bind(this),
                contextmenu: __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_handleContextMenuEvent).bind(this),
                focus: __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_handleFocusEvent).bind(this),
                focusin: __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_handleFocusInEvent).bind(this),
                focusout: __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_handleFocusOutEvent).bind(this),
            }
        });
        return fragment(treeElement, element("slot"), element("div", {
            attributes: {
                class: "offscreen",
                hidden: true
            },
            children: reactiveChildElements(model.items, item => __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_renderTreeItemDragImage).call(this, item))
        }));
    }
    itemContentDelegate(item) {
        return reactiveElement(item, element("span"), ["name"], (label, property, oldValue, newValue) => {
            label.textContent = newValue;
        });
    }
    itemToolbarDelegate(item) {
        return null;
    }
    itemMenuDelegate() {
        return null;
    }
    selectedItems() {
        const { treeElement } = this;
        if (treeElement) {
            const selectedElements = treeElement.selectedItems();
            return selectedElements.map(item_i => this.treeItem(item_i));
        }
        return [];
    }
    activeItem() {
        const { treeElement } = this;
        if (treeElement) {
            const { activeItem } = treeElement;
            return activeItem ?
                this.treeItem(activeItem) :
                null;
        }
        return null;
    }
};
_TreeViewBase_dragImages = new WeakMap(), _TreeViewBase_instances = new WeakSet(), _TreeViewBase_getTreeItemElementUri = function _TreeViewBase_getTreeItemElementUri(item) {
    let uri = "";
    let closestItem = item;
    while (closestItem !== null) {
        const { dataset, parentElement } = closestItem;
        const { name } = dataset;
        uri = `${name}/` + uri;
        closestItem = parentElement?.closest("e-treeitem") ?? null;
    }
    return uri;
}, _TreeViewBase_getDragImage = function _TreeViewBase_getDragImage(model) {
    return __classPrivateFieldGet(this, _TreeViewBase_dragImages, "f").get(model)?.deref() ?? null;
}, _TreeViewBase_renderTreeItem = function _TreeViewBase_renderTreeItem(item) {
    const { draggable } = this;
    const { index, level, name } = item;
    const toolbar = this.itemToolbarDelegate(item);
    const content = this.itemContentDelegate(item);
    const treeItemElement = reactiveElement(item, element("e-treeitem", {
        attributes: {
            draggable: String(draggable),
            posinset: index,
            level: level
        },
        dataset: {
            name: name
        },
        children: [
            ...(content ? [content] : []),
            ...(toolbar ? [toolbar] : [])
        ]
    }), ["index", "name", "type"], (treeitem, propertyName, oldValue, newValue) => {
        switch (propertyName) {
            case "index": {
                treeitem.posinset = newValue;
                break;
            }
            case "name": {
                const { dataset } = treeitem;
                dataset.name = newValue;
                break;
            }
            case "type": {
                treeitem.type = newValue;
                switch (newValue) {
                    case "parent": {
                        treeitem.append(element("e-treeitemgroup", {
                            attributes: {
                                slot: "group"
                            },
                            children: reactiveChildElements(item.childItems, item => __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_renderTreeItem).call(this, item))
                        }));
                        break;
                    }
                    case "leaf": {
                        const { group } = treeitem;
                        if (group) {
                            group.remove();
                        }
                        break;
                    }
                }
                break;
            }
        }
    });
    return treeItemElement;
}, _TreeViewBase_renderTreeItemDragImage = function _TreeViewBase_renderTreeItemDragImage(item) {
    const dragImageElement = reactiveElement(item, element("span", {
        attributes: {
            class: "dragimage"
        }
    }), ["name"], (span, property, oldValue, newValue) => {
        span.textContent = newValue;
    });
    __classPrivateFieldGet(this, _TreeViewBase_dragImages, "f").set(item, new WeakRef(dragImageElement));
    return dragImageElement;
}, _TreeViewBase_handleDragStartEvent = function _TreeViewBase_handleDragStartEvent(event) {
    const { currentTarget, target } = event;
    const targetTree = currentTarget;
    const targetItem = target.closest("e-treeitem");
    const { model } = this;
    if (targetItem) {
        const { dataTransfer } = event;
        const selectedElements = targetTree.selectedItems();
        const { length: selectedCount } = selectedElements;
        if (selectedCount > 0) {
            const selectedUris = selectedElements
                .map(element_i => __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_getTreeItemElementUri).call(this, element_i))
                .filter((uri_i, _, uris) => !uris.some(uri_j => uri_i.startsWith(`${uri_j}/`)));
            const selectedUrisString = selectedUris.join("\n");
            const lastUri = selectedUris[selectedUris.length - 1];
            const lastItem = model.getItemByUri(lastUri);
            if (lastItem && dataTransfer) {
                dataTransfer.dropEffect = "move";
                dataTransfer.setData("text/plain", selectedUrisString);
                const dragImage = __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_getDragImage).call(this, lastItem);
                if (dragImage) {
                    dataTransfer.setDragImage(dragImage, -16, 0);
                }
            }
        }
    }
}, _TreeViewBase_handleDropEvent = function _TreeViewBase_handleDropEvent(event) {
    const { currentTarget, target } = event;
    const targetTree = currentTarget;
    const targetItem = target.closest("e-treeitem");
    const { model } = this;
    const { sortFunction } = model;
    if (targetItem) {
        const { dataTransfer } = event;
        if (dataTransfer) {
            const targetUri = __classPrivateFieldGet(this, _TreeViewBase_instances, "m", _TreeViewBase_getTreeItemElementUri).call(this, targetItem);
            const targetItemModel = model.getItemByUri(targetUri);
            const transferedUris = dataTransfer.getData("text/plain").split("\n");
            const targetIsWithin = transferedUris.some(uri_i => targetUri.startsWith(`${uri_i}/`) || uri_i === targetUri);
            if (!targetIsWithin) {
                const transferedItems = (transferedUris.map(uri_i => model.getItemByUri(uri_i)).filter(item_i => item_i !== null));
                const { type: targetType, parentItem: targetParentItem } = targetItemModel;
                const { childItems: targetList } = targetType === "parent" ? targetItemModel :
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
                const newElements = targetTree.querySelectorAll(`e-treeitem:is(${transferedItems.map(item_i => `[data-uri="${item_i.uri}"]`).join(",")})`);
                targetTree.beginSelection();
                newElements.forEach(element_i => element_i.selected = true);
                targetTree.endSelection();
            }
        }
    }
}, _TreeViewBase_handleContextMenuEvent = function _TreeViewBase_handleContextMenuEvent(event) {
    const { clientX, clientY, currentTarget, target } = event;
    const targetTree = currentTarget;
    const targetItem = target.closest("e-treeitem");
    if (targetItem) {
        const contextMenu = this.itemMenuDelegate();
        if (contextMenu !== null) {
            contextMenu.contextual = true;
            contextMenu.addEventListener("close", () => {
                targetItem.focus({ preventScroll: true });
            });
            targetTree.append(contextMenu);
            contextMenu.positionContextual(clientX, clientY);
            contextMenu.focus({ preventScroll: true });
        }
    }
    event.preventDefault();
}, _TreeViewBase_handleFocusEvent = function _TreeViewBase_handleFocusEvent(event) {
    const { currentTarget, relatedTarget } = event;
    const targetTree = currentTarget;
    if (relatedTarget !== null && !this.contains(relatedTarget)) {
        const relatedPosition = relatedTarget.compareDocumentPosition(this);
        if (!(relatedPosition & Node.DOCUMENT_POSITION_DISCONNECTED) && (relatedPosition & Node.DOCUMENT_POSITION_PRECEDING)) {
            const { activeItem } = targetTree;
            if (activeItem) {
                const itemToolbar = activeItem.querySelector("e-toolbar");
                if (itemToolbar) {
                    event.preventDefault();
                    itemToolbar.focus();
                }
            }
        }
    }
}, _TreeViewBase_handleFocusInEvent = function _TreeViewBase_handleFocusInEvent(event) {
    const { target } = event;
    const targetItem = target.closest("e-treeitem");
    if (targetItem) {
        const itemToolbar = targetItem.querySelector("e-toolbar");
        if (itemToolbar) {
            itemToolbar.tabIndex = itemToolbar.contains(target) ? -1 : 0;
        }
    }
}, _TreeViewBase_handleFocusOutEvent = function _TreeViewBase_handleFocusOutEvent(event) {
    const { target } = event;
    const targetItem = target.closest("e-treeitem");
    if (targetItem) {
        const itemToolbar = targetItem.querySelector("e-toolbar");
        if (itemToolbar) {
            itemToolbar.tabIndex = itemToolbar.contains(target) ? 0 : -1;
        }
    }
};
(() => {
    style = /*css*/ `
            :host {
                display: block;
            }
            
            .offscreen {
                position: absolute;
                top: 0;
                left: 0;
                transform: translateY(-100%);
                display: block;
                pointer-events: none;
            }
            
            .dragimage {
                white-space: nowrap;
                margin: 1px;
                display: inline-block;
                outline: 1px solid var(--focused-item-outline-color);
                outline-offset: -1px;
                border-radius: 3px; 
                padding: 2px 4px;
            }
        `;
})();
__decorate([
    AttributeProperty({ type: Boolean, observed: true })
], TreeViewBase.prototype, "draggable", void 0);
TreeViewBase = __decorate([
    CustomElement({
        name: "e-treeview"
    })
], TreeViewBase);
var TreeView = TreeViewBase;
//# sourceMappingURL=TreeView.js.map