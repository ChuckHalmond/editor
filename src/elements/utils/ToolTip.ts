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

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.append(
            shadowTemplate.content.cloneNode(true)
        );
        this.#target = null;
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
        this.#position();
    }

    hide(): void {
        this.visible = false;
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
            switch (position) {
                case "top": {
                    tooltipStyle.setProperty("top", `${targetTop - tooltipHeight - arrowHeight}px`);
                    tooltipStyle.setProperty("left", `${targetCenter - tooltipHalfWidth}px`);
                    arrowStyle.setProperty("top", `${targetTop - arrowHeight}px`);
                    arrowStyle.setProperty("left", `${targetCenter - arrowHalfWidth}px`);
                    break;
                }
                case "bottom": {
                    tooltipStyle.setProperty("top", `${targetBottom + arrowHeight}px`);
                    tooltipStyle.setProperty("left", `${targetCenter - tooltipHalfWidth}px`);
                    arrowStyle.setProperty("top", `${targetBottom + arrowHeight}px`);
                    arrowStyle.setProperty("left", `${targetCenter - arrowHalfWidth}px`);
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