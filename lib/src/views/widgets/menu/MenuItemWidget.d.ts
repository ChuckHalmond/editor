import { WidgetFactory } from "../Widget";
export { menuItemWidget };
declare type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";
declare global {
    interface WidgetNameMap {
        "menuitem": MenuItemWidgetFactory;
    }
}
interface MenuItemWidgetFactory extends WidgetFactory {
    create(properties?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        type?: MenuItemType;
        checked?: boolean;
        label?: string;
        name?: string;
        keyshortcut?: string;
        value?: string;
        disabled?: boolean;
    }): HTMLElement;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    getMenu(item: HTMLElement): HTMLElement | null;
    getKeyShortcut(item: HTMLElement): string | null;
    setKeyShortcut(item: HTMLElement, value: string | null): void;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    getType(item: HTMLElement): MenuItemType | null;
    setType(item: HTMLElement, type: MenuItemType): void;
    getValue(item: HTMLElement): string;
    setValue(item: HTMLElement, value: string): void;
    getName(item: HTMLElement): string;
    setName(item: HTMLElement, value: string): void;
    getChecked(item: HTMLElement): boolean;
    setChecked(item: HTMLElement, value: boolean): void;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setExpanded(item: HTMLElement, value: boolean): void;
    getExpanded(item: HTMLElement): boolean;
    toggle(item: HTMLElement, force?: boolean): void;
    expand(item: HTMLElement): void;
    collapse(item: HTMLElement): void;
}
declare var menuItemWidget: {
    "__#15@#iconPartTemplate": HTMLElement;
    "__#15@#arrowPartTemplate": HTMLElement;
    "__#15@#keyshortcutsPartTemplate": HTMLElement;
    "__#15@#template": HTMLElement;
    "__#15@#types": MenuItemType[];
    "__#15@#typesFeatures": {
        menu: {
            role: string;
            hasIcon: boolean;
            hasArrow: boolean;
        };
        button: {
            role: string;
            hasIcon: boolean;
            hasArrow: boolean;
        };
        radio: {
            role: string;
            hasIcon: boolean;
            hasArrow: boolean;
        };
        checkbox: {
            role: string;
            hasIcon: boolean;
            hasArrow: boolean;
        };
        submenu: {
            role: string;
            hasIcon: boolean;
            hasArrow: boolean;
        };
    };
    create(init?: {
        id?: string;
        classList?: string[];
        tabIndex?: number;
        type: MenuItemType;
        checked?: boolean;
        label?: string;
        name?: string;
        keyshortcut?: string;
        value?: string;
        disabled?: boolean;
    }): HTMLElement;
    slot(item: HTMLElement): HTMLElement | null;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    "__#15@#label"(item: HTMLElement): HTMLElement;
    getMenu(item: HTMLElement): HTMLElement | null;
    getKeyShortcut(item: HTMLElement): string | null;
    setKeyShortcut(item: HTMLElement, value: string | null): void;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    getType(item: HTMLElement): MenuItemType | null;
    setType(item: HTMLElement, type: MenuItemType): void;
    getValue(item: HTMLElement): string;
    setValue(item: HTMLElement, value: string): void;
    getName(item: HTMLElement): string;
    setName(item: HTMLElement, value: string): void;
    getChecked(item: HTMLElement): boolean;
    setChecked(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setDisabled(item: HTMLElement, value: boolean): void;
    setExpanded(item: HTMLElement, value: boolean): void;
    getExpanded(item: HTMLElement): boolean;
    toggle(item: HTMLElement, force?: boolean): void;
    expand(item: HTMLElement): void;
    collapse(item: HTMLElement): void;
    "__#15@#handleClickEvent"(event: MouseEvent): void;
    "__#15@#positionMenu"(item: HTMLElement): void;
};
