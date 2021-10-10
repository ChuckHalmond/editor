export { FormState };
export { getFormState };
export { setFormState };

interface FormState {
    [name: string]: {
        value: string | number | boolean | null;
        _control?: string;
    }
};

const getFormState = (form: HTMLFormElement) => {
    const elements = Array.from(form.elements);
    const state: FormState = {};
    elements.forEach((element) => {
        if (element instanceof HTMLInputElement) {
            if (element.type === "radio") {
                if (typeof state[element.name] === "undefined") {
                    state[element.name] = {
                        value: null,
                        _control: element.type
                    };
                }
                if (element.checked) {
                    state[element.name] = {
                        value: element.value,
                        _control: element.type
                    };
                }
            }
            else if (element.type === "checkbox") {
                state[element.name] = {
                    value: element.checked,
                    _control: element.type
                };
            }
            else if (element.type === "number") {
                const floatValue = parseFloat(element.value);
                state[element.name] = {
                    value: !isNaN(floatValue) ? floatValue : null,
                    _control: element.type
                };
            }
            else {
                state[element.name] = {
                    value: (element.value !== "") ? element.value : null,
                    _control: element.type
                };
            }
        }
        else if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
            state[element.name] = {
                value: (element.value !== "") ? element.value : null,
                _control: element.type
            };
        }
    });

    return state;
}

const setFormState = (form: HTMLFormElement, state: FormState) => {
    const elements = Array.from(form.elements);
    const names = Object.keys(state);
    names.forEach((name) => {
        const namedElements = elements.filter((element) => (element as any).name === name);
        namedElements.forEach((element) => {
            const stateValue = state[name].value;
            if (element instanceof HTMLInputElement) {
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
            else if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
                element.value = (stateValue !== null) ? stateValue.toString() : "";
            }
        });
    });
}