import { CustomElement, reactiveChildElements, reactiveObject, widget } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";
import { MenuItemWidget, menuItemWidgets } from "./widgets/MenuItemWidget";
import { MenuWidget } from "./widgets/MenuWidget";

export { MenuModel };
export { MenuItemModel };
export { MenuView };

class MenuModel extends ModelObject {
    @ModelProperty()
    readonly items: ModelList<MenuItemModel>;
    
    @ModelProperty()
    name?: string;
    
    constructor()
    constructor(init: {name?: string, items?: MenuItemModel[]})
    constructor(init?: {name?: string, items?: MenuItemModel[]}) {
        super();
        this.name = init?.name;
        this.items = new ModelList(init?.items ?? [])
    }
}

class MenuItemModel extends ModelObject {
    @ModelProperty()
    name: string;

    @ModelProperty()
    label: string;

    @ModelProperty()
    type: "button" | "radio" | "checkbox" | "menu" | "submenu";

    @ModelProperty()
    menu?: MenuModel;
    
    constructor(init: {name: string, label: string, type: "button" | "radio" | "checkbox" | "menu" | "submenu"; menu?: MenuModel;}) {
        super();
        const {name, label, type, menu} = init;
        this.name = name;
        this.label = label;
        this.type = type;
        this.menu = menu;
    }
}

interface MenuViewConstructor {
    readonly prototype: MenuView;
    new(): MenuView;
    new(model: MenuModel): MenuView;
}

interface MenuView extends View {
    readonly model: MenuModel;
}

declare global {
    interface HTMLElementTagNameMap {
        "v-menu": MenuView,
    }
}

@CustomElement({
    name: "v-menu"
})
class MenuViewBase extends View {
    readonly model!: MenuModel;

    constructor()
    constructor(model: MenuModel)
    constructor(model?: MenuModel) {
        super();
        this.setModel(model ?? new MenuModel());
    }

    renderLight() {
        const {model} = this;
        return this.#renderMenu(model);
    }

    #renderMenu(menu: MenuModel) {
        return widget("menu", {
            children: reactiveChildElements(
                menu.items,
                item_i => this.#renderMenuItem(item_i)
            )
        }).element;
    }

    #renderMenuItem(item: MenuItemModel): Element {
        const {type, menu} = item;
        return reactiveObject(
            item,
            widget("menuitem", {
                properties: {
                    type: type,
                    hasPopup: menu !== void 0
                },
                children: menu !== void 0 ? [
                    this.#renderMenu(menu)
                ] : void 0
            }),
            ["label", "name"],
            (menuitem, property, oldValue, newValue) => {
                switch (property) {
                    case "label": {
                        menuitem.label = newValue;
                        break;
                    }
                }
            }
        ).element;
    }
}

var MenuView: MenuViewConstructor = MenuViewBase;