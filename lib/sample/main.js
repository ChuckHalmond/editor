import * as editor from "../index";
import { formdata } from "./formdata";
import { list } from "./view";
export async function main() {
    console.log("Main loaded!");
    window["editor"] = editor;
    let formDataImport = document.getElementById("formdata-import");
    if (formDataImport) {
        formDataImport.addEventListener("load", () => {
            formdata();
        });
    }
    list;
}
//# sourceMappingURL=main.js.map