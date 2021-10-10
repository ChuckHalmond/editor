import { areAttributesMatching, isElement } from "../elements/HTMLElement";
import { forAllSubtreeElements } from "../elements/Snippets";
export { AttributeMixinsObserver };
class AttributeMixinsObserverBase {
    constructor(mixins) {
        this._observer = new MutationObserver(this.callback.bind(this));
        this._mixins = mixins.slice();
    }
    callback(mutationsList) {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (isElement(node)) {
                    forAllSubtreeElements(node, (childElement) => {
                        [...childElement.attributes].forEach((attr) => {
                            let matchingMixins = this._mixins.filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
                            matchingMixins.forEach((mixin) => {
                                mixin.attach(childElement);
                            });
                        });
                    });
                }
            });
            mutation.removedNodes.forEach((node) => {
                if (isElement(node)) {
                    forAllSubtreeElements(node, (childElement) => {
                        [...childElement.attributes].forEach((attr) => {
                            let matchingMixins = this._mixins.filter(mixin => areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attr.name, attr.value));
                            matchingMixins.forEach((mixin) => {
                                mixin.detach(childElement);
                            });
                        });
                    });
                }
            });
            if (isElement(mutation.target)) {
                let targetElement = mutation.target;
                let attrName = mutation.attributeName;
                if (attrName) {
                    let relatedMixins = this._mixins.filter(mixin => mixin.attributeName === attrName);
                    relatedMixins.forEach((mixin) => {
                        if (areAttributesMatching(mixin.attributeType, mixin.attributeName, mixin.attributeValue, attrName, targetElement.getAttribute(attrName))) {
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
}
var AttributeMixinsObserver = AttributeMixinsObserverBase;
//# sourceMappingURL=AttributeMixinsObserver.js.map