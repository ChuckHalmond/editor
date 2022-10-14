import { WidgetFactory } from "../Widget";
export { gridHeadWidget };
declare global {
    interface WidgetNameMap {
        "gridhead": GridHeadWidgetFactory;
    }
}
interface GridHeadWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}
declare var gridHeadWidget: {
    "__#55@#template": HTMLElement;
    create(): HTMLElement;
    slot(head: HTMLElement): HTMLElement;
};
