import { CustomElement, reactiveChildElements, reactiveElement, widget } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";
import { MenuItemWidget } from "./widgets/MenuItemWidget";
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
    type: string;

    @ModelProperty()
    menu?: MenuModel;
    
    constructor(init: {name: string, label: string, type: string; menu?: MenuModel;}) {
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
        return this.#renderMenu(model).element;
    }

    #renderMenu(menu: MenuModel): MenuWidget {
        return widget("menu", {
            children: reactiveChildElements(
                menu.items,
                item_i => this.#renderMenuItem(item_i).element
            )
        });
    }

    #renderMenuItem(item: MenuItemModel): MenuItemWidget {
        return reactiveElement(
            item,
            widget("menuitem", item.menu ? {
                properties: {
                    menu: this.#renderMenu(item.menu)
                }
            } : {}),
            ["label", "name"],
            (item, property, oldValue, newValue) => {
                switch (property) {
                    case "label": {
                        item.label = newValue;
                        break;
                    }
                }
            }
        );
    }
}

var MenuView: MenuViewConstructor = MenuViewBase;