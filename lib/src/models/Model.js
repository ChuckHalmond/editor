import { EventDispatcher, Event } from "../events/EventDispatcher";
export { ObjectModelBase };
export { ListModelBase };
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
            this.dispatchEvent(new Event("listmodelchange", { index: index, removedItems: [], addedItems: [item] }));
        }
    }
    push(...items) {
        const newLength = this._items.push(...items);
        this.dispatchEvent(new Event("listmodelchange", { index: newLength - items.length, removedItems: [], addedItems: items }));
        return newLength;
    }
    pop() {
        const item = this._items.pop();
        if (item) {
            this.dispatchEvent(new Event("listmodelchange", { index: this._items.length, removedItems: [item], addedItems: [] }));
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
        this.dispatchEvent(new Event("listmodelchange", { index: index, removedItems: [], addedItems: items }));
    }
    remove(item) {
        const itemIndex = this._items.indexOf(item);
        if (itemIndex > -1) {
            this._items.splice(itemIndex, 1);
            this.dispatchEvent(new Event("listmodelchange", { index: itemIndex, removedItems: [item], addedItems: [] }));
        }
    }
    clear() {
        const removedItems = this._items.slice();
        this._items.splice(0, this._items.length);
        this.dispatchEvent(new Event("listmodelchange", { index: 0, removedItems: removedItems, addedItems: [] }));
    }
}
//# sourceMappingURL=Model.js.map