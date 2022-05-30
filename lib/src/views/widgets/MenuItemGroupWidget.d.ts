export { menuItemGroupWidget };
declare global {
    interface WidgetNameMap {
        "menuitemgroup": typeof menuItemGroupWidget;
    }
}
declare var menuItemGroupWidget: Readonly<{
    template: HTMLDivElement;
    observer: MutationObserver;
    create(init?: {
        name?: string | undefined;
    } | undefined): HTMLDivElement;
    childNodesAddedCallback(item: HTMLElement, childNodes: NodeList): void;
    childNodesRemovedCallback(item: HTMLElement, childNodes: NodeList): void;
}>;
