import { camelToTrain } from "../../elements/Snippets";
export { widget };
export { Widget };
export { WidgetFactory };
export { widgets };
var slotsMap = new WeakMap();
var slotsObserver = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        const { target, type } = mutation;
        if (target instanceof HTMLElement) {
            switch (type) {
                case "childList": {
                    const slotReferences = slotsMap.get(target);
                    if (slotReferences) {
                        slotReferences.forEach(slotRef_i => {
                            const { widget, element, slot } = slotRef_i;
                            const slottedCallback = widget["slottedCallback"];
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
});
var widgetsMap = new WeakMap();
var attributesObserver = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        const { target, type } = mutation;
        if (target instanceof HTMLElement) {
            switch (type) {
                case "attributes": {
                    const { attributeName, oldValue } = mutation;
                    const widget = widgetsMap.get(target);
                    if (widget) {
                        const attributeChangedCallback = widget["attributeChangedCallback"];
                        if (typeof attributeChangedCallback == "function") {
                            attributeChangedCallback(target, attributeName, oldValue, target.getAttribute(attributeName));
                        }
                    }
                    break;
                }
            }
        }
    });
});
class WidgetFactoryBase {
    constructor() {
        const widget = this;
        this.create = new Proxy(this.create, {
            apply: (target, thisArg, argumentsList) => {
                const element = Reflect.apply(target, thisArg, argumentsList);
                const observedSlots = widget["observedSlots"];
                if (Array.isArray(observedSlots)) {
                    const slots = observedSlots
                        .map(slotName_i => {
                        return {
                            slotName: slotName_i,
                            slotElement: widget.slot(element, slotName_i)
                        };
                    });
                    slots.forEach(slot_i => {
                        const { slotElement, slotName } = slot_i;
                        if (slotElement) {
                            slotsObserver.observe(slotElement, {
                                childList: true
                            });
                            const slotReferences = slotsMap.get(slotElement);
                            const slotReference = { widget, element: new WeakRef(element), slot: slotName };
                            if (Array.isArray(slotReferences)) {
                                slotReferences.push(slotReference);
                            }
                            else {
                                slotsMap.set(slotElement, new Array(slotReference));
                            }
                        }
                    });
                }
                const observedAttributes = widget["observedAttributes"];
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
        });
    }
    create() {
        throw new Error(`create method is not implemented`);
    }
    slot() {
        return null;
    }
    get observedSlots() {
        return [""];
    }
}
var WidgetFactory = WidgetFactoryBase;
var widgets = new Map();
function widget(name, init) {
    const widget = widgets.get(name);
    if (widget) {
        if (init !== undefined) {
            const { properties, attributes, dataset, slotted, listeners } = init;
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
                const { dataset: elementDataset } = element;
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
const Widget = function (init) {
    return (widget) => {
        const { name } = init;
        widgets.set(name, new widget());
        return widget;
    };
};
//# sourceMappingURL=Widget.js.map