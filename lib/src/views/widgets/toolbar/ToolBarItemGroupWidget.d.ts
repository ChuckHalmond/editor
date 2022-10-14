import { WidgetFactory } from "../Widget";
export { toolbarItemGroupWidget };
declare global {
    interface WidgetNameMap {
        "toolbaritemgroup": MenuItemGroupWidgetFactory;
    }
}
interface MenuItemGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}
declare var toolbarItemGroupWidget: {
    "__#48@#template": HTMLElement;
    create(): HTMLElement;
    slot(group: HTMLElement): HTMLElement;
};
