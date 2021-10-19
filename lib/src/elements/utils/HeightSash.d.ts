export { HTMLEHeightSashElement };
declare type EHeightSashDirection = "top" | "bottom";
interface HTMLEHeightSashElementConstructor {
    readonly prototype: HTMLEHeightSashElement;
    new (): HTMLEHeightSashElement;
    readonly observedAttributes: string[];
}
interface HTMLEHeightSashElement extends HTMLElement {
    controls: string;
    growdir: EHeightSashDirection;
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-hsash": HTMLEHeightSashElement;
    }
    interface HTMLElementEventMap {
        "e_resize": Event;
    }
}
declare var HTMLEHeightSashElement: HTMLEHeightSashElementConstructor;
