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
    "__#60@#template": HTMLElement;
    "__#60@#walker": TreeWalker;
    "__#60@#optionsObserver": MutationObserver;
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
    "__#60@#box"(combobox: HTMLElement): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
    selectedOption(combobox: HTMLElement): HTMLElement | null;
    "__#60@#getActiveOption"(combobox: HTMLElement): HTMLElement | null;
    "__#60@#value"(combobox: HTMLElement): HTMLElement;
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
    "__#60@#optionsMutationCallback"(mutationsList: MutationRecord[]): void;
    "__#60@#walkerNodeFilter"(node: Node): number;
    "__#60@#firstOption"(combobox: HTMLElement): HTMLElement | null;
    "__#60@#lastOption"(combobox: HTMLElement): HTMLElement | null;
    "__#60@#previousOption"(option: HTMLElement): HTMLElement | null;
    "__#60@#nextOption"(option: HTMLElement): HTMLElement | null;
    "__#60@#selectOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#60@#setSelectedOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#60@#positionBox"(combobox: HTMLElement): void;
    "__#60@#handleClickEvent"(event: MouseEvent): void;
    "__#60@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#60@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#60@#handleMouseOverEvent"(event: MouseEvent): void;
};
