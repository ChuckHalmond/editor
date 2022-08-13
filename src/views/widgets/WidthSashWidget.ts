import { element } from "../../elements/Element";
import { Widget, WidgetFactory } from "./Widget";

export { widthSashWidget };

declare global {
    interface WidgetNameMap {
        "widthsash": WidthSashWidgetFactory
    }
}

interface WidthSashWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        controls?: string;
        growDir?: "left" | "right";
    }): HTMLElement;
}

var widthSashWidget = new (
Widget({
    name: "widthsash"
})(class WidthSashWidgetFactory extends WidgetFactory {
    #template: HTMLElement;

    #targets: WeakMap<HTMLElement, HTMLElement | null>;
    #onCaptureFlags: WeakMap<HTMLElement, boolean>;
    #queuedPointerCallbacks: WeakMap<HTMLElement, FrameRequestCallback | null>;
    #pointerMovements: WeakMap<HTMLElement, number>;

    constructor() {
        super();
        this.#template = element("div", {
            attributes: {
                class: "widthsash"
            }
        });
        this.#targets = new WeakMap();
        this.#onCaptureFlags = new WeakMap();
        this.#queuedPointerCallbacks = new WeakMap();
        this.#pointerMovements = new WeakMap();
    }

    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        controls?: string;
        growDir?: "left" | "right";
    }) {
        const targets = this.#targets;
        const pointerMovements = this.#pointerMovements;
        const onCaptureFlags = this.#onCaptureFlags;
        const queuedPointerCallbacks = this.#queuedPointerCallbacks;
        const sash = <HTMLElement>this.#template.cloneNode(true);
        sash.addEventListener("pointerdown", this.#handlePointerDownEvent.bind(this));
        sash.addEventListener("pointermove", this.#handlePointerMoveEvent.bind(this));
        sash.addEventListener("pointerup", this.#handlePointerUpEvent.bind(this));
        if (properties !== undefined) {
            const {id, classList, tabIndex, controls, growDir} = properties;
            if (id !== undefined) {
                sash.id = id;
            }
            if (classList !== undefined) {
                sash.classList.add(...classList);
            }
            if (tabIndex !== undefined) {
                sash.tabIndex = tabIndex;
            }
            if (controls !== undefined) {
                this.setControls(sash, controls);
            }
            if (growDir !== undefined) {
                this.setGrowDir(sash, growDir);
            }
        }
        targets.set(sash, null);
        queuedPointerCallbacks.set(sash, null);
        pointerMovements.set(sash, 0);
        onCaptureFlags.set(sash, false);
        return sash;
    }

    getGrowDir(sash: HTMLElement): "right" | "left" {
        return <"right" | "left">sash.getAttribute("data-growdir") ?? "right";
    }

    setGrowDir(sash: HTMLElement, value: "right" | "left"): void {
        sash.setAttribute("data-growdir", value);
    }

    getControls(sash: HTMLElement): string | null {
        return sash.getAttribute("data-controls");
    }

    setControls(sash: HTMLElement, value: string): void {
        sash.setAttribute("data-controls", value);
    }

    setWidth(sash: HTMLElement, width: number): void {
        const targets = this.#targets;
        const target = targets.get(sash)!;
        if (target !== null) {
            target.style.setProperty("width", `${width}px`);
        }
    }

    #handlePointerUpEvent(event: PointerEvent): void {
        const {pointerId, currentTarget} = event;
        const sashTarget = <HTMLElement>currentTarget;
        const onCaptureFlags = this.#onCaptureFlags;
        sashTarget.releasePointerCapture(pointerId);
        onCaptureFlags.set(sashTarget, false);
    }

    #handlePointerDownEvent(event: PointerEvent): void {
        const {pointerId, currentTarget} = event;
        const sashTarget = <HTMLElement>currentTarget;
        const controls = this.getControls(sashTarget);
        if (controls) {
            const targets = this.#targets;
            const onCaptureFlags = this.#onCaptureFlags;
            const rootNode = <ShadowRoot | Document>sashTarget.getRootNode();
            targets.set(sashTarget, rootNode.getElementById(controls));
            onCaptureFlags.set(sashTarget, true);
            sashTarget.setPointerCapture(pointerId);
        }
    }

    #handlePointerMoveEvent(event: PointerEvent): void {
        const {currentTarget} = event;
        const sashTarget = <HTMLElement>currentTarget;
        const pointerMovements = this.#pointerMovements;
        const onCaptureFlags = this.#onCaptureFlags;
        const queuedPointerCallbacks = this.#queuedPointerCallbacks;
        const pointerMoveCallback = this.#pointerMoveCallback;
        const onCaptureFlag = onCaptureFlags.get(sashTarget);
        if (onCaptureFlag) {
            let callback = queuedPointerCallbacks.get(sashTarget);
            if (callback == null) {
                callback = pointerMoveCallback.bind(this, sashTarget);
                queuedPointerCallbacks.set(sashTarget, callback);
                requestAnimationFrame(callback);
            }
            const pointerMovement = pointerMovements.get(sashTarget)! + event.movementX;
            pointerMovements.set(sashTarget, pointerMovement);
        }
    }

    #pointerMoveCallback(sash: HTMLElement): void {
        const targets = this.#targets;
        const pointerMovements = this.#pointerMovements;
        const queuedPointerCallbacks = this.#queuedPointerCallbacks;
        const target = targets.get(sash)!;
        if (target !== null) {
            const targetComputedStyle = window.getComputedStyle(target);
            const growdir = this.getGrowDir(sash);
            const movementX = pointerMovements.get(sash)!;
            const width = parseFloat(targetComputedStyle.getPropertyValue("width"));
            const newWidth = width + (growdir == "right" ? 1 : -1) * movementX;
            this.setWidth(sash, newWidth);
            sash.dispatchEvent(new Event("resize"));
        }
        pointerMovements.set(sash, 0);
        queuedPointerCallbacks.set(sash, null);
    }
}));