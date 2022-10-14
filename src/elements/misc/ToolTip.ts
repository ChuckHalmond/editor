import { CustomElement, AttributeProperty, element } from "../Element";

export { HTMLEToolTipElement };

interface HTMLEToolTipElementConstructor {
    prototype: HTMLEToolTipElement;
    new(): HTMLEToolTipElement;
}

interface HTMLEToolTipElement extends HTMLElement {
    readonly shadowRoot: ShadowRoot;
    readonly target: HTMLElement | null;
    htmlFor: string;
    position: "top" | "bottom" | "right" | "left";
    visible: boolean;
    show(): void;
    hide(): void;
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tooltip": HTMLEToolTipElement;
    }
}

var shadowTemplate: HTMLTemplateElement;
var style: string;
var HIDE_DELAY_MS = 200;
var SHOW_DELAY_MS = 200;

@CustomElement({
    name: "e-tooltip"
})
class HTMLEToolTipElementBase extends HTMLElement implements HTMLEToolTipElement {

    readonly shadowRoot!: ShadowRoot;

    get target(): HTMLElement | null {
        return this.#target;
    }

    @AttributeProperty({type: String, observed: true, name: "for"})
    htmlFor!: string;

    @AttributeProperty({type: String, defaultValue: "top"})
    position!: "top" | "bottom" | "right" | "left";

    @AttributeProperty({type: Boolean})
    visible!: boolean;

    #target: HTMLElement | null;
    #targetListenerObject: EventListenerObject;
    #documentListenerObject: EventListenerObject;
    #toggleAnimation: Animation | null;

    static {
        shadowTemplate = element("template");
        shadowTemplate.content.append(
            element("div", {
                attributes: {
                    part: "container"
                },
                children: [
                    element("span", {
                        attributes: {
                            part: "arrow"
                        }
                    }),
                    element("slot")
                ]
            })
        );
        style = /*css*/`
            :host {
                display: inline-block;
                position: fixed;
                padding: 4px;
                border-radius: 4px;
                box-sizing: border-box;
                background-color: white;
                border: 1px solid black;
                pointer-events: none;
            }
            
            :host(:not([visible])) {
                display: none;
            }
            
            [part="arrow"] {
                display: inline-block;
                position: fixed;
                z-index: 1;
                width: 6px;
                height: 6px;
                box-sizing: border-box;
                background-color: white;
                border: 1px solid black;
                border-width: 0 1px 1px 0;
            }
            
            :host(:is(:not([position]), [position="top"])) [part="arrow"] {
                transform: translate(-3px, -3px) rotate(45deg);
            }
            
            :host(:is([position="bottom"])) [part="arrow"] {
                transform: translate(-3px, -3px) rotate(225deg);
            }
            
            :host(:is([position="left"])) [part="arrow"] {
                transform: translate(-3px, -3px) rotate(315deg);
            }
            
            :host(:is([position="right"])) [part="arrow"] {
                transform: translate(-3px, -3px) rotate(135deg);
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
        this.#target = null;
        this.#toggleAnimation = null;
        this.#targetListenerObject = (function(tooltip) {
            return {
                handleEvent(event: Event) {
                    const {type} = event;
                    switch (type) {
                        case "mouseenter": {
                            tooltip.#handleTargetMouseEnterEvent();
                            break;
                        }
                        case "mouseleave": {
                            tooltip.#handleTargetMouseLeaveEvent();
                            break;
                        }
                    }
                }
            };
        })(this);
        this.#documentListenerObject = (function(tooltip) {
            return {
                handleEvent(event: Event) {
                    const {type} = event;
                    switch (type) {
                        case "keydown": {
                            tooltip.#handleDocumentKeyDownEvent(<KeyboardEvent>event);
                            break;
                        }
                    }
                }
            };
        })(this);
    }

    connectedCallback(): void {
        const {htmlFor} = this;
        this.#setTarget(htmlFor);
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name) {
            case "for": {
                this.#setTarget(newValue);
                break;
            }
        }
    }

    show(): void {
        this.visible = true;
        let toggleAnimation = this.#toggleAnimation;
        if (toggleAnimation !== null) {
            const {id} = toggleAnimation;
            if (id === "hide") {
                toggleAnimation.cancel();
            }
        }
        toggleAnimation = this.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], {
            id: "show",
            duration: SHOW_DELAY_MS
        })
        const {finished} = toggleAnimation;
        finished.then(
            () => {
                this.#toggleAnimation = null;
            },
            () => {
                this.visible = false;
            }
        );
        this.#toggleAnimation = toggleAnimation;
        this.#position();
    }

    hide(): void {
        let toggleAnimation = this.#toggleAnimation;
        if (toggleAnimation !== null) {
            const {id} = toggleAnimation;
            if (id === "show") {
                toggleAnimation.cancel();
            }
        }
        toggleAnimation = this.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            id: "hide",
            duration: HIDE_DELAY_MS
        });
        const {finished} = toggleAnimation;
        finished.then(
            () => {
                this.visible = false;
            },
            () => {
                this.visible = true;
            }
        );
        this.#toggleAnimation = toggleAnimation;
    }

    #arrow(): HTMLElement {
        return this.shadowRoot.querySelector<HTMLElement>("[part=arrow]")!;
    }

    #setTarget(id: string | null): void {
        const target = id ? document.getElementById(id) : null;
        if (target !== null) {
            const oldTarget = this.#target;
            if (oldTarget) {
                oldTarget.removeEventListener("mouseenter", this.#targetListenerObject);
                oldTarget.removeEventListener("mouseleave", this.#targetListenerObject);
            }
            target.addEventListener("mouseenter", this.#targetListenerObject);
            target.addEventListener("mouseleave", this.#targetListenerObject);
        }
        this.#target = target;
    }

    #position(): void {
        const target = this.#target;
        if (target !== null) {
            const {top: targetTop, bottom: targetBottom, left: targetLeft, right: targetRight} = target.getBoundingClientRect();
            const {width: tooltipWidth, height: tooltipHeight} = this.getBoundingClientRect();
            const tooltipHalfWidth = tooltipWidth / 2;
            const tooltipHalfHeight = tooltipHeight / 2;
            const targetCenter = (targetRight + targetLeft) / 2;
            const targetMiddle = (targetBottom + targetTop) / 2;
            const {position, style: tooltipStyle} = this;
            const arrow = this.#arrow();
            const {style: arrowStyle} = arrow;
            const {width: arrowWidth, height: arrowHeight} = arrow.getBoundingClientRect();
            const arrowHalfWidth = arrowWidth / 2;
            const arrowHalfHeight = arrowHeight / 2;
            const {clientWidth} = document.body;
            switch (position) {
                case "top": {
                    tooltipStyle.setProperty("top", `${targetTop - tooltipHeight - arrowHalfHeight}px`);
                    tooltipStyle.setProperty("left", `${
                        Math.max(0, Math.min(targetCenter - tooltipHalfWidth, clientWidth - tooltipWidth))
                    }px`);
                    arrowStyle.setProperty("top", `${targetTop - arrowHalfHeight}px`);
                    arrowStyle.setProperty("left", `${targetCenter}px`);
                    break;
                }
                case "bottom": {
                    tooltipStyle.setProperty("top", `${targetBottom + arrowHalfHeight}px`);
                    tooltipStyle.setProperty("left", `${
                        Math.max(0, Math.min(targetCenter - tooltipHalfWidth, clientWidth - tooltipWidth))
                    }px`);
                    arrowStyle.setProperty("top", `${targetBottom + arrowHalfHeight}px`);
                    arrowStyle.setProperty("left", `${targetCenter}px`);
                    break;
                }
                case "left": {
                    tooltipStyle.setProperty("top", `${targetMiddle - tooltipHalfHeight}px`);
                    tooltipStyle.setProperty("left", `${targetLeft - tooltipWidth - arrowHalfWidth}px`);
                    arrowStyle.setProperty("top", `${targetMiddle}px`);
                    arrowStyle.setProperty("left", `${targetLeft - arrowHalfWidth}px`);
                    break;
                }
                case "right": {
                    tooltipStyle.setProperty("top", `${targetMiddle - tooltipHalfHeight}px`);
                    tooltipStyle.setProperty("left", `${targetRight + arrowHalfWidth}px`);
                    arrowStyle.setProperty("top", `${targetMiddle}px`);
                    arrowStyle.setProperty("left", `${targetRight + arrowHalfWidth}px`);
                    break;
                }
            }
        }
    }

    #handleTargetMouseEnterEvent(): void {
        this.show();
        document.addEventListener("keydown", this.#documentListenerObject);
    }

    #handleTargetMouseLeaveEvent(): void {
        this.hide();
        document.removeEventListener("keydown", this.#documentListenerObject);
    }

    #handleDocumentKeyDownEvent(event: KeyboardEvent): void {
        const {key} = event;
        switch (key) {
            case "Escape": {
                this.hide();
                break;
            }
        }
    }
}

var HTMLEToolTipElement: HTMLEToolTipElementConstructor = HTMLEToolTipElementBase;