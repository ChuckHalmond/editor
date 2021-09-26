import { EventDispatcher, Event } from "../events/EventDispatcher";
export { isObjectModel };
export { ObjectModelBase };
export { isListModel };
export { ListModelBase };
function isObjectModel(obj) {
    return typeof obj === "object" &&
        typeof obj.data === "object" &&
        typeof obj.set === "function";
}
class ObjectModelBase extends EventDispatcher {
    constructor(data = {}) {
        super();
        this._data = data;
    }
    get data() {
        return this._data;
    }
    set(key, value) {
        const oldValue = this._data[key];
        this._data[key] = value;
        this.dispatchEvent(new Event("objectmodelchange", { property: key, oldValue: oldValue, newValue: value }));
    }
}
function isListModel(obj) {
    return typeof obj === "object" &&
        Array.isArray(obj.items) &&
        typeof obj.set === "function" &&
        typeof obj.insert === "function" &&
        typeof obj.push === "function" &&
        typeof obj.pop === "function" &&
        typeof obj.remove === "function" &&
        typeof obj.clear === "function";
}
class ListModelBase extends EventDispatcher {
    constructor(items = []) {
        super();
        this._items = items;
    }
    get items() {
        return this._items;
    }
    set(index, item) {
        if (index >= 0 && index < this._items.length) {
            this._items[index] = item;
            this.dispatchEvent(new Event("listmodelchange", { addedItems: [item], removedItems: [], index: index }));
        }
    }
    push(...items) {
        const newLength = this._items.push(...items);
        this.dispatchEvent(new Event("listmodelchange", { addedItems: items, removedItems: [], index: newLength - items.length }));
        return newLength;
    }
    pop() {
        const item = this._items.pop();
        if (item) {
            this.dispatchEvent(new Event("listmodelchange", { addedItems: [], removedItems: [item], index: this._items.length }));
        }
        return item;
    }
    insert(index, ...items) {
        if (index > this._items.length) {
            index = this._items.length;
        }
        else if (index < 0) {
            if (index < -this._items.length) {
                index = 0;
            }
            else {
                index = this._items.length + index;
            }
        }
        this._items.splice(index, 0, ...items);
        this.dispatchEvent(new Event("listmodelchange", { addedItems: items, removedItems: [], index: index }));
    }
    remove(item) {
        const itemIndex = this._items.indexOf(item);
        if (itemIndex > -1) {
            this._items.splice(itemIndex, 1);
            this.dispatchEvent(new Event("listmodelchange", { addedItems: [], removedItems: [item], index: itemIndex }));
        }
    }
    clear() {
        const removedItems = this._items.slice();
        this._items.splice(0, this._items.length);
        this.dispatchEvent(new Event("listmodelchange", { addedItems: [], removedItems: removedItems, index: 0 }));
    }
}
//# sourceMappingURL=Model.js.map