import "./StatusItem";
export { HTMLEStatusItemGroupElement };
interface HTMLEStatusItemGroupElementConstructor {
    prototype: HTMLEStatusItemGroupElement;
    new (): HTMLEStatusItemGroupElement;
}
interface HTMLEStatusItemGroupElement extends HTMLElement {
    name: string;
}
declare global {
    interface HTMLElementTagNameMap {
        "e-statusitemgroup": HTMLEStatusItemGroupElement;
    }
}
declare var HTMLEStatusItemGroupElement: HTMLEStatusItemGroupElementConstructor;
