import { HTMLEMenuElement } from "../src/elements/containers/menus/Menu";
import { EMenuItem } from "../src/elements/containers/menus/MenuItem";
import { HTMLEToolBarElement } from "../src/elements/containers/toolbars/ToolBar";
import { HTMLEToolBarItemElement } from "../src/elements/containers/toolbars/ToolBarItem";
import { HTMLETreeElement } from "../src/elements/containers/trees/Tree";
import { HTMLETreeItemElement } from "../src/elements/containers/trees/TreeItem";
import { HTMLETabListElement } from "../src/elements/containers/tabs/TabList";
import { CustomElement, revokeReactiveElement, element, fragment, reactiveElement, reactiveElementsMap } from "../src/elements/Element";
import { ModelEvent, ModelObject, ModelProperty } from "../src/models/Model";
import { GridColumnModel, GridModel, GridRowModel, GridView } from "../src/views/GridView";
import { TreeItemModelList, TreeItemModel, TreeModel, TreeView } from "../src/views/TreeView";

import * as editor from "../index";

editor;

interface PreloadDataFile {
    assets: {
        as: "image",
        hrefs: string[]
    }[]
}

class MyTreeItemModelList extends TreeItemModelList {
    readonly items!: MyTreeItemModel[];

    constructor(items: MyTreeItemModel[]) {
        super(items);
    }

    get count(): number {
        return this.items.length;
    }

    show(): void {
        this.items.forEach(item_i => item_i.show());
    }

    hide(): void {
        this.items.forEach(item_i => item_i.hide());
    }
    
    display(): void {
        const result = this.items.map(item_i => item_i.name).join(" ");
        console.log(result);
    }
}

class MyTreeItemModel extends TreeItemModel {
    
    @ModelProperty()
    childCount: number;

    @ModelProperty()
    visibility: boolean;

    constructor(init: {name: string, type: "leaf" | "parent", items?: TreeItemModel[]}) {
        super(init);
        this.childCount = this.childItems.length;
        this.visibility = true;
        this.addEventListener("modelchange", this.#handleModelChangeEvent.bind(this));
    }

    show(): void {
        this.visibility = true;
    }

    hide(): void {
        this.visibility = false;
    }

    display(): void {
        console.log(this.name);
    }

    #handleModelChangeEvent(event: ModelEvent): void {
        const {target} = event;
        const {childItems} = this;
        if (target == childItems) {
            this.childCount = childItems.length;
        }
    }
}

export async function main() {
    const preloadData = <PreloadDataFile>(await fetch("/assets/preload.json").then((resp) => resp.json()));
    preloadData.assets.forEach(
        asset => {
            document.head.append(
                ...asset.hrefs.map(href =>
                    element("link", {
                        attributes: {
                            as: asset.as,
                            href: `/assets/${href}`
                        }
                    })
                )
            )
        }
    );
    
    const gridView = new GridView();
    gridView.resizable = true;
    gridView.setModel(
        new GridModel({
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
                    },{
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
        })
    );
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
    
    @CustomElement({
        name: "e-mytreeview"
    })
    class MyTreeView extends TreeView {

        override render(): void {
            super.render();
            const {shadowRoot, treeElement} = this;
            shadowRoot.prepend(
                element("link", {
                    attributes: {
                        rel: "stylesheet",
                        href: "/sample/css/mytreeview.css"
                    }
                })
            );
            treeElement!.addEventListener("keydown", this.#handleKeyDownEvent.bind(this));
            treeElement!.addEventListener("dblclick", this.#handleDoubleClickEvent.bind(this));
        }

        override itemContentDelegate(item: MyTreeItemModel) {
            return fragment(
                reactiveElement(
                    item,
                    element("span", {
                        attributes: {
                            class: "label"
                        }
                    }),
                    ["name"],
                    (label, property, oldValue, newValue) => {
                        label.textContent = newValue;
                    }
                ),
                reactiveElement(
                    item,
                    element("span", {
                        attributes: {
                            class: "badge"
                        }
                    }),
                    ["childCount", "type"],
                    (badge, property, oldValue, newValue) => {
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
                    }
                )
            );
        }

        override itemToolbarDelegate(this: TreeView, item: MyTreeItemModel): HTMLEToolBarElement {
            return reactiveElement(
                item,
                element("e-toolbar", {
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
                }),
                ["visibility"],
                (toolbar, property, oldValue, newValue) => {
                    switch (property) {
                        case "visibility": {
                            const visibilityItem = toolbar
                                .querySelector<HTMLEToolBarItemElement>("e-toolbaritem[name=visibility]");
                            if (visibilityItem) {
                                const label = newValue ? "Hide" : "Show";
                                visibilityItem.label = label;
                                visibilityItem.title = label;
                                visibilityItem.pressed = newValue;
                            }
                        }
                    }
                }
            )
        }

        override itemMenuDelegate(this: TreeView): HTMLEMenuElement {
            const {treeElement} = this;
            const {activeItem: activeItemElement} = treeElement!;
            const selectedItems = <MyTreeItemModel[]>this.selectedItems();
            const activeItem = <MyTreeItemModel>this.activeItem();
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
                                        activeItemElement!.focus();
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
                                        const {count} = selectedItemsList;
                                        const doRemove = confirm(`Remove ${count} items?`);
                                        if (doRemove) {
                                            selectedItemsList.remove();
                                        }
                                        treeElement!.focus();
                                    }
                                }
                            })
                        ]
                    })
                ]
            });
        }

        #handleKeyDownEvent(event: KeyboardEvent) {
            const {currentTarget, key} = event;
            const targetTree = <HTMLETreeElement>currentTarget;
            const {activeItem} = targetTree;
            if (activeItem) {
                const activeItemModel = <MyTreeItemModel>this.treeItem(activeItem!)!;
                switch (key) {
                    case "Delete": {
                        const selectedItems = this.selectedItems();
                        const selectedItemsList = selectedItems.includes(activeItemModel) ?
                            new TreeItemModelList(selectedItems) : new TreeItemModelList([activeItemModel]);
                        const {count} = selectedItemsList;
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
        }

        showEditItemDialog(item: MyTreeItemModel): void {
            const {shadowRoot} = this;
            const {visibility, name, type} = item;
            const dialog = element("dialog", {
                children: [
                    element("form", {
                        attributes: {
                            method: "dialog"
                        },
                        children: [
                            element("e-menubar", {
                                attributes: {
                                    tabindex: 0
                                },
                                children: [
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
                                                            type: "checkbox"
                                                        },
                                                        children: "Menuitem 2"
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
                                                                    }),
                                                                    EMenuItem.radio({
                                                                        label: "SubmenuItem 3",
                                                                        name: "radio",
                                                                        value: String(3)
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            element("e-tablist", {
                                attributes: {
                                    tabindex: 0
                                },
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
                                                            checked: visibility,
                                                            tabindex: 0,
                                                            autofocus: true
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
                                                            value: name,
                                                            tabindex: 0
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
                                                            name: "type",
                                                            tabindex: 0
                                                        },
                                                        children: ["parent", "leaf"].map(
                                                            type_i => element("e-option", {
                                                                attributes: {
                                                                    label: type_i,
                                                                    value: type_i,
                                                                    selected: type === type_i
                                                                }
                                                            })
                                                        )
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
                        const {currentTarget} = event;
                        const targetDialog = <HTMLDialogElement>currentTarget;
                        if (targetDialog.returnValue === "confirm") {
                            const form = targetDialog.querySelector("form")!;
                            const formData = new FormData(form);
                            item.visibility = Boolean(formData.get("visibility"));
                            item.type = <"leaf" | "parent">String(formData.get("type"));
                            item.name = String(formData.get("name"));
                        }
                        targetDialog.remove();
                    }
                }
            });
            shadowRoot.append(dialog);
            dialog.showModal();
        }

        #handleDoubleClickEvent(event: MouseEvent): void {
            const {target} = event;
            const targetItem = <HTMLETreeItemElement>(<Element>target).closest("e-treeitem");
            const targetItemModel = <MyTreeItemModel>this.treeItem(targetItem);
            if (targetItemModel) {
                this.showEditItemDialog(targetItemModel);
            }
        }
    };

    const treeView = new MyTreeView();
    treeView.draggable = true;
    treeView.setModel(treeModel);
    treeView.render();
    document.body.append(treeView);

    document.body.append(
        element("e-menubar", {
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
                                                }),
                                                EMenuItem.radio({
                                                    label: "SubmenuItem 3",
                                                    name: "radio",
                                                    value: String(3)
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
        })
    );

    document.body.append(
        element("e-toolbar", {
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
        }),
        element("e-tooltip", {
            attributes: {
                for: "one",
                position: "bottom"
            },
            children: "First tooltip"
        }),
        element("e-tooltip", {
            attributes: {
                for: "two",
                position: "top"
            },
            children: "Second tooltip!"
        }),
        element("e-tooltip", {
            attributes: {
                for: "three",
                position: "right",
            },
            children: "Third tooltip ?"
        }),
        element("e-tooltip", {
            attributes: {
                for: "four",
                position: "left"
            },
            children: "Fourth."
        })
    );

    document.body.append(
        element("e-select", {
            children: ["Hello", "World", "Innocents"].map(
                option => element("e-option", {
                    attributes: {
                        value: option,
                        label: option
                    }
                })
            )
        })
    );

    document.body.append(
        ...[
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
            })
        })
    );
    document.querySelector("e-import[src='example/status.html']")!.addEventListener("load", () => {
        const lastStatusItem = document.querySelector("e-statusitem:last-child");
        if (lastStatusItem) {
            lastStatusItem.addEventListener("click", (event) => {
                const {currentTarget, target} = event;
                if (target === currentTarget) {
                    const select = lastStatusItem.querySelector("e-select");
                    if (select) {
                        select.expand();
                    }
                }
            });
        }
    });

    class PersonModel extends ModelObject {
        @ModelProperty()
        name: string;

        @ModelProperty()
        age: number;

        constructor(name: string, age: number) {
            super();
            this.name = name;
            this.age = age;
        }
    }

    @CustomElement({name: "e-person"})
    class PersonElement extends HTMLElement {
        readonly shadowRoot!: ShadowRoot;

        #person?: PersonModel;

        get person(): PersonModel | undefined {
            return this.#person;
        }

        set person(person: PersonModel | undefined) {
            const oldPerson = this.#person;
            if (oldPerson !== person) {
                if (oldPerson) {
                    revokeReactiveElement(oldPerson, this);
                }
                if (person) {
                    reactiveElement(
                        person, this,
                        this.personReactiveProperties,
                        this.handlePersonModelChange.bind(this)
                    );
                }
                this.#person = person;
            }
        }

        constructor() {
            super();
            const shadowRoot = this.attachShadow({mode: "open"});
            shadowRoot.replaceChildren(
                element("input", {
                    attributes: {
                        id: "age_input",
                        type: "number"
                    }
                }),
                element("input", {
                    attributes: {
                        id: "name_input",
                        type: "text"
                    }
                })
            );
            shadowRoot.addEventListener("change", this.#handleInputChangeEvent.bind(this));
        }

        #handleInputChangeEvent(event: Event): void {
            const {target} = event;
            const {person} = this;
            if (target instanceof HTMLInputElement && person) {
                if (target.matches("#name_input")) {
                    person.name = target.value;
                }
                else if (target.matches("#age_input")) {
                    person.age = target.valueAsNumber;
                }
            }
        }

        personReactiveProperties = ["name", "age"];

        handlePersonModelChange(element: this, propertyName: string, oldValue: any, newValue: any) {
            const {shadowRoot} = this;
            switch (propertyName) {
                case "name": {
                    shadowRoot
                        .querySelector<HTMLInputElement>("#name_input")!
                        .value = newValue;
                    break;
                }
                case "age": {
                    shadowRoot
                        .querySelector<HTMLInputElement>("#age_input")!
                        .valueAsNumber = newValue;
                    break;
                }
            }
        }
    }
    
    const personElement = new PersonElement();
    document.body.append(
        personElement
    );

    (window as any)["personElement"] = personElement;
    (window as any)["PersonModel"] = PersonModel;


    document.querySelector("e-import[src*='tablist']")?.addEventListener("load", () => {
        const tablist = document.querySelector<HTMLETabListElement>("e-tablist");
        if (tablist) {
            const {selectedTab} = tablist;
            if (selectedTab) {
                const tabBox = selectedTab.getBoundingClientRect();
                const {bottom, left, width} = tabBox;
                tablist.animate([
                    { width: `${width}px`, left: `${left}px`, top: `${bottom}px` }
                ], {
                    duration: 0,
                    fill: "forwards",
                    easing: "ease-in-out",
                    pseudoElement: "::after"
                });
            }
            tablist?.addEventListener("click", (event) => {
                const {target} = event;
                const tab = (<Element>target).closest("e-tab");
                if (tab) {
                    const tabBox = tab.getBoundingClientRect();
                    const {bottom, left, width} = tabBox;
                    tablist.animate([
                        { width: `${width}px`, left: `${left}px`, top: `${bottom}px` }
                    ], {
                        duration: 400,
                        fill: "forwards",
                        easing: "ease-in-out",
                        pseudoElement: "::after"
                    });
                }
            });
        }
    });
}