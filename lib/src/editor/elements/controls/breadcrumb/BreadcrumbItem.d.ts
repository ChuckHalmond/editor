export { HTMLEBreadcrumbItemElement };
export { HTMLEBreadcrumbItemElementBase };
interface HTMLEBreadcrumbItemElement extends HTMLElement {
    label: string;
    active: boolean;
}
declare class HTMLEBreadcrumbItemElementBase extends HTMLElement implements HTMLEBreadcrumbItemElement {
    label: string;
    active: boolean;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-breadcrumbitem": HTMLEBreadcrumbItemElement;
    }
}
