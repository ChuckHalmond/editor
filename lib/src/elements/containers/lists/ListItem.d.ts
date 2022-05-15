import { HTMLEMenuElement } from "../menus/Menu";
import { HTMLEToolBarElement } from "../toolbars/ToolBar";
export { HTMLEListItemElement };
interface HTMLEListItemElementConstructor {
    readonly prototype: HTMLEListItemElement;
    new (): HTMLEListItemElement;
}
interface HTMLEListItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly badge: HTMLSpanElement | null;
    readonly toolbar: HTMLEToolBarElement | null;
    readonly menu: HTMLEMenuElement | null;
    name: string;
    posinset: number;
    label: string;
    droptarget: boolean;
    selected: boolean;
    active: boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-listitem": HTMLEListItemElement;
    }
}
declare var HTMLEListItemElement: HTMLEListItemElementConstructor;
