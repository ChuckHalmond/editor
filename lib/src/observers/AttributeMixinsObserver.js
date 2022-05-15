import { areAttributesMatching } from "../elements/Element";
export { AttributeMixinsObserver };
class AttributeMixinsObserverBase {
    _observer;
    _mixins;
    constructor(mixins) {
        this._observer = new MutationObserver(this._callback.bind(this));
        this._mixins = mixins.slice();
    }
    trigger() {
        this._callback(this._observer.takeRecords());
    }
    _callback(mutationsList) {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof Element) {
                    this._attachMatchingAttributeMixinsInSubtree(node);
                }
            });
            mutation.removedNodes.forEach((node) => {
                if (node instanceof Element) {
                    this._detachMatchingAttributeMixinsInSubtree(node);
                }
            });
            if (mutation.target instanceof Element) {
                const targetElement = mutation.target;
                const attributeName = mutation.attributeName;
                if (attributeName) {
                    const relatedMixins = this._mixins.filter(mixin => mixin.attributeName === attributeName);
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
    }
    observe(target) {
        this._observer.observe(target, {
            childList: true,
            subtree: true,
            attributeFilter: this._mixins.map((mixin => mixin.attributeName))
        });
    }
    disconnect() {
        this._observer.disconnect();
    }
    _attachMatchingAttributeMixinsInSubtree(element) {
        Array.from(element.attributes).forEach((attr) => {
            let matchingMixins = this._mixins.filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
            matchingMixins.forEach((mixin) => {
                mixin.attach(element);
            });
        });
        let childIndex = 0;
        const { children } = element;
        while (childIndex < children.length) {
            const child = children.item(childIndex);
            if (child !== null) {
                this._attachMatchingAttributeMixinsInSubtree(child);
            }
            childIndex++;
        }
    }
    _detachMatchingAttributeMixinsInSubtree(element) {
        Array.from(element.attributes).forEach((attr) => {
            let matchingMixins = this._mixins.filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
            matchingMixins.forEach((mixin) => {
                mixin.detach(element);
            });
        });
        let childIndex = 0;
        const { children } = element;
        while (childIndex < children.length) {
            const child = children.item(childIndex);
            if (child !== null) {
                this._detachMatchingAttributeMixinsInSubtree(child);
            }
            childIndex++;
        }
    }
}
var AttributeMixinsObserver = AttributeMixinsObserverBase;
//# sourceMappingURL=AttributeMixinsObserver.js.map