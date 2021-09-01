export { PanelElement };
declare class PanelElement extends HTMLElement {
    label: string;
    state: 'opened' | 'closed';
    constructor();
    render(): Promise<void>;
    connectedCallback(): void;
}
