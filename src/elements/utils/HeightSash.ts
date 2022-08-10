import { CustomElement, AttributeProperty, element } from "../Element";

export { HTMLEHeightSashElement };

interface HTMLEHeightSashElementConstructor {
    prototype: HTMLEHeightSashElement;
    new(): HTMLEHeightSashElement;
}

interface HTMLEHeightSashElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly target: HTMLElement | null;
    controls: string;
    growdir: "top" | "bottom";
}

declare global {
    interface HTMLElementTagNameMap {
        "e-hsash": HTMLEHeightSashElement;
    }
    interface HTMLElementEventMap {
        "resize": Event;
    }
}

var shadowTemplate: HTMLTemplateElement;

@CustomElement({
    name: "e-hsash"
})
class HTMLEHeightSashElementBase extends HTMLElement implements HTMLEHeightSashElement {

    readonly shadowRoot!: ShadowRoot;

    get target(): HTMLElement | null {
        return this.#target;
    }

    @AttributeProperty({type: String})
    controls!: string;

    @AttributeProperty({type: String, defaultValue: "top"})
    growdir!: "top" | "bottom";

    #target: HTMLElement | null;
    #onCapture: boolean;
    #queuedPointerCallback: FrameRequestCallback | null;
    #pointerMovement: number;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("style", {
                children: [
                    /*css*/`
                        :host {
                            display: inline-block;
                            width: 100%;
        
                            max-height: 4px;
                            height: 4px;
                            min-height: 4px;
        
                            margin-top: -2px;
                            margin-bottom: -2px;
                            
                            background-color: rgb(135, 206, 250);
                            cursor: ns-resize;
        
                            transition-property: opacity;
                            transition-delay: 0.2s;
                            transition-duration: 0.2s;
                            transition-timing-function: ease-out;
                            opacity: 0;
                        }
        
                        :host(:active),
                        :host(:hover) {
                            opacity: 1;
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
        this.#queuedPointerCallback = null;
        this.#pointerMovement = 0;
        this.#onCapture = false;
        this.addEventListener("pointerdown", this.#handlePointerDownEvent.bind(this));
        this.addEventListener("pointermove", this.#handlePointerMoveEvent.bind(this));
        this.addEventListener("pointerup", this.#handlePointerUpEvent.bind(this));
    }

    #handlePointerUpEvent(event: PointerEvent): void {
        const {pointerId} = event;
        this.releasePointerCapture(pointerId);
        this.#onCapture = false;
    }

    #handlePointerDownEvent(event: PointerEvent): void {
        const {pointerId} = event;
        const {controls} = this;
        const rootNode = <ShadowRoot | Document>this.getRootNode();
        this.#target = rootNode.getElementById(controls);
        this.setPointerCapture(pointerId);
        this.#onCapture = true;
    }

    #handlePointerMoveEvent(event: PointerEvent): void {
        if (this.#onCapture) {
            if (this.#queuedPointerCallback == null) {
                this.#pointerMovement = event.movementY;
                this.#queuedPointerCallback = this.#pointerMoveCallback.bind(this);
                requestAnimationFrame(this.#queuedPointerCallback);
            }
            else {
                this.#pointerMovement += event.movementY;
            }
        }
    }

    #pointerMoveCallback(): void {
        const target = this.#target;
        if (target !== null) {
            const targetComputedStyle = window.getComputedStyle(target);
            const {growdir} = this;
            const movementY = this.#pointerMovement;
            const height = parseFloat(targetComputedStyle.getPropertyValue("height"));
            const newHeight = Math.trunc(height + (growdir == "top" ? -1 : 1) * movementY);
            target.style.setProperty("height", `${newHeight}px`);
            const computedNewHeight = parseFloat(targetComputedStyle.getPropertyValue("height"));
            target.style.setProperty("height", `${computedNewHeight}px`);
            this.dispatchEvent(new Event("resize"));
        }
        this.#queuedPointerCallback = null;
    }
}

var HTMLEHeightSashElement: HTMLEHeightSashElementConstructor = HTMLEHeightSashElementBase;