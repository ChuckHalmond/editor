import { WidgetFactory } from "./Widget";
export { separatorWidget };
declare global {
    interface WidgetNameMap {
        "separator": SeparatorWidgetFactory;
    }
}
interface SeparatorWidgetFactory extends WidgetFactory {
}
declare var separatorWidget: {
    "__#47@#template": HTMLElement;
    create(): HTMLElement;
    slot(root: HTMLElement, name: string | null): HTMLElement | null;
    readonly slots: string[];
};
