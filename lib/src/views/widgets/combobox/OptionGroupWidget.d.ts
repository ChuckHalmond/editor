import { WidgetFactory } from "../Widget";
export { optionGroupWidget };
declare global {
    interface WidgetNameMap {
        "optiongroup": OptionGroupWidgetFactory;
    }
}
interface OptionGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}
declare var optionGroupWidget: {
    "__#68@#template": HTMLElement;
    create(): HTMLElement;
    slot(group: HTMLElement): HTMLElement;
};
