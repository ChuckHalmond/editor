import * as editor from "../index";
import { Element, GenerateObjectModelAccessors, HTMLEDraggableElement, HTMLEDropzoneElement, ListModel, ObjectModel, ReactiveChildNodes, ReactiveNode, ReactiveNodesObserver, RegisterCustomHTMLElement, TextNode } from "../index";

editor;

@RegisterCustomHTMLElement({
    name: "my-drag"
})
class MyDraggable extends HTMLEDraggableElement {
    constructor(str: string) {
        super();
        console.log(str);
    }
}

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