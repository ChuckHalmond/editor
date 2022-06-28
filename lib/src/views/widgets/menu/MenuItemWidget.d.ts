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
    "__#47@#iconPartTemplate": HTMLElement;
    "__#47@#arrowPartTemplate": HTMLElement;
    "__#47@#keyshortcutsPartTemplate": HTMLElement;
    "__#47@#template": HTMLElement;
    "__#47@#types": MenuItemType[];
    "__#47@#typesFeatures": {
        button: {
            role: string;
            hasIcon: boolean;
            hasArrow: boolean;
        };
        menu: {
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
        type: MenuItemType;
        checked?: boolean | undefined;
        label?: string | undefined;
        name?: string | undefined;
        keyshortcut?: string | undefined;
        value?: string | undefined;
        disabled?: boolean | undefined;
    } | undefined): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    "__#47@#label"(item: HTMLElement): HTMLElement;
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
    toggle(item: HTMLElement, force?: boolean | undefined): void;
    expand(item: HTMLElement): void;
    collapse(item: HTMLElement): void;
    "__#47@#handleClickEvent"(event: MouseEvent): void;
    "__#47@#positionMenu"(item: HTMLElement): void;
    readonly slots: string[];
};
