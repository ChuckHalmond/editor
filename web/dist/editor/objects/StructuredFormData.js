define(["require", "exports", "../elements/Snippets"], function (require, exports, Snippets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StructuredFormData = void 0;
    class StructuredFormData {
        constructor(form) {
            this.form = form;
        }
        getStructuredFormData() {
            let structuredData = {};
            let formData = new FormData(this.form);
            let keys = Array.from(formData.keys());
            keys.forEach((key) => {
                let value = formData.get(key);
                if (value) {
                    (0, Snippets_1.setPropertyFromPath)(structuredData, key, JSON.parse(value.toString()));
                }
            });
            return structuredData;
        }
    }
    exports.StructuredFormData = StructuredFormData;
});
//# sourceMappingURL=StructuredFormData.js.map