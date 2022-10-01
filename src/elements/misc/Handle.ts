import { CustomElement, AttributeProperty, element } from "../Element";

export { HTMLEHandleElement };

interface HTMLEHandleElementConstructor {
    prototype: HTMLEHandleElement;
    new(): HTMLEHandleElement;
}

interface HTMLEHandleElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    controls: string;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-handle": HTMLEHandleElement;
    }
    interface HTMLElementEventMap {
        "move": Event;
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-handle"
})
class HTMLEHandleElementBase extends HTMLElement implements HTMLEHandleElement {

    readonly shadowRoot!: ShadowRoot;

    @AttributeProperty({type: String, observed: true})
    controls!: string;

    #target: HTMLElement | null;
    #onCapture: boolean;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: block;
                            
                            width: 24px;
                            height: 12px;
                            
                            background-color: rgb(0, 128, 255);

                            -webkit-mask-image: url("/assets/dots.png");
                            mask-image: url("/assets/dots.png");

                            -webkit-mask-repeat: repeat;
                            mask-repeat: repeat;
                            cursor: move;
                        }
                    `
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
        this.#target = null;
        this.#onCapture = false;
        this.addEventListener("pointerdown", this.#handlePointerDownEvent.bind(this));
        this.addEventListener("pointermove", this.#handlePointerMoveEvent.bind(this));
        this.addEventListener("pointerup", this.#handlePointerUpEvent.bind(this));
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "controls": {
                const {controls} = this;
                this.#target = document.getElementById(controls);
                break;
            }
        }
    }

    #handlePointerUpEvent(event: PointerEvent): void {
        const {pointerId} = event;
        this.releasePointerCapture(pointerId);
        this.#onCapture = false;
    }

    #handlePointerDownEvent(event: PointerEvent): void {
        const {pointerId} = event;
        const {controls} = this;
        this.#target = document.getElementById(controls);
        this.setPointerCapture(pointerId);
        this.#onCapture = true;
    }

    #handlePointerMoveEvent(event: PointerEvent): void {
        if (this.#onCapture) {
            const target = this.#target;
            if (target !== null) {
                const targetComputedStyle = window.getComputedStyle(target);
                const {movementX, movementY} = event;
                const {width: rectWidth, height: rectHeight} = target.getBoundingClientRect();
                const outerElement = target.parentElement ?? document.body;
                const {
                    left: outerRectLeft, right: outerRectRight,
                    top: outerRectTop, bottom: outerRectBottom
                } = outerElement.getBoundingClientRect();
                const left = parseFloat(targetComputedStyle.getPropertyValue("left"));
                const newLeft = Math.max(outerRectLeft, Math.min(Math.trunc(left + movementX), outerRectRight - rectWidth));
                const top = parseFloat(targetComputedStyle.getPropertyValue("top"));
                const newTop = Math.max(outerRectTop, Math.min(Math.trunc(top + movementY), outerRectBottom - rectHeight));
                target.style.setProperty("left", `${newLeft}px`);
                target.style.setProperty("top", `${newTop}px`);
                this.dispatchEvent(new CustomEvent("move"));
            }
        }
    }
}

var HTMLEHandleElement: HTMLEHandleElementConstructor = HTMLEHandleElementBase;