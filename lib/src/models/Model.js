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
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", { oldItems: oldItems, newItems: newItems }));
    }
    push(...items) {
        const oldItems = this._items.slice();
        const result = this._items.push(...items);
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", { oldItems: oldItems, newItems: newItems }));
        return result;
    }
    insert(index, ...items) {
        if (index >= 0 && index <= this._items.length) {
            const oldItems = this._items.slice();
            this._items.splice(index, 0, ...items);
            const newItems = this._items.slice();
            this.dispatchEvent(new Event("listmodelchange", { oldItems: oldItems, newItems: newItems }));
        }
    }
    splice(start, deleteCount, ...items) {
        const oldItems = this._items.slice();
        const result = this._items.splice(start, deleteCount, ...items);
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", { oldItems: oldItems, newItems: newItems }));
        return result;
    }
    filter(predicate) {
        const oldItems = this._items.slice();
        this._items = this._items.filter(predicate);
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", { oldItems: oldItems, newItems: newItems }));
    }
    clear() {
        const oldItems = this._items.slice();
        this._items = [];
        const newItems = this._items.slice();
        this.dispatchEvent(new Event("listmodelchange", { oldItems: oldItems, newItems: newItems }));
    }
}
//# sourceMappingURL=Model.js.map