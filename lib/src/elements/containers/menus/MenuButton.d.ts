import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuButtonElement };
interface HTMLEMenuButtonElementConstructor {
    readonly prototype: HTMLEMenuButtonElement;
    new (): HTMLEMenuButtonElement;
    readonly observedAttributes: string[];
}
interface HTMLEMenuButtonElement extends HTMLElement {
    name: string;
    label: string;
    disabled: boolean;
    active: boolean;
    childMenu: HTMLEMenuElement | null;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
declare var HTMLEMenuButtonElement: HTMLEMenuButtonElementConstructor;
