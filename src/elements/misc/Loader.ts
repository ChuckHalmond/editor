import { CustomElement, AttributeProperty, element, trimMultilineIndent } from "../Element";

export { HTMLELoaderElement };

interface HTMLELoaderElementConstructor {
    prototype: HTMLELoaderElement;
    new(): HTMLELoaderElement;
}

interface HTMLELoaderElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    type: "bar" | "spinner";
}

declare global {
    interface HTMLElementTagNameMap {
        "e-loader": HTMLELoaderElement,
    }
}

var barShadowTemplate: HTMLTemplateElement;
var spinnerShadowTemplate: HTMLTemplateElement;
var style: string;

@CustomElement({
    name: "e-loader"
})
class HTMLELoaderElementBase extends HTMLElement implements HTMLELoaderElement {

    readonly shadowRoot!: ShadowRoot;
    
    @AttributeProperty({type: String, defaultValue: "bar", observed: true})
    type!: "bar" | "spinner";

    static {
        barShadowTemplate = element("template");
        barShadowTemplate.content.append(
            element("div", {
                attributes: {
                    part: "bar"
                },
                children: [
                    element("div", {
                        attributes: {
                            part: "slider"
                        },
                        children: [
                            element("div", {
                                attributes: {
                                    part: "cursor"
                                }
                            })
                        ]
                    })
                ]
            })
        );
        spinnerShadowTemplate = element("template");
        spinnerShadowTemplate.content.append(
            element("div", {
                attributes: {
                    part: "spinner"
                }
            })
        );
        style = /*css*/`
            :host {
                display: inline-block;
            }

            :host(:is(:not([type]), [type="bar"])) {
                border: 1px solid gainsboro;
                border-radius: 4px;
            }
        
            [part="bar"] {
                position: relative;
                overflow: hidden;
                height: 6px;
                width: 100%;
                width: 86px;
                border-radius: 4px;
            }
        
            [part="slider"] {
                display: flex;
                position: absolute;
                width: 100%;
                height: 100%;
                animation-name: slider;
            }
        
            [part="slider"],
            [part="cursor"] {
                border-radius: 4px;
                will-change: transform;
                animation-duration: 1s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        
            [part="cursor"] {
                display: block;
                width: 32px;
                background-color: rgb(0, 128, 255);
                animation-name: cursor;
            }
        
            :host([type="spinner"]) {
                display: inline-block;
                width: 20px;
                height: 20px;
            }
        
            [part="spinner"] {
                display: inline-block;
                width: 18px;
                height: 18px;
            }
        
            [part="spinner"]::after {
                content: " ";
                display: block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border-width: 4px;
                border-style: solid;
                border-color: transparent rgb(0, 128, 255);
                animation: spin 1.2s linear infinite;
            }
        
            @keyframes slider {
                0% {
                    transform: translateX(0%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
        
            @keyframes cursor {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }
        
            @keyframes spin {
                0% {
                    transform: rotate(0);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `;
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        shadowRoot.replaceChildren(
            barShadowTemplate.content.cloneNode(true)
        );
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "type": {
                this.#updateTemplate();
                break;
            }
        }
    }

    #updateTemplate(): void {
        const {type, shadowRoot} = this;
        switch (type) {
            case "spinner": {
                shadowRoot.replaceChildren(
                    spinnerShadowTemplate.content.cloneNode(true)
                );
                break;
            }
            case "bar": {
                shadowRoot.replaceChildren(
                    barShadowTemplate.content.cloneNode(true)
                );
                break;
            }
        }
    }
}

var HTMLELoaderElement: HTMLELoaderElementConstructor = HTMLELoaderElementBase;