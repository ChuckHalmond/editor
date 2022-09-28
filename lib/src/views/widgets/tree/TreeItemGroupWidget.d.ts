import { WidgetFactory } from "../Widget";
export { treeItemGroupWidget };
declare global {
    interface WidgetNameMap {
        "treeitemgroup": TreeItemGroupWidgetFactory;
    }
}
interface TreeItemGroupWidgetFactory extends WidgetFactory {
    create(): HTMLElement;
}
declare var treeItemGroupWidget: {
    "__#50@#template": HTMLElement;
    create(): HTMLElement;
    slot(group: HTMLElement): HTMLElement;
    slottedCallback(group: HTMLElement, slot: HTMLElement): void;
};
