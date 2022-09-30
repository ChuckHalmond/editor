export { HTMLESeparatorElement };
interface HTMLESeparatorElementConstructor {
    prototype: HTMLESeparatorElement;
    new (): HTMLESeparatorElement;
}
interface HTMLESeparatorElement extends HTMLElement {
}
declare global {
    interface HTMLElementTagNameMap {
        "e-separator": HTMLESeparatorElement;
    }
}
declare var HTMLESeparatorElement: HTMLESeparatorElementConstructor;
