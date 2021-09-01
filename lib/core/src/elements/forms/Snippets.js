import { isTagElement } from "../HTMLElement";
export { getFormState };
export { setFormState };
;
const getFormState = (form) => {
    const elements = Array.from(form.elements);
    let state = {};
    elements.forEach((element) => {
        if (isTagElement("input", element)) {
            if (element.type === "radio") {
                if (!(element.name in state)) {
                    state[element.name] = {
                        type: "radio",
                        nodes: [{
                                value: element.value,
                                checked: element.checked
                            }]
                    };
                }
                else {
                    const elem = state[element.name];
                    if ("nodes" in elem) {
                        elem.nodes.push({
                            value: element.value,
                            checked: element.checked
                        });
                    }
                }
            }
            else if (element.type === "checkbox") {
                state[element.name] = {
                    type: "checkbox",
                    checked: element.checked
                };
            }
            else {
                state[element.name] = {
                    value: element.value,
                };
            }
        }
        else if (isTagElement("select", element)) {
            state[element.name] = {
                value: element.value,
            };
        }
        else if (isTagElement("textarea", element)) {
            state[element.name] = {
                value: element.value,
            };
        }
    });
    return state;
};
const setFormState = (form, state) => {
    const elements = Array.from(form.elements);
    const names = Object.keys(state);
    names.forEach((name) => {
        const elemState = state[name];
        if ("type" in elemState) {
            if (elemState.type === "checkbox") {
                let element = elements.find((elem) => elem.name === name);
                if (element && isTagElement("input", element)) {
                    element.checked = elemState.checked;
                }
            }
            else if (elemState.type === "radio") {
                elemState.nodes.forEach((radioNode) => {
                    let element = elements.find((elem) => elem.name === name && elem.value === radioNode.value);
                    if (element && isTagElement("input", element)) {
                        element.checked = radioNode.checked;
                    }
                });
            }
        }
        else {
            let element = elements.find((elem) => elem.name === name);
            if (element && (isTagElement("input", element) || isTagElement("select", element) || isTagElement("textarea", element))) {
                element.value = elemState.value;
            }
        }
    });
};
//# sourceMappingURL=Snippets.js.map