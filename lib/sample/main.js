var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as editor from "../index";
import { HTMLEDraggableElement, HTMLEDropzoneElement, ReactiveNodesObserver, RegisterCustomHTMLElement } from "../index";
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
    /*console.log(new MyDraggable("salut!"));
    setTimeout(() => {
        document.getElementById("dragzone")!.append(document.createElement("my-drag"));
    }, 100);
    console.log("Main loaded!");

    @GenerateObjectModelAccessors(["lol"])
    class MyModel extends ObjectModel {
        public lol: string = "holoo";
    }

    class MyListModel extends ListModel<string> {
        
    }

    const model = new MyModel();
    const listModel = new MyListModel();

    listModel.push("lol");


    (window as any)["model"] = model;
    
    (window as any)["listModel"] = listModel;
    document.body.append(
        ReactiveNode(
            model,
            TextNode(model.lol),
            (node, prop, oldValue, newValue) => {
                if (prop === "lol") {
                    node.textContent = newValue;
                }
            }
        )
    )

    const parent = Element("div", {
        children: [
            Element("ul", {
                children: ReactiveChildNodes(
                    listModel,
                    item => Element("li", {
                        props: {
                            textContent: item as string
                        }
                    })
                )
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
    document.body.append(parent);*/
    document.body.addEventListener("dragover", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLEDropzoneElement)) {
            const dataTransfer = event.dataTransfer;
            if (dataTransfer) {
                dataTransfer.dropEffect = "move";
            }
            event.preventDefault();
        }
    });
    document.body.addEventListener("drop", (event) => {
        const dataTransfer = event.dataTransfer;
        if (dataTransfer) {
            const dragzoneId = dataTransfer.getData("text/plain");
            const dragzone = document.getElementById(dragzoneId);
            if (dragzone instanceof HTMLEDropzoneElement) {
                const selectedDraggables = dragzone.selectedDraggables;
                dragzone.removeDraggables((draggable) => selectedDraggables.includes(draggable));
            }
        }
    });
    /*(window as {[key: string]: any})["editor"] = editor;
    let formDataImport = document.getElementById("formdata-import");
    if (formDataImport) {
        formDataImport.addEventListener("load", () => {
            formdata();
        });
    }*/
}
//# sourceMappingURL=main.js.map