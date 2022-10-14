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

var style: string;

@CustomElement({
    name: "e-separator"
})
class HTMLESeparatorElementBase extends HTMLElement implements HTMLESeparatorElement {
    #internals: ElementInternals;

    static {
        style = /*css*/`
            :host {
                display: block;
                margin: 10px 0 10px 27px;
                border: none;
                border-top: 1px solid lightgrey;
            }
        `;
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        this.#internals = this.attachInternals();
        this.#internals.role = "separator";
    }
}

var HTMLESeparatorElement: HTMLESeparatorElementConstructor = HTMLESeparatorElementBase;