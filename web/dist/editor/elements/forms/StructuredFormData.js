define(["require", "exports", "../HTMLElement", "../Snippets"], function (require, exports, HTMLElement_1, Snippets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StructuredFormData = void 0;
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
                if ((0, HTMLElement_1.isTagElement)("input", element) || (0, HTMLElement_1.isTagElement)("select", element) || (0, HTMLElement_1.isTagElement)("textarea", element)) {
                    if (element.name) {
                        let value = null;
                        if ((0, HTMLElement_1.isTagElement)("input", element)) {
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
                            (0, Snippets_1.setPropertyFromPath)(data, fullname, value);
                        }
                    }
                }
            });
            return data;
        }
    }
    exports.StructuredFormData = StructuredFormData;
});
//# sourceMappingURL=StructuredFormData.js.map