var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WidthSashWidgetFactory_instances, _WidthSashWidgetFactory_template, _WidthSashWidgetFactory_targets, _WidthSashWidgetFactory_onCaptureFlags, _WidthSashWidgetFactory_queuedPointerCallbacks, _WidthSashWidgetFactory_pointerMovements, _WidthSashWidgetFactory_handlePointerUpEvent, _WidthSashWidgetFactory_handlePointerDownEvent, _WidthSashWidgetFactory_handlePointerMoveEvent, _WidthSashWidgetFactory_pointerMoveCallback, _a;
import { element } from "../../elements/Element";
import { Widget, WidgetFactory } from "./Widget";
export { widthSashWidget };
var widthSashWidget = new (Widget({
    name: "widthsash"
})((_a = class WidthSashWidgetFactory extends WidgetFactory {
        constructor() {
            super();
            _WidthSashWidgetFactory_instances.add(this);
            _WidthSashWidgetFactory_template.set(this, void 0);
            _WidthSashWidgetFactory_targets.set(this, void 0);
            _WidthSashWidgetFactory_onCaptureFlags.set(this, void 0);
            _WidthSashWidgetFactory_queuedPointerCallbacks.set(this, void 0);
            _WidthSashWidgetFactory_pointerMovements.set(this, void 0);
            __classPrivateFieldSet(this, _WidthSashWidgetFactory_template, element("div", {
                attributes: {
                    class: "widthsash"
                }
            }), "f");
            __classPrivateFieldSet(this, _WidthSashWidgetFactory_targets, new WeakMap(), "f");
            __classPrivateFieldSet(this, _WidthSashWidgetFactory_onCaptureFlags, new WeakMap(), "f");
            __classPrivateFieldSet(this, _WidthSashWidgetFactory_queuedPointerCallbacks, new WeakMap(), "f");
            __classPrivateFieldSet(this, _WidthSashWidgetFactory_pointerMovements, new WeakMap(), "f");
        }
        create(properties) {
            const targets = __classPrivateFieldGet(this, _WidthSashWidgetFactory_targets, "f");
            const pointerMovements = __classPrivateFieldGet(this, _WidthSashWidgetFactory_pointerMovements, "f");
            const onCaptureFlags = __classPrivateFieldGet(this, _WidthSashWidgetFactory_onCaptureFlags, "f");
            const queuedPointerCallbacks = __classPrivateFieldGet(this, _WidthSashWidgetFactory_queuedPointerCallbacks, "f");
            const sash = __classPrivateFieldGet(this, _WidthSashWidgetFactory_template, "f").cloneNode(true);
            sash.addEventListener("pointerdown", __classPrivateFieldGet(this, _WidthSashWidgetFactory_instances, "m", _WidthSashWidgetFactory_handlePointerDownEvent).bind(this));
            sash.addEventListener("pointermove", __classPrivateFieldGet(this, _WidthSashWidgetFactory_instances, "m", _WidthSashWidgetFactory_handlePointerMoveEvent).bind(this));
            sash.addEventListener("pointerup", __classPrivateFieldGet(this, _WidthSashWidgetFactory_instances, "m", _WidthSashWidgetFactory_handlePointerUpEvent).bind(this));
            if (properties !== undefined) {
                const { id, classList, tabIndex, controls, growDir } = properties;
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
        getGrowDir(sash) {
            return sash.getAttribute("data-growdir") ?? "right";
        }
        setGrowDir(sash, value) {
            sash.setAttribute("data-growdir", value);
        }
        getControls(sash) {
            return sash.getAttribute("data-controls");
        }
        setControls(sash, value) {
            sash.setAttribute("data-controls", value);
        }
        setWidth(sash, width) {
            const targets = __classPrivateFieldGet(this, _WidthSashWidgetFactory_targets, "f");
            const target = targets.get(sash);
            if (target !== null) {
                target.style.setProperty("width", `${width}px`);
            }
        }
    },
    _WidthSashWidgetFactory_template = new WeakMap(),
    _WidthSashWidgetFactory_targets = new WeakMap(),
    _WidthSashWidgetFactory_onCaptureFlags = new WeakMap(),
    _WidthSashWidgetFactory_queuedPointerCallbacks = new WeakMap(),
    _WidthSashWidgetFactory_pointerMovements = new WeakMap(),
    _WidthSashWidgetFactory_instances = new WeakSet(),
    _WidthSashWidgetFactory_handlePointerUpEvent = function _WidthSashWidgetFactory_handlePointerUpEvent(event) {
        const { pointerId, currentTarget } = event;
        const sashTarget = currentTarget;
        const onCaptureFlags = __classPrivateFieldGet(this, _WidthSashWidgetFactory_onCaptureFlags, "f");
        sashTarget.releasePointerCapture(pointerId);
        onCaptureFlags.set(sashTarget, false);
    },
    _WidthSashWidgetFactory_handlePointerDownEvent = function _WidthSashWidgetFactory_handlePointerDownEvent(event) {
        const { pointerId, currentTarget } = event;
        const sashTarget = currentTarget;
        const controls = this.getControls(sashTarget);
        if (controls) {
            const targets = __classPrivateFieldGet(this, _WidthSashWidgetFactory_targets, "f");
            const onCaptureFlags = __classPrivateFieldGet(this, _WidthSashWidgetFactory_onCaptureFlags, "f");
            const rootNode = sashTarget.getRootNode();
            targets.set(sashTarget, rootNode.getElementById(controls));
            onCaptureFlags.set(sashTarget, true);
            sashTarget.setPointerCapture(pointerId);
        }
    },
    _WidthSashWidgetFactory_handlePointerMoveEvent = function _WidthSashWidgetFactory_handlePointerMoveEvent(event) {
        const { currentTarget } = event;
        const sashTarget = currentTarget;
        const pointerMovements = __classPrivateFieldGet(this, _WidthSashWidgetFactory_pointerMovements, "f");
        const onCaptureFlags = __classPrivateFieldGet(this, _WidthSashWidgetFactory_onCaptureFlags, "f");
        const queuedPointerCallbacks = __classPrivateFieldGet(this, _WidthSashWidgetFactory_queuedPointerCallbacks, "f");
        const pointerMoveCallback = __classPrivateFieldGet(this, _WidthSashWidgetFactory_instances, "m", _WidthSashWidgetFactory_pointerMoveCallback);
        const onCaptureFlag = onCaptureFlags.get(sashTarget);
        if (onCaptureFlag) {
            let callback = queuedPointerCallbacks.get(sashTarget);
            if (callback == null) {
                callback = pointerMoveCallback.bind(this, sashTarget);
                queuedPointerCallbacks.set(sashTarget, callback);
                requestAnimationFrame(callback);
            }
            const pointerMovement = pointerMovements.get(sashTarget) + event.movementX;
            pointerMovements.set(sashTarget, pointerMovement);
        }
    },
    _WidthSashWidgetFactory_pointerMoveCallback = function _WidthSashWidgetFactory_pointerMoveCallback(sash) {
        const targets = __classPrivateFieldGet(this, _WidthSashWidgetFactory_targets, "f");
        const pointerMovements = __classPrivateFieldGet(this, _WidthSashWidgetFactory_pointerMovements, "f");
        const queuedPointerCallbacks = __classPrivateFieldGet(this, _WidthSashWidgetFactory_queuedPointerCallbacks, "f");
        const target = targets.get(sash);
        if (target !== null) {
            const targetComputedStyle = window.getComputedStyle(target);
            const growdir = this.getGrowDir(sash);
            const movementX = pointerMovements.get(sash);
            const width = parseFloat(targetComputedStyle.getPropertyValue("width"));
            const newWidth = width + (growdir == "right" ? 1 : -1) * movementX;
            this.setWidth(sash, newWidth);
            sash.dispatchEvent(new Event("resize"));
        }
        pointerMovements.set(sash, 0);
        queuedPointerCallbacks.set(sash, null);
    },
    _a)));
//# sourceMappingURL=WidthSashWidget.js.map