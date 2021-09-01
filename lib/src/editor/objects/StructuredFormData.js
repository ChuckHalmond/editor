import { setPropertyFromPath } from "../elements/Snippets";
export { StructuredFormData };
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
                setPropertyFromPath(structuredData, key, JSON.parse(value.toString()));
            }
        });
        return structuredData;
    }
}
//# sourceMappingURL=StructuredFormData.js.map