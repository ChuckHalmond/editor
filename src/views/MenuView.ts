import { CustomElement, reactiveChildElements, reactiveElement, widget } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";
import { menuItemWidget } from "./widgets/menu/MenuItemWidget";

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
            properties: {
                
            },
            slotted: reactiveChildElements(
                menu.items,
                item_i => this.#renderMenuItem(item_i)
            )
        });
    }

    #renderMenuItem(item: MenuItemModel): Element {
        const {type, menu} = item;
        return reactiveElement(
            item,
            widget("menuitem", {
                properties: {
                    type: type
                },
                slotted: menu !== undefined ? [
                    this.#renderMenu(menu)
                ] : []
            }),
            ["label", "name"],
            (menuitem, property, oldValue, newValue) => {
                switch (property) {
                    case "label": {
                        menuItemWidget.setLabel(menuitem, newValue);
                        break;
                    }
                }
            }
        );
    }
}

var MenuView: MenuViewConstructor = MenuViewBase;