import { EventDispatcher, Event } from "../events/EventDispatcher";
export { ObjectModelBase };
export { ListModelBase };
class ObjectModelBase extends EventDispatcher {
    constructor(data) {
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
    constructor(items) {
        super();
        this._items = items;
    }
    get items() {
        return this._items;
    }
    set(items) {
        const oldItems = this._items.slice();
        this._items = items.slice();
        const removedItems = [[0, oldItems]];
        const addedItems = [[0, items.slice()]];
        this.dispatchEvent(new Event("listmodelchange", { removedItems: removedItems, addedItems: addedItems }));
    }
    push(...items) {
        const oldItemsLength = this._items.length;
        const newLength = this._items.push(...items);
        const addedItems = [[oldItemsLength, items.slice()]];
        this.dispatchEvent(new Event("listmodelchange", { removedItems: [[]], addedItems: addedItems }));
        return newLength;
    }
    insert(index, ...items) {
        if (index >= 0 && index <= this._items.length) {
            this._items.splice(index, 0, ...items);
            const addedItems = [[index, items.slice()]];
            this.dispatchEvent(new Event("listmodelchange", { removedItems: [[]], addedItems: addedItems }));
        }
    }
    splice(start, deleteCount, ...items) {
        const length = this._items.length;
        start = (start < 0) ? (start > -length) ? length - start : 0 : start;
        start = Math.min(start, length);
        const spliceResult = this._items.splice(start, deleteCount, ...items);
        const removedItems = [[start, spliceResult]];
        const addedItems = [[start, items.slice()]];
        this.dispatchEvent(new Event("listmodelchange", { removedItems: removedItems, addedItems: addedItems }));
        return spliceResult;
    }
    filter(predicate) {
        const oldItems = this._items.slice();
        this._items = this._items.filter(predicate);
        const removedItems = oldItems
            .map((item, index, array) => !predicate(item, index, array) ? [index, item] : null)
            .filter(item => item !== null);
        this.dispatchEvent(new Event("listmodelchange", { removedItems: removedItems, addedItems: [[]] }));
    }
    clear() {
        const oldItems = this._items.slice();
        this._items = [];
        const removedItems = [[0, oldItems]];
        this.dispatchEvent(new Event("listmodelchange", { removedItems: removedItems, addedItems: [[]] }));
    }
}
//# sourceMappingURL=Model.js.map