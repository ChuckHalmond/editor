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
    "__#64@#template": HTMLElement;
    "__#64@#walker": TreeWalker;
    "__#64@#optionsObserver": MutationObserver;
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
    "__#64@#box"(combobox: HTMLElement): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
    selectedOption(combobox: HTMLElement): HTMLElement | null;
    "__#64@#getActiveOption"(combobox: HTMLElement): HTMLElement | null;
    "__#64@#value"(combobox: HTMLElement): HTMLElement;
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
    "__#64@#optionsMutationCallback"(mutationsList: MutationRecord[]): void;
    "__#64@#walkerNodeFilter"(node: Node): number;
    "__#64@#firstOption"(combobox: HTMLElement): HTMLElement | null;
    "__#64@#lastOption"(combobox: HTMLElement): HTMLElement | null;
    "__#64@#previousOption"(option: HTMLElement): HTMLElement | null;
    "__#64@#nextOption"(option: HTMLElement): HTMLElement | null;
    "__#64@#selectOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#64@#setSelectedOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#64@#positionBox"(combobox: HTMLElement): void;
    "__#64@#handleClickEvent"(event: MouseEvent): void;
    "__#64@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#64@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#64@#handleMouseOverEvent"(event: MouseEvent): void;
};
