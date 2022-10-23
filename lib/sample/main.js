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
var _MyTreeItemModel_instances, _MyTreeItemModel_handleModelChangeEvent;
import { EMenuItem } from "../src/elements/containers/menus/MenuItem";
import { CustomElement, element, fragment, reactiveElement } from "../src/elements/Element";
import { ModelObject, ModelProperty } from "../src/models/Model";
import { GridColumnModel, GridModel, GridRowModel, GridView } from "../src/views/GridView";
import { TreeItemModelList, TreeItemModel, TreeModel, TreeView } from "../src/views/TreeView";
import * as editor from "../index";
editor;
class MyTreeItemModelList extends TreeItemModelList {
    constructor(items) {
        super(items);
    }
    get count() {
        return this.items.length;
    }
    show() {
        this.items.forEach(item_i => item_i.show());
    }
    hide() {
        this.items.forEach(item_i => item_i.hide());
    }
    display() {
        const result = this.items.map(item_i => item_i.name).join(" ");
        console.log(result);
    }
}
class MyTreeItemModel extends TreeItemModel {
    constructor(init) {
        super(init);
        _MyTreeItemModel_instances.add(this);
        this.childCount = this.childItems.length;
        this.visibility = true;
        this.addEventListener("modelchange", __classPrivateFieldGet(this, _MyTreeItemModel_instances, "m", _MyTreeItemModel_handleModelChangeEvent).bind(this));
    }
    show() {
        this.visibility = true;
    }
    hide() {
        this.visibility = false;
    }
    display() {
        console.log(this.name);
    }
}
_MyTreeItemModel_instances = new WeakSet(), _MyTreeItemModel_handleModelChangeEvent = function _MyTreeItemModel_handleModelChangeEvent(event) {
    const { target } = event;
    const { childItems } = this;
    if (target == childItems) {
        this.childCount = childItems.length;
    }
};
__decorate([
    ModelProperty()
], MyTreeItemModel.prototype, "childCount", void 0);
__decorate([
    ModelProperty()
], MyTreeItemModel.prototype, "visibility", void 0);
export async function main() {
    var _MyTreeView_instances, _MyTreeView_handleKeyDownEvent, _MyTreeView_handleDoubleClickEvent;
    const gridView = new GridView();
    gridView.resizable = true;
    gridView.setModel(new GridModel({
        columns: [
            new GridColumnModel({
                name: "name",
                type: String,
                label: "Name",
                extract: (row) => row.name
            }),
            new GridColumnModel({
                name: "age",
                type: Number,
                label: "Age",
                extract: (row) => String(row.age),
                filters: [{
                        name: "Minors",
                        filter: (row) => row.age < 18
                    }, {
                        name: "Majors",
                        filter: (row) => row.age >= 18
                    }]
            }),
            new GridColumnModel({
                name: "birthyear",
                type: String,
                label: "Brith Year",
                extract: (row) => String(new Date().getFullYear() - row.age)
            }),
        ],
        rows: [
            new GridRowModel({
                id: 1,
                name: "Denis",
                age: 13
            }),
            new GridRowModel({
                id: 2,
                name: "Jean-Charles",
                age: 32
            }),
            new GridRowModel({
                id: 3,
                name: "Charles",
                age: 25
            }),
            new GridRowModel({
                id: 4,
                name: "Mamagubida",
                age: 128
            })
        ]
    }));
    document.body.append(gridView);
    gridView.render();
    const treeModel = new TreeModel({
        items: [
            new MyTreeItemModel({
                name: "TI 0",
                type: "parent",
                items: [
                    new MyTreeItemModel({
                        name: "TI 1A",
                        type: "parent",
                        items: [
                            new MyTreeItemModel({
                                type: "leaf",
                                name: "TI 1AX"
                            }),
                        ]
                    }),
                    new MyTreeItemModel({
                        type: "parent",
                        name: "TI 1B"
                    })
                ]
            }),
            new MyTreeItemModel({
                name: "TI 1",
                type: "parent",
                items: [
                    new MyTreeItemModel({
                        name: "TI 1A",
                        type: "parent",
                        items: [
                            new MyTreeItemModel({
                                type: "leaf",
                                name: "TI 1AX"
                            }),
                        ]
                    }),
                    new MyTreeItemModel({
                        type: "parent",
                        name: "TI 1B"
                    })
                ]
            }),
            new MyTreeItemModel({
                type: "leaf",
                name: "TI 2"
            }),
            new MyTreeItemModel({
                type: "leaf",
                name: "TI 3"
            })
        ]
    });
    let MyTreeView = class MyTreeView extends TreeView {
        constructor() {
            super(...arguments);
            _MyTreeView_instances.add(this);
        }
        render() {
            super.render();
            const { shadowRoot, treeElement } = this;
            shadowRoot.prepend(element("link", {
                attributes: {
                    rel: "stylesheet",
                    href: "/sample/css/mytreeview.css"
                }
            }));
            treeElement.addEventListener("keydown", __classPrivateFieldGet(this, _MyTreeView_instances, "m", _MyTreeView_handleKeyDownEvent).bind(this));
            treeElement.addEventListener("dblclick", __classPrivateFieldGet(this, _MyTreeView_instances, "m", _MyTreeView_handleDoubleClickEvent).bind(this));
        }
        itemContentDelegate(item) {
            return fragment(reactiveElement(item, element("span", {
                attributes: {
                    class: "label"
                }
            }), ["name"], (label, property, oldValue, newValue) => {
                label.textContent = newValue;
            }), reactiveElement(item, element("span", {
                attributes: {
                    class: "badge"
                }
            }), ["childCount", "type"], (badge, property, oldValue, newValue) => {
                switch (property) {
                    case "type": {
                        if (newValue === "leaf") {
                            badge.textContent = null;
                        }
                        else {
                            badge.textContent = `(${item.childCount})`;
                        }
                        break;
                    }
                    case "childCount": {
                        badge.textContent = `(${newValue})`;
                        break;
                    }
                }
            }));
        }
        itemToolbarDelegate(item) {
            return reactiveElement(item, element("e-toolbar", {
                children: [
                    element("e-toolbaritem", {
                        attributes: {
                            name: "visibility",
                            type: "checkbox",
                            label: "Visibility",
                            iconed: true
                        },
                        listeners: {
                            click: (event) => {
                                item.visibility ?
                                    item.hide() :
                                    item.show();
                                event.stopPropagation();
                            }
                        }
                    })
                ]
            }), ["visibility"], (toolbar, property, oldValue, newValue) => {
                switch (property) {
                    case "visibility": {
                        const visibilityItem = toolbar
                            .querySelector("e-toolbaritem[name=visibility]");
                        if (visibilityItem) {
                            const label = newValue ? "Hide" : "Show";
                            visibilityItem.label = label;
                            visibilityItem.title = label;
                            visibilityItem.pressed = newValue;
                        }
                    }
                }
            });
        }
        itemMenuDelegate() {
            const { treeElement } = this;
            const { activeItem: activeItemElement } = treeElement;
            const selectedItems = this.selectedItems();
            const activeItem = this.activeItem();
            return element("e-menu", {
                attributes: {
                    contextual: true
                },
                children: [
                    element("e-menuitemgroup", {
                        children: [
                            element("e-menuitem", {
                                attributes: {
                                    type: "checkbox",
                                    label: activeItem.visibility ? "Hide" : "Show"
                                },
                                children: activeItem.visibility ? "Hide" : "Show",
                                listeners: {
                                    click: () => {
                                        const selectedItemsList = selectedItems.includes(activeItem) ?
                                            new MyTreeItemModelList(selectedItems) : new MyTreeItemModelList([activeItem]);
                                        activeItem.visibility ?
                                            selectedItemsList.hide() :
                                            selectedItemsList.show();
                                        activeItemElement.focus();
                                    }
                                }
                            })
                        ]
                    }),
                    element("e-separator"),
                    element("e-menuitemgroup", {
                        children: [
                            element("e-menuitem", {
                                attributes: {
                                    label: "Delete"
                                },
                                children: "Delete",
                                listeners: {
                                    click: () => {
                                        const selectedItemsList = selectedItems.includes(activeItem) ?
                                            new MyTreeItemModelList(selectedItems) : new MyTreeItemModelList([activeItem]);
                                        const { count } = selectedItemsList;
                                        const doRemove = confirm(`Remove ${count} items?`);
                                        if (doRemove) {
                                            selectedItemsList.remove();
                                        }
                                        treeElement.focus();
                                    }
                                }
                            })
                        ]
                    })
                ]
            });
        }
        showEditItemDialog(item) {
            const { shadowRoot } = this;
            const { visibility, name, type } = item;
            const dialog = element("dialog", {
                children: [
                    element("form", {
                        attributes: {
                            method: "dialog"
                        },
                        children: [
                            element("e-tablist", {
                                children: [
                                    element("e-tab", {
                                        attributes: {
                                            controls: "properties"
                                        },
                                        children: "Properties"
                                    })
                                ]
                            }),
                            element("e-tabpanel", {
                                attributes: {
                                    id: "properties"
                                },
                                children: [
                                    element("fieldset", {
                                        children: [
                                            element("legend", {
                                                children: "Item information"
                                            }),
                                            element("div", {
                                                attributes: {
                                                    class: "form-content"
                                                },
                                                children: [
                                                    element("label", {
                                                        attributes: {
                                                            for: "visibility"
                                                        },
                                                        children: "Visibility"
                                                    }),
                                                    element("input", {
                                                        attributes: {
                                                            id: "visibility",
                                                            type: "checkbox",
                                                            name: "visibility",
                                                            checked: visibility
                                                        }
                                                    }),
                                                    element("label", {
                                                        attributes: {
                                                            for: "name"
                                                        },
                                                        children: "Name"
                                                    }),
                                                    element("input", {
                                                        attributes: {
                                                            id: "name",
                                                            type: "text",
                                                            name: "name",
                                                            value: name
                                                        }
                                                    }),
                                                    element("label", {
                                                        attributes: {
                                                            for: "type"
                                                        },
                                                        children: "Type"
                                                    }),
                                                    element("e-select", {
                                                        attributes: {
                                                            id: "type",
                                                            name: "type"
                                                        },
                                                        children: ["parent", "leaf"].map(type_i => element("e-option", {
                                                            attributes: {
                                                                label: type_i,
                                                                value: type_i,
                                                                selected: type === type_i
                                                            }
                                                        }))
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            element("footer", {
                                attributes: {
                                    class: "dialog-footer"
                                },
                                children: [
                                    element("button", {
                                        attributes: {
                                            type: "submit",
                                            value: "confirm"
                                        },
                                        children: "Confirm"
                                    }),
                                    element("button", {
                                        attributes: {
                                            value: "cancel"
                                        },
                                        children: "Cancel"
                                    })
                                ]
                            })
                        ]
                    })
                ],
                listeners: {
                    close: (event) => {
                        const { currentTarget } = event;
                        const targetDialog = currentTarget;
                        if (targetDialog.returnValue === "confirm") {
                            const form = targetDialog.querySelector("form");
                            const formData = new FormData(form);
                            item.visibility = Boolean(formData.get("visibility"));
                            item.type = String(formData.get("type"));
                            item.name = String(formData.get("name"));
                        }
                        targetDialog.remove();
                    }
                }
            });
            shadowRoot.append(dialog);
            dialog.showModal();
        }
    };
    _MyTreeView_instances = new WeakSet(), _MyTreeView_handleKeyDownEvent = function _MyTreeView_handleKeyDownEvent(event) {
        const { currentTarget, key } = event;
        const targetTree = currentTarget;
        const { activeItem } = targetTree;
        if (activeItem) {
            const activeItemModel = this.treeItem(activeItem);
            switch (key) {
                case "Delete": {
                    const selectedItems = this.selectedItems();
                    const selectedItemsList = selectedItems.includes(activeItemModel) ?
                        new TreeItemModelList(selectedItems) : new TreeItemModelList([activeItemModel]);
                    const { count } = selectedItemsList;
                    const doRemove = confirm(`Remove ${count} items?`);
                    if (doRemove) {
                        selectedItemsList.remove();
                    }
                    targetTree.focus();
                    event.preventDefault();
                    break;
                }
                case "Enter": {
                    this.showEditItemDialog(activeItemModel);
                    event.preventDefault();
                }
            }
        }
    }, _MyTreeView_handleDoubleClickEvent = function _MyTreeView_handleDoubleClickEvent(event) {
        const { target } = event;
        const targetItem = target.closest("e-treeitem");
        const targetItemModel = this.treeItem(targetItem);
        if (targetItemModel) {
            this.showEditItemDialog(targetItemModel);
        }
    };
    MyTreeView = __decorate([
        CustomElement({
            name: "e-mytreeview"
        })
    ], MyTreeView);
    ;
    const treeView = new MyTreeView();
    treeView.draggable = true;
    treeView.setModel(treeModel);
    treeView.render();
    document.body.append(treeView);
    document.body.append(element("e-menubar", {
        attributes: {
            tabindex: 0
        },
        children: [
            element("e-menuitem", {
                attributes: {
                    type: "menu",
                    label: "Menu 1",
                    disabled: true
                },
                children: [
                    "Menu 1"
                ]
            }),
            element("e-menuitem", {
                attributes: {
                    type: "menu",
                    label: "Menu 1"
                },
                children: [
                    "Menu 1",
                    element("e-menu", {
                        attributes: {
                            slot: "menu"
                        },
                        children: [
                            element("e-menuitem", {
                                attributes: {
                                    type: "checkbox"
                                },
                                children: "Menuitem 1"
                            }),
                            element("e-menuitem", {
                                attributes: {
                                    type: "submenu"
                                },
                                children: [
                                    "Submenu 1",
                                    element("e-menu", {
                                        attributes: {
                                            slot: "menu"
                                        },
                                        children: [
                                            EMenuItem.radio({
                                                label: "SubmenuItem 1",
                                                name: "radio",
                                                value: String(0)
                                            }),
                                            EMenuItem.radio({
                                                label: "SubmenuItem 2",
                                                name: "radio",
                                                value: String(1)
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            element("e-menuitem", {
                attributes: {
                    type: "menu",
                    label: "Menu 1"
                },
                children: [
                    "Menu 1",
                    element("e-menu", {
                        attributes: {
                            slot: "menu"
                        },
                        children: [
                            element("e-menuitem", {
                                attributes: {
                                    type: "checkbox"
                                },
                                children: "Checkbox"
                            })
                        ]
                    })
                ]
            })
        ]
    }));
    document.body.append(element("e-toolbar", {
        children: [
            element("e-toolbaritem", {
                attributes: {
                    id: "one"
                },
                children: "Item 1"
            }),
            element("e-toolbaritem", {
                attributes: {
                    id: "three",
                },
                children: "Item 3"
            }),
            element("e-toolbaritem", {
                attributes: {
                    id: "four"
                },
                children: "Item 4"
            }),
            element("e-toolbaritem", {
                attributes: {
                    id: "two"
                },
                children: "Item 2"
            })
        ]
    }), element("e-tooltip", {
        attributes: {
            for: "one",
            position: "bottom"
        },
        children: "First tooltip"
    }), element("e-tooltip", {
        attributes: {
            for: "two",
            position: "top"
        },
        children: "Second tooltip!"
    }), element("e-tooltip", {
        attributes: {
            for: "three",
            position: "right",
        },
        children: "Third tooltip ?"
    }), element("e-tooltip", {
        attributes: {
            for: "four",
            position: "left"
        },
        children: "Fourth."
    }));
    document.body.append(element("e-select", {
        children: ["Hello", "World", "Innocents"].map(option => element("e-option", {
            attributes: {
                value: option,
                label: option
            }
        }))
    }));
    document.body.append(...[
        "tablist",
        "sash",
        "loaders",
        "tree",
        "menubar",
        "list",
        "status"
    ].map(example => {
        return element("details", {
            children: [
                element("summary", {
                    children: `${example}.html`
                }),
                element("e-import", {
                    attributes: {
                        src: `example/${example}.html`
                    }
                })
            ]
        });
    }));
    document.querySelector("e-import[src='example/status.html']").addEventListener("load", () => {
        const lastStatusItem = document.querySelector("e-statusitem:last-child");
        if (lastStatusItem) {
            lastStatusItem.addEventListener("click", (event) => {
                const { currentTarget, target } = event;
                if (target === currentTarget) {
                    const select = lastStatusItem.querySelector("e-select");
                    if (select) {
                        select.expand();
                    }
                }
            });
        }
    });
    class ModelWrapper extends ModelObject {
        constructor(model) {
            super();
            this.model = model ?? null;
        }
    }
    __decorate([
        ModelProperty()
    ], ModelWrapper.prototype, "model", void 0);
    class SimpleModel extends ModelObject {
        constructor(property) {
            super();
            this.property = property;
        }
    }
    __decorate([
        ModelProperty()
    ], SimpleModel.prototype, "property", void 0);
    const wrapper = new ModelWrapper();
    document.body.append(reactiveElement(wrapper, element("div", {
        children: [
            element("input")
        ]
    }), ["model"], (element, _, oldValue, newValue) => {
        if (newValue instanceof SimpleModel) {
            reactiveElement(newValue, element, ["property"], (element, _, oldValue, newValue) => {
                const input = element.querySelector("input");
                input.value = newValue;
            });
        }
        element.hidden = !Boolean(newValue);
    }));
    window["wrapper"] = wrapper;
    window["SimpleModel"] = SimpleModel;
}
//# sourceMappingURL=main.js.map