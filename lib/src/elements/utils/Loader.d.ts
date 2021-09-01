export { HTMLELoaderElement };
export { HTMLELoaderElementBase };
declare type LoaderType = "bar" | "circle";
interface HTMLELoaderElement extends HTMLElement {
    type: LoaderType;
    promise: Promise<any> | null;
}
declare class HTMLELoaderElementBase extends HTMLElement implements HTMLELoaderElement {
    type: LoaderType;
    private _promise;
    constructor();
    set promise(promise: Promise<any> | null);
    get promise(): Promise<any> | null;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-loader": HTMLELoaderElement;
    }
}
