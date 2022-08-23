import { HTMLEMenuItemElement } from "../elements/containers/menus/MenuItem";
import { CustomElement, element, reactiveChildElements, reactiveElement } from "../elements/Element";
import { ModelList, ModelObject, ModelProperty } from "../models/Model";
import { View } from "./View";

export { MenuModel };
export { MenuItemModel };
export { MenuView };

interface MenuInit {
    name?: string;
    items: MenuItemModel[];
}

class MenuModel extends ModelObject {
    readonly items: ModelList<MenuItemModel>;
    
    @ModelProperty()
    name?: string;
    
    constructor(init: MenuInit) {
        super();
        this.name = init?.name;
        this.items = new ModelList(init?.items ?? []);
    }
}

interface MenuItemInit {
    label: string;
    name?: string;
    type?: "button" | "radio" | "checkbox" | "menu" | "submenu";
    menu?: MenuModel;
}

class MenuItemModel extends ModelObject {
    @ModelProperty()
    name?: string;

    @ModelProperty()
    label: string;

    @ModelProperty()
    type?: "button" | "radio" | "checkbox" | "menu" | "submenu";

    @ModelProperty()
    menu?: MenuModel;
    
    constructor(init: MenuItemInit) {
        super();
        const {name, label, type, menu} = init;
        this.name = name;
        this.label = label;
        this.type = type;
        this.menu = menu;
    }
}

interface MenuViewConstructor {
    prototype: MenuView;
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
        this.setModel(model ?? new MenuModel({
            items: []
        }));
    }

    renderLight() {
        const {model} = this;
        return this.#renderMenu(model);
    }

    #renderMenu(menu: MenuModel) {
        return element("e-menu", {
            children: reactiveChildElements(
                menu.items,
                item_i => this.#renderMenuItem(item_i)
            )
        });
    }

    #renderMenuItem(item: MenuItemModel): HTMLEMenuItemElement {
        const {label, type, menu} = item;
        return reactiveElement(
            item,
            element("e-menuitem", {
                attributes: {
                    type: type
                },
                children: [
                    <string | Node>label
                ].concat(
                    (menu !== undefined) ? [
                        this.#renderMenu(menu)
                    ] : []
                )
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
        );
    }
}

var MenuView: MenuViewConstructor = MenuViewBase;