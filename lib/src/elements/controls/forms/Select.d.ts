import { HTMLEOptionElement } from "./Option";
export { HTMLESelectElement };
interface HTMLESelectElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    get options(): HTMLEOptionElement[];
    get activeOption(): HTMLEOptionElement | null;
    get selectedOption(): HTMLEOptionElement | null;
    name: string;
    label: string;
    value: string;
    expanded: boolean;
    expand(): void;
    collapse(): void;
    toggle(force?: boolean): void;
}
interface HTMLESelectElementConstructor {
    prototype: HTMLESelectElement;
    new (): HTMLESelectElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-select": HTMLESelectElement;
    }
}
declare var HTMLESelectElement: HTMLESelectElementConstructor;
