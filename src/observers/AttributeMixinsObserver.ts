import { areAttributesMatching, AttributeMutationMixin } from "../elements/Element";

export { AttributeMixinsObserver };

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
                if (node instanceof Element) {
                    this.attachMatchingAttributeMixinsInSubtree(node);
                }
            });
            mutation.removedNodes.forEach((node: Node) => {
                if (node instanceof Element) {
                    this.detachMatchingAttributeMixinsInSubtree(node);
                }
            });
            if (mutation.target instanceof Element) {
                const targetElement = mutation.target;
                const attributeName = mutation.attributeName;
                if (attributeName) {
                    const relatedMixins = this._mixins.filter(mixin => mixin.attributeName === attributeName);
                    relatedMixins.forEach((mixin) => {
                        if (areAttributesMatching(
                                mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                                attributeName!, targetElement.getAttribute(attributeName!)
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

    private attachMatchingAttributeMixinsInSubtree(element: Element) {
        Array.from(element.attributes).forEach((attr) => {
            let matchingMixins = this._mixins.filter(
                mixin => areAttributesMatching(
                    mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                    attr.name, attr.value
                )
            );
            matchingMixins.forEach((mixin) => {
                mixin.attach(element);
            });
        });
        let childIndex = 0;
        while (childIndex < element.children.length) {
            const child = element.children.item(childIndex);
            if (child !== null) {
                this.attachMatchingAttributeMixinsInSubtree(child);
            }
            childIndex++;
        }
    }

    private detachMatchingAttributeMixinsInSubtree(element: Element) {
        Array.from(element.attributes).forEach((attr) => {
            let matchingMixins = this._mixins.filter(
                mixin => areAttributesMatching(
                    mixin.attributeType, mixin.attributeName, mixin.attributeValue,
                    attr.name, attr.value
                )
            );
            matchingMixins.forEach((mixin) => {
                mixin.detach(element);
            });
        });
        let childIndex = 0;
        while (childIndex < element.children.length) {
            const child = element.children.item(childIndex);
            if (child !== null) {
                this.detachMatchingAttributeMixinsInSubtree(child);
            }
            childIndex++;
        }
    }
}

var AttributeMixinsObserver: AttributeMixinsObserverConstructor = AttributeMixinsObserverBase;