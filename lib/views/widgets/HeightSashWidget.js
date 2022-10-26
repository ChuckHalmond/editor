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
var _HeightSashWidgetFactory_instances, _HeightSashWidgetFactory_template, _HeightSashWidgetFactory_targets, _HeightSashWidgetFactory_onCaptureFlags, _HeightSashWidgetFactory_queuedPointerCallbacks, _HeightSashWidgetFactory_pointerMovements, _HeightSashWidgetFactory_handlePointerUpEvent, _HeightSashWidgetFactory_handlePointerDownEvent, _HeightSashWidgetFactory_handlePointerMoveEvent, _HeightSashWidgetFactory_pointerMoveCallback, _a;
import { element } from "../../elements/Element";
import { Widget, WidgetFactory } from "./Widget";
export { heightSashWidget };
var heightSashWidget = new (Widget({
    name: "heightsash"
})((_a = class HeightSashWidgetFactory extends WidgetFactory {
        constructor() {
            super();
            _HeightSashWidgetFactory_instances.add(this);
            _HeightSashWidgetFactory_template.set(this, void 0);
            _HeightSashWidgetFactory_targets.set(this, void 0);
            _HeightSashWidgetFactory_onCaptureFlags.set(this, void 0);
            _HeightSashWidgetFactory_queuedPointerCallbacks.set(this, void 0);
            _HeightSashWidgetFactory_pointerMovements.set(this, void 0);
            __classPrivateFieldSet(this, _HeightSashWidgetFactory_template, element("div", {
                attributes: {
                    class: "heightsash"
                }
            }), "f");
            __classPrivateFieldSet(this, _HeightSashWidgetFactory_targets, new WeakMap(), "f");
            __classPrivateFieldSet(this, _HeightSashWidgetFactory_onCaptureFlags, new WeakMap(), "f");
            __classPrivateFieldSet(this, _HeightSashWidgetFactory_queuedPointerCallbacks, new WeakMap(), "f");
            __classPrivateFieldSet(this, _HeightSashWidgetFactory_pointerMovements, new WeakMap(), "f");
        }
        create(properties) {
            const targets = __classPrivateFieldGet(this, _HeightSashWidgetFactory_targets, "f");
            const pointerMovements = __classPrivateFieldGet(this, _HeightSashWidgetFactory_pointerMovements, "f");
            const onCaptureFlags = __classPrivateFieldGet(this, _HeightSashWidgetFactory_onCaptureFlags, "f");
            const queuedPointerCallbacks = __classPrivateFieldGet(this, _HeightSashWidgetFactory_queuedPointerCallbacks, "f");
            const sash = __classPrivateFieldGet(this, _HeightSashWidgetFactory_template, "f").cloneNode(true);
            sash.addEventListener("pointerdown", __classPrivateFieldGet(this, _HeightSashWidgetFactory_instances, "m", _HeightSashWidgetFactory_handlePointerDownEvent).bind(this));
            sash.addEventListener("pointermove", __classPrivateFieldGet(this, _HeightSashWidgetFactory_instances, "m", _HeightSashWidgetFactory_handlePointerMoveEvent).bind(this));
            sash.addEventListener("pointerup", __classPrivateFieldGet(this, _HeightSashWidgetFactory_instances, "m", _HeightSashWidgetFactory_handlePointerUpEvent).bind(this));
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
            return sash.getAttribute("data-growdir") ?? "top";
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
        setHeight(sash, height) {
            const targets = __classPrivateFieldGet(this, _HeightSashWidgetFactory_targets, "f");
            const target = targets.get(sash);
            if (target !== null) {
                target.style.setProperty("height", `${height}px`);
            }
        }
    },
    _HeightSashWidgetFactory_template = new WeakMap(),
    _HeightSashWidgetFactory_targets = new WeakMap(),
    _HeightSashWidgetFactory_onCaptureFlags = new WeakMap(),
    _HeightSashWidgetFactory_queuedPointerCallbacks = new WeakMap(),
    _HeightSashWidgetFactory_pointerMovements = new WeakMap(),
    _HeightSashWidgetFactory_instances = new WeakSet(),
    _HeightSashWidgetFactory_handlePointerUpEvent = function _HeightSashWidgetFactory_handlePointerUpEvent(event) {
        const { pointerId, currentTarget } = event;
        const sashTarget = currentTarget;
        const onCaptureFlags = __classPrivateFieldGet(this, _HeightSashWidgetFactory_onCaptureFlags, "f");
        sashTarget.releasePointerCapture(pointerId);
        onCaptureFlags.set(sashTarget, false);
    },
    _HeightSashWidgetFactory_handlePointerDownEvent = function _HeightSashWidgetFactory_handlePointerDownEvent(event) {
        const { pointerId, currentTarget } = event;
        const sashTarget = currentTarget;
        const controls = this.getControls(sashTarget);
        if (controls) {
            const targets = __classPrivateFieldGet(this, _HeightSashWidgetFactory_targets, "f");
            const onCaptureFlags = __classPrivateFieldGet(this, _HeightSashWidgetFactory_onCaptureFlags, "f");
            const rootNode = sashTarget.getRootNode();
            targets.set(sashTarget, rootNode.getElementById(controls));
            onCaptureFlags.set(sashTarget, true);
            sashTarget.setPointerCapture(pointerId);
        }
    },
    _HeightSashWidgetFactory_handlePointerMoveEvent = function _HeightSashWidgetFactory_handlePointerMoveEvent(event) {
        const { currentTarget } = event;
        const sashTarget = currentTarget;
        const pointerMovements = __classPrivateFieldGet(this, _HeightSashWidgetFactory_pointerMovements, "f");
        const onCaptureFlags = __classPrivateFieldGet(this, _HeightSashWidgetFactory_onCaptureFlags, "f");
        const queuedPointerCallbacks = __classPrivateFieldGet(this, _HeightSashWidgetFactory_queuedPointerCallbacks, "f");
        const onCaptureFlag = onCaptureFlags.get(sashTarget);
        if (onCaptureFlag) {
            let callback = queuedPointerCallbacks.get(sashTarget);
            if (callback == null) {
                callback = __classPrivateFieldGet(this, _HeightSashWidgetFactory_instances, "m", _HeightSashWidgetFactory_pointerMoveCallback).bind(this, sashTarget);
                queuedPointerCallbacks.set(sashTarget, callback);
                requestAnimationFrame(callback);
            }
            const pointerMovement = pointerMovements.get(sashTarget) + event.movementX;
            pointerMovements.set(sashTarget, pointerMovement);
        }
    },
    _HeightSashWidgetFactory_pointerMoveCallback = function _HeightSashWidgetFactory_pointerMoveCallback(sash) {
        const targets = __classPrivateFieldGet(this, _HeightSashWidgetFactory_targets, "f");
        const pointerMovements = __classPrivateFieldGet(this, _HeightSashWidgetFactory_pointerMovements, "f");
        const queuedPointerCallbacks = __classPrivateFieldGet(this, _HeightSashWidgetFactory_queuedPointerCallbacks, "f");
        const target = targets.get(sash);
        if (target !== null) {
            const targetComputedStyle = window.getComputedStyle(target);
            const growdir = this.getGrowDir(sash);
            const movementX = pointerMovements.get(sash);
            const height = parseFloat(targetComputedStyle.getPropertyValue("height"));
            const newHeight = height + (growdir == "top" ? -1 : 1) * movementX;
            this.setHeight(sash, newHeight);
            sash.dispatchEvent(new Event("resize"));
        }
        pointerMovements.set(sash, 0);
        queuedPointerCallbacks.set(sash, null);
    },
    _a)));
//# sourceMappingURL=HeightSashWidget.js.map