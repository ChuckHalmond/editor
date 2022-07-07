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
    "__#18288@#template": HTMLElement;
    create(): HTMLElement;
    slot(group: HTMLElement): HTMLElement;
    slottedCallback(group: HTMLElement, slot: HTMLElement): void;
    readonly slots: string[];
};
