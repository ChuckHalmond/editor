declare global {
    interface WidgetNameMap {
        "menubar": typeof menubarWidget;
    }
}
declare var menubarWidget: Readonly<{
    template: HTMLMenuElement;
    walker: TreeWalker;
    create(): HTMLMenuElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    getActiveItem(menubar: HTMLElement): HTMLElement | null;
    firstItem(menubar: HTMLElement): HTMLElement | null;
    lastItem(menubar: HTMLElement): HTMLElement | null;
    previousItem(item: HTMLElement): HTMLElement | null;
    nextItem(item: HTMLElement): HTMLElement | null;
    firstChildItem(item: HTMLElement): HTMLElement | null;
    setActiveItem(menubar: HTMLElement, item: HTMLElement | null): void;
    isClosestMenu(menubar: HTMLElement, target: Element): boolean;
    nearestItem(menubar: HTMLElement, target: Element): HTMLElement | null;
    handleFocusInEvent(event: FocusEvent): void;
    handleFocusOutEvent(event: FocusEvent): void;
    handleMouseOverEvent(event: MouseEvent): void;
    handleClickEvent(event: MouseEvent): void;
    handleKeyDownEvent(event: KeyboardEvent): void;
    handleTriggerEvent(event: Event): void;
}>;
export {};
