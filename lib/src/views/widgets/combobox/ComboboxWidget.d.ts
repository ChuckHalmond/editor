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
    "__#69@#template": HTMLElement;
    "__#69@#walker": TreeWalker;
    "__#69@#optionsObserver": MutationObserver;
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
    "__#69@#box"(combobox: HTMLElement): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
    selectedOption(combobox: HTMLElement): HTMLElement | null;
    "__#69@#getActiveOption"(combobox: HTMLElement): HTMLElement | null;
    "__#69@#value"(combobox: HTMLElement): HTMLElement;
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
    "__#69@#optionsMutationCallback"(mutationsList: MutationRecord[]): void;
    "__#69@#walkerNodeFilter"(node: Node): number;
    "__#69@#firstOption"(combobox: HTMLElement): HTMLElement | null;
    "__#69@#lastOption"(combobox: HTMLElement): HTMLElement | null;
    "__#69@#previousOption"(option: HTMLElement): HTMLElement | null;
    "__#69@#nextOption"(option: HTMLElement): HTMLElement | null;
    "__#69@#selectOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#69@#setSelectedOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#69@#positionBox"(combobox: HTMLElement): void;
    "__#69@#handleClickEvent"(event: MouseEvent): void;
    "__#69@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#69@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#69@#handleMouseOverEvent"(event: MouseEvent): void;
};
