var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as editor from "../index";
import { HTMLEDraggableElementBase, RegisterCustomHTMLElement } from "../index";
editor;
let MyDraggable = class MyDraggable extends HTMLEDraggableElementBase {
    test() {
    }
};
MyDraggable = __decorate([
    RegisterCustomHTMLElement({
        name: "my-drag"
    })
], MyDraggable);
export async function main() {
    setTimeout(() => {
        document.getElementById("dragzone").append(document.createElement("my-drag"));
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
//# sourceMappingURL=main.js.map