import { DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { AttributeProperty, CustomElement } from "../../Element";


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

var style: string;

@CustomElement({
    name: "e-hsash"
})
class HTMLEHeightSashElementBase extends HTMLElement implements HTMLEHeightSashElement {

    declare readonly shadowRoot: ShadowRoot;

    get target(): HTMLElement | null {
        return this.#target;
    }

    static {
        style = /*css*/`
            :host {
                display: block;
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
                transition-property: opacity;
                transition-delay: 0.2s;
                transition-duration: 0.2s;
                transition-timing-function: ease-out;
                
                height: 2px;
                cursor: ns-resize;
            }
        `;
    }

    @AttributeProperty({type: String})
    declare controls: string;

    @AttributeProperty({type: String, defaultValue: "top"})
    declare growdir: "top" | "bottom";

    #target: HTMLElement | null;
    #onCapture: boolean;
    #queuedPointerCallback: FrameRequestCallback | null;
    #pointerMovement: number;

    constructor() {
        super();
        this.#target = null;
        this.#queuedPointerCallback = null;
        this.#pointerMovement = 0;
        this.#onCapture = false;
        const shadowRoot = this.attachShadow({mode: "open"});
        const adoptedStylesheet = new CSSStyleSheet();
        adoptedStylesheet.replace(style);
        shadowRoot.adoptedStyleSheets = [adoptedStylesheet];
        this.addEventListener("pointerdown", this.#handlePointerDownEvent.bind(this));
        this.addEventListener("pointermove", this.#handlePointerMoveEvent.bind(this));
        this.addEventListener("pointerup", this.#handlePointerUpEvent.bind(this));
    }

    #pointerMoveCallback(): void {
        const target = this.#target;
        if (target !== null) {
            const targetComputedStyle = window.getComputedStyle(target);
            const {style} = target;
            const {growdir} = this;
            const movementY = this.#pointerMovement;
            const height = parseFloat(targetComputedStyle.getPropertyValue("height"));
            const newHeight = Math.trunc(height + (growdir == "top" ? -1 : 1) * movementY);
            style.setProperty("height", `${newHeight}px`);
            const computedNewHeight = parseFloat(targetComputedStyle.getPropertyValue("height"));
            style.setProperty("height", `${computedNewHeight}px`);
            this.dispatchEvent(new Event("resize"));
        }
        this.#queuedPointerCallback = null;
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

    #handlePointerUpEvent(event: PointerEvent): void {
        const {pointerId} = event;
        this.releasePointerCapture(pointerId);
        this.#onCapture = false;
    }
}

var HTMLEHeightSashElement: HTMLEHeightSashElementConstructor = HTMLEHeightSashElementBase;