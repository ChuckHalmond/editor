export { PaletteElement };
declare class PaletteElement extends HTMLElement {
    colors: Array<string>;
    constructor();
    connectedCallback(): void;
}
