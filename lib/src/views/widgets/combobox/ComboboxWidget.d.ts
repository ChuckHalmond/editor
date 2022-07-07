import { WidgetFactory } from "../Widget";
export { comboboxWidget };
interface ComboboxWidgetFactory extends WidgetFactory {
    create(properties?: {
        label?: string;
        name?: string;
        value?: string;
        disabled?: boolean;
        multiselectable?: boolean;
    }): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
    getLabel(combobox: HTMLElement): string;
    setLabel(combobox: HTMLElement, value: string): void;
    getValue(combobox: HTMLElement): string;
    setValue(combobox: HTMLElement, value: string): void;
    getName(combobox: HTMLElement): string;
    setName(combobox: HTMLElement, value: string): void;
    getExpanded(combobox: HTMLElement): boolean;
    setExpanded(combobox: HTMLElement, value: boolean): void;
    setDisabled(combobox: HTMLElement, value: boolean): void;
    getDisabled(combobox: HTMLElement): boolean;
    expand(combobox: HTMLElement): void;
    collapse(combobox: HTMLElement): void;
    toggle(combobox: HTMLElement, force?: boolean): void;
}
declare global {
    interface WidgetNameMap {
        "combobox": ComboboxWidgetFactory;
    }
}
declare var comboboxWidget: {
    "__#38457@#template": HTMLElement;
    "__#38457@#walker": TreeWalker;
    "__#38457@#optionsObserver": MutationObserver;
    create(init?: {
        label?: string;
        name?: string;
        value?: string;
        disabled?: boolean;
        multiselectable?: boolean;
    }): HTMLElement;
    slot(combobox: HTMLElement, name: string | null): HTMLElement;
    slottedCallback(combobox: HTMLElement, slot: HTMLElement): void;
    "__#38457@#box"(combobox: HTMLElement): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
    selectedOption(combobox: HTMLElement): HTMLElement | null;
    "__#38457@#getActiveOption"(combobox: HTMLElement): HTMLElement | null;
    "__#38457@#value"(combobox: HTMLElement): HTMLElement;
    "__#38457@#label"(combobox: HTMLElement): HTMLElement;
    getLabel(combobox: HTMLElement): string;
    setLabel(combobox: HTMLElement, value: string): void;
    getValue(combobox: HTMLElement): string;
    setValue(combobox: HTMLElement, value: string): void;
    getName(combobox: HTMLElement): string;
    setName(combobox: HTMLElement, value: string): void;
    getDisabled(combobox: HTMLElement): boolean;
    setDisabled(combobox: HTMLElement, value: boolean): void;
    setExpanded(combobox: HTMLElement, value: boolean): void;
    getExpanded(combobox: HTMLElement): boolean;
    setMultiSelectable(combobox: HTMLElement, value: boolean): void;
    getMultiSelectable(combobox: HTMLElement): boolean;
    expand(combobox: HTMLElement): void;
    collapse(combobox: HTMLElement): void;
    toggle(combobox: HTMLElement, force?: boolean): void;
    "__#38457@#walkerNodeFilter"(node: Node): number;
    "__#38457@#firstOption"(combobox: HTMLElement): HTMLElement | null;
    "__#38457@#lastOption"(combobox: HTMLElement): HTMLElement | null;
    "__#38457@#previousOption"(option: HTMLElement): HTMLElement | null;
    "__#38457@#nextOption"(option: HTMLElement): HTMLElement | null;
    "__#38457@#selectOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#38457@#setSelectedOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#38457@#positionBox"(combobox: HTMLElement): void;
    "__#38457@#handleClickEvent"(event: MouseEvent): void;
    "__#38457@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#38457@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#38457@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#38457@#handleSelectEvent"(event: Event): void;
    readonly slots: string[];
};
