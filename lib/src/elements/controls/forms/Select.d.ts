import { HTMLEActionElement } from "../../containers/actions/Action";
import { HTMLEOptionElement } from "./Option";
import { HTMLEOptionCollection } from "./OptionCollection";
export { HTMLESelectElement };
interface HTMLESelectElement extends HTMLEActionElement {
    readonly shadowRoot: ShadowRoot;
    readonly options: HTMLEOptionCollection;
    readonly activeOption: HTMLEOptionElement | null;
    readonly selectedOption: HTMLEOptionElement | null;
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
