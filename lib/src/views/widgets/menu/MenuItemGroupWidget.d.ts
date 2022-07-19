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
    "__#19001@#template": HTMLElement;
    create(): HTMLElement;
    slot(group: HTMLElement): HTMLElement | null;
};
