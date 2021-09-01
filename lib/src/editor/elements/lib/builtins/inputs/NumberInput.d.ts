export { NumberInputElement };
declare class NumberInputElement extends HTMLInputElement {
    cache: string;
    constructor();
    isValueValid(value: string): boolean;
    parseValue(value: string): string;
    connectedCallback(): void;
}
