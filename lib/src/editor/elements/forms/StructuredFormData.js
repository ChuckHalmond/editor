import { isTagElement } from "../HTMLElement";
import { setPropertyFromPath } from "../Snippets";
export { StructuredFormData };
class StructuredFormData {
    constructor(form) {
        this.form = form;
    }
    resolveElementScope(element) {
        let fullname = element.name;
        let parent = element.parentElement;
        while (parent && parent !== this.form) {
            let scope = parent.dataset.scope;
            if (typeof scope !== "undefined") {
                fullname = `${scope}.${fullname}`;
            }
            parent = parent === null || parent === void 0 ? void 0 : parent.parentElement;
        }
        return fullname;
    }
    getScopedData() {
        let elements = Array.from(this.form.elements);
        let data = {};
        elements.forEach((element) => {
            if (isTagElement("input", element) || isTagElement("select", element) || isTagElement("textarea", element)) {
                if (element.name) {
                    let value = null;
                    if (isTagElement("input", element)) {
                        if (element.value) {
                            switch (element.type) {
                                case "text":
                                    value = element.value;
                                    break;
                                case "date":
                                case "datetime-local":
                                    value = element.value;
                                    break;
                                case "checkbox":
                                case "radio":
                                    value = (element.value == "on");
                                    break;
                                default:
                                    value = element.value;
                            }
                        }
                    }
                    if (value !== null) {
                        let fullname = this.resolveElementScope(element);
                        setPropertyFromPath(data, fullname, value);
                    }
                }
            }
        });
        return data;
    }
}
//# sourceMappingURL=StructuredFormData.js.map