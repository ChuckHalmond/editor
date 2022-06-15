import { WidgetFactory } from "../Widget";
export { menuItemGroupWidget };
declare global {
    interface WidgetNameMap {
        "menuitemgroup": MenuItemGroupWidgetFactory;
    }
}
interface MenuItemGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}
declare var menuItemGroupWidget: {
    "__#51@#template": HTMLElement;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
