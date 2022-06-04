export { menuWidget };
declare global {
    interface WidgetNameMap {
        "menu": typeof menuWidget;
    }
}