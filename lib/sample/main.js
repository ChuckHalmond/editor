import * as editor from "../index";
import { formdata } from "./formdata";
editor;
export async function main() {
    console.log("Main loaded!");
    let formDataImport = document.getElementById("formdata-import");
    if (formDataImport) {
        formDataImport.addEventListener("load", () => {
            formdata();
        });
    }
}
//# sourceMappingURL=main.js.map