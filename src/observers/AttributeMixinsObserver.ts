import { areAttributesMatching, AttributeMutationMixin, isElement } from "../elements/HTMLElement";
import { forAllSubtreeElements } from "../elements/Snippets";

export { AttributeMixinsObserverConstructor };
export { AttributeMixinsObserver };
export { AttributeMixinsObserverBase };

interface AttributeMixinsObserverConstructor {
    readonly prototype: AttributeMixinsObserver;
    new(mixins: AttributeMutationMixin[]): AttributeMixinsObserver;
}

interface AttributeMixinsObserver {
    observe(target: Node): void;
    disconnect(): void;
}

class AttributeMixinsObserverBase implements AttributeMixinsObserver {
    private _observer: MutationObserver;
    private _mixins: AttributeMutationMixin[];

    constructor(mixins: AttributeMutationMixin[]) {
        this._observer = new MutationObserver(
            this.callback.bind(this)
        );
        this._mixins = mixins.slice();
    }

    public callback(mutationsList: MutationRecord[]) {
        mutationsList.forEach((mutation: MutationRecord) => {
            mutation.addedNodes.forEach((node: Node) => {
                if (isElement(node)) {
                    forAllSubtreeElements(node, (childElement: Element) => {
                        [...childElement.attributes].forEach((attr) => {
                            let matchingMixins = this._mixins.filter(
                                mixin => areAttributesMatching(
                                    mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                    attr.name, attr.value
                                )
                            );
                            matchingMixins.forEach((mixin) => {
                                mixin.attach(childElement);
                            });
                        });
                    });
                }
            });
            mutation.removedNodes.forEach((node: Node) => {
                if (isElement(node)) {
                    forAllSubtreeElements(node, (childElement: Element) => {
                        [...childElement.attributes].forEach((attr) => {
                            let matchingMixins = this._mixins.filter(
                                mixin => areAttributesMatching(
                                    mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                    attr.name, attr.value
                                )
                            );
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
                        if (areAttributesMatching(
                                mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                attrName!, targetElement.getAttribute(attrName!)
                            )) {
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

    public observe(target: Node): void  {
        this._observer.observe(target, {
            childList: true,
            subtree: true,
            attributeFilter: this._mixins.map((mixin => mixin.attributeName))
        });
    }

    public disconnect(): void {
        this._observer.disconnect();
    }
}

var AttributeMixinsObserver: AttributeMixinsObserverConstructor = AttributeMixinsObserverBase;