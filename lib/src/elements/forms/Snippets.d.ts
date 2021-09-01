export { FormState };
export { getFormState };
export { setFormState };
interface FormState {
    [name: string]: ({
        type: "checkbox";
        checked: boolean;
    } | {
        type: "radio";
        nodes: [
            {
                value: string;
                checked: boolean;
            }
        ];
    } | {
        value: string;
    });
}
declare const getFormState: (form: HTMLFormElement) => FormState;
declare const setFormState: (form: HTMLFormElement, state: FormState) => void;
