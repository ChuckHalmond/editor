import * as editor from "../index";
import { HTMLEDraggableElementBase, RegisterCustomHTMLElement } from "../index";

editor;

@RegisterCustomHTMLElement({
    name: "my-drag"
})
class MyDraggable extends HTMLEDraggableElementBase {
    public test() {

    }
}

export async function main() {
    setTimeout(() => {
        document.getElementById("dragzone")!.append(document.createElement("my-drag"));
    }, 100);
    console.log("Main loaded!");
    /*(window as {[key: string]: any})["editor"] = editor;
    let formDataImport = document.getElementById("formdata-import");
    if (formDataImport) {
        formDataImport.addEventListener("load", () => {
            formdata();
        });
    }*/
}