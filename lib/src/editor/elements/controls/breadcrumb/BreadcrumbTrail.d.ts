import { HTMLEBreadcrumbItemElement } from "./BreadcrumbItem";
export { HTMLEBreadcrumbTrailElement };
export { HTMLEBreadcrumbTrailElementBase };
interface HTMLEBreadcrumbTrailElement extends HTMLElement {
    items: HTMLEBreadcrumbItemElement[];
    activateItem(item: HTMLEBreadcrumbItemElement): void;
}
declare class HTMLEBreadcrumbTrailElementBase extends HTMLElement implements HTMLEBreadcrumbTrailElement {
    items: HTMLEBreadcrumbItemElement[];
    constructor();
    activateItem(item: HTMLEBreadcrumbItemElement): void;
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-breadcrumbtrail": HTMLEBreadcrumbTrailElement;
    }
}
