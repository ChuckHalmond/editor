export { HTMLEImportElement };
interface HTMLEImportElementConstructor {
    readonly prototype: HTMLEImportElement;
    new (): HTMLEImportElement;
}
interface HTMLEImportElement extends HTMLElement {
    src: string;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-import": HTMLEImportElement;
    }
    interface HTMLElementEventMap {
        "load": Event;
    }
}
declare var HTMLEImportElement: HTMLEImportElementConstructor;
