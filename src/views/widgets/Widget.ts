import { ReactiveChildElements } from "../../elements/Element";
import { camelToTrain } from "../../elements/Snippets";

export { WidgetFactoryConstructor };

export { widget };
export { Widget };
export { WidgetFactory };
export { widgets };

declare global {
    interface WidgetNameMap {}
}

interface WidgetFactoryConstructor {
    prototype: WidgetFactory;
    new(): WidgetFactory;
}

interface WidgetFactory {
    create(properties?: object): HTMLElement;
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
                apply: (target, thisArg, argumentsList: Parameters<WidgetFactory["create"]>) => {
                    const element = <HTMLElement>Reflect.apply(target, thisArg, argumentsList);
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
        return [""];
    }
}

var WidgetFactory: WidgetFactoryConstructor = WidgetFactoryBase;
var widgets: Map<string, WidgetFactory> = new Map();

interface WidgetInit<K extends keyof WidgetNameMap> {
    properties?: Parameters<WidgetNameMap[K]["create"]>[0],
    attributes?: {
        [name: string]: number | string | boolean
    },
    dataset?: {
        [property: string]: string | number | boolean
    },
    slotted?: {
        [slot: string]: Node | string | (Node | string)[] | NodeList | ReactiveChildElements
    } | (Node | string | (Node | string)[] | NodeList | ReactiveChildElements),
    listeners?: {
        [EventName in keyof HTMLElementEventMap]?: EventListenerOrEventListenerObject | [EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined]
    }
}

function widget<K extends keyof WidgetNameMap>(
    name: K, init?: WidgetInit<K>): ReturnType<WidgetNameMap[K]["create"]>;
function widget<K extends keyof WidgetNameMap>(
    name: K, init?: WidgetInit<K>): HTMLElement {
    const widget = widgets.get(name);
    if (widget) {
        if (init !== undefined) {
            const {properties, attributes, dataset, slotted, listeners} = init;
            const element = widget.create(properties);
            if (attributes) {
                Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
                    if (attributeValue !== undefined) {
                        if (typeof attributeValue === "boolean") {
                            element.toggleAttribute(camelToTrain(attributeName), attributeValue);
                        }
                        else {
                            element.setAttribute(camelToTrain(attributeName), String(attributeValue));
                        }
                    }
                });
            }
            if (dataset) {
                const {dataset: elementDataset} = element;
                Object.keys(dataset).forEach((datasetEntry_i) => {
                    elementDataset[datasetEntry_i] = String(dataset[datasetEntry_i]);
                });
            }
            if (slotted) {
                if (typeof slotted === "function" || Array.isArray(slotted) || slotted instanceof NodeList || typeof slotted === "string" || slotted instanceof Node) {
                    const slot = widget.slot(element, null);
                    if (slot) {
                        if (typeof slotted === "function") {
                            slotted(slot);
                        }
                        else if (typeof slotted === "object" && "length" in slotted) {
                            slot.append(...Array.from(slotted));
                        }
                        else {
                            slot.append(slotted);
                        }
                    }
                }
                else {
                    Object.entries(slotted).forEach(([slot_i, slotted]) => {
                        const slot = widget.slot(element, slot_i);
                        if (slot) {
                            if (typeof slotted === "function") {
                                slotted(slot);
                            }
                            else if (typeof slotted === "object" && "length" in slotted) {
                                slot.append(...Array.from(slotted));
                            }
                            else {
                                slot.append(slotted);
                            }
                        }
                    });
                }
            }
            if (listeners) {
                Object.entries(listeners).forEach(([name_i, listener_i]) => {
                    if (Array.isArray(listener_i)) {
                        element.addEventListener(name_i, listener_i[0], listener_i[1]);
                    }
                    else {
                        element.addEventListener(name_i, listener_i);
                    }
                });
            }
            return element;
        }
        else {
            return widget.create();
        }
    }
    throw new Error(`Unknown widget ${name}. The corresponding module might not be imported.`);
}

interface WidgetDecorator {
    (init: {
        name: string;
    }): <W extends WidgetFactoryConstructor>(widget: W) => W;
}

const Widget: WidgetDecorator = function(init: {
    name: string;
}) {
    return <W extends WidgetFactoryConstructor>(
        widget: W
    ) => {
        const {name} = init;
        widgets.set(
            name,
            new widget()
        );
        return widget;
    }
}