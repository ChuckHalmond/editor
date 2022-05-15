import { HTMLEActionElement } from "../../containers/actions/Action";
import { HTMLEOptionElement } from "./Option";
import { HTMLEOptionCollection } from "./OptionCollection";
export { HTMLESelectElement };
interface HTMLESelectElement extends HTMLEActionElement {
    readonly shadowRoot: ShadowRoot;
    readonly options: HTMLEOptionCollection;
    readonly activeIndex: number;
    readonly activeOption: HTMLEOptionElement | null;
    readonly selectedIndex: number;
    readonly selectedOption: HTMLEOptionElement | null;
    name: string;
    label: string;
    value: string;
    expanded: boolean;
    expand(): void;
    collapse(): void;
    toggle(force?: boolean): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
interface HTMLESelectElementConstructor {
    readonly prototype: HTMLESelectElement;
    new (): HTMLESelectElement;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-select": HTMLESelectElement;
    }
}
declare var HTMLESelectElement: HTMLESelectElementConstructor;
