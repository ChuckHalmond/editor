import { CustomElement, AttributeProperty, element } from "../../Element";

export { HTMLEOptionElement };

interface HTMLEOptionElementConstructor {
    readonly prototype: HTMLEOptionElement;
    new(): HTMLEOptionElement;
}

interface HTMLEOptionElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    name: string;
    active: boolean;
    value: string;
    label: string;
    description: string;
    disabled: boolean;
    selected: boolean;
    default: boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-option": HTMLEOptionElement,
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-option"
})
class HTMLEOptionElementBase extends HTMLElement implements HTMLEOptionElement {

    readonly shadowRoot!: ShadowRoot;

    @AttributeProperty({type: String})
    name!: string;

    @AttributeProperty({type: String})
    value!: string;
    
    @AttributeProperty({type: String, observed: true})
    label!: string;
        
    @AttributeProperty({type: String})
    description!: string;

    @AttributeProperty({type: Boolean})
    disabled!: boolean;

    @AttributeProperty({type: Boolean})
    active!: boolean;

    @AttributeProperty({type: Boolean})
    selected!: boolean;

    @AttributeProperty({type: Boolean})
    default!: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: flex;
                            user-select: none;
                            white-space: nowrap;
                            padding: 2px 12px;
                        }
                        
                        :host([active]) {
                            color: black;
                            background-color: lightgray;
                        }
        
                        :host([disabled]) {
                            color: lightgray;
                        }

                        :host::before {
                            display: flex;
                            content: "";
                            width: 18px;
                            height: 18px;
                            margin-right: 6px;

                            mask-size: 18px 18px;
                            -webkit-mask-size: 18px 18px;
                            background-color: var(--icon-color, none);
                            -webkit-mask-image: var(--icon-image, none);
                            mask-image: var(--icon-image, none);
                        }

                        [part="label"] {
                            flex: auto;
                            text-align: left;
                        }

                        :host([default])::after {
                            display: inline-block;
                            content: "(default)";
                            margin-left: 24px;
                            text-align: right;
                        }

                        [part="content"] {
                            flex: auto;
                            display: flex;
                            overflow: hidden;
                            pointer-events: none;
                        }
                    `
                ]
            }),
            element("span", {
                attributes: {
                    part: "content"
                },
                children: [
                    element("span", {
                        attributes: {
                            part: "label"
                        }
                    })
                ]
            })
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
            case "label": {
                const {shadowRoot} = this;
                const labelPart = shadowRoot.querySelector<HTMLElement>("[part=label]");
                if (labelPart) {
                    labelPart.textContent = newValue;
                }
                break;
            }
        }
    }
}

var HTMLEOptionElement: HTMLEOptionElementConstructor = HTMLEOptionElementBase;