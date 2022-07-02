import { HTMLEMenuElement } from "./Menu";
import { HTMLEMenuItemElement } from "./MenuItem";
export { HTMLEMenuButtonElement };
export { EMenuButton };
interface HTMLEMenuButtonElementConstructor {
    readonly prototype: HTMLEMenuButtonElement;
    new (): HTMLEMenuButtonElement;
}
interface HTMLEMenuButtonElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
    readonly firstItem: HTMLEMenuItemElement | null;
    name: string;
    disabled: boolean;
    expanded: boolean;
    toggle(force?: boolean): void;
    expand(): void;
    collapse(): void;
}
declare var HTMLEMenuButtonElement: HTMLEMenuButtonElementConstructor;
interface EMenuButtonConstructor {
    readonly prototype: HTMLEMenuButtonElement;
    new (init: {
        menu: HTMLEMenuElement;
    }): HTMLEMenuButtonElement;
}
declare var EMenuButton: EMenuButtonConstructor;
