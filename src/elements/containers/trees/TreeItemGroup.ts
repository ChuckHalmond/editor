import { CustomElement } from "../../Element";

export { HTMLETreeItemGroupElement };

interface HTMLETreeItemGroupElementConstructor {
    prototype: HTMLETreeItemGroupElement;
    new(): HTMLETreeItemGroupElement;
}

interface HTMLETreeItemGroupElement extends HTMLElement {}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeitemgroup": HTMLETreeItemGroupElement,
    }
}

@CustomElement({
    name: "e-treeitemgroup"
})
class HTMLETreeItemGroupElementBase extends HTMLElement implements HTMLETreeItemGroupElement {

    constructor() {
        super();
    }
}

var HTMLETreeItemGroupElement: HTMLETreeItemGroupElementConstructor = HTMLETreeItemGroupElementBase;