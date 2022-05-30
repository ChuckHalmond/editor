export { menuWidget };
declare global {
    interface WidgetNameMap {
        "menu": typeof menuWidget;
    }
}
declare var menuWidget: Readonly<{
    template: HTMLMenuElement;
    walker: TreeWalker;
    create(init?: {
        name?: string | undefined;
    } | undefined): HTMLMenuElement;
    walkerNodeFilter(node: Node): number;
    getContextual(menu: HTMLElement): boolean;
    setContextual(menu: HTMLElement, value: boolean): void;
    getName(menu: HTMLElement): string;
    setName(menu: HTMLElement, value: string): void;
    collapseSubmenus(menu: HTMLElement): void;
    isClosestMenu(menu: HTMLElement, target: Element): boolean;
    nearestItem(menu: HTMLElement, target: Element): HTMLElement | null;
    firstItem(menu: HTMLElement): HTMLElement | null;
    lastItem(menu: HTMLElement): HTMLElement | null;
    previousItem(item: HTMLElement): HTMLElement | null;
    nextItem(item: HTMLElement): HTMLElement | null;
    firstChildItem(item: HTMLElement): HTMLElement | null;
    getActiveItem(menu: HTMLMenuElement): HTMLElement | null;
    setActiveItem(menu: HTMLMenuElement, item: HTMLElement | null): void;
    handleClickEvent(event: MouseEvent): void;
    handleFocusInEvent(event: FocusEvent): void;
    handleFocusOutEvent(event: FocusEvent): void;
    setItemTimeout(item: HTMLElement, delay?: number | undefined): Promise<void>;
    clearItemTimeout(item: HTMLElement): void;
    handleKeyDownEvent(event: KeyboardEvent): void;
    handleMouseOutEvent(event: MouseEvent): void;
    handleMouseOverEvent(event: MouseEvent): void;
    handleTriggerEvent(event: Event): void;
}>;
