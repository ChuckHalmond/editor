import { HTMLEMenuElement } from "../elements/containers/menus/Menu";
import { HTMLEMenuBarElement } from "../elements/containers/menus/MenuBar";
import { HTMLEMenuItemElement } from "../elements/containers/menus/MenuItem";
import { HTMLEMenuItemGroupElement } from "../elements/containers/menus/MenuItemGroup";
import { element } from "../elements/Element";
import { HotKey } from "../Input";
import { Widget } from "./widgets/Widget";
/*
export { MenuItemWidget };
export { MenuItemGroupWidget };
export { MenuWidget };
export { MenuBarWidget };

type MenuItemType = "button" | "checkbox" | "radio" | "menu" | "submenu";

class MenuItemWidget extends Widget<HTMLEMenuItemElement> {
    constructor(init: {label: string, name: string, type?: MenuItemType, menu?: MenuWidget, hotkey?: HotKey}) {
        const {label, menu, name, type} = init;
        if (menu) {
            menu.element.slot = "menu";
        }
        const itemElement = element("e-menuitem", {
            properties: {
                label: label,
                name: name,
                type: type,
                tabIndex: -1
            },
            children: menu ? [menu.element] : void 0
        });
        super(itemElement);
    }

    setLabel(label: string) {
        this.element.label = label;
    }

    setName(name: string) {
        this.element.name = name;
    }

    setType(type: MenuItemType) {
        this.element.type = type;
    }

    setMenu(menu: MenuWidget) {
        menu.element.slot = "menu";
        this.element.replaceChildren(menu.element);
    }
}

class MenuItemGroupWidget extends Widget<HTMLEMenuItemGroupElement> {
    readonly items: (MenuItemWidget | MenuItemGroupWidget)[];

    constructor(init: {name: string, label?: string, items?: MenuItemWidget[]}) {
        const items = init.items || [];
        const groupElement = element("e-menuitemgroup", {
            properties: {
                label: init.label,
                tabIndex: -1
            },
            children: items.map(item => item.element)
        });
        super(groupElement);
        this.items = items;
    }

    setLabel(label: string) {
        this.element.label = label;
    }

    setName(name: string) {
        this.element.name = name;
    }

    insertItem(index: number, ...items: MenuItemWidget[]) {
        const {element} = this;
        this.items.splice(index, 0, ...items);
        element.children.item(
            Math.max(element.children.length, index))!
                .before(...items.map(item => item.element)
        );
    }
}

class MenuWidget extends Widget<HTMLEMenuElement> {
    readonly groups: MenuItemGroupWidget[];

    constructor(init: {name: string, groups?: MenuItemGroupWidget[]}) {
        const groups = init.groups || [];
        const menuElement = element("e-menu", {
            properties: {
                tabIndex: -1
            },
            children: groups.map(group => group.element)
        });
        super(menuElement);
        this.groups = groups;
    }

    setName(name: string) {
        this.element.name = name;
    }
}

class MenuBarWidget extends Widget<HTMLEMenuBarElement> {
    readonly items: MenuItemWidget[];

    constructor(items: MenuItemWidget[] = []) {
        const menubarElement = element("e-menubar", {
            properties: {
                tabIndex: 0
            },
            children: items.map(item => item.element)
        });
        super(menubarElement);
        this.items = items;
    }
}*/