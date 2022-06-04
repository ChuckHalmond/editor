declare global {
    interface WidgetNameMap {
        "menubar": typeof menubarWidget;
    }
}
declare var menubarWidget: {
    "__#14252@#template": HTMLDivElement;
    "__#14252@#walker": TreeWalker;
    create(): HTMLElement;
    slot(menubar: HTMLElement): HTMLElement;
    setExpanded(menubar: HTMLElement, value: boolean): void;
    getExpanded(menubar: HTMLElement): boolean;
    getActiveItem(menubar: HTMLElement): HTMLElement | null;
    firstItem(menubar: HTMLElement): HTMLElement | null;
    lastItem(menubar: HTMLElement): HTMLElement | null;
    previousItem(item: HTMLElement): HTMLElement | null;
    nextItem(item: HTMLElement): HTMLElement | null;
    firstChildItem(item: HTMLElement): HTMLElement | null;
    isClosestMenu(menubar: HTMLElement, target: HTMLElement): boolean;
    nearestItem(menubar: HTMLElement, target: HTMLElement): HTMLElement | null;
    "__#14252@#handleFocusInEvent"(event: FocusEvent): void;
    "__#14252@#handleFocusOutEvent"(event: FocusEvent): void;
    "__#14252@#handleMouseOverEvent"(event: MouseEvent): void;
    "__#14252@#handleClickEvent"(event: MouseEvent): void;
    "__#14252@#handleKeyDownEvent"(event: KeyboardEvent): void;
    "__#14252@#handleTriggerEvent"(event: Event): void;
    readonly slots: string[];
};
export {};
