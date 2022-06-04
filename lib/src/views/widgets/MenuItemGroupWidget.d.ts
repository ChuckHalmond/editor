export { menuItemGroupWidget };
declare global {
    interface WidgetNameMap {
        "menuitemgroup": typeof menuItemGroupWidget;
    }
}
