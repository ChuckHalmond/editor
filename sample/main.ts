import * as editor from "../index";
import { formdata } from "./formdata";
//import { list } from "./view";

export async function main() {
    console.log("Main loaded!");
    (window as {[key: string]: any})["editor"] = editor;
    let formDataImport = document.getElementById("formdata-import");
    if (formDataImport) {
        formDataImport.addEventListener("load", () => {
            formdata();
        });
    }
    //list;
}