define(["require", "exports", "../HTMLElement"], function (require, exports, HTMLElement_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setFormState = exports.getFormState = void 0;
    ;
    const getFormState = (form) => {
        const elements = Array.from(form.elements);
        let state = {};
        elements.forEach((element) => {
            if ((0, HTMLElement_1.isTagElement)("input", element)) {
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
            else if ((0, HTMLElement_1.isTagElement)("select", element)) {
                state[element.name] = {
                    value: element.value,
                };
            }
            else if ((0, HTMLElement_1.isTagElement)("textarea", element)) {
                state[element.name] = {
                    value: element.value,
                };
            }
        });
        return state;
    };
    exports.getFormState = getFormState;
    const setFormState = (form, state) => {
        const elements = Array.from(form.elements);
        const names = Object.keys(state);
        names.forEach((name) => {
            const elemState = state[name];
            if ("type" in elemState) {
                if (elemState.type === "checkbox") {
                    let element = elements.find((elem) => elem.name === name);
                    if (element && (0, HTMLElement_1.isTagElement)("input", element)) {
                        element.checked = elemState.checked;
                    }
                }
                else if (elemState.type === "radio") {
                    elemState.nodes.forEach((radioNode) => {
                        let element = elements.find((elem) => elem.name === name && elem.value === radioNode.value);
                        if (element && (0, HTMLElement_1.isTagElement)("input", element)) {
                            element.checked = radioNode.checked;
                        }
                    });
                }
            }
            else {
                let element = elements.find((elem) => elem.name === name);
                if (element && ((0, HTMLElement_1.isTagElement)("input", element) || (0, HTMLElement_1.isTagElement)("select", element) || (0, HTMLElement_1.isTagElement)("textarea", element))) {
                    element.value = elemState.value;
                }
            }
        });
    };
    exports.setFormState = setFormState;
});
//# sourceMappingURL=Snippets.js.map