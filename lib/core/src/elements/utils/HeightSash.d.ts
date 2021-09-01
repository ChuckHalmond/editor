export { HTMLEHeightSashElement };
export { HTMLEHeightSashElementBase };
interface HTMLEHeightSashElement extends HTMLElement {
    controls: string;
}
declare class HTMLEHeightSashElementBase extends HTMLElement implements HTMLEHeightSashElement {
    controls: string;
    private _target;
    private _targetStyle;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-hsash": HTMLEHeightSashElement;
    }
}
declare global {
    interface HTMLElementEventMap {
        "resize": CustomEvent;
    }
}
