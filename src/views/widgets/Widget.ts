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
    create(properties?: object): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement;
    get slots(): string[];
}

var slotsMap: WeakMap<HTMLElement, [WidgetFactory, HTMLElement][]> = new WeakMap();
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
                                const [widget, element] = slotRef_i;
                                const slottedCallback = (widget as any)["slottedCallback"];
                                if (typeof slottedCallback == "function") {
                                    slottedCallback(element, target);
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

class WidgetFactoryBase implements WidgetFactory {

    constructor() {
        const widget = <WidgetFactory>this;
        this.create = new Proxy(
            this.create, {
                apply: (target, thisArg, argumentsList) => {
                    const element = Reflect.apply(target, thisArg, argumentsList);
                    const targets = widget.slots.map(slot_i => {
                        return widget.slot(element, slot_i);
                    }).concat(element);
                    targets.forEach(target_i => {
                        slotsObserver.observe(target_i, {
                            childList: true
                        });
                        const slotReferences = slotsMap.get(target_i);
                        if (Array.isArray(slotReferences)) {
                            slotReferences.push([widget, element]);
                        }
                        else {
                            slotsMap.set(target_i, new Array([widget, element]));
                        }
                    });
                    return element;
                }
            }
        )
    }

    create(): HTMLElement {
        throw new Error();
    }

    setup(): void {}

    slot(root: HTMLElement): HTMLElement {
        return root;
    }

    get slots(): string[] {
        return [];
    }
}

var WidgetFactory: WidgetFactoryConstructor = WidgetFactoryBase;
var widgets: Map<string, WidgetFactory> = new Map();