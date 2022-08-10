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
    "__#11614@#template": HTMLElement;
    "__#11614@#walker": TreeWalker;
    "__#11614@#optionsObserver": MutationObserver;
    create(properties?: {
        id?: string | undefined;
        classList?: string[] | undefined;
        tabIndex?: number | undefined;
        name?: string | undefined;
        disabled?: boolean | undefined;
        multiselectable?: boolean | undefined;
    } | undefined): HTMLElement;
    slot(combobox: HTMLElement): HTMLElement;
    slottedCallback(combobox: HTMLElement, slot: HTMLElement, name: string | null): void;
    "__#11614@#box"(combobox: HTMLElement): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
    selectedOption(combobox: HTMLElement): HTMLElement | null;
    "__#11614@#getActiveOption"(combobox: HTMLElement): HTMLElement | null;
    "__#11614@#value"(combobox: HTMLElement): HTMLElement;
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
    toggle(combobox: HTMLElement, force?: boolean | undefined): void;
    "__#11614@#optionsMutationCallback"(mutationsList: MutationRecord[]): void;
    "__#11614@#walkerNodeFilter"(node: Node): number;
    "__#11614@#firstOption"(combobox: HTMLElement): HTMLElement | null;
    "__#11614@#lastOption"(combobox: HTMLElement): HTMLElement | null;
    "__#11614@#previousOption"(option: HTMLElement): HTMLElement | null;
    "__#11614@#nextOption"(option: HTMLElement): HTMLElement | null;
    "__#11614@#selectOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#11614@#setSelectedOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#11614@#positionBox"(combobox: HTMLElement): void;
    "__#11614@#handleClickEvent"(event: MouseEvent): void;
    "__#11614@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#11614@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#11614@#handleMouseOverEvent"(event: MouseEvent): void;
};
