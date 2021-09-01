export { PanelGroupElement };
declare class PanelGroupElement extends HTMLElement {
    label: string;
    state: 'opened' | 'closed';
    static readonly observedAttributes: string[];
    constructor();
    connectedCallback(): void;
}
