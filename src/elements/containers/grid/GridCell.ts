import { CustomElement, element, AttributeProperty } from "../../Element";

export { HTMLEGridCellElement };

interface HTMLEGridCellElementConstructor {
    readonly prototype: HTMLEGridCellElement;
    new(): HTMLEGridCellElement;
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
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void
}

declare global {
    interface HTMLElementTagNameMap {
        "e-gridcell": HTMLEGridCellElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-gridcell"
})
class HTMLEGridCellElementBase extends HTMLElement implements HTMLEGridCellElement {

    readonly shadowRoot!: ShadowRoot;
    
    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String})
    headers!: string;

    @AttributeProperty({type: String})
    type!: "rowheader" | "columnheader" | "gridcell";

    @AttributeProperty({type: Number})
    posinset!: number;

    @AttributeProperty({type: Boolean})
    droptarget!: boolean;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    selected!: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("slot")
        );
    }
    
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "selected": {
                this.dispatchEvent(new Event("select", {bubbles: true}));
                break;
            }
        }
    }
}

var HTMLEGridCellElement: HTMLEGridCellElementConstructor = HTMLEGridCellElementBase;