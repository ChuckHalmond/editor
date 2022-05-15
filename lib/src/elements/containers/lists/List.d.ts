import { HTMLEListItemElement } from "./ListItem";
export { HTMLEListElement };
interface HTMLEListElementConstructor {
    readonly prototype: HTMLEListElement;
    new (): HTMLEListElement;
}
interface HTMLEListElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly items: HTMLCollectionOf<HTMLEListItemElement>;
    readonly activeItem: HTMLEListItemElement | null;
    readonly activeIndex: number;
    name: string;
    droptarget: boolean;
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
