import { WidgetFactory } from "../Widget";
export { comboBoxWidget };
interface ComboBoxWidgetFactory extends WidgetFactory {
    create(properties?: {
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
    "__#31966@#template": HTMLElement;
    "__#31966@#walker": TreeWalker;
    "__#31966@#optionsObserver": MutationObserver;
    create(init?: {
        name?: string | undefined;
        disabled?: boolean | undefined;
        multiselectable?: boolean | undefined;
    } | undefined): HTMLElement;
    slot(combobox: HTMLElement): HTMLElement;
    slottedCallback(combobox: HTMLElement, slot: HTMLElement, name: string | null): void;
    "__#31966@#box"(combobox: HTMLElement): HTMLElement;
    options(combobox: HTMLElement): HTMLElement[];
    selectedOption(combobox: HTMLElement): HTMLElement | null;
    "__#31966@#getActiveOption"(combobox: HTMLElement): HTMLElement | null;
    "__#31966@#value"(combobox: HTMLElement): HTMLElement;
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
    "__#31966@#optionsMutationCallback"(mutationsList: MutationRecord[]): void;
    "__#31966@#walkerNodeFilter"(node: Node): number;
    "__#31966@#firstOption"(combobox: HTMLElement): HTMLElement | null;
    "__#31966@#lastOption"(combobox: HTMLElement): HTMLElement | null;
    "__#31966@#previousOption"(option: HTMLElement): HTMLElement | null;
    "__#31966@#nextOption"(option: HTMLElement): HTMLElement | null;
    "__#31966@#selectOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#31966@#setSelectedOption"(combobox: HTMLElement, option: HTMLElement): void;
    "__#31966@#positionBox"(combobox: HTMLElement): void;
    "__#31966@#handleClickEvent"(event: MouseEvent): void;
    "__#31966@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#31966@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#31966@#handleMouseOverEvent"(event: MouseEvent): void;
};
