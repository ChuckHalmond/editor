import { CustomElement, AttributeProperty, element } from "../Element";

export { HTMLELoaderElement };

interface HTMLELoaderElementConstructor {
    readonly prototype: HTMLELoaderElement;
    new(): HTMLELoaderElement;
}

interface HTMLELoaderElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    type: "bar" | "circle";
    promise: Promise<any> | null;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-loader": HTMLELoaderElement,
    }
}

var barShadowTemplate: HTMLTemplateElement;
var circleShadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-loader"
})
class HTMLELoaderElementBase extends HTMLElement implements HTMLELoaderElement {

    readonly shadowRoot!: ShadowRoot;
    
    @AttributeProperty({type: String, defaultValue: "bar", observed: true})
    type!: "bar" | "circle";
    
    #promise: Promise<any> | null;

    static {
        const commonStyle = element("style", {
            properties: {
                innerText: /*css*/`
                    :host {
                        display: inline-block;
                        --default-loader-color: rgb(0, 128, 255);
                        --default-animation-duration: 2s;
                    }
                `
            }
        });
        const barStyle = commonStyle.cloneNode(true);
        const circleStyle = commonStyle.cloneNode(true);
        barStyle.textContent += /*css*/`
            :host {
                display: block;
            }

            [part="bar"] {
                position: relative;
                display: block;
                overflow: hidden;
                height: 6px;
                width: 100%;
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
                animation-duration: var(--animation-duration, var(--default-animation-duration));
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }

            [part="cursor"] {
                display: block;
                width: 128px;
                background-color: var(--loader-color, var(--default-loader-color));
                animation-name: cursor;
            }

            [part="bar"]:after {
                animation-name: shine;
                animation-duration: var(--animation-duration, var(--default-animation-duration));
                animation-iteration-count: infinite;
                animation-fill-mode: forwards;  
                content: "";
                position: absolute;
                left: -100%;
                width: 100%;
                height: 100%;
                top: 0;
                opacity: 0;
                
                background: rgba(255, 255, 255, 0.13);
                background: linear-gradient(
                    to right, 
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.1) 10%,
                    rgba(255, 255, 255, 0.9) 80%,
                    rgba(255, 255, 255, 0) 100%
                );
            }

            @keyframes shine {
                25% {
                    opacity: 1;
                    left: -100%;
                }
                100% {
                    opacity: 0;
                    left: 100%;
                }
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
        `;
        circleStyle.textContent += /*css*/`
            :host {
                display: inline-block;
            }

            [part="circle"] {
                width: 12px;
                height: 12px;
                border-top: 4px solid var(--loader-color, var(--default-loader-color));
                border-right: 4px solid var(--loader-color, var(--default-loader-color));
                border-left: 4px solid transparent;
                border-bottom: 4px solid transparent;
                border-radius: 50%;
                animation-duration: 1s;
                animation-name: circle;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }

            @keyframes circle {
                0% {
                    transform: rotate(0);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `;
        barShadowTemplate = element("template");
        barShadowTemplate.content.append(
            barStyle,
            element("div", {
                part: ["bar"],
                children: [
                    element("div", {
                        part: ["slider"],
                        children: [
                            element("div", {
                                part: ["cursor"]
                            })
                        ]
                    })
                ]
            })
        );
        circleShadowTemplate = element("template");
        circleShadowTemplate.content.append(
            circleStyle,
            element("div", {
                part: ["circle"]
            })
        )
    }

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.#updateTemplate();
        this.#promise = null;
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "type": {
                this.#updateTemplate();
                break;
            }
        }
    }

    set promise(promise: Promise<any> | null) {
        if (promise) {
            promise.finally(() => {
                this.remove();
            });
        }
        this.#promise = promise;
    }

    get promise(): Promise<any> | null {
        return this.#promise;
    }

    #updateTemplate(): void {
        const {type, shadowRoot} = this;
        switch (type) {
            case "circle": {
                shadowRoot.replaceChildren(
                    circleShadowTemplate.content.cloneNode(true)
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