var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as editor from "../index";
import { Element, GenerateObjectModelAccessors, HTMLEDraggableElement, ListModel, ObjectModelBase, ReactiveChildNodes, ReactiveNode, ReactiveNodesObserver, RegisterCustomHTMLElement, TextNode } from "../index";
editor;
let MyDraggable = class MyDraggable extends HTMLEDraggableElement {
    constructor(str) {
        super();
        console.log(str);
    }
};
MyDraggable = __decorate([
    RegisterCustomHTMLElement({
        name: "my-drag"
    })
], MyDraggable);
const observer = new ReactiveNodesObserver();
observer.observe(document.body);
export async function main() {
    console.log(new MyDraggable("salut!"));
    setTimeout(() => {
        document.getElementById("dragzone").append(document.createElement("my-drag"));
    }, 100);
    console.log("Main loaded!");
    let MyModel = class MyModel extends ObjectModelBase {
        constructor() {
            super(...arguments);
            this.lol = "holoo";
        }
    };
    MyModel = __decorate([
        GenerateObjectModelAccessors(["lol"])
    ], MyModel);
    class MyListModel extends ListModel {
    }
    const model = new MyModel();
    const listModel = new MyListModel();
    listModel.push("lol");
    window["model"] = model;
    window["listModel"] = listModel;
    document.body.append(ReactiveNode(model, TextNode(model.lol), (node, prop, oldValue, newValue) => {
        if (prop === "lol") {
            node.textContent = newValue;
        }
    }));
    const parent = Element("div", {
        children: [
            Element("ul", {
                children: ReactiveChildNodes(listModel, item => Element("li", {
                    props: {
                        textContent: item
                    }
                }))
            }),
            Element("button", {
                props: {
                    textContent: "Print date!"
                },
                listeners: {
                    click: () => {
                        listModel.push(new Date().toLocaleString());
                    }
                }
            })
        ]
    });
    document.body.append(parent);
    /*(window as {[key: string]: any})["editor"] = editor;
    let formDataImport = document.getElementById("formdata-import");
    if (formDataImport) {
        formDataImport.addEventListener("load", () => {
            formdata();
        });
    }*/
}
//# sourceMappingURL=main.js.map