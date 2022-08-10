import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuItemGroupElement };
export { EMenuItemGroup };
interface HTMLEMenuItemGroupElementConstructor {
    prototype: HTMLEMenuItemGroupElement;
    new (): HTMLEMenuItemGroupElement;
}
interface HTMLEMenuItemGroupElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    label: string;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-menuitemgroup": HTMLEMenuItemGroupElement;
    }
}
declare var HTMLEMenuItemGroupElement: HTMLEMenuItemGroupElementConstructor;
interface EMenuItemGroupConstructor {
    prototype: HTMLEMenuItemGroupElement;
    new (init: {
        name?: string;
        items: HTMLEMenuItemElement[];
    }): HTMLEMenuItemGroupElement;
    radios(init: {
        name: string;
        items: {
            label: string;
            value: string;
        }[];
    }): HTMLEMenuItemGroupElement;
}
declare var EMenuItemGroup: EMenuItemGroupConstructor;
