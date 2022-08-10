export { HTMLEGridCellElement };
interface HTMLEGridCellElementConstructor {
    prototype: HTMLEGridCellElement;
    new (): HTMLEGridCellElement;
}
interface HTMLEGridCellElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    type: "rowheader" | "columnheader" | "gridcell";
    headers: string;
    posinset: number;
    droptarget: boolean;
    selected: boolean;
    active: boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-gridcell": HTMLEGridCellElement;
    }
}
declare var HTMLEGridCellElement: HTMLEGridCellElementConstructor;
