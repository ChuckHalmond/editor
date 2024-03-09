import { areAttributesMatching } from "../elements/Element";
export { AttributeMixinsObserver };
class AttributeMixinsObserverBase {
    #observer;
    #mixins;
    constructor(mixins) {
        this.#observer = new MutationObserver(this.#callback.bind(this));
        this.#mixins = mixins.slice();
    }
    trigger() {
        this.#callback(this.#observer.takeRecords());
    }
    observe(target) {
        this.#observer.observe(target, {
            childList: true,
            subtree: true,
            attributeFilter: this.#mixins.map((mixin => mixin.attributeName))
        });
    }
    disconnect() {
        this.#observer.disconnect();
    }
    #callback(mutationsList) {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof Element) {
                    this.#attachMatchingAttributeMixinsInSubtree(node);
                }
            });
            mutation.removedNodes.forEach((node) => {
                if (node instanceof Element) {
                    this.#detachMatchingAttributeMixinsInSubtree(node);
                }
            });
            if (mutation.target instanceof Element) {
                const targetElement = mutation.target;
                const attributeName = mutation.attributeName;
                if (attributeName) {
                    const relatedMixins = this.#mixins.filter(mixin => mixin.attributeName == attributeName);
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
    #attachMatchingAttributeMixinsInSubtree(element) {
        Array.from(element.attributes).forEach((attr) => {
            let matchingMixins = this.#mixins.filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
            matchingMixins.forEach((mixin) => {
                mixin.attach(element);
            });
        });
        let childIndex = 0;
        const { children } = element;
        while (childIndex < children.length) {
            const child = children.item(childIndex);
            if (child !== null) {
                this.#attachMatchingAttributeMixinsInSubtree(child);
            }
            childIndex++;
        }
    }
    #detachMatchingAttributeMixinsInSubtree(element) {
        Array.from(element.attributes).forEach((attr) => {
            let matchingMixins = this.#mixins.filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
            matchingMixins.forEach((mixin) => {
                mixin.detach(element);
            });
        });
        let childIndex = 0;
        const { children } = element;
        while (childIndex < children.length) {
            const child = children.item(childIndex);
            if (child !== null) {
                this.#detachMatchingAttributeMixinsInSubtree(child);
            }
            childIndex++;
        }
    }
}
var AttributeMixinsObserver = AttributeMixinsObserverBase;
//# sourceMappingURL=AttributeMixinsObserver.js.map