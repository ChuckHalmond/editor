import * as editor from "../index";
import { ReactiveViewBase } from "../index";
import { formdata } from "./formdata";

export async function main() {
    console.log("Main loaded!");
    (window as {[key: string]: any})["editor"] = editor;
    let formDataImport = document.getElementById("formdata-import");
    if (formDataImport) {
        formDataImport.addEventListener("load", () => {
            formdata();
        });
    }
    class MyView extends ReactiveViewBase {
        public render() {
            return editor.Element("div", {
                props: {
                    textContent: "div content"
                },
                children: [
                    editor.Element("div", {
                        props: {
                            textContent: "child"
                        }
                    })
                ]
            });
        }
    }

    document.body.append(
        new MyView({}).root
    )
}