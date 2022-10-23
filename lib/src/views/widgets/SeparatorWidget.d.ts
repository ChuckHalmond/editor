import { WidgetFactory } from "./Widget";
export { separatorWidget };
declare global {
    interface WidgetNameMap {
        "separator": SeparatorWidgetFactory;
    }
}
interface SeparatorWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}
declare var separatorWidget: {
    "__#36@#template": HTMLElement;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
};
