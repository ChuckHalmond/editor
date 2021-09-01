import { EventDispatcher, Event } from "editor/libs/events/EventDispatcher";
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
    setData(key, value) {
        let oldValue = this._data[key];
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
    insertItem(index, item) {
        if (index >= 0 && index <= this._items.length) {
            this._items.splice(index, 0, item);
            this.dispatchEvent(new Event("listmodelchange", { addedItems: [item], removedItems: [], index: index }));
        }
    }
    removeItem(index) {
        if (index >= 0 && index < this._items.length) {
            let item = this._items.splice(index, 1)[0];
            this.dispatchEvent(new Event("listmodelchange", { addedItems: [], removedItems: [item], index: index }));
        }
    }
    clearItems() {
        let items = this._items;
        this._items = [];
        this.dispatchEvent(new Event("listmodelchange", { addedItems: [], removedItems: items, index: 0 }));
    }
}
//# sourceMappingURL=Model.js.map