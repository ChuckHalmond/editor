export { HTMLEOptionElement };
interface HTMLEOptionElementConstructor {
    prototype: HTMLEOptionElement;
    new (): HTMLEOptionElement;
}
interface HTMLEOptionElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    active: boolean;
    value: string;
    label: string;
    disabled: boolean;
    selected: boolean;
    default: boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-option": HTMLEOptionElement;
    }
}
declare var HTMLEOptionElement: HTMLEOptionElementConstructor;
