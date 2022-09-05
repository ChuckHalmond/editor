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
}

declare global {
    interface HTMLElementTagNameMap {
        "e-tooltip": HTMLEToolTipElement;
    }
}

var shadowTemplate: HTMLTemplateElement;

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
    }

    #toggleAnimation: Animation | null;

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
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
            toggleAnimation.cancel();
        }
        toggleAnimation = this.animate([
            { opacity: "0" },
            { opacity: "1" }
        ], {
            duration: 200
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
            toggleAnimation.cancel();
        }
        toggleAnimation = this.animate([
            { opacity: "1" },
            { opacity: "0" }
        ], {
            duration: 200
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