import { DEFAULT_THEME_SELECTED_ITEM_COLOR } from "../../../stylesheets/Theme";
import { CustomElement, AttributeProperty, element } from "../../Element";

export { HTMLEWidthSashElement };

interface HTMLEWidthSashElementConstructor {
    prototype: HTMLEWidthSashElement;
    new(): HTMLEWidthSashElement;
}

interface HTMLEWidthSashElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly target: HTMLElement | null;
    controls: string;
    growdir: "right" | "left";
    max: boolean;
    setWidth(width: number): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-wsash": HTMLEWidthSashElement;
    }
    interface HTMLElementEventMap {
        "resize": Event;
    }
}

var style: string;

@CustomElement({
    name: "e-wsash"
})
class HTMLEWidthSashElementBase extends HTMLElement implements HTMLEWidthSashElement {

    declare readonly shadowRoot: ShadowRoot;

    get target(): HTMLElement | null {
        return this.#target;
    }

    @AttributeProperty({type: String, observed: true})
    declare controls: string;

    @AttributeProperty({type: String, defaultValue: "right"})
    declare growdir: "right" | "left";

    @AttributeProperty({type: Boolean})
    declare max: boolean;

    #target: HTMLElement | null;
    #onCapture: boolean;
    #queuedPointerCallback: FrameRequestCallback | null;
    #pointerMovement: number;

    static {
        style = /*css*/`
            :host {
                display: block;
                background-color: var(--theme-selected-item-color, ${DEFAULT_THEME_SELECTED_ITEM_COLOR});
                transition-property: opacity;
                transition-delay: 0.2s;
                transition-duration: 0.2s;
                transition-timing-function: ease-out;
                
                width: 2px;
                cursor: ew-resize;
            }
        `;
    }

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

    setWidth(width: number): void {
        const target = this.#target;
        if (target !== null) {
            const {max} = this;
            const {style} = target;
            style.setProperty("width", `${width}px`);
            if (max) {
                style.setProperty("max-width", `${width}px`);
            }
        }
    }

    #pointerMoveCallback(): void {
        const target = this.#target;
        if (target !== null) {
            const targetComputedStyle = window.getComputedStyle(target);
            const {growdir} = this;
            const movementX = this.#pointerMovement;
            const width = parseFloat(targetComputedStyle.getPropertyValue("width"));
            const newWidth = width + (growdir == "right" ? 1 : -1) * movementX;
            this.setWidth(newWidth);
            this.dispatchEvent(new Event("resize"));
        }
        this.#pointerMovement = 0;
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
                this.#queuedPointerCallback = this.#pointerMoveCallback.bind(this);
                requestAnimationFrame(this.#queuedPointerCallback);
            }
            this.#pointerMovement += event.movementX;
        }
    }

    #handlePointerUpEvent(event: PointerEvent): void {
        const {pointerId} = event;
        this.releasePointerCapture(pointerId);
        this.#onCapture = false;
    }
}

var HTMLEWidthSashElement: HTMLEWidthSashElementConstructor = HTMLEWidthSashElementBase;