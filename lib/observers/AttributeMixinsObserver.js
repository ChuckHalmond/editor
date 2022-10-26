var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AttributeMixinsObserverBase_instances, _AttributeMixinsObserverBase_observer, _AttributeMixinsObserverBase_mixins, _AttributeMixinsObserverBase_callback, _AttributeMixinsObserverBase_attachMatchingAttributeMixinsInSubtree, _AttributeMixinsObserverBase_detachMatchingAttributeMixinsInSubtree;
import { areAttributesMatching } from "../elements/Element";
export { AttributeMixinsObserver };
class AttributeMixinsObserverBase {
    constructor(mixins) {
        _AttributeMixinsObserverBase_instances.add(this);
        _AttributeMixinsObserverBase_observer.set(this, void 0);
        _AttributeMixinsObserverBase_mixins.set(this, void 0);
        __classPrivateFieldSet(this, _AttributeMixinsObserverBase_observer, new MutationObserver(__classPrivateFieldGet(this, _AttributeMixinsObserverBase_instances, "m", _AttributeMixinsObserverBase_callback).bind(this)), "f");
        __classPrivateFieldSet(this, _AttributeMixinsObserverBase_mixins, mixins.slice(), "f");
    }
    trigger() {
        __classPrivateFieldGet(this, _AttributeMixinsObserverBase_instances, "m", _AttributeMixinsObserverBase_callback).call(this, __classPrivateFieldGet(this, _AttributeMixinsObserverBase_observer, "f").takeRecords());
    }
    observe(target) {
        __classPrivateFieldGet(this, _AttributeMixinsObserverBase_observer, "f").observe(target, {
            childList: true,
            subtree: true,
            attributeFilter: __classPrivateFieldGet(this, _AttributeMixinsObserverBase_mixins, "f").map((mixin => mixin.attributeName))
        });
    }
    disconnect() {
        __classPrivateFieldGet(this, _AttributeMixinsObserverBase_observer, "f").disconnect();
    }
}
_AttributeMixinsObserverBase_observer = new WeakMap(), _AttributeMixinsObserverBase_mixins = new WeakMap(), _AttributeMixinsObserverBase_instances = new WeakSet(), _AttributeMixinsObserverBase_callback = function _AttributeMixinsObserverBase_callback(mutationsList) {
    mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
                __classPrivateFieldGet(this, _AttributeMixinsObserverBase_instances, "m", _AttributeMixinsObserverBase_attachMatchingAttributeMixinsInSubtree).call(this, node);
            }
        });
        mutation.removedNodes.forEach((node) => {
            if (node instanceof Element) {
                __classPrivateFieldGet(this, _AttributeMixinsObserverBase_instances, "m", _AttributeMixinsObserverBase_detachMatchingAttributeMixinsInSubtree).call(this, node);
            }
        });
        if (mutation.target instanceof Element) {
            const targetElement = mutation.target;
            const attributeName = mutation.attributeName;
            if (attributeName) {
                const relatedMixins = __classPrivateFieldGet(this, _AttributeMixinsObserverBase_mixins, "f").filter(mixin => mixin.attributeName == attributeName);
                relatedMixins.forEach((mixin) => {
                    if (areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attributeName, targetElement.getAttribute(attributeName))) {
                        mixin.attach(targetElement);
                    }
                    else {
                        mixin.detach(targetElement);
                    }
                });
            }
        }
    });
}, _AttributeMixinsObserverBase_attachMatchingAttributeMixinsInSubtree = function _AttributeMixinsObserverBase_attachMatchingAttributeMixinsInSubtree(element) {
    Array.from(element.attributes).forEach((attr) => {
        let matchingMixins = __classPrivateFieldGet(this, _AttributeMixinsObserverBase_mixins, "f").filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
        matchingMixins.forEach((mixin) => {
            mixin.attach(element);
        });
    });
    let childIndex = 0;
    const { children } = element;
    while (childIndex < children.length) {
        const child = children.item(childIndex);
        if (child !== null) {
            __classPrivateFieldGet(this, _AttributeMixinsObserverBase_instances, "m", _AttributeMixinsObserverBase_attachMatchingAttributeMixinsInSubtree).call(this, child);
        }
        childIndex++;
    }
}, _AttributeMixinsObserverBase_detachMatchingAttributeMixinsInSubtree = function _AttributeMixinsObserverBase_detachMatchingAttributeMixinsInSubtree(element) {
    Array.from(element.attributes).forEach((attr) => {
        let matchingMixins = __classPrivateFieldGet(this, _AttributeMixinsObserverBase_mixins, "f").filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
        matchingMixins.forEach((mixin) => {
            mixin.detach(element);
        });
    });
    let childIndex = 0;
    const { children } = element;
    while (childIndex < children.length) {
        const child = children.item(childIndex);
        if (child !== null) {
            __classPrivateFieldGet(this, _AttributeMixinsObserverBase_instances, "m", _AttributeMixinsObserverBase_detachMatchingAttributeMixinsInSubtree).call(this, child);
        }
        childIndex++;
    }
};
var AttributeMixinsObserver = AttributeMixinsObserverBase;
//# sourceMappingURL=AttributeMixinsObserver.js.map