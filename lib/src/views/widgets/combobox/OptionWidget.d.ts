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
        "option": OptionWidgetFactory;
    }
}
declare var optionWidget: {
    "__#59@#template": HTMLElement;
    create(properties?: {
        selected?: boolean | undefined;
        label?: string | undefined;
        name?: string | undefined;
        value?: string | undefined;
        disabled?: boolean | undefined;
    } | undefined): HTMLElement;
    readonly observedAttributes: string[];
    attributeChangedCallback(option: HTMLElement, name: string, oldValue: string, newValue: string): void;
    "__#59@#label"(option: HTMLElement): HTMLElement;
    getLabel(option: HTMLElement): string;
    setLabel(option: HTMLElement, value: string): void;
    getValue(option: HTMLElement): string;
    setValue(option: HTMLElement, value: string): void;
    getName(option: HTMLElement): string;
    setName(option: HTMLElement, value: string): void;
    getSelected(option: HTMLElement): boolean;
    setSelected(option: HTMLElement, value: boolean): void;
    getDisabled(option: HTMLElement): boolean;
    setDisabled(option: HTMLElement, value: boolean): void;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
