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
    "__#14490@#template": HTMLElement;
    create(): HTMLElement;
    slot(root: HTMLElement): HTMLElement;
    slottedCallback(item: HTMLElement, slot: HTMLElement): void;
};
