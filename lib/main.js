var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as editor from "./index";
import { Element, Fragment, ListModel, ObjectModel, ReactiveChildNodes, ReactiveNodesObserver, RegisterCustomHTMLElement } from "./index";
editor;
const observer = new ReactiveNodesObserver();
observer.observe(document.body);
export async function main() {
    class TreeModel extends ObjectModel {
        constructor(items) {
            super();
            this.items = new ListModel(items || []);
        }
    }
    window.TreeModel = TreeModel;
    class TreeItemModel extends ObjectModel {
        constructor(args) {
            super();
            this.label = args.label;
            this.items = new ListModel(args.items);
        }
    }
    window.TreeItemModel = TreeItemModel;
    let TreeView = class TreeView extends HTMLElement {
        constructor() {
            super();
            this._model = new TreeModel([
                new TreeItemModel({ label: "My Item", items: [
                        new TreeItemModel({ label: "My sub Item", items: [] })
                    ] })
            ]);
            this.model();
            const observer = new ReactiveNodesObserver();
            this.attachShadow({ mode: "open" });
            this.shadowRoot.append(this.render());
            observer.observe(this.shadowRoot);
        }
        render() {
            return Fragment(...ReactiveChildNodes(this.model().items, item => Element("e-treeitem", {
                props: {
                    label: item.label
                },
                children: ReactiveChildNodes(item.items, item => Element("e-treeitem", {
                    props: {
                        label: item.label
                    }
                }))
            }))(this.shadowRoot));
        }
        model() {
            return this._model;
        }
        setModel(model) {
            this._model = model;
            this.shadowRoot.replaceChildren(this.render());
        }
    };
    TreeView = __decorate([
        RegisterCustomHTMLElement({
            name: "v-treeview"
        })
    ], TreeView);
    document.body.append(Element("v-treeview"));
}
//# sourceMappingURL=main.js.map