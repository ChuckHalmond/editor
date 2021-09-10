export { FormState };
export { getFormState };
export { setFormState };
interface FormState {
    [name: string]: {
        value: string | number | boolean | null;
    };
}
declare const getFormState: (form: HTMLFormElement) => FormState;
declare const setFormState: (form: HTMLFormElement, state: FormState) => void;
