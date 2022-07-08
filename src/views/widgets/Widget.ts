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
}

var slotsMap: WeakMap<HTMLElement, {
    widget: WidgetFactory,
    element: WeakRef<HTMLElement>;
    slot: string | null;
}[]> = new WeakMap();
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
                                const {widget, element, slot} = slotRef_i;
                                const slottedCallback = (widget as any)["slottedCallback"];
                                if (typeof slottedCallback == "function") {
                                    slottedCallback(element.deref(), target, slot);
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

var widgetsMap: WeakMap<HTMLElement, WidgetFactory> = new WeakMap();
var attributesObserver = new MutationObserver(
    (mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
            const {target, type} = mutation;
            if (target instanceof HTMLElement) {
                switch (type) {
                    case "attributes": {
                        const {attributeName, oldValue} = mutation;
                        const widget = widgetsMap.get(target);
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
                    const observedSlots = <(string | null)[]>(widget as any)["observedSlots"];
                    if (Array.isArray(observedSlots)) {
                        const slots = observedSlots
                            .map(slotName_i => {
                                return {
                                    slotName: slotName_i,
                                    slotElement: widget.slot(element, slotName_i)
                                };
                            });
                        slots.forEach(slot_i => {
                            const {slotElement, slotName} = slot_i;
                            if (slotElement) {
                                slotsObserver.observe(slotElement, {
                                    childList: true
                                });
                                const slotReferences = slotsMap.get(slotElement);
                                const slotReference = {widget, element: new WeakRef(element), slot: slotName};
                                if (Array.isArray(slotReferences)) {
                                    slotReferences.push(slotReference);
                                }
                                else {
                                    slotsMap.set(slotElement, new Array(slotReference));
                                }
                            }
                        });
                    }
                    const observedAttributes = (widget as any)["observedAttributes"];
                    if (Array.isArray(observedAttributes)) {
                        widgetsMap.set(element, widget);
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

    slot(): HTMLElement | null {
        return null;
    }

    get observedSlots(): string[] {
        return ["_"];
    }
}

var WidgetFactory: WidgetFactoryConstructor = WidgetFactoryBase;
var widgets: Map<string, WidgetFactory> = new Map();