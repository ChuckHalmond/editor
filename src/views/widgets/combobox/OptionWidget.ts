import { element, Widget } from "../../../elements/Element";
import { WidgetFactory } from "../Widget";

export { optionWidget };

interface OptionWidgetFactory extends WidgetFactory {
    create(properties?: {
        label?: string;
        name?: string;
        value?: string;
        selected?: boolean;
        disabled?: boolean;
    }): HTMLElement;
    getLabel(option: HTMLElement): string;
    setLabel(option: HTMLElement, value: string): void;
    getValue(option: HTMLElement): string;
    setValue(option: HTMLElement, value: string): void;
    getName(option: HTMLElement): string;
    setName(option: HTMLElement, value: string): void;
    getSelected(option: HTMLElement): boolean;
    setSelected(option: HTMLElement, value: boolean): void;
    setDisabled(option: HTMLElement, value: boolean): void;
    getDisabled(option: HTMLElement): boolean;
}

declare global {
    interface WidgetNameMap {
        "option": OptionWidgetFactory
    }
}

var optionWidget = new(
Widget({
    name: "option"
})(
class OptionWidgetFactoryBase extends WidgetFactory implements OptionWidgetFactory {
    #template: HTMLElement;

    constructor() {
        super();
        this.#template = element("span", {
            attributes: {
                class: "option",
                role: "option",
                tabindex: -1
            },
            children: [
                element("span", {
                    attributes: {
                        class: "label"
                    }
                })
            ]
        });
    }

    create(properties?: {
        selected?: boolean;
        label?: string;
        name?: string;
        value?: string;
        disabled?: boolean;
    }): HTMLElement {
        const option = <HTMLElement>this.#template.cloneNode(true);
        if (properties !== undefined) {
            const {label, name, value, disabled} = properties;
            let {selected} = properties;
            selected = selected ?? false;
            if (selected !== undefined) {
                this.setSelected(option, selected);
            }
            if (label !== undefined) {
                this.setLabel(option, label);
            }
            if (name !== undefined) {
                this.setName(option, name);
            }
            if (value !== undefined) {
                this.setValue(option, value);
            }
            if (disabled !== undefined) {
                this.setDisabled(option, disabled);
            }
        }
        return option;
    }

    get observedAttributes() {
        return ["aria-selected"];
    }

    attributeChangedCallback(option: HTMLElement, name: string, oldValue: string, newValue: string) {
        switch (name) {
            case "aria-selected": {
                if (JSON.parse(newValue) === true) {
                    option.dispatchEvent(new Event("select", {bubbles: true}));
                }
            }
        }
    }

    #label(option: HTMLElement): HTMLElement {
        return option.querySelector<HTMLElement>(":scope > .label")!;
    }

    getLabel(option: HTMLElement): string {
        return this.#label(option).textContent ?? "";
    }

    setLabel(option: HTMLElement, value: string): void {
        this.#label(option).textContent = value;
    }

    getValue(option: HTMLElement): string {
        return option.getAttribute("value") ?? "";
    }

    setValue(option: HTMLElement, value: string): void {
        option.setAttribute("value", value);
    }
    
    getName(option: HTMLElement): string {
        return option.getAttribute("name") ?? "";
    }

    setName(option: HTMLElement, value: string): void {
        option.setAttribute("name", value);
    }

    getSelected(option: HTMLElement): boolean {
        return JSON.parse(option.getAttribute("aria-selected") ?? String(false));
    }

    setSelected(option: HTMLElement, value: boolean): void {
        option.setAttribute("aria-selected", String(value));
    }

    getDisabled(option: HTMLElement): boolean {
        return option.hasAttribute("aria-disabled");
    }

    setDisabled(option: HTMLElement, value: boolean): void {
        option.toggleAttribute("aria-disabled", value);
    }
}));