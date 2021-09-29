import * as editor from "../index";
import { formdata } from "./formdata";
export async function main() {
    console.log("Main loaded!");
    window["editor"] = editor;
    let formDataImport = document.getElementById("formdata-import");
    if (formDataImport) {
        formDataImport.addEventListener("load", () => {
            formdata();
        });
    }
}
//# sourceMappingURL=main.js.map