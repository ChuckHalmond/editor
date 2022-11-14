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
var _MenuViewBase_instances, _MenuViewBase_renderMenu, _MenuViewBase_renderMenuItem;
import { CustomElement, element, reactiveChildElements, reactiveElement } from "../elements/Element";
import { ModelList, ModelObject, ReactiveProperty } from "../models/Model";
import { View } from "./View";
export { MenuModel };
export { MenuItemModel };
export { MenuView };
class MenuModel extends ModelObject {
    constructor(init) {
        super();
        this.name = init?.name;
        this.items = new ModelList(init?.items ?? []);
    }
}
__decorate([
    ReactiveProperty()
], MenuModel.prototype, "name", void 0);
class MenuItemModel extends ModelObject {
    constructor(init) {
        super();
        const { name, label, type, menu } = init;
        this.name = name;
        this.label = label;
        this.type = type;
        this.menu = menu;
    }
}
__decorate([
    ReactiveProperty()
], MenuItemModel.prototype, "name", void 0);
__decorate([
    ReactiveProperty()
], MenuItemModel.prototype, "label", void 0);
__decorate([
    ReactiveProperty()
], MenuItemModel.prototype, "type", void 0);
__decorate([
    ReactiveProperty()
], MenuItemModel.prototype, "menu", void 0);
let MenuViewBase = class MenuViewBase extends View {
    constructor(model) {
        super();
        _MenuViewBase_instances.add(this);
        this.setModel(model ?? new MenuModel({
            items: []
        }));
    }
    renderLight() {
        const { model } = this;
        return __classPrivateFieldGet(this, _MenuViewBase_instances, "m", _MenuViewBase_renderMenu).call(this, model);
    }
};
_MenuViewBase_instances = new WeakSet(), _MenuViewBase_renderMenu = function _MenuViewBase_renderMenu(menu) {
    return element("e-menu", {
        children: reactiveChildElements(menu.items, item_i => __classPrivateFieldGet(this, _MenuViewBase_instances, "m", _MenuViewBase_renderMenuItem).call(this, item_i))
    });
}, _MenuViewBase_renderMenuItem = function _MenuViewBase_renderMenuItem(item) {
    const { label, type, menu } = item;
    return reactiveElement(item, element("e-menuitem", {
        attributes: {
            type: type
        },
        children: [
            label
        ].concat((menu !== undefined) ? [
            __classPrivateFieldGet(this, _MenuViewBase_instances, "m", _MenuViewBase_renderMenu).call(this, menu)
        ] : [])
    }), ["label", "name"], (menuitem, property, oldValue, newValue) => {
        switch (property) {
            case "label": {
                menuitem.label = newValue;
                break;
            }
        }
    });
};
MenuViewBase = __decorate([
    CustomElement({
        name: "v-menu"
    })
], MenuViewBase);
var MenuView = MenuViewBase;
//# sourceMappingURL=MenuView.js.map