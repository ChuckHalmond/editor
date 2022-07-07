import { WidgetFactory } from "../Widget";
export { listItemGroupWidget };
declare global {
    interface WidgetNameMap {
        "listitemgroup": ListItemGroupWidgetFactory;
    }
}
interface ListItemGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}
declare var listItemGroupWidget: {
    "__#18286@#template": HTMLElement;
    create(): HTMLElement;
    slot(group: HTMLElement): HTMLElement;
    slottedCallback(group: HTMLElement, slot: HTMLElement): void;
    readonly slots: string[];
};
