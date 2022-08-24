import { WidgetFactory } from "../Widget";
export { gridBodyWidget };
declare global {
    interface WidgetNameMap {
        "gridbody": GridBodyWidgetFactory;
    }
}
interface GridBodyWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}
declare var gridBodyWidget: {
    "__#65@#template": HTMLElement;
    create(): HTMLElement;
    slot(body: HTMLElement): HTMLElement;
    slottedCallback(body: HTMLElement, slot: HTMLElement): void;
};
