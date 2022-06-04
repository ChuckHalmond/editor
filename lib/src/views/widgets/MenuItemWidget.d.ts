import { WidgetSlotsObserver } from "./Widget";
export { menuItemWidget };
declare type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";
declare global {
    interface WidgetNameMap {
        "menuitem": typeof menuItemWidget;
    }
}
declare var menuItemWidget: {
    "__#17621@#iconPartTemplate": HTMLSpanElement;
    "__#17621@#arrowPartTemplate": HTMLSpanElement;
    "__#17621@#widgetTemplate": HTMLButtonElement;
    "__#17621@#slotsObserver": WidgetSlotsObserver;
    create(init?: {
        type: MenuItemType;
        checked?: boolean | undefined;
        label?: string | undefined;
        name?: string | undefined;
        keyshortcut?: string | undefined;
        value?: string | undefined;
    } | undefined): HTMLButtonElement;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    "__#17621@#label"(item: HTMLElement): HTMLElement;
    getMenu(item: HTMLElement): HTMLElement | null;
    setMenu(item: HTMLElement, menu: HTMLElement | null): void;
    getKeyShortcut(item: HTMLElement): string | null;
    setKeyShortcut(item: HTMLElement, value: string | null): void;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    getType(item: HTMLElement): string | null;
    setType(item: HTMLElement, type: MenuItemType): void;
    getValue(item: HTMLElement): string;
    setValue(item: HTMLElement, value: string): void;
    getName(item: HTMLElement): string;
    setName(item: HTMLElement, value: string): void;
    getChecked(item: HTMLElement): any;
    setChecked(item: HTMLElement, value: boolean): void;
    setDisabled(item: HTMLElement, value: boolean): void;
    getDisabled(item: HTMLElement): boolean;
    setExpanded(item: HTMLElement, value: boolean): void;
    getExpanded(item: HTMLElement): boolean;
    trigger(item: HTMLElement): void;
    toggle(item: HTMLElement, force?: boolean | undefined): void;
    expand(item: HTMLElement): void;
    collapse(item: HTMLElement): void;
    "__#17621@#positionMenu"(item: HTMLElement): void;
    "__#17621@#types": string[];
    "__#17621@#typesFeatures": {
        button: {
            role: string;
            hasIcon: boolean;
            hasArrow: boolean;
        };
        checkbox: {
            role: string;
            hasIcon: boolean;
            hasArrow: boolean;
        };
        radio: {
            role: string;
            hasIcon: boolean;
            hasArrow: boolean;
        };
        menu: {
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
    slot(root: HTMLElement, name: string | null): HTMLElement;
    readonly slots: string[];
};
