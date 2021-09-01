import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuButtonElement };
export { HTMLEMenuButtonElementBase };
interface HTMLEMenuButtonElement extends HTMLElement {
    name: string;
    label: string;
    disabled: boolean;
    icon: string;
    active: boolean;
    childMenu: HTMLEMenuElement | null;
    trigger(): void;
}
declare class HTMLEMenuButtonElementBase extends HTMLElement implements HTMLEMenuButtonElement {
    name: string;
    label: string;
    disabled: boolean;
    icon: string;
    active: boolean;
    childMenu: HTMLEMenuElement | null;
    constructor();
    trigger(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    connectedCallback(): void;
}
