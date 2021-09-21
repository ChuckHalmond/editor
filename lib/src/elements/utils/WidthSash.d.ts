export { HTMLEWidthSashElement };
export { HTMLEWidthSashElementBase };
interface HTMLEWidthSashElement extends HTMLElement {
    controls: string;
}
declare class HTMLEWidthSashElementBase extends HTMLElement implements HTMLEWidthSashElement {
    controls: string;
    private _target;
    private _targetStyle;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-wsash": HTMLEWidthSashElement;
    }
}
declare global {
    interface HTMLElementEventMap {
        "e_resize": CustomEvent;
    }
}
