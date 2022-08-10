import { areAttributesMatching, AttributeMutationMixin } from "../elements/Element";

export { AttributeMixinsObserver };

interface AttributeMixinsObserverConstructor {
    prototype: AttributeMixinsObserver;
    new(mixins: AttributeMutationMixin[]): AttributeMixinsObserver;
}

interface AttributeMixinsObserver {
    observe(target: Node): void;
    trigger(): void;
    disconnect(): void;
}

class AttributeMixinsObserverBase implements AttributeMixinsObserver {
    #observer: MutationObserver;
    #mixins: AttributeMutationMixin[];

    constructor(mixins: AttributeMutationMixin[]) {
        this.#observer = new MutationObserver(
            this.#callback.bind(this)
        );
        this.#mixins = mixins.slice();
    }

    trigger(): void {
        this.#callback(this.#observer.takeRecords());
    }

    observe(target: Node): void  {
        this.#observer.observe(target, {
            childList: true,
            subtree: true,
            attributeFilter: this.#mixins.map((mixin => mixin.attributeName))
        });
    }

    disconnect(): void {
        this.#observer.disconnect();
    }

    #callback(mutationsList: MutationRecord[]) {
        mutationsList.forEach((mutation: MutationRecord) => {
            mutation.addedNodes.forEach((node: Node) => {
                if (node instanceof Element) {
                    this.#attachMatchingAttributeMixinsInSubtree(node);
                }
            });
            mutation.removedNodes.forEach((node: Node) => {
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

    #attachMatchingAttributeMixinsInSubtree(element: Element) {
        Array.from(element.attributes).forEach((attr) => {
            let matchingMixins = this.#mixins.filter(
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
        const {children} = element;
        while (childIndex < children.length) {
            const child = children.item(childIndex);
            if (child !== null) {
                this.#attachMatchingAttributeMixinsInSubtree(child);
            }
            childIndex++;
        }
    }

    #detachMatchingAttributeMixinsInSubtree(element: Element) {
        Array.from(element.attributes).forEach((attr) => {
            let matchingMixins = this.#mixins.filter(
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
        const {children} = element;
        while (childIndex < children.length) {
            const child = children.item(childIndex);
            if (child !== null) {
                this.#detachMatchingAttributeMixinsInSubtree(child);
            }
            childIndex++;
        }
    }
}

var AttributeMixinsObserver: AttributeMixinsObserverConstructor = AttributeMixinsObserverBase;