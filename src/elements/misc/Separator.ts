import { CustomElement } from "../Element";

export { HTMLESeparatorElement };

interface HTMLESeparatorElementConstructor {
    prototype: HTMLESeparatorElement;
    new(): HTMLESeparatorElement;
}

interface HTMLESeparatorElement extends HTMLElement {}

declare global {
    interface HTMLElementTagNameMap {
        "e-separator": HTMLESeparatorElement,
    }
}

@CustomElement({
    name: "e-separator"
})
class HTMLESeparatorElementBase extends HTMLElement implements HTMLESeparatorElement {
    #internals: ElementInternals;

    constructor() {
        super();
        this.#internals = this.attachInternals();
        this.#internals.role = "separator";
    }
}

var HTMLESeparatorElement: HTMLESeparatorElementConstructor = HTMLESeparatorElementBase;