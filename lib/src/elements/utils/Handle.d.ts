export { HTMLEHandleElement };
interface HTMLEHandleElementConstructor {
    readonly prototype: HTMLEHandleElement;
    new (): HTMLEHandleElement;
}
interface HTMLEHandleElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    controls: string;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-handle": HTMLEHandleElement;
    }
    interface HTMLElementEventMap {
        "move": Event;
    }
}
declare var HTMLEHandleElement: HTMLEHandleElementConstructor;
