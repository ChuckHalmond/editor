export { HTMLEStatusItemElement };
export { HTMLEStatusItemElementBase };
interface HTMLEStatusItemElement extends HTMLElement {
}
declare type EStatusElementType = "button" | "widget";
declare class HTMLEStatusItemElementBase extends HTMLElement implements HTMLEStatusItemElement {
    name: string;
    type: EStatusElementType;
    icon: string;
    command: string | null;
    private _stateMap;
    get stateMap(): ((state: any) => {
        content: string;
    }) | null;
    set stateMap(stateMap: ((state: any) => {
        content: string;
    }) | null);
    update(newValue: any): void;
    constructor();
    activate(): void;
    connectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-statusitem": HTMLEStatusItemElement;
    }
}
