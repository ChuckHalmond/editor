export { StructuredFormData };
declare class StructuredFormData {
    form: HTMLFormElement;
    constructor(form: HTMLFormElement);
    private resolveElementScope;
    getScopedData(): object;
}
