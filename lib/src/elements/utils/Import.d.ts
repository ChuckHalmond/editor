export { HTMLEImportElement };
export { HTMLEImportElementBase };
interface HTMLEImportElement extends HTMLElement {
    src: string;
}
declare class HTMLEImportElementBase extends HTMLElement {
    src: string;
    constructor();
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-import": HTMLEImportElement;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_load": CustomEvent;
    }
}
