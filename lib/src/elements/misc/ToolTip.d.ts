export { HTMLEToolTipElement };
interface HTMLEToolTipElementConstructor {
    prototype: HTMLEToolTipElement;
    new (): HTMLEToolTipElement;
}
interface HTMLEToolTipElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly target: HTMLElement | null;
    htmlFor: string;
    position: "top" | "bottom" | "right" | "left";
    visible: boolean;
    show(): void;
    hide(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-tooltip": HTMLEToolTipElement;
    }
}
declare var HTMLEToolTipElement: HTMLEToolTipElementConstructor;
