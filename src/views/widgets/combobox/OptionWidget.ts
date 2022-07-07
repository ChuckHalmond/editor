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

    create(init?: {
        selected?: boolean;
        label?: string;
        name?: string;
        value?: string;
        disabled?: boolean;
    }): HTMLElement {
        const option = <HTMLElement>this.#template.cloneNode(true);
        if (init !== void 0) {
            const {label, name, value, disabled} = init;
            let {selected} = init;
            selected = selected ?? false;
            if (selected !== void 0) {
                this.setSelected(option, selected);
            }
            if (label !== void 0) {
                this.setLabel(option, label);
            }
            if (name !== void 0) {
                this.setName(option, name);
            }
            if (value !== void 0) {
                this.setValue(option, value);
            }
            if (disabled !== void 0) {
                this.setDisabled(option, disabled);
            }
        }
        return option;
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
        return JSON.parse(option.getAttribute("aria-selected") ?? false.toString());
    }

    setSelected(option: HTMLElement, value: boolean): void {
        option.setAttribute("aria-selected", value.toString());
        option.dispatchEvent(new Event("select", {bubbles: true}));
    }

    getDisabled(option: HTMLElement): boolean {
        return option.hasAttribute("aria-disabled");
    }

    setDisabled(option: HTMLElement, value: boolean): void {
        option.toggleAttribute("aria-disabled", value);
    }
}));