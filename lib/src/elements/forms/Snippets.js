import { isTagElement } from "../HTMLElement";
export { getFormState };
export { setFormState };
;
const getFormState = (form) => {
    const elements = Array.from(form.elements);
    const state = {};
    elements.forEach((element) => {
        if (isTagElement("input", element)) {
            if (element.type === "radio") {
                if (typeof state[element.name] === "undefined") {
                    state[element.name] = {
                        value: null
                    };
                }
                if (element.checked) {
                    state[element.name] = {
                        value: element.value
                    };
                }
            }
            else if (element.type === "checkbox") {
                state[element.name] = {
                    value: element.checked
                };
            }
            else if (element.type === "number") {
                let floatValue = parseFloat(element.value);
                state[element.name] = {
                    value: !isNaN(floatValue) ? floatValue : null
                };
            }
            else {
                state[element.name] = {
                    value: (element.value !== "") ? element.value : null
                };
            }
        }
        else if (isTagElement("select", element) || isTagElement("textarea", element)) {
            state[element.name] = {
                value: (element.value !== "") ? element.value : null
            };
        }
    });
    return state;
};
const setFormState = (form, state) => {
    const elements = Array.from(form.elements);
    const names = Object.keys(state);
    names.forEach((name) => {
        let namedElements = elements.filter((element) => element.name === name);
        namedElements.forEach((element) => {
            let stateValue = state[name].value;
            if (isTagElement("input", element)) {
                if (element.type === "radio") {
                    element.checked = (stateValue !== null && element.value === stateValue.toString());
                }
                else if (element.type === "checkbox") {
                    element.checked = !!stateValue;
                }
                else if (element.type === "number") {
                    element.value = (stateValue !== null) ? stateValue.toString() : "";
                }
                else {
                    element.value = (stateValue !== null) ? stateValue.toString() : "";
                }
            }
            else if (isTagElement("select", element) || isTagElement("textarea", element)) {
                element.value = (stateValue !== null) ? stateValue.toString() : "";
            }
        });
    });
};
//# sourceMappingURL=Snippets.js.map