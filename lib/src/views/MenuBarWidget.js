import { HTML } from "../elements/Element";
import { Widget } from "./widgets/Widget";
export { MenuItemWidget };
export { MenuItemGroupWidget };
export { MenuWidget };
export { MenuBarWidget };
class MenuItemWidget extends Widget {
    constructor(init) {
        const { label, menu, name, type } = init;
        if (menu) {
            menu.element.slot = "menu";
        }
        const element = HTML("e-menuitem", {
            properties: {
                label: label,
                name: name,
                type: type,
                tabIndex: -1
            },
            children: menu ? [menu.element] : void 0
        });
        super(element);
    }
    setLabel(label) {
        this.element.label = label;
    }
    setName(name) {
        this.element.name = name;
    }
    setType(type) {
        this.element.type = type;
    }
    setMenu(menu) {
        menu.element.slot = "menu";
        this.element.replaceChildren(menu.element);
    }
}
class MenuItemGroupWidget extends Widget {
    items;
    constructor(init) {
        const items = init.items || [];
        const element = HTML("e-menuitemgroup", {
            properties: {
                label: init.label,
                tabIndex: -1
            },
            children: items.map(item => item.element)
        });
        super(element);
        this.items = items;
    }
    setLabel(label) {
        this.element.label = label;
    }
    setName(name) {
        this.element.name = name;
    }
    insertItem(index, ...items) {
        const { element } = this;
        this.items.splice(index, 0, ...items);
        element.children.item(Math.max(element.children.length, index))
            .before(...items.map(item => item.element));
    }
}
class MenuWidget extends Widget {
    groups;
    constructor(init) {
        const groups = init.groups || [];
        const element = HTML("e-menu", {
            properties: {
                tabIndex: -1
            },
            children: groups.map(group => group.element)
        });
        super(element);
        this.groups = groups;
    }
    setName(name) {
        this.element.name = name;
    }
}
class MenuBarWidget extends Widget {
    items;
    constructor(items = []) {
        const element = HTML("e-menubar", {
            properties: {
                tabIndex: 0
            },
            children: items.map(item => item.element)
        });
        super(element);
        this.items = items;
    }
}
//# sourceMappingURL=MenuBarWidget.js.map