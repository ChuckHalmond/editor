export interface HTMLView extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    render(): HTMLElement;
    refresh(): void;
}
export interface ViewConstructor {
    readonly prototype: HTMLView;
    readonly styles: string | undefined;
}
export declare abstract class HTMLViewBase extends HTMLElement implements HTMLView {
    readonly shadowRoot: ShadowRoot;
    constructor();
    static styles: string | undefined;
    abstract render(): HTMLElement;
    refresh(): void;
}
