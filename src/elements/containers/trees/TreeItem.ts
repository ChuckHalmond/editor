import { CustomElement, element, AttributeProperty, QueryProperty } from "../../Element";
import { HTMLETreeItemGroupElement } from "./TreeItemGroup";

export { HTMLETreeItemElement };

import stylesheet from "../../../../css/elements/containers/trees/treeitem.css" assert { type: 'css' };
import { theme } from "../../../stylesheets/Theme";

interface HTMLETreeItemElementConstructor {
    prototype: HTMLETreeItemElement;
    new(): HTMLETreeItemElement;
}

interface HTMLETreeItemElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly group: HTMLETreeItemGroupElement | null;
    name: string;
    posinset: number;
    label: string;
    droptarget: boolean;
    expanded: boolean;
    selected: boolean;
    active: boolean;
    level: number;
    type: "leaf" | "parent";
    toggle(force?: boolean): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void
}

declare global {
    interface HTMLElementTagNameMap {
        "e-treeitem": HTMLETreeItemElement,
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-treeitem"
})
class HTMLETreeItemElementBase extends HTMLElement implements HTMLETreeItemElement {

    declare readonly shadowRoot: ShadowRoot;

    @AttributeProperty({type: String})
    declare name: string;

    @AttributeProperty({type: Number})
    declare posinset: number;

    @AttributeProperty({type: String, observed: true})
    declare label: string;

    @AttributeProperty({type: Boolean, observed: true})
    declare expanded: boolean;
    
    @AttributeProperty({type: Boolean})
    declare droptarget: boolean;

    @AttributeProperty({type: Boolean})
    declare active: boolean;

    @AttributeProperty({type: Boolean, observed: true})
    declare selected: boolean;

    @AttributeProperty({type: Number, observed: true})
    declare level: number;

    @AttributeProperty({type: String, defaultValue: "leaf"})
    declare type: "leaf" | "parent";

    @QueryProperty({selector: ":scope > e-treeitemgroup[slot=group]"})
    declare group: HTMLETreeItemGroupElement | null;
    
    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("div", {
                attributes: {
                    part: "content"
                },
                children: [
                    element("span", {
                        attributes: {
                            part: "arrow"
                        }
                    }),
                    element("slot")
                ]
            }),
            element("slot", {
                attributes: {
                    name: "group"
                }
            })
        );
    }
    
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [theme.stylesheet, ...Array.from(<IterableIterator<any>>stylesheet).map(
            (item) => {
                const [count, source] = item;
                const stylesheet = new CSSStyleSheet();
                stylesheet.replace(source);
                return stylesheet;
            }
        )];
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
    }
    
    connectedCallback(): void {
        const {tabIndex} = this;
        this.tabIndex = tabIndex;
    }
    
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "expanded": {
                this.dispatchEvent(new Event("toggle", {bubbles: true}));
                break;
            }
            case "selected": {
                this.dispatchEvent(new Event("select", {bubbles: true}));
                break;
            }
            case "label": {
                const labelPart = this.shadowRoot.querySelector("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
            case "level": {
                (<CSSStyleRule>this.shadowRoot.adoptedStyleSheets[2].cssRules[5]).styleMap.set("padding-left", `${12 * Number(newValue)}px`);
                break;
            }
        }
    }

    toggle(force?: boolean): void {
        const {expanded} = this;
        this.expanded = force ?? !expanded;
    }
}

var HTMLETreeItemElement: HTMLETreeItemElementConstructor = HTMLETreeItemElementBase;