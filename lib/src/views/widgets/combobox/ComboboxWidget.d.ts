import { WidgetFactory } from "../Widget";
export { comboBoxWidget };
interface ComboBoxWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        name?: string;
        disabled?: boolean;
        multiselectable?: boolean;
    }): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
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
        "combobox": ComboBoxWidgetFactory;
    }
}
declare var comboBoxWidget: {
    "__#67@#template": HTMLElement;
    "__#67@#walker": TreeWalker;
    "__#67@#optionsObserver": MutationObserver;
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        name?: string;
        disabled?: boolean;
        multiselectable?: boolean;
    }): HTMLElement;
    slot(combobox: HTMLElement): HTMLElement;
    slottedCallback(combobox: HTMLElement, slot: HTMLElement, name: string | null): void;
    "__#67@#box"(combobox: HTMLElement): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
    selectedOption(combobox: HTMLElement): HTMLElement | null;
    "__#67@#getActiveOption"(combobox: HTMLElement): HTMLElement | null;
    "__#67@#value"(combobox: HTMLElement): HTMLElement;
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
    "__#67@#optionsMutationCallback"(mutationsList: MutationRecord[]): void;
    "__#67@#walkerNodeFilter"(node: Node): number;
    "__#67@#firstOption"(combobox: HTMLElement): HTMLElement | null;
    "__#67@#lastOption"(combobox: HTMLElement): HTMLElement | null;
    "__#67@#previousOption"(option: HTMLElement): HTMLElement | null;
    "__#67@#nextOption"(option: HTMLElement): HTMLElement | null;
    "__#67@#selectOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#67@#setSelectedOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#67@#positionBox"(combobox: HTMLElement): void;
    "__#67@#handleClickEvent"(event: MouseEvent): void;
    "__#67@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#67@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#67@#handleMouseOverEvent"(event: MouseEvent): void;
};
