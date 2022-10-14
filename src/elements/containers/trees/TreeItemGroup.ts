import { CustomElement, element } from "../../Element";

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

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-treeitemgroup"
})
class HTMLETreeItemGroupElementBase extends HTMLElement implements HTMLETreeItemGroupElement {

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
        style = /*css*/`
            :host {
                display: block;
            }
        `;
    }
    
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
    }
}

var HTMLETreeItemGroupElement: HTMLETreeItemGroupElementConstructor = HTMLETreeItemGroupElementBase;