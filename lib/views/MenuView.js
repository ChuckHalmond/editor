var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, element, reactiveChildElements, reactiveElement } from "../elements/Element";
import { ModelList, ModelObject, ReactiveProperty } from "../models/Model";
import { View } from "./View";
export { MenuModel };
export { MenuItemModel };
export { MenuView };
class MenuModel extends ModelObject {
    items;
    name;
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
    name;
    label;
    type;
    menu;
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
        this.setModel(model ?? new MenuModel({
            items: []
        }));
    }
    renderLight() {
        const { model } = this;
        return this.#renderMenu(model);
    }
    #renderMenu(menu) {
        return element("e-menu", {
            children: reactiveChildElements(menu.items, item_i => this.#renderMenuItem(item_i))
        });
    }
    #renderMenuItem(item) {
        const { label, type, menu } = item;
        return reactiveElement(item, element("e-menuitem", {
            attributes: {
                type: type
            },
            children: [
                label
            ].concat((menu !== undefined) ? [
                this.#renderMenu(menu)
            ] : [])
        }), ["label", "name"], (menuitem, property, oldValue, newValue) => {
            switch (property) {
                case "label": {
                    menuitem.label = newValue;
                    break;
                }
            }
        });
    }
};
MenuViewBase = __decorate([
    CustomElement({
        name: "v-menu"
    })
], MenuViewBase);
var MenuView = MenuViewBase;
//# sourceMappingURL=MenuView.js.map