import { HTMLEListItemElement } from "./ListItem";
import "./ListItem";
import "./ListItemGroup";
export { HTMLEListElement };
interface HTMLEListElementConstructor {
    prototype: HTMLEListElement;
    new (): HTMLEListElement;
}
interface HTMLEListElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly activeItem: HTMLEListItemElement | null;
    readonly dropTargetItem: HTMLEListItemElement | null;
    name: string;
    droptarget: boolean;
    items(): HTMLEListItemElement[];
    beginSelection(): void;
    endSelection(): void;
    selectedItems(): HTMLEListItemElement[];
}
declare global {
    interface HTMLElementTagNameMap {
        "e-list": HTMLEListElement;
    }
}
declare var HTMLEListElement: HTMLEListElementConstructor;
