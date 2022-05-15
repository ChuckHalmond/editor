import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuButtonElement };
export { EMenuButton };
interface HTMLEMenuButtonElementConstructor {
    readonly prototype: HTMLEMenuButtonElement;
    new (): HTMLEMenuButtonElement;
}
interface HTMLEMenuButtonElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly menu: HTMLEMenuElement | null;
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
