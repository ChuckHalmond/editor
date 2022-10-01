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
    "__#57@#template": HTMLElement;
    create(): HTMLElement;
    slot(head: HTMLElement): HTMLElement;
};
