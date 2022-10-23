export { HTMLEStatusItemElement };
export { EStatusItem };
interface HTMLEStatusItemElementConstructor {
    prototype: HTMLEStatusItemElement;
    new (): HTMLEStatusItemElement;
}
interface HTMLEStatusItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    active: boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-statusitem": HTMLEStatusItemElement;
    }
}
declare var HTMLEStatusItemElement: HTMLEStatusItemElementConstructor;
interface EStatusItemConstructor {
    prototype: HTMLEStatusItemElement;
    new (init: {
        name: string;
        label: string;
        onclick?: () => void;
    }): HTMLEStatusItemElement;
}
declare var EStatusItem: EStatusItemConstructor;
