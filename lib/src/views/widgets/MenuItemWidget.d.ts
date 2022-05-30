export { menuItemWidget };
declare type MenuItemType = "button" | "radio" | "checkbox" | "menu" | "submenu";
declare global {
    interface WidgetNameMap {
        "menuitem": typeof menuItemWidget;
    }
}
declare var menuItemWidget: Readonly<{
    template: HTMLButtonElement;
    observer: MutationObserver;
    create(init?: {
        checked?: boolean | undefined;
        type?: MenuItemType | undefined;
        label?: string | undefined;
        name?: string | undefined;
        keyshortcut?: string | undefined;
    } | undefined): HTMLButtonElement;
    handleKeyDownEvent(event: KeyboardEvent): void;
    attributeChangedCallback(item: HTMLElement, name: string, oldValue: string | null, newValue: string | null): void;
    childNodesAddedCallback(item: HTMLElement, childNodes: NodeList): void;
    childNodesRemovedCallback(item: HTMLElement, childNodes: NodeList): void;
    label(item: HTMLElement): HTMLElement;
    menu(item: HTMLElement): HTMLElement;
    getKeyShortcut(item: HTMLElement): string | null;
    setKeyShortcut(item: HTMLElement, value: string | null): void;
    getLabel(item: HTMLElement): string;
    setLabel(item: HTMLElement, value: string): void;
    getType(item: HTMLElement): MenuItemType;
    setType(item: HTMLElement, value: MenuItemType): void;
    getActive(item: HTMLElement): boolean;
    setActive(item: HTMLElement, value: boolean): void;
    getName(item: HTMLElement): string;
    setName(item: HTMLElement, value: string): void;
    getHasPopup(item: HTMLElement): boolean;
    setHasPopup(item: HTMLElement, value: boolean): void;
    setChecked(item: HTMLElement, value: boolean): void;
    getChecked(item: HTMLElement): boolean;
    setExpanded(item: HTMLElement, value: boolean): void;
    getExpanded(item: HTMLElement): boolean;
    trigger(item: HTMLElement): void;
    toggle(item: HTMLElement, force?: boolean | undefined): void;
    expand(item: HTMLElement): void;
    collapse(item: HTMLElement): void;
    positionMenu(item: HTMLElement): void;
}>;
