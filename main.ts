//import { MenuItemGroupWidget, MenuItemWidget, MenuWidget, MenuBarWidget } from "./src/views/MenuBarWidget";
import { TreeItemModel, TreeModel, TreeItemList } from "./src/views/TreeView";

import { ListItemModel, ListModel, ListView } from "./src/views/ListView";
import { GridColumnModel, GridModel, GridRowModel, GridView } from "./src/views/GridView";
import { element, fragment, reactiveElement } from "./src/elements/Element";
import { treeItemWidget } from "./src/views/widgets/tree/TreeItemWidget";
import { widget } from "./src/views/widgets/Widget";
import { Editor } from "./src/Editor";
import { toolbarWidget } from "./src/views/widgets/toolbar/ToolBarWidget";
import { toolbarItemWidget } from "./src/views/widgets/toolbar/ToolBarItemWidget";
import { comboBoxWidget } from "./src/views/widgets/combobox/ComboBoxWidget";
import { optionWidget } from "./src/views/widgets/combobox/OptionWidget";
import { TreeMain } from "./TreeMain";

import "./index";

declare global {
    interface ElementInternals {
        role: string;
    }
}
// const menubar = new MenuBarWidget([
//     new MenuItemWidget({
//         label: "File",
//         name: "file",
//         type: "menu",
//         menu: new MenuWidget({
//             name: "File",
//             groups: [
//                 new MenuItemGroupWidget({
//                     name: "fileActions",
//                     items: [
//                         new MenuItemWidget({
//                             label: "Import file...",
//                             name: "import"
//                         }),
//                         new MenuItemWidget({
//                             label: "Export file...",
//                             name: "export",
//                             hotkey: new HotKey(Key.B, KeyModifier.Control, KeyModifier.Alt)
//                         })
//                     ]
//                 })
//             ]
//         })
//     }),
//     new MenuItemWidget({
//         label: "Preferences",
//         name: "preferences",
//         type: "menu",
//         menu: new MenuWidget({
//             name: "Preferences",
//             groups: [
//                 new MenuItemGroupWidget({
//                     name: "fileActions",
//                     items: [
//                         new MenuItemWidget({
//                             label: "Advanced User",
//                             name: "advanced",
//                             type: "checkbox",
//                             hotkey: new HotKey(Key.A, KeyModifier.Control, KeyModifier.Alt)
//                         }),
//                         new MenuItemWidget({
//                             label: "Layout",
//                             name: "layout",
//                             type: "submenu",
//                             menu: new MenuWidget({
//                                 name: "Layout",
//                                 groups: [
//                                     new MenuItemGroupWidget({
//                                         name: "Layout",
//                                         items: [
//                                             new MenuItemWidget({
//                                                 label: "Standard",
//                                                 name: "standard",
//                                                 type: "radio"
//                                             }),
//                                             new MenuItemWidget({
//                                                 label: "Advanced",
//                                                 name: "advanced",
//                                                 type: "radio"
//                                             })
//                                         ]
//                                     })
//                                 ]
//                             })
//                         })
//                     ]
//                 })
//             ]
//         })
//     })
// ]);

// const treeModel = new TreeModel({
//     itemContextMenuDelegate: (activeItem: TreeItemModel, selectedItems: TreeItemList) => 
//         fragment(
//             widget("menuitemgroup", {
//                 slotted: [
//                     widget("menuitem", {
//                         properties: {
//                             label: "Display"
//                         },
//                         listeners: {
//                             click: () => {
//                                 selectedItems.display();
//                             }
//                         }
//                     }),
//                     widget("menuitem", {
//                         properties: {
//                             label: "Delete"
//                         },
//                         listeners: {
//                             click: () => {
//                                 const {count} = selectedItems;
//                                 const doRemove = confirm(`Remove ${count} items?`);
//                                 if (doRemove) {
//                                     selectedItems.remove();
//                                 }
//                             }
//                         }
//                     })
//                 ]
//             }),
//             widget("menuitemgroup", {
//                 slotted: [
//                     widget("menuitem", {
//                         properties: {
//                             type: "checkbox",
//                             label: activeItem.visibility ? "Hide" : "Show"
//                         },
//                         listeners: {
//                             click: () => {
//                                 activeItem.visibility ?
//                                     selectedItems.hide() :
//                                     selectedItems.show();
//                             }
//                         }
//                     })
//                 ]
//             })
//         ),
//     itemContentDelegate: (item: TreeItemModel) => 
//         fragment(
//             ...([
//                 reactiveElement(
//                     item,
//                     element("span", {
//                         attributes: {
//                             class: "label"
//                         }
//                     }),
//                     ["label"],
//                     (label, property, oldValue, newValue) => {
//                         label.textContent = newValue;
//                     }
//                 )
//             ]).concat(
//                 (item.type == "parent") ? [
//                     reactiveElement(
//                         item,
//                         element("span", {
//                             attributes: {
//                                 class: "badge"
//                             }
//                         }),
//                         ["childCount"],
//                         (badge, property, oldValue, newValue) => {
//                             badge.textContent = `(${newValue})`;
//                         }
//                     )
//                 ] : []
//             ).concat([
//                 reactiveElement(
//                     item,
//                     widget("toolbar", {
//                         slotted: [
//                             widget("toolbaritem", {
//                                 properties: {
//                                     name: "visibility",
//                                     type: "checkbox",
//                                     label: "Visibility"
//                                 },
//                                 listeners: {
//                                     click: () => {
//                                         item.visibility ?
//                                             item.hide() :
//                                             item.show();
//                                     }
//                                 }
//                             })
//                         ]
//                     }),
//                     ["visibility"],
//                     (toolbar, property, oldValue, newValue) => {
//                         switch (property) {
//                             case "visibility": {
//                                 const visibilityItem = toolbarWidget.slot(toolbar)
//                                     ?.querySelector<HTMLElement>(".toolbaritem[name=visibility]");
//                                 if (visibilityItem) {
//                                     const label = newValue ? "Hide" : "Show";
//                                     toolbarItemWidget.setLabel(visibilityItem, label);
//                                     toolbarItemWidget.setTitle(visibilityItem, label);
//                                     toolbarItemWidget.setPressed(visibilityItem, newValue);
//                                 }
//                             }
//                         }
//                     }
//                 )
//             ])
//         ),
//     items: [
//         new TreeItemModel({
//             label: "TI 0",
//             type: "parent",
//             items: [
//                 new TreeItemModel({
//                     label: "TI 1A",
//                     type: "parent",
//                     items: [
//                         new TreeItemModel({
//                             type: "leaf",
//                             label: "TI 1AX"
//                         }),
//                     ]
//                 }),
//                 new TreeItemModel({
//                     type: "parent",
//                     label: "TI 1B"
//                 })
//             ]
//         }),
//         new TreeItemModel({
//             label: "TI 1",
//             type: "parent",
//             items: [
//                 new TreeItemModel({
//                     label: "TI 1A",
//                     type: "parent",
//                     items: [
//                         new TreeItemModel({
//                             type: "leaf",
//                             label: "TI 1AX"
//                         }),
//                     ]
//                 }),
//                 new TreeItemModel({
//                     type: "parent",
//                     label: "TI 1B"
//                 })
//             ]
//         }),
//         new TreeItemModel({
//             type: "leaf",
//             label: "TI 2"
//         }),
//         new TreeItemModel({
//             type: "leaf",
//             label: "TI 3"
//         })
//     ],
//     sortFunction: (item_a: TreeItemModel, item_b: TreeItemModel) => {
//         const {label: aLabel} = item_a;
//         const {label: bLabel} = item_b;
//         return bLabel.localeCompare(aLabel);
//     }
// });
// const treeElement = treeView.create(treeModel);
// document.body.append(treeElement);

// treeModel.childItems.append(
//     new TreeItemModel({
//         label: "yo",
//         type: "parent",
//         items: [
//             new TreeItemModel({
//                 type: "leaf",
//                 label: "plop"
//             })
//         ]
//     })
// );

// const listView = new ListView();
// listView.setModel(
//     new ListModel({
//         items: [
//             new ListItemModel({
//                 label: "Hey"
//             }),
//             new ListItemModel({
//                 label: "Yo"
//             })
//         ]
//     })
// );

// //document.body.append(listView);

// // Menu actions
// // Toolbar actions
// const gridView = new GridView();
// gridView.resizable = true;
// gridView.sortable = true;
// gridView.setColumnDelegate((column) => {
//     return fragment(
//         element("label", {
//             children: column.label
//         }),
//         element("e-toolbar", {
//             children: [
//                 element("e-toolbaritem", {
//                     attributes: {
//                         type: "button"
//                     }
//                 })
//             ]
//         })
//     );
// });
// const year = new Date().getFullYear();
// gridView.setModel(
//     new GridModel({
//         columns: [
//             new GridColumnModel({
//                 name: "name",
//                 type: String,
//                 label: "Name",
//                 extract: (row) => row.name
//             }),
//             new GridColumnModel({
//                 name: "age",
//                 type: Number,
//                 label: "Age",
//                 extract: (row) => row.age,
//                 filters: [{
//                     name: "Minors",
//                     filter: (row) => row.age < 18
//                 },{
//                     name: "Majors",
//                     filter: (row) => row.age >= 18
//                 }]
//             }),
//             new GridColumnModel({
//                 name: "birthyear",
//                 type: String,
//                 label: "Brith Year",
//                 extract: (row) => year - row.age
//             }),
//         ],
//         rows: [
//             new GridRowModel({
//                 id: 1,
//                 name: "Denis",
//                 age: 13
//             }),
//             new GridRowModel({
//                 id: 2,
//                 name: "Jean-Charles",
//                 age: 32
//             }),
//             new GridRowModel({
//                 id: 3,
//                 name: "Charles",
//                 age: 25
//             }),
//             new GridRowModel({
//                 id: 4,
//                 name: "Mamagubida",
//                 age: 128
//             })
//         ]
//     })
// );
// document.body.append(gridView);

// const menuView = widget("menubar", {
//     slotted: [
//         widget("menuitem", {
//             properties: {
//                 label: "MenuItem 0",
//                 name: "MenuItem 0",
//                 type: "menu",
//                 disabled: true
//             },
//             slotted: [
//                 widget("menu", {
//                     slotted: [
//                         widget("menuitem", {
//                             properties: {
//                                 label: "MenuItem 1",
//                                 name: "MenuItem 1",
//                                 type: "checkbox"
//                             }
//                         })
//                     ]
//                 })
//             ]
//         }),
//         widget("menuitem", {
//             properties: {
//                 label: "MenuItem 0",
//                 name: "MenuItem 0",
//                 type: "menu"
//             },
//             slotted: [
//                 widget("menu", {
//                     slotted: [
//                         widget("menuitem", {
//                             properties: {
//                                 label: "MenuItem 1",
//                                 name: "MenuItem 1",
//                                 type: "checkbox"
//                             }
//                         })
//                     ]
//                 })
//             ]
//         }),
//         widget("menuitem", {
//             properties: {
//                 label: "MenuItem 1",
//                 name: "MenuItem 1",
//                 type: "menu"
//             },
//             slotted: [
//                 widget("menu", {
//                     slotted: [
//                         widget("menuitemgroup", {
//                             slotted: [
//                                 widget("menuitem", {
//                                     properties: {
//                                         label: "MenuItem 1",
//                                         type: "checkbox",
//                                         keyshortcut: "Ctrl+B",
//                                         disabled: true,
//                                         checked: true
//                                     }
//                                 }),
//                                 widget("menuitem", {
//                                     properties: {
//                                         type: "button",
//                                         label: "MenuItem 2",
//                                         keyshortcut: "Ctrl+A"
//                                     }
//                                 })
//                             ]
//                         }),
//                         widget("separator"),
//                         widget("menuitem", {
//                             properties: {
//                                 label: "Submenu",
//                                 type: "submenu"
//                             },
//                             slotted: [
//                                 widget("menu", {
//                                     slotted: [
//                                         widget("menuitem", {
//                                             properties: {
//                                                 label: "MenuItem 1",
//                                                 type: "radio",
//                                                 name: "radio",
//                                                 value: "1"
//                                             }
//                                         }),
//                                         widget("menuitem", {
//                                             properties: {
//                                                 type: "radio",
//                                                 label: "MenuItem 2",
//                                                 name: "radio",
//                                                 value: "2"
//                                             }
//                                         }),
//                                         widget("menuitem", {
//                                             properties: {
//                                                 type: "radio",
//                                                 label: "MenuItem 3",
//                                                 name: "radio",
//                                                 value: "3"
//                                             }
//                                         })
//                                     ]
//                                 })
//                             ]
//                         })
//                     ]
//                 })
//             ]
//         })
//     ]
// })
// document.body.append(menuView);

// const tree = widget("tree", {
//     slotted: [
//         widget("treeitem", {
//             properties: {
//                 label: "treeitem 0",
//                 type: "parent",
//                 draggable: true
//                 //disabled: true
//             },
//             slotted: {
//                 group: [
//                     widget("treeitemgroup", {
//                         slotted: [
//                             widget("treeitem", {
//                                 properties: {
//                                     label: "treeitem 1",
//                                     type: "leaf",
//                                     draggable: true
//                                 }
//                             })
//                         ]
//                     })
//                 ]
//             },
//             listeners: {
//                 contextmenu: <EventListener>((event: MouseEvent) => {
//                     const {target, clientX, clientY} = event;
//                     const targetItem = <HTMLElement>(<HTMLElement>target).closest(".treeitem");
//                     const menu = widget("menu", {
//                         properties: {
//                             contextual: true
//                         },
//                         slotted: [
//                             widget("menuitemgroup", {
//                                 slotted: [
//                                     widget("menuitem", {
//                                         properties: {
//                                             label: "Display"
//                                         },
//                                         listeners: {
//                                             click: () => {
//                                                 console.log(treeItemWidget.getLabel(targetItem));
//                                             }
//                                         }
//                                     }),
//                                     widget("menuitem", {
//                                         properties: {
//                                             label: "Delete"
//                                         },
//                                         listeners: {
//                                             click: () => {
//                                                 targetItem.remove();
//                                             }
//                                         }
//                                     })
//                                 ]
//                             }),
//                         ]
//                     });
//                     targetItem.append(menu);
//                     menuWidget.positionContextual(menu, clientX, clientY);
//                     menu.focus({preventScroll: true});
//                     event.preventDefault();
//                 })
//             }
//         }),
//         widget("treeitem", {
//             properties: {
//                 label: "treeitem 0",
//                 type: "parent",
//                 draggable: true,
//                 disabled: true
//             },
//             slotted: {
//                 group: [
//                     widget("treeitemgroup", {
//                         slotted: [
//                             widget("treeitem", {
//                                 properties: {
//                                     label: "treeitem 1",
//                                     type: "leaf",
//                                     draggable: true
//                                 }
//                             })
//                         ]
//                     })
//                 ]
//             }
//         }),
//         widget("treeitem", {
//             properties: {
//                 label: "treeitem 1",
//                 type: "leaf",
//                 draggable: true
//             },
//             slotted: {
//                 content: [
//                     widget("toolbar", {
//                         slotted: [
//                             widget("toolbaritem",  {
//                                 properties: {
//                                     label: "First item",
//                                     type: "button"
//                                 }
//                             }),
//                             widget("toolbaritem",  {
//                                 properties: {
//                                     label: "Second item",
//                                     type: "checkbox"
//                                 }
//                             })
//                         ]
//                     })
//                 ]
//             }
//         })
//     ]
// })
// document.body.append(tree);

// document.body.append(
//     widget("toolbar", {
//         slotted: [
//             widget("toolbaritem",  {
//                 properties: {
//                     label: "First item",
//                     type: "menubutton"
//                 },
//                 slotted: [
//                     widget("menu", {
//                         slotted: [
//                             widget("menuitem", {
//                                 properties: {
//                                     label: "MenuItem 1",
//                                     name: "MenuItem 1",
//                                     type: "checkbox"
//                                 }
//                             }),
//                             widget("menuitem", {
//                                 properties: {
//                                     label: "MenuItem 2",
//                                     name: "MenuItem 2",
//                                     type: "checkbox"
//                                 }
//                             })
//                         ]
//                     })
//                 ]
//             }),
//             widget("toolbaritem",  {
//                 properties: {
//                     label: "Second item",
//                     type: "checkbox"
//                 }
//             }),
//             widget("toolbaritem",  {
//                 properties: {
//                     label: "Third item",
//                     type: "checkbox",
//                     disabled: true,
//                 }
//             }),
//             widget("toolbaritem",  {
//                 properties: {
//                     label: "Fourth item",
//                     type: "checkbox"
//                 }
//             })
//         ]
//     })
// );

// document.body.append(
//     widget("list", {
//         slotted: [
//             widget("listitemgroup",  {
//                 slotted: [   
//                     widget("listitem",  {
//                         properties: {
//                             label: "First item"
//                         }
//                     })
//                 ]
//             }),
//             widget("listitem",  {
//                 properties: {
//                     label: "Second item"
//                 },
//                 slotted: [
//                     widget("toolbar", {
//                         slotted: [
//                             widget("toolbaritem",  {
//                                 properties: {
//                                     label: "First item",
//                                     type: "button"
//                                 }
//                             }),
//                             widget("toolbaritem",  {
//                                 properties: {
//                                     label: "Second item",
//                                     type: "checkbox"
//                                 }
//                             })
//                         ]
//                     })
//                 ]
//             }),
//             widget("listitem",  {
//                 properties: {
//                     label: "Third item",
//                     disabled: true,
//                 }
//             }),
//             widget("listitem",  {
//                 properties: {
//                     label: "Fourth item"
//                 }
//             })
//         ]
//     })
// );

// document.body.append(
//     widget("grid", {
//         properties: {
//             selectby: "row",
//             multisectable: true
//         },
//         slotted: {
//             headers: [
//                 widget("gridheader",  {
//                     slotted: "First header"
//                 }),
//                 widget("gridheader",  {
//                     slotted: "Second header"
//                 })
//             ],
//             rows: [
//                 widget("gridrow",  {
//                     slotted: [   
//                         widget("gridcell",  {
//                             slotted: "First cell"
//                         }),
//                         widget("gridcell",  {
//                             slotted: "Second cell"
//                         })
//                     ]
//                 }),
//                 widget("gridrow",  {
//                     slotted: [   
//                         widget("gridcell",  {
//                             slotted: "Third cell"
//                         }),
//                         widget("gridcell",  {
//                             slotted: "Fourth cell"
//                         })
//                     ]
//                 }),
//                 widget("gridrow",  {
//                     slotted: [   
//                         widget("gridcell",  {
//                             slotted: "Fifth cell"
//                         }),
//                         widget("gridcell",  {
//                             slotted: "Sixth cell"
//                         })
//                     ]
//                 }),
//                 widget("gridrow",  {
//                     slotted: [   
//                         widget("gridcell",  {
//                             slotted: "Heighth cell"
//                         }),
//                         widget("gridcell",  {
//                             slotted: "Nineth cell"
//                         })
//                     ]
//                 })
//             ]
//         }
//     })
// );

// document.body.append(
//     widget("combobox", {
//         slotted: [
//             widget("option",  {
//                 properties: {
//                     label: "First option"
//                 }
//             }),
//             widget("option",  {
//                 properties: {
//                     label: "Second option"
//                 }
//             }),
//             widget("option",  {
//                 properties: {
//                     label: "Third option",
//                     selected: true
//                 }
//             })
//         ],
//         listeners: {
//             change: (event) => {
//                 const {currentTarget} = event;
//                 const comboBoxTarget = <HTMLElement>currentTarget;
//                 console.log(optionWidget.getLabel(comboBoxWidget.selectedOption(comboBoxTarget)!));
//             }
//         }
//     })
// );

// const editor = new Editor();
// editor.setup();

// editor.registerCheckboxAction("toggleAdvancedUser", (_, newValue) => {
//     console.log(`Advanced user is now ${newValue}`);
// }, {hotkey: new HotKey(Key.ARROW_DOWN, KeyModifier.Alt)});

// editor.registerRadioAction("setLayout", (_, newValue) => {
//     editor.setPair("layout", newValue);
// });

// editor.registerButtonAction("execLayout", () => {
//     const layout = editor.getPair("layout");
//     console.log(`Layout is ${layout}`);
// }, {hotkey: new HotKey(Key.ARROW_UP, KeyModifier.Alt)});


// editor.registerRadioAction("selectTest", (oldValue, newValue) => {
//     console.log(`Test is ${newValue}`);
// }, {value: "2", key: "test"});

// document.addEventListener("slotchange", (event) => {
//     console.log(event);
// });

// setTimeout(() => {
//     const execLayoutToolBarItem = document.querySelector<HTMLEActionElement>("e-toolbaritem[name=execLayout]");
//     if (execLayoutToolBarItem) {
//         editor.addPairListener("layout", (oldValue, newValue) => {
//             if (newValue !== oldValue) {
//                 execLayoutToolBarItem.value = newValue;
//             }
//         });
//     }
// }, 100);

// const button = element("button", {
//     properties: {
//         textContent: "Focus"
//     },
//     listeners: {
//         click: () => {
//             const menuitem = document.querySelector<HTMLEMenuItemElement>("e-menuitem#hey");
//             if (menuitem) {
//                 menuitem.focus();
//             }
//         }
//     }
// });
// document.body.append(button);
// document.body.append(menubar.element);

// editor.executeCheckboxAction("toggleAdvancedUser", true);
// editor.setCheckboxActionValue("toggleAdvancedUser", false);

//editor.setRadioActionValue("selectTest", "2");

//editor.executeRadioAction("setLayout", "other");
export async function main() {
    TreeMain();
}