import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuButtonElement };
export { EMenuButton };
interface HTMLEMenuButtonElementConstructor {
    prototype: HTMLEMenuButtonElement;
    new (): HTMLEMenuButtonElement;
}
interface HTMLEMenuButtonElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
    readonly firstItem: HTMLEMenuItemElement | null;
    name: string;
    disabled: boolean;
    expanded: boolean;
    connectedCallback(): void;
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}
declare var HTMLEMenuButtonElement: HTMLEMenuButtonElementConstructor;
interface EMenuButtonConstructor {
    prototype: HTMLEMenuButtonElement;
    new (init: {
        menu: HTMLEMenuElement;
    }): HTMLEMenuButtonElement;
}
declare var EMenuButton: EMenuButtonConstructor;
