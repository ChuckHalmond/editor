export { HTMLEWidthSashElement };
export { HTMLEWidthSashElementBase };
declare type EWidthSashDirection = "left" | "right";
interface HTMLEWidthSashElement extends HTMLElement {
    controls: string;
    growdir: EWidthSashDirection;
}
declare class HTMLEWidthSashElementBase extends HTMLElement implements HTMLEWidthSashElement {
    controls: string;
    growdir: EWidthSashDirection;
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
