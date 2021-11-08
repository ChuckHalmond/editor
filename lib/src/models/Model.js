export { GenerateObjectModelAccessors };
export { ObjectModelChangeEvent };
export { ObjectModel };
export { ListModelChangeEvent };
export { ListModel };
export { ObjectModelProperty };
class ObjectModelChangeEventBase extends CustomEvent {
    constructor(eventInitDict) {
        super("objectmodelchange", eventInitDict);
    }
}
var ObjectModelChangeEvent = ObjectModelChangeEventBase;
class ObjectModelBase extends EventTarget {
    constructor() {
        super();
    }
}
const GenerateObjectModelAccessors = function (props) {
    return (ctor) => {
        const properties = props.reduce((obj, prop) => {
            return {
                ...obj,
                [prop]: {
                    enumerable: true,
                    get: function () {
                        return this[`_${prop}`];
                    },
                    set: function (value) {
                        const oldValue = this[`_${prop}`];
                        this[`_${prop}`] = value;
                        this.dispatchEvent(new ObjectModelChangeEvent({ detail: { property: prop, oldValue: oldValue, newValue: value } }));
                    }
                }
            };
        }, {});
        Object.defineProperties(ctor.prototype, properties);
        return ctor;
    };
};
const ObjectModelProperty = function () {
    return (target, propertyKey) => {
        Object.defineProperty(target.constructor.prototype, propertyKey, {
            enumerable: true,
            set: function (value) {
                const oldValue = this[propertyKey];
                this[propertyKey] = value;
                this.dispatchEvent(new ObjectModelChangeEvent({ detail: { property: propertyKey.toString(), oldValue: oldValue, newValue: value } }));
            }
        });
        return target;
    };
};
var ObjectModel = ObjectModelBase;
class ListModelChangeEventBase extends CustomEvent {
    constructor(eventInitDict) {
        super("listmodelchange", eventInitDict);
    }
}
var ListModelChangeEvent = ListModelChangeEventBase;
class ListModelBase extends EventTarget {
    constructor(items = []) {
        super();
        this._items = items.slice();
    }
    get(index) {
        return this._items[index];
    }
    getAll() {
        return this._items.slice();
    }
    set(index, item) {
        if (index >= 0 && index < this._items.length) {
            this._items[index] = item;
            this.dispatchEvent(new ListModelChangeEvent({ detail: { addedItems: [item], removedItems: [], index: index } }));
        }
    }
    setAll(items) {
        this._items = items.slice();
    }
    push(...items) {
        const newLength = this._items.push(...items);
        this.dispatchEvent(new ListModelChangeEvent({ detail: { addedItems: items, removedItems: [], index: newLength - items.length } }));
        return newLength;
    }
    pop() {
        const item = this._items.pop();
        if (item) {
            this.dispatchEvent(new ListModelChangeEvent({ detail: { addedItems: [], removedItems: [item], index: this._items.length } }));
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
        this.dispatchEvent(new ListModelChangeEvent({ detail: { addedItems: items, removedItems: [], index: index } }));
    }
    remove(item) {
        const itemIndex = this._items.indexOf(item);
        if (itemIndex > -1) {
            this._items.splice(itemIndex, 1);
            this.dispatchEvent(new ListModelChangeEvent({ detail: { addedItems: [], removedItems: [item], index: itemIndex } }));
        }
    }
    clear() {
        const removedItems = this._items.slice();
        this._items.splice(0, this._items.length);
        this.dispatchEvent(new ListModelChangeEvent({ detail: { addedItems: [], removedItems: removedItems, index: 0 } }));
    }
}
var ListModel = ListModelBase;
//# sourceMappingURL=Model.js.map