export { WidgetFactoryConstructor };

export { WidgetFactory };
export { widgets };

declare global {
    interface WidgetNameMap {}
}

interface WidgetFactoryConstructor {
    readonly prototype: WidgetFactory;
    new(): WidgetFactory;
}

interface WidgetFactory {
    create(init?: object): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    get slots(): string[];
}

var slotsMap: WeakMap<HTMLElement, [WidgetFactory, WeakRef<HTMLElement>][]> = new WeakMap();
var slotsObserver = new MutationObserver(
    (mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
            const {target, type} = mutation;
            if (target instanceof HTMLElement) {
                switch (type) {
                    case "childList": {
                        const slotReferences = slotsMap.get(target);
                        if (slotReferences) {
                            slotReferences.forEach(slotRef_i => {
                                const [widget, elementRef] = slotRef_i;
                                const slottedCallback = (widget as any)["slottedCallback"];
                                if (typeof slottedCallback == "function") {
                                    slottedCallback(elementRef.deref(), target);
                                }
                            });
                        }
                        break;
                    }
                }
            }
        });
    }
);

var elementsMap: WeakMap<HTMLElement, WidgetFactory> = new WeakMap();
var attributesObserver = new MutationObserver(
    (mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
            const {target, type} = mutation;
            if (target instanceof HTMLElement) {
                switch (type) {
                    case "attributes": {
                        const {attributeName, oldValue} = mutation;
                        const widget = elementsMap.get(target);
                        if (widget) {
                            const attributeChangedCallback = (widget as any)["attributeChangedCallback"];
                            if (typeof attributeChangedCallback == "function") {
                                attributeChangedCallback(target, attributeName, oldValue, target.getAttribute(attributeName!));
                            }
                        }
                        break;
                    }
                }
            }
        });
    }
);

class WidgetFactoryBase implements WidgetFactory {

    constructor() {
        const widget = <WidgetFactory>this;
        this.create = new Proxy(
            this.create, {
                apply: (target, thisArg, argumentsList) => {
                    const element = Reflect.apply(target, thisArg, argumentsList);
                    const {slots: slotNames} = widget;
                    const slots = (<(string | null)[]>[null])
                        .concat(slotNames)
                        .map(slot_i => widget.slot(element, slot_i));
                    slots.forEach(slot_i => {
                        if (slot_i) {
                            slotsObserver.observe(slot_i, {
                                childList: true
                            });
                            const slotReferences = slotsMap.get(slot_i);
                            if (Array.isArray(slotReferences)) {
                                slotReferences.push([widget, new WeakRef(element)]);
                            }
                            else {
                                slotsMap.set(slot_i, new Array([widget, new WeakRef(element)]));
                            }
                        }
                    });
                    const observedAttributes = (widget as any)["observedAttributes"];
                    if (Array.isArray(observedAttributes)) {
                        elementsMap.set(element, widget);
                        attributesObserver.observe(element, {
                            attributes: true,
                            attributeFilter: observedAttributes,
                            attributeOldValue: true
                        });
                    }
                    return element;
                }
            }
        );
    }

    create(): HTMLElement {
        throw new Error(`create method is not implemented`);
    }

    slot(root: HTMLElement): HTMLElement {
        return root;
    }

    get slots(): string[] {
        return [];
    }
}

var WidgetFactory: WidgetFactoryConstructor = WidgetFactoryBase;
var widgets: Map<string, WidgetFactory> = new Map();