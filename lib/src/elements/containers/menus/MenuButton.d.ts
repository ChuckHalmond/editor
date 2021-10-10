import { HTMLEMenuElement } from "./Menu";
export { HTMLEMenuButtonElement };
interface HTMLEMenuButtonElementConstructor {
    readonly prototype: HTMLEMenuButtonElement;
    new (): HTMLEMenuButtonElement;
}
interface HTMLEMenuButtonElement extends HTMLElement {
    name: string;
    label: string;
    disabled: boolean;
    active: boolean;
    childMenu: HTMLEMenuElement | null;
    trigger(): void;
}
declare var HTMLEMenuButtonElement: HTMLEMenuButtonElementConstructor;
