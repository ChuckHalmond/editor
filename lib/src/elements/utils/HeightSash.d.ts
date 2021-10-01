export { HTMLEHeightSashElement };
export { HTMLEHeightSashElementBase };
declare type EHeightSashDirection = "top" | "bottom";
interface HTMLEHeightSashElement extends HTMLElement {
    controls: string;
    growdir: EHeightSashDirection;
}
declare class HTMLEHeightSashElementBase extends HTMLElement implements HTMLEHeightSashElement {
    controls: string;
    growdir: EHeightSashDirection;
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
        "e_resize": CustomEvent;
    }
}
