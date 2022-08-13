import { WidgetFactory } from "../Widget";
export { toolbarItemWidget };
declare type ToolBarItemType = "button" | "checkbox" | "radio" | "menubutton";
declare global {
    interface WidgetNameMap {
        "toolbaritem": ToolBarItemWidgetFactory;
    }
}
interface ToolBarItemWidgetFactory extends WidgetFactory {
    create(init?: {
        id?: string;
        type: ToolBarItemType;
        pressed?: boolean;
        label?: string;
        name?: string;
        keyshortcut?: string;
        value?: string;
        disabled?: boolean;
    }): HTMLElement;
    menu(item: HTMLElement): HTMLElement | null;
    getName(item: HTMLElement): string;
    setName(item: HTMLElement, value: string): void;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    setPressed(item: HTMLElement, value: boolean): void;
    getPressed(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    getValue(item: HTMLElement): string;
    setValue(item: HTMLElement, value: string): void;
    getType(item: HTMLElement): ToolBarItemType | null;
    setType(item: HTMLElement, value: ToolBarItemType): void;
}
declare var toolbarItemWidget: {
    "__#10@#template": HTMLElement;
    "__#10@#types": ToolBarItemType[];
    create(init?: {
        id?: string | undefined;
        type?: ToolBarItemType | undefined;
        pressed?: boolean | undefined;
        label?: string | undefined;
        name?: string | undefined;
        keyshortcut?: string | undefined;
        value?: string | undefined;
        disabled?: boolean | undefined;
    } | undefined): HTMLElement;
    slot(item: HTMLElement): HTMLElement | null;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    menu(item: HTMLElement): HTMLElement | null;
    setExpanded(item: HTMLElement, value: boolean): void;
    getExpanded(item: HTMLElement): boolean;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    getKeyShortcut(item: HTMLElement): string | null;
    setKeyShortcut(item: HTMLElement, value: string | null): void;
    toggle(item: HTMLElement, force?: boolean | undefined): void;
    expand(item: HTMLElement): void;
    collapse(item: HTMLElement): void;
    getType(item: HTMLElement): ToolBarItemType | null;
    setType(item: HTMLElement, type: ToolBarItemType): void;
    getValue(item: HTMLElement): string;
    setValue(item: HTMLElement, value: string): void;
    getTitle(item: HTMLElement): string;
    setTitle(item: HTMLElement, value: string): void;
    getName(item: HTMLElement): string;
    setName(item: HTMLElement, value: string): void;
    getPressed(item: HTMLElement): boolean;
    setPressed(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    setActive(item: HTMLElement, value: boolean): void;
    getActive(item: HTMLElement): boolean;
    "__#10@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#10@#handleClickEvent"(event: MouseEvent): void;
    "__#10@#positionMenu"(item: HTMLElement): void;
    "__#10@#label"(item: HTMLElement): HTMLElement;
};
