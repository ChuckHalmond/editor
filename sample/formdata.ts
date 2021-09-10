import { getFormState, setFormState } from "../src/elements/forms/Snippets";

export function formdata() {
    const exportButton = document.getElementById("export-button");
    const loadButton = document.getElementById("load-button");

    exportButton?.addEventListener("click", () => {
        const form = exportButton!.closest("form");
        if (form) {
            let formState = getFormState(form);
            let dataBlob = new Blob([JSON.stringify(formState, null, 4)], {type: "application/json"});
            let donwloadAnchor = document.createElement("a");
            donwloadAnchor.href = URL.createObjectURL(dataBlob);
            donwloadAnchor.download = "config.json";
            donwloadAnchor.click();
        }
    });

    loadButton?.addEventListener("click", () => {
        const form = exportButton!.closest("form");
        if (form) {
            let input = document.createElement("input");
            input.type = "file";
            input.addEventListener("change", () => {
                let file = input.files ? input.files.length > 0 ? input.files.item(0) : null : null;
                if (file) {
                    file.text().then((resp) => {
                        let formState = JSON.parse(resp);
                        const form = exportButton!.closest("form");
                        if (form) {
                            setFormState(form, formState);
                        }
                    });
                }
            });
            input.click();
        }
    });
}