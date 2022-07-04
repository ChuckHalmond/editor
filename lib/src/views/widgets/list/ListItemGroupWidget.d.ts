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
    "__#28413@#template": HTMLElement;
    create(): HTMLElement;
    slot(root: HTMLElement): HTMLElement;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
    readonly slots: string[];
};
